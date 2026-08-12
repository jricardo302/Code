/**
 * The payment lifecycle around the provider interface.
 *
 * startPayment: validates the amount against the *stored booking* (never a
 * client number), writes the payment row first, then creates the provider
 * payment — so a webhook can always find its row, even one that arrives
 * before the create call returns.
 *
 * processWebhook: authenticates, re-fetches the payment from the provider's
 * API, and applies the state transition idempotently. The provider's answer
 * is compared against the stored amount before anything is confirmed; a
 * mismatch freezes the payment as `failed` and is loudly logged rather than
 * confirming a booking for the wrong money.
 */

import { and, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { bookings, payments, type Booking, type Payment } from "../db/schema";
import { audit } from "../booking/audit";
import { BookingError } from "../booking/errors";
import { confirmBooking, expectedChargeCents } from "../booking/service";
import type { PaymentProvider } from "./provider";
import { siteUrl } from "../site-config";

export type PaymentStep = "deposit" | "balance" | "full";

export interface StartPaymentResult {
  payment: Payment;
  checkoutUrl: string;
}

export async function startPayment(
  db: Db,
  provider: PaymentProvider,
  booking: Booking,
  step: PaymentStep,
): Promise<StartPaymentResult> {
  if (booking.status !== "pending" && booking.status !== "confirmed") {
    throw new BookingError("INVALID_STATE", `Cannot pay for a ${booking.status} booking`);
  }
  // Balance payments happen on an already-confirmed booking; the first
  // payment (deposit or full) happens while it is pending.
  if ((step === "deposit" || step === "full") && booking.status !== "pending") {
    throw new BookingError("INVALID_STATE", "This booking is already paid");
  }
  if (step === "balance" && booking.status !== "confirmed") {
    throw new BookingError("INVALID_STATE", "The deposit has not been paid yet");
  }

  // The authoritative amount, from the stored booking row.
  const amountCents = expectedChargeCents(booking, step);

  const description = `${booking.reference} — Lighthouse Curaçao ${
    step === "balance" ? "restbetaling" : "reservering"
  }`;

  const [payment] = await db
    .insert(payments)
    .values({
      bookingId: booking.id,
      provider: provider.name,
      kind: step,
      status: "open",
      amountCents,
      currency: booking.currency,
      description,
    })
    .returning();

  const created = await provider.createPayment({
    paymentId: payment.id,
    bookingReference: booking.reference,
    amountCents,
    currency: booking.currency,
    description,
    redirectUrl: `${siteUrl()}/${booking.locale}/boeken/status/${booking.id}`,
    webhookUrl: `${siteUrl()}/api/webhooks/${provider.name}`,
    locale: booking.locale,
  });

  const [updated] = await db
    .update(payments)
    .set({
      providerPaymentId: created.providerPaymentId,
      checkoutUrl: created.checkoutUrl,
      updatedAt: new Date(),
    })
    .where(eq(payments.id, payment.id))
    .returning();

  return { payment: updated, checkoutUrl: created.checkoutUrl };
}

export interface WebhookOutcome {
  /** HTTP status the route should answer with. */
  httpStatus: number;
  /** What happened, for the server log. */
  note: string;
  /** Set when this webhook completed a booking payment for the first time. */
  confirmedBooking?: Booking;
  paidPayment?: Payment;
}

export async function processWebhook(
  db: Db,
  provider: PaymentProvider,
  rawBody: string,
  headers: Headers,
): Promise<WebhookOutcome> {
  const verification = await provider.verifyWebhook(rawBody, headers);
  if (!verification.ok) {
    console.warn(`[webhook:${provider.name}] rejected: ${verification.reason}`);
    // 401 tells a legitimate provider to retry with correct signing and gives
    // a forger nothing to learn from.
    return { httpStatus: 401, note: verification.reason ?? "verification failed" };
  }
  if (!verification.providerPaymentId) {
    // Authenticated but not about a payment we track (e.g. unrelated Stripe
    // event types). Acknowledge so the provider stops retrying.
    return { httpStatus: 200, note: "event ignored" };
  }

  // The authoritative state, from the provider's own API.
  let snapshot;
  try {
    snapshot = await provider.fetchPayment(verification.providerPaymentId);
  } catch {
    console.warn(
      `[webhook:${provider.name}] unknown payment ${verification.providerPaymentId}`,
    );
    return { httpStatus: 404, note: "unknown payment" };
  }

  const payment = await db.query.payments.findFirst({
    where: and(
      eq(payments.provider, provider.name),
      eq(payments.providerPaymentId, snapshot.providerPaymentId),
    ),
  });
  if (!payment) {
    // Real payment at the provider, no row here: log loudly — this is either
    // a payment from another environment or a bug — but acknowledge.
    console.error(
      `[webhook:${provider.name}] no local row for ${snapshot.providerPaymentId}`,
    );
    return { httpStatus: 200, note: "no local payment row" };
  }

  // Terminal states never regress; replays and out-of-order events fall out here.
  const TERMINAL = new Set(["paid", "refunded", "cancelled", "expired", "failed"]);
  if (TERMINAL.has(payment.status) && payment.status !== "refunded") {
    if (snapshot.status === "refunded" && payment.status === "paid") {
      // The one legal terminal transition: paid -> refunded.
    } else {
      return { httpStatus: 200, note: `already ${payment.status}` };
    }
  }

  const now = new Date();

  if (snapshot.status === "paid") {
    // The money check: what the provider says was paid must equal the row.
    if (
      snapshot.paidAmountCents !== payment.amountCents ||
      (snapshot.currency && snapshot.currency !== payment.currency)
    ) {
      console.error(
        `[webhook:${provider.name}] AMOUNT MISMATCH on ${payment.id}: ` +
          `expected ${payment.amountCents} ${payment.currency}, ` +
          `provider reports ${snapshot.paidAmountCents} ${snapshot.currency}`,
      );
      await db
        .update(payments)
        .set({ status: "failed", failedAt: now, providerPayload: snapshot.raw, updatedAt: now })
        .where(eq(payments.id, payment.id));
      await audit(db, {
        actor: provider.name,
        action: "payment.amount_mismatch",
        entity: "payment",
        entityId: payment.id,
        after: { expected: payment.amountCents, reported: snapshot.paidAmountCents },
      });
      return { httpStatus: 200, note: "amount mismatch, payment frozen" };
    }

    const [paidPayment] = await db
      .update(payments)
      .set({
        status: "paid",
        paidAt: now,
        method: snapshot.method,
        providerPayload: snapshot.raw,
        updatedAt: now,
      })
      .where(and(eq(payments.id, payment.id), eq(payments.status, payment.status)))
      .returning();
    if (!paidPayment) return { httpStatus: 200, note: "lost update race, already handled" };

    // First successful payment confirms the booking (deposit or full);
    // a balance payment lands on an already-confirmed booking.
    let confirmedBooking: Booking | undefined;
    if (payment.kind === "deposit" || payment.kind === "full") {
      confirmedBooking = await confirmBooking(db, payment.bookingId);
    }
    await audit(db, {
      actor: provider.name,
      action: "payment.paid",
      entity: "payment",
      entityId: payment.id,
      after: { amountCents: payment.amountCents, kind: payment.kind },
    });
    return {
      httpStatus: 200,
      note: `payment ${payment.id} paid`,
      confirmedBooking,
      paidPayment,
    };
  }

  if (snapshot.status === "refunded") {
    await db
      .update(payments)
      .set({ status: "refunded", providerPayload: snapshot.raw, updatedAt: now })
      .where(eq(payments.id, payment.id));
    await audit(db, {
      actor: provider.name,
      action: "payment.refunded",
      entity: "payment",
      entityId: payment.id,
    });
    return { httpStatus: 200, note: `payment ${payment.id} refunded` };
  }

  if (["failed", "expired", "cancelled"].includes(snapshot.status)) {
    await db
      .update(payments)
      .set({
        status: snapshot.status,
        failedAt: snapshot.status === "failed" ? now : null,
        providerPayload: snapshot.raw,
        updatedAt: now,
      })
      .where(eq(payments.id, payment.id));
    // The booking stays pending until its hold expires — the guest may still
    // retry with another method within the hold window.
    return { httpStatus: 200, note: `payment ${payment.id} ${snapshot.status}` };
  }

  // open / pending: nothing to change yet.
  return { httpStatus: 200, note: `payment ${payment.id} still ${snapshot.status}` };
}

/** /admin: record money that moved outside any provider (bank transfer, cash). */
export async function registerManualPayment(
  db: Db,
  bookingId: string,
  amountCents: number,
  note: string,
  actor: string,
): Promise<Payment> {
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!booking) throw new BookingError("BOOKING_NOT_FOUND", "Unknown booking");
  const now = new Date();
  const [payment] = await db
    .insert(payments)
    .values({
      bookingId,
      provider: "manual",
      kind: booking.status === "pending" ? "deposit" : "balance",
      status: "paid",
      amountCents,
      currency: booking.currency,
      description: note,
      method: "manual",
      paidAt: now,
    })
    .returning();
  if (booking.status === "pending") await confirmBooking(db, bookingId);
  await audit(db, {
    actor,
    action: "payment.manual_registered",
    entity: "payment",
    entityId: payment.id,
    after: { amountCents, note },
  });
  return payment;
}
