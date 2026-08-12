/**
 * Mollie: the primary provider — iDEAL for the Dutch majority, cards for
 * everyone else, settled in EUR.
 *
 * Webhook model: Mollie POSTs `id=tr_xxx` and deliberately signs nothing by
 * default. Authentication is therefore *fetch-back*: the id is only trusted
 * after Mollie's own API confirms it and returns the payment — a forged
 * webhook can, at worst, make us re-fetch a real payment and observe its
 * true state, which is exactly what a real webhook does. If a webhook
 * signing secret is configured (Mollie's newer signed webhooks), the
 * signature is additionally required to match.
 */

import { createHmac, timingSafeEqual } from "node:crypto";
import createMollieClient, {
  PaymentStatus,
  type MollieClient,
  type Payment as MolliePayment,
} from "@mollie/api-client";
import { fromDecimalString, toDecimalString, type Cents } from "../domain/money";
import type {
  CreatePaymentRequest,
  CreatedPayment,
  NormalizedStatus,
  PaymentProvider,
  PaymentSnapshot,
  WebhookVerification,
} from "./provider";

const MOLLIE_LOCALES = { nl: "nl_NL", en: "en_US", pap: "en_US" } as const;

function normalizeStatus(payment: MolliePayment): NormalizedStatus {
  // Refunds don't change Mollie's status; check the refunded amount first.
  const refunded = payment.amountRefunded && Number(payment.amountRefunded.value) > 0;
  if (refunded) return "refunded";
  switch (payment.status) {
    case PaymentStatus.paid:
      return "paid";
    case PaymentStatus.open:
      return "open";
    case PaymentStatus.pending:
    case PaymentStatus.authorized:
      return "pending";
    case PaymentStatus.canceled:
      return "cancelled";
    case PaymentStatus.expired:
      return "expired";
    case PaymentStatus.failed:
    default:
      return "failed";
  }
}

export class MollieProvider implements PaymentProvider {
  readonly name = "mollie" as const;
  private client: MollieClient;
  private webhookSecret: string | null;

  constructor(apiKey: string, webhookSecret?: string) {
    this.client = createMollieClient({ apiKey });
    this.webhookSecret = webhookSecret ?? null;
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatedPayment> {
    const payment = await this.client.payments.create({
      amount: {
        currency: request.currency,
        value: toDecimalString(request.amountCents),
      },
      description: request.description,
      redirectUrl: request.redirectUrl,
      webhookUrl: request.webhookUrl,
      locale: MOLLIE_LOCALES[request.locale] as never,
      metadata: {
        paymentId: request.paymentId,
        bookingReference: request.bookingReference,
      },
    });
    const checkoutUrl = payment._links.checkout?.href;
    if (!checkoutUrl) {
      throw new Error(`Mollie payment ${payment.id} came back without a checkout URL`);
    }
    return { providerPaymentId: payment.id, checkoutUrl };
  }

  async verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookVerification> {
    // Optional signed-webhook check, when a secret is configured.
    if (this.webhookSecret) {
      const signature = headers.get("x-mollie-signature");
      if (!signature) return { ok: false, reason: "missing X-Mollie-Signature" };
      const expected = createHmac("sha256", this.webhookSecret)
        .update(rawBody, "utf8")
        .digest("hex");
      const provided = signature.replace(/^sha256=/, "");
      if (
        provided.length !== expected.length ||
        !timingSafeEqual(Buffer.from(provided, "utf8"), Buffer.from(expected, "utf8"))
      ) {
        return { ok: false, reason: "signature mismatch" };
      }
    }

    // Classic Mollie webhook body: application/x-www-form-urlencoded `id=tr_x`.
    const id = new URLSearchParams(rawBody).get("id");
    if (!id || !/^(tr|ord|sub)_[A-Za-z0-9]+$/.test(id)) {
      return { ok: false, reason: "no payment id in body" };
    }
    // The fetch-back in fetchPayment is the real authentication: an id Mollie
    // does not recognize throws there and the webhook returns 404.
    return { ok: true, providerPaymentId: id };
  }

  async fetchPayment(providerPaymentId: string): Promise<PaymentSnapshot> {
    const payment = await this.client.payments.get(providerPaymentId);
    const metadata = (payment.metadata ?? {}) as { paymentId?: string };
    return {
      providerPaymentId: payment.id,
      status: normalizeStatus(payment),
      paidAmountCents: payment.amount ? fromDecimalString(payment.amount.value) : null,
      currency: payment.amount?.currency ?? null,
      method: typeof payment.method === "string" ? payment.method : null,
      paymentId: metadata.paymentId ?? null,
      raw: payment,
    };
  }

  async refund(
    providerPaymentId: string,
    amountCents: Cents,
    description: string,
  ): Promise<void> {
    const payment = await this.client.payments.get(providerPaymentId);
    await this.client.paymentRefunds.create({
      paymentId: providerPaymentId,
      amount: {
        currency: payment.amount.currency,
        value: toDecimalString(amountCents),
      },
      description,
    });
  }
}
