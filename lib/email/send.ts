/**
 * Sending, with send-once guards.
 *
 * Every mail marks its *_sent_at column in a guarded UPDATE before handing
 * anything to Resend: the update claims the send, so a replayed webhook or an
 * overlapping cron run finds the column already set and does nothing. If
 * Resend then fails, the claim is rolled back so the next run retries.
 *
 * Without RESEND_API_KEY (local dev), mails are logged instead of sent —
 * the flow keeps working end to end.
 */

import { render } from "@react-email/render";
import { and, eq, isNull, sql } from "drizzle-orm";
import { Resend } from "resend";
import * as React from "react";
import type { Db } from "../db/client";
import { bookings, guests, payments, properties } from "../db/schema";
import type { QuoteLine } from "../domain/pricing";
import { CONTACT_EMAIL, SITE_NAME, siteUrl } from "../site-config";
import { emailCopy, resolveEmailLocale } from "./copy";
import { bookingIcs } from "./ics";
import { ArrivalInfo } from "./templates/ArrivalInfo";
import { BalanceReminder } from "./templates/BalanceReminder";
import { BookingConfirmation } from "./templates/BookingConfirmation";

const FROM = process.env.MAIL_FROM ?? `${SITE_NAME} <onboarding@resend.dev>`;

interface Mail {
  to: string;
  subject: string;
  react: React.ReactElement;
  attachments?: { filename: string; content: string }[];
}

async function deliver(mail: Mail): Promise<void> {
  const key = process.env.RESEND_API_KEY;
  if (!key) {
    console.info(`[email] (dry run) to=${mail.to} subject="${mail.subject}"`);
    return;
  }
  const resend = new Resend(key);
  const { error } = await resend.emails.send({
    from: FROM,
    to: mail.to,
    replyTo: CONTACT_EMAIL,
    subject: mail.subject,
    html: await render(mail.react),
    text: await render(mail.react, { plainText: true }),
    attachments: mail.attachments,
  });
  if (error) throw new Error(`Resend refused the e-mail: ${error.message}`);
}

async function loadBookingBundle(db: Db, bookingId: string) {
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!booking) throw new Error(`Unknown booking ${bookingId}`);
  const [guest, property] = await Promise.all([
    db.query.guests.findFirst({ where: eq(guests.id, booking.guestId) }),
    db.query.properties.findFirst({ where: eq(properties.id, booking.propertyId) }),
  ]);
  if (!guest || !property) throw new Error(`Booking ${bookingId} misses guest or property`);
  return { booking, guest, property };
}

/**
 * Claim a *_sent_at column. Returns false when someone else already sent it.
 */
async function claimSend(
  db: Db,
  bookingId: string,
  column: "confirmationEmailSentAt" | "balanceReminderSentAt" | "arrivalEmailSentAt",
): Promise<boolean> {
  const col = bookings[column];
  const claimed = await db
    .update(bookings)
    .set({ [column]: new Date() })
    .where(and(eq(bookings.id, bookingId), isNull(col)))
    .returning({ id: bookings.id });
  return claimed.length > 0;
}

async function releaseClaim(
  db: Db,
  bookingId: string,
  column: "confirmationEmailSentAt" | "balanceReminderSentAt" | "arrivalEmailSentAt",
): Promise<void> {
  await db
    .update(bookings)
    .set({ [column]: null })
    .where(eq(bookings.id, bookingId));
}

async function paidCentsFor(db: Db, bookingId: string): Promise<number> {
  const [row] = await db
    .select({ paid: sql<string>`coalesce(sum(amount_cents), 0)` })
    .from(payments)
    .where(and(eq(payments.bookingId, bookingId), eq(payments.status, "paid")));
  return Number(row?.paid ?? 0);
}

