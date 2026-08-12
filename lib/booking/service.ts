/**
 * The booking lifecycle, as one module.
 *
 *   quote      -> loadPricingContext + computeQuote   (no writes)
 *   book       -> createBooking                       (single transaction)
 *   pay        -> the payment module, then confirmBooking via webhook
 *   tidy       -> expireStaleHolds from cron
 *
 * createBooking re-checks blocked dates inside the transaction and lets the
 * `bookings_no_overlap` EXCLUDE constraint arbitrate races: if two guests
 * submit the same nights, exactly one insert succeeds and the other surfaces
 * as DATES_UNAVAILABLE. There is deliberately no "check then insert" gap to
 * exploit — the check for blocks and the insert for bookings are the same
 * statement's transaction, and bookings-vs-bookings is the constraint's job.
 */

import { and, eq, gt, inArray, lt, lte } from "drizzle-orm";
import type { Db } from "../db/client";
import {
  blockedDates,
  bookings,
  guests,
  properties,
  seasons,
  type Booking,
  type Property,
} from "../db/schema";
import {
  nightsBetween,
  todayInTimezone,
  type CalendarDate,
} from "../domain/dates";
import {
  computeQuote,
  type PricingPolicy,
  type Quote,
  type SeasonRate,
} from "../domain/pricing";
import { BookingError, isOverlapViolation } from "./errors";
import { newBookingReference } from "./reference";

// ---------------------------------------------------------------------------
// Pricing context
// ---------------------------------------------------------------------------

export interface PricingContext {
  property: Property;
  policy: PricingPolicy;
  seasons: SeasonRate[];
  today: CalendarDate;
}

export function policyFromProperty(property: Property): PricingPolicy {
  return {
    currency: property.currency,
    cleaningFeeCents: property.cleaningFeeCents,
    taxRateBps: property.taxRateBps,
    taxOnCleaningFee: property.taxOnCleaningFee,
    depositBps: property.depositBps,
    balanceDueDays: property.balanceDueDays,
    payInFullWithinDays: property.payInFullWithinDays,
    minNightsFloor: property.minNightsFloor,
    maxNights: property.maxNights,
  };
}

export async function loadPricingContext(
  db: Db,
  propertySlug: string,
): Promise<PricingContext> {
  const property = await db.query.properties.findFirst({
    where: eq(properties.slug, propertySlug),
  });
  if (!property) throw new BookingError("PROPERTY_NOT_FOUND", "Unknown property");
  const seasonRows = await db
    .select()
    .from(seasons)
    .where(eq(seasons.propertyId, property.id));
  return {
    property,
    policy: policyFromProperty(property),
    seasons: seasonRows,
    today: todayInTimezone(property.timezone),
  };
}

/** Window guards that are about the calendar, not the price. */
export function assertBookableWindow(
  ctx: PricingContext,
  arrivalDate: CalendarDate,
): void {
  const daysAhead = nightsBetween(ctx.today, arrivalDate);
  if (daysAhead < ctx.property.minAdvanceDays) {
    throw new BookingError("ARRIVAL_IN_PAST", "Arrival date is too soon");
  }
  if (daysAhead > ctx.property.maxAdvanceDays) {
    throw new BookingError("TOO_FAR_AHEAD", "Arrival date is too far ahead");
  }
}

// ---------------------------------------------------------------------------
// Availability
// ---------------------------------------------------------------------------

/** Statuses that occupy nights. Everything else has let go of its dates. */
const LIVE_STATUSES = ["pending", "confirmed"] as const;

/**
 * All unavailable [start, end) ranges touching the window, bookings and
 * blocks merged. Feeds the calendar UI and the iCal export.
 */
export async function unavailableRanges(
  db: Db,
  propertyId: string,
  windowStart: CalendarDate,
  windowEnd: CalendarDate,
): Promise<{ startDate: CalendarDate; endDate: CalendarDate }[]> {
  const [bookingRows, blockRows] = await Promise.all([
    db
      .select({ startDate: bookings.arrivalDate, endDate: bookings.departureDate })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, propertyId),
          inArray(bookings.status, [...LIVE_STATUSES]),
          lt(bookings.arrivalDate, windowEnd),
          gt(bookings.departureDate, windowStart),
        ),
      ),
    db
      .select({ startDate: blockedDates.startDate, endDate: blockedDates.endDate })
      .from(blockedDates)
      .where(
        and(
          eq(blockedDates.propertyId, propertyId),
          lt(blockedDates.startDate, windowEnd),
          gt(blockedDates.endDate, windowStart),
        ),
      ),
  ]);
  return [...bookingRows, ...blockRows].sort((a, b) =>
    a.startDate < b.startDate ? -1 : 1,
  );
}

