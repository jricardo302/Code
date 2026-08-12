/**
 * The fake provider: dev and end-to-end tests only. Behaves like a real
 * provider — creates a payment, serves a checkout page URL, fires our
 * webhook — without any network. Refuses to load in production.
 *
 * Checkout is a local page (/betalen/fake/[id]) with "pay" and "fail"
 * buttons; each button POSTs the signed webhook exactly like Mollie would,
 * so the whole confirmation path is exercised for real in E2E.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import type { Cents } from "../domain/money";
import type {
  CreatePaymentRequest,
  CreatedPayment,
  PaymentProvider,
  PaymentSnapshot,
  WebhookVerification,
} from "./provider";

export const FAKE_WEBHOOK_SECRET = "fake-provider-secret";

/** In-memory store; module-scoped, which is exactly right for dev/E2E. */
const store = new Map<
  string,
  { request: CreatePaymentRequest; status: PaymentSnapshot["status"]; refundedCents: number }
>();

let counter = 0;

export function fakeSignature(body: string): string {
  return createHmac("sha256", FAKE_WEBHOOK_SECRET).update(body, "utf8").digest("hex");
}

/** Test hook: flip a fake payment's state, as if the guest paid or bailed. */
export function settleFakePayment(
  providerPaymentId: string,
  status: "paid" | "failed" | "expired",
): void {
  const entry = store.get(providerPaymentId);
  if (!entry) throw new Error(`Unknown fake payment ${providerPaymentId}`);
  entry.status = status;
}

export class FakeProvider implements PaymentProvider {
  readonly name = "fake" as const;

  constructor(private baseUrl: string) {
    if (process.env.NODE_ENV === "production" && process.env.ALLOW_FAKE_PAYMENTS !== "1") {
      throw new Error("The fake payment provider must never run in production");
    }
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatedPayment> {
    const id = `fake_${++counter}_${request.paymentId.slice(0, 8)}`;
    store.set(id, { request, status: "open", refundedCents: 0 });
    return {
      providerPaymentId: id,
      checkoutUrl: `${this.baseUrl}/betalen/fake/${id}`,
    };
  }

  async verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookVerification> {
    const signature = headers.get("x-fake-signature") ?? "";
    const expected = fakeSignature(rawBody);
    if (
      signature.length !== expected.length ||
      !timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
    ) {
      return { ok: false, reason: "bad fake signature" };
    }
    const id = new URLSearchParams(rawBody).get("id");
    if (!id) return { ok: false, reason: "no id" };
    return { ok: true, providerPaymentId: id };
  }

  async fetchPayment(providerPaymentId: string): Promise<PaymentSnapshot> {
    const entry = store.get(providerPaymentId);
    if (!entry) throw new Error(`Unknown fake payment ${providerPaymentId}`);
    // Mirrors Mollie: a refund shows up as status "refunded" on the snapshot.
    const status = entry.refundedCents > 0 ? "refunded" : entry.status;
    return {
      providerPaymentId,
      status,
      paidAmountCents: entry.status === "paid" ? entry.request.amountCents : null,
      currency: entry.request.currency,
      method: "fake",
      paymentId: entry.request.paymentId,
      raw: { fake: true, status },
    };
  }

  async refund(providerPaymentId: string, amountCents: Cents): Promise<void> {
    const entry = store.get(providerPaymentId);
    if (!entry) throw new Error(`Unknown fake payment ${providerPaymentId}`);
    if (entry.status !== "paid") throw new Error("Only paid payments can be refunded");
    entry.refundedCents += amountCents;
  }
}