/** Confirmation + .ics. Fired by the webhook that confirmed the booking. */
export async function sendBookingConfirmation(
  db: Db,
  bookingId: string,
  { force = false }: { force?: boolean } = {},
): Promise<boolean> {
  const { booking, guest, property } = await loadBookingBundle(db, bookingId);
  if (booking.status !== "confirmed") return false;

  if (!force && !(await claimSend(db, bookingId, "confirmationEmailSentAt"))) return false;

  try {
    const locale = resolveEmailLocale(booking.locale);
    const breakdown = booking.breakdown as { lines?: QuoteLine[] };
    const statusUrl = `${siteUrl()}/${booking.locale}/boeken/status/${booking.id}`;
    const paidCents = await paidCentsFor(db, bookingId);
    const ics = bookingIcs({
      reference: booking.reference,
      arrivalDate: booking.arrivalDate,
      departureDate: booking.departureDate,
      propertyName: property.name,
      address: `${property.addressLine}, ${property.city}, Curaçao`,
      url: statusUrl,
    });

    await deliver({
      to: guest.email,
      subject: emailCopy[locale].confirmation.subject(booking.reference),
      react: React.createElement(BookingConfirmation, {
        locale: booking.locale,
        reference: booking.reference,
        arrivalDate: booking.arrivalDate,
        departureDate: booking.departureDate,
        guests: booking.guests,
        currency: booking.currency,
        lines: breakdown.lines ?? [],
        cleaningFeeCents: booking.cleaningFeeCents,
        taxRateBps: booking.taxRateBps,
        taxCents: booking.taxCents,
        totalCents: booking.totalCents,
        paidCents,
        balanceCents: booking.totalCents - paidCents,
        balanceDueDate: booking.balanceDueDate,
        statusUrl,
      }),
      attachments: [
        {
          filename: `${booking.reference}.ics`,
          content: Buffer.from(ics, "utf8").toString("base64"),
        },
      ],
    });
    return true;
  } catch (error) {
    if (!force) await releaseClaim(db, bookingId, "confirmationEmailSentAt");
    throw error;
  }
}

/** Balance reminder, sent by cron once the due window opens. */
export async function sendBalanceReminder(db: Db, bookingId: string): Promise<boolean> {
  const { booking, guest } = await loadBookingBundle(db, bookingId);
  const outstanding = booking.totalCents - (await paidCentsFor(db, bookingId));
  if (booking.status !== "confirmed" || outstanding <= 0 || !booking.balanceDueDate) {
    return false;
  }
  if (!(await claimSend(db, bookingId, "balanceReminderSentAt"))) return false;

  try {
    const locale = resolveEmailLocale(booking.locale);
    await deliver({
      to: guest.email,
      subject: emailCopy[locale].balanceReminder.subject(booking.reference),
      react: React.createElement(BalanceReminder, {
        locale: booking.locale,
        reference: booking.reference,
        arrivalDate: booking.arrivalDate,
        currency: booking.currency,
        balanceCents: outstanding,
        balanceDueDate: booking.balanceDueDate,
        payUrl: `${siteUrl()}/${booking.locale}/boeken/status/${booking.id}`,
      }),
    });
    return true;
  } catch (error) {
    await releaseClaim(db, bookingId, "balanceReminderSentAt");
    throw error;
  }
}

/** Practical arrival mail, sent by cron three days out. */
export async function sendArrivalInfo(db: Db, bookingId: string): Promise<boolean> {
  const { booking, guest, property } = await loadBookingBundle(db, bookingId);
  if (booking.status !== "confirmed") return false;
  if (!(await claimSend(db, bookingId, "arrivalEmailSentAt"))) return false;

  try {
    const locale = resolveEmailLocale(booking.locale);
    await deliver({
      to: guest.email,
      subject: emailCopy[locale].arrival.subject,
      react: React.createElement(ArrivalInfo, {
        locale: booking.locale,
        arrivalDate: booking.arrivalDate,
        checkInTime: property.checkInTime,
      }),
    });
    return true;
  } catch (error) {
    await releaseClaim(db, bookingId, "arrivalEmailSentAt");
    throw error;
  }
}

/** Used by /admin's "resend confirmation" button. */
export async function resendConfirmation(db: Db, bookingId: string): Promise<void> {
  await sendBookingConfirmation(db, bookingId, { force: true });
}