export async function isStayAvailable(
  db: Db,
  propertyId: string,
  arrivalDate: CalendarDate,
  departureDate: CalendarDate,
): Promise<boolean> {
  const clashes = await unavailableRanges(db, propertyId, arrivalDate, departureDate);
  return clashes.length === 0;
}

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

export interface GuestDetails {
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  country?: string;
  addressLine?: string;
  postalCode?: string;
  city?: string;
  locale: "nl" | "en" | "pap";
}

export interface CreateBookingInput {
  propertySlug: string;
  arrivalDate: CalendarDate;
  departureDate: CalendarDate;
  guestCount: number;
  guest: GuestDetails;
  paymentPlan: "deposit" | "full";
  guestMessage?: string;
  /** `manual` bookings from /admin skip the hold and start confirmed. */
  source?: "direct" | "manual";
}

export interface CreateBookingResult {
  booking: Booking;
  quote: Quote;
}

/**
 * The one write path to a new booking. Everything happens in a single
 * transaction: guest upsert, block re-check, insert. The price is computed
 * here, server-side, from the database's own seasons — whatever number the
 * client displayed is irrelevant to what gets stored.
 */
export async function createBooking(
  db: Db,
  input: CreateBookingInput,
): Promise<CreateBookingResult> {
  const ctx = await loadPricingContext(db, input.propertySlug);
  const { property } = ctx;

  if (input.guestCount > property.maxGuests) {
    throw new BookingError(
      "TOO_MANY_GUESTS",
      `The house sleeps at most ${property.maxGuests} guests`,
    );
  }
  assertBookableWindow(ctx, input.arrivalDate);

  // Throws PricingError on bad ranges / minimum stay — surfaced as-is.
  const quote = computeQuote(ctx.policy, ctx.seasons, input, { today: ctx.today });

  const isManual = input.source === "manual";
  const now = new Date();

  try {
    const booking = await db.transaction(async (tx) => {
      // Blocked dates are not covered by the bookings exclusion constraint,
      // so they are re-checked inside the transaction.
      const blocked = await tx
        .select({ id: blockedDates.id })
        .from(blockedDates)
        .where(
          and(
            eq(blockedDates.propertyId, property.id),
            lt(blockedDates.startDate, input.departureDate),
            gt(blockedDates.endDate, input.arrivalDate),
          ),
        )
        .limit(1);
      if (blocked.length > 0) {
        throw new BookingError("DATES_UNAVAILABLE", "These dates are not available");
      }

      // Guest upsert by e-mail: a returning guest keeps their id and history.
      const [guest] = await tx
        .insert(guests)
        .values({
          email: input.guest.email.trim().toLowerCase(),
          firstName: input.guest.firstName.trim(),
          lastName: input.guest.lastName.trim(),
          phone: input.guest.phone?.trim() || null,
          country: input.guest.country ?? null,
          addressLine: input.guest.addressLine?.trim() || null,
          postalCode: input.guest.postalCode?.trim() || null,
          city: input.guest.city?.trim() || null,
          locale: input.guest.locale,
        })
        .onConflictDoUpdate({
          target: guests.email,
          set: {
            firstName: input.guest.firstName.trim(),
            lastName: input.guest.lastName.trim(),
            phone: input.guest.phone?.trim() || null,
            locale: input.guest.locale,
            updatedAt: now,
          },
        })
        .returning();

      const [created] = await tx
        .insert(bookings)
        .values({
          reference: await newBookingReference(tx, ctx.today),
          propertyId: property.id,
          guestId: guest.id,
          status: isManual ? "confirmed" : "pending",
          source: input.source ?? "direct",
          arrivalDate: quote.arrivalDate,
          departureDate: quote.departureDate,
          nights: quote.nights,
          guests: input.guestCount,
          currency: quote.currency,
          accommodationCents: quote.accommodationCents,
          cleaningFeeCents: quote.cleaningFeeCents,
          taxCents: quote.taxCents,
          taxRateBps: quote.taxRateBps,
          totalCents: quote.totalCents,
          depositCents: input.paymentPlan === "deposit" ? quote.depositCents : quote.totalCents,
          balanceCents: input.paymentPlan === "deposit" ? quote.balanceCents : 0,
          balanceDueDate: input.paymentPlan === "deposit" ? quote.balanceDueDate : null,
          paymentPlan: input.paymentPlan,
          breakdown: quote,
          locale: input.guest.locale,
          guestMessage: input.guestMessage?.trim() || null,
          holdExpiresAt: isManual
            ? null
            : new Date(now.getTime() + property.holdMinutes * 60_000),
          confirmedAt: isManual ? now : null,
        })
        .returning();
      return created;
    });
    return { booking, quote };
  } catch (error) {
    if (isOverlapViolation(error)) {
      // The database said no: someone else got these nights first.
      throw new BookingError("DATES_UNAVAILABLE", "These dates were just taken");
    }
    throw error;
  }
}

