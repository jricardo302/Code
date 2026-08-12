/**
 * The one interface every payment provider implements. The booking flow talks
 * only to this; whether the money moves through Mollie, Stripe, or the fake
 * provider in tests is a configuration detail.
 *
 * Design rules the implementations must uphold:
 *  - Amounts in integer cents, converted at the provider boundary only.
 *  - `verifyWebhook` authenticates *before* anything is parsed or trusted.
 *  - The status returned is re-fetched from the provider's API where the
 *    provider allows it — the webhook body is a hint, never the truth.
 */

import type { Cents } from "../domain/money";

export type ProviderName = "mollie" | "stripe" | "fake";

/** Provider-agnostic view of one payment's state. */
export type NormalizedStatus =
  | "open"
  | "pending"
  | "paid"
  | "failed"
  | "expired"
  | "cancelled"
  | "refunded";

export interface CreatePaymentRequest {
  /** Our payment row id — round-trips through provider metadata. */
  paymentId: string;
  bookingReference: string;
  amountCents: Cents;
  currency: string;
  description: string;
  /** Where the guest lands after paying (or aborting). */
  redirectUrl: string;
  /** Absolute URL of our webhook endpoint for this provider. */
  webhookUrl: string;
  /** BCP-47-ish locale for the provider's checkout page. */
  locale: "nl" | "en" | "pap";
}

export interface CreatedPayment {
  /** The provider's id: Mollie `tr_...`, Stripe session/intent id. */
  providerPaymentId: string;
  /** Where to send the guest to pay. */
  checkoutUrl: string;
}

export interface WebhookVerification {
  ok: boolean;
  /** The provider payment id the event is about, once authenticated. */
  providerPaymentId?: string;
  /** Why verification failed, for the server log — never echoed to callers. */
  reason?: string;
}

export interface PaymentSnapshot {
  providerPaymentId: string;
  status: NormalizedStatus;
  /** What the provider says was actually paid, in cents. */
  paidAmountCents: Cents | null;
  currency: string | null;
  method: string | null;
  /** Our payment row id, recovered from provider metadata. */
  paymentId: string | null;
  /** Raw provider payload, stored for reconciliation. */
  raw: unknown;
}

export interface PaymentProvider {
  readonly name: ProviderName;

  createPayment(request: CreatePaymentRequest): Promise<CreatedPayment>;

  /**
   * Authenticate an incoming webhook. Implementations must not trust any
   * field of the body until this has returned ok.
   */
  verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookVerification>;

  /** Fetch the authoritative state of a payment from the provider's API. */
  fetchPayment(providerPaymentId: string): Promise<PaymentSnapshot>;

  /** Refund (part of) a paid payment, in cents. */
  refund(providerPaymentId: string, amountCents: Cents, description: string): Promise<void>;
}
