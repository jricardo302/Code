/**
 * Payment lifecycle against a real Postgres, driven through the fake
 * provider: start payment -> signed webhook -> confirmed booking, plus the
 * failure modes that matter (bad signature, replay, amount mismatch).
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { eq } from "drizzle-orm";
import { addDays, todayInTimezone } from "@/lib/domain/dates";
import { bookings, payments } from "@/lib/db/schema";
import { createBooking } from "@/lib/booking/service";
import { FakeProvider, fakeSignature, settleFakePayment } from "@/lib/payments/fake";
import { processWebhook, startPayment } from "@/lib/payments/service";
import {
  pgAvailable,
  seedTestProperty,
  startTestCluster,
  type TestCluster,
} from "./setup-db";

const RUN = pgAvailable();
const today = todayInTimezone();
const arrival = addDays(today, 150);

function webhookHeaders(body: string): Headers {
  return new Headers({ "x-fake-signature": fakeSignature(body) });
}

describe.runIf(RUN)("payments (integration)", () => {
  let cluster: TestCluster;
  let provider: FakeProvider;

  beforeAll(async () => {
    cluster = await startTestCluster();
    await seedTestProperty(cluster.db);
    provider = new FakeProvider("http://localhost:3000");
  }, 60_000);

  afterAll(() => cluster?.stop());

  async function makeBooking(offset: number, email: string, plan: "deposit" | "full" = "full") {
    const { booking } = await createBooking(cluster.db, {
      propertySlug: "lighthouse",
      arrivalDate: addDays(arrival, offset),
      departureDate: addDays(arrival, offset + 7),
      guestCount: 4,
      paymentPlan: plan,
      guest: { email, firstName: "Pay", lastName: "Tester", locale: "nl" },
    });
    return booking;
  }

  it("full flow: start payment, webhook, booking confirmed exactly once", async () => {
    const booking = await makeBooking(0, "flow@example.nl");
    const { payment, checkoutUrl } = await startPayment(cluster.db, provider, booking, "full");
    expect(checkoutUrl).toContain("/betalen/fake/");
    expect(payment.amountCents).toBe(booking.totalCents);
    expect(payment.providerPaymentId).toBeTruthy();

    // Guest pays on the provider's checkout; provider fires our webhook.
    settleFakePayment(payment.providerPaymentId!, "paid");
    const body = `id=${payment.providerPaymentId}`;
    const outcome = await processWebhook(cluster.db, provider, body, webhookHeaders(body));
    expect(outcome.httpStatus).toBe(200);
    expect(outcome.confirmedBooking?.status).toBe("confirmed");

    // Replay: same webhook again must change nothing and confirm nothing new.
    const replay = await processWebhook(cluster.db, provider, body, webhookHeaders(body));
    expect(replay.httpStatus).toBe(200);
    expect(replay.confirmedBooking).toBeUndefined();
    expect(replay.note).toContain("already paid");

    const stored = await cluster.db.query.payments.findFirst({
      where: eq(payments.id, payment.id),
    });
    expect(stored?.status).toBe("paid");
    expect(stored?.paidAt).toBeInstanceOf(Date);
  });

  it("rejects a webhook with a bad signature before touching anything", async () => {
    const booking = await makeBooking(10, "sig@example.nl");
    const { payment } = await startPayment(cluster.db, provider, booking, "full");
    settleFakePayment(payment.providerPaymentId!, "paid");
    const body = `id=${payment.providerPaymentId}`;
    const outcome = await processWebhook(
      cluster.db,
      provider,
      body,
      new Headers({ "x-fake-signature": "0".repeat(64) }),
    );
    expect(outcome.httpStatus).toBe(401);
    const stored = await cluster.db.query.payments.findFirst({
      where: eq(payments.id, payment.id),
    });
    expect(stored?.status).toBe("open"); // untouched
  });

  it("freezes the payment instead of confirming on an amount mismatch", async () => {
    const booking = await makeBooking(20, "tamper@example.nl");
    const { payment } = await startPayment(cluster.db, provider, booking, "full");
    settleFakePayment(payment.providerPaymentId!, "paid");

    // Simulate tampering: the stored row expects more money than the
    // provider will report as paid.
    await cluster.db
      .update(payments)
      .set({ amountCents: payment.amountCents + 10_000 })
      .where(eq(payments.id, payment.id));

    const body = `id=${payment.providerPaymentId}`;
    const outcome = await processWebhook(cluster.db, provider, body, webhookHeaders(body));
    expect(outcome.httpStatus).toBe(200);
    expect(outcome.note).toContain("mismatch");
    expect(outcome.confirmedBooking).toBeUndefined();

    const storedBooking = await cluster.db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
    });
    expect(storedBooking?.status).toBe("pending"); // never confirmed
    const storedPayment = await cluster.db.query.payments.findFirst({
      where: eq(payments.id, payment.id),
    });
    expect(storedPayment?.status).toBe("failed");
  });

  it("deposit plan: deposit payment confirms, balance pays onto confirmed booking", async () => {
    const booking = await makeBooking(30, "deposit@example.nl", "deposit");
    expect(booking.depositCents + booking.balanceCents).toBe(booking.totalCents);

    // Deposit.
    const dep = await startPayment(cluster.db, provider, booking, "deposit");
    expect(dep.payment.amountCents).toBe(booking.depositCents);
    settleFakePayment(dep.payment.providerPaymentId!, "paid");
    const depBody = `id=${dep.payment.providerPaymentId}`;
    const depOutcome = await processWebhook(cluster.db, provider, depBody, webhookHeaders(depBody));
    expect(depOutcome.confirmedBooking?.status).toBe("confirmed");

    // Balance, later.
    const confirmed = (await cluster.db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
    }))!;
    const bal = await startPayment(cluster.db, provider, confirmed, "balance");
    expect(bal.payment.amountCents).toBe(booking.balanceCents);
    settleFakePayment(bal.payment.providerPaymentId!, "paid");
    const balBody = `id=${bal.payment.providerPaymentId}`;
    const balOutcome = await processWebhook(cluster.db, provider, balBody, webhookHeaders(balBody));
    expect(balOutcome.httpStatus).toBe(200);
    // Balance does not re-confirm.
    expect(balOutcome.confirmedBooking).toBeUndefined();

    const rows = await cluster.db.query.payments.findMany({
      where: eq(payments.bookingId, booking.id),
    });
    expect(rows.filter((p) => p.status === "paid")).toHaveLength(2);
    expect(rows.reduce((s, p) => s + (p.status === "paid" ? p.amountCents : 0), 0)).toBe(
      booking.totalCents,
    );
  });

  it("refuses to start a balance payment before the deposit is in", async () => {
    const booking = await makeBooking(40, "eager@example.nl", "deposit");
    await expect(startPayment(cluster.db, provider, booking, "balance")).rejects.toMatchObject({
      code: "INVALID_STATE",
    });
  });

  it("a failed payment leaves the booking pending so the guest can retry", async () => {
    const booking = await makeBooking(50, "retry@example.nl");
    const first = await startPayment(cluster.db, provider, booking, "full");
    settleFakePayment(first.payment.providerPaymentId!, "failed");
    const body = `id=${first.payment.providerPaymentId}`;
    await processWebhook(cluster.db, provider, body, webhookHeaders(body));

    const stored = (await cluster.db.query.bookings.findFirst({
      where: eq(bookings.id, booking.id),
    }))!;
    expect(stored.status).toBe("pending");

    // Second attempt succeeds.
    const second = await startPayment(cluster.db, provider, stored, "full");
    settleFakePayment(second.payment.providerPaymentId!, "paid");
    const body2 = `id=${second.payment.providerPaymentId}`;
    const outcome = await processWebhook(cluster.db, provider, body2, webhookHeaders(body2));
    expect(outcome.confirmedBooking?.status).toBe("confirmed");
  });
});

describe.runIf(!RUN)("payments (integration)", () => {
  it.skip("skipped: postgres binaries not found", () => {});
});