// ---------------------------------------------------------------------------
// Transitions
// ---------------------------------------------------------------------------

/**
 * Pending -> confirmed, exactly once. The status guard in the WHERE makes a
 * replayed webhook a no-op: the second call updates zero rows and returns the
 * already-confirmed booking unchanged.
 */
export async function confirmBooking(db: Db, bookingId: string): Promise<Booking> {
  const [updated] = await db
    .update(bookings)
    .set({ status: "confirmed", confirmedAt: new Date(), holdExpiresAt: null, updatedAt: new Date() })
    .where(and(eq(bookings.id, bookingId), eq(bookings.status, "pending")))
    .returning();
  if (updated) return updated;

  const existing = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!existing) throw new BookingError("BOOKING_NOT_FOUND", "Unknown booking");
  if (existing.status === "confirmed") return existing;
  throw new BookingError(
    "INVALID_STATE",
    `Cannot confirm a ${existing.status} booking`,
  );
}

export async function cancelBooking(
  db: Db,
  bookingId: string,
  reason: string,
): Promise<Booking> {
  const [updated] = await db
    .update(bookings)
    .set({
      status: "cancelled",
      cancelledAt: new Date(),
      cancellationReason: reason,
      holdExpiresAt: null,
      updatedAt: new Date(),
    })
    .where(
      and(eq(bookings.id, bookingId), inArray(bookings.status, ["pending", "confirmed"])),
    )
    .returning();
  if (!updated) {
    const existing = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
    if (!existing) throw new BookingError("BOOKING_NOT_FOUND", "Unknown booking");
    throw new BookingError("INVALID_STATE", `Cannot cancel a ${existing.status} booking`);
  }
  return updated;
}

/**
 * Cron: pending bookings whose hold has lapsed release their dates. Returns
 * the expired rows so the caller can audit-log them.
 */
export async function expireStaleHolds(db: Db, now = new Date()): Promise<Booking[]> {
  return db
    .update(bookings)
    .set({ status: "expired", updatedAt: now })
    .where(
      and(
        eq(bookings.status, "pending"),
        lte(bookings.holdExpiresAt, now),
      ),
    )
    .returning();
}

// ---------------------------------------------------------------------------
// Payment-time re-verification
// ---------------------------------------------------------------------------

/**
 * Called by the payment route just before creating the provider payment: the
 * amount about to be charged must equal what the stored booking says is owed
 * for that step. A drifted client, a replayed request, or a tampered amount
 * all land here and stop.
 */
export function expectedChargeCents(
  booking: Booking,
  step: "deposit" | "balance" | "full",
): number {
  switch (step) {
    case "deposit":
      if (booking.paymentPlan !== "deposit") {
        throw new BookingError("QUOTE_MISMATCH", "This booking is pay-in-full");
      }
      return booking.depositCents;
    case "balance":
      if (booking.balanceCents <= 0) {
        throw new BookingError("QUOTE_MISMATCH", "No balance is due");
      }
      return booking.balanceCents;
    case "full":
      return booking.totalCents;
  }
}
