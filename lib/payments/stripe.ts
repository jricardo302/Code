/**
 * Stripe: the international fallback, for guests whose cards or wallets
 * Mollie's checkout doesn't serve. Uses Checkout Sessions so Stripe hosts
 * the payment page — no card data ever touches this app.
 *
 * Webhooks are authenticated with Stripe's signed `Stripe-Signature` header
 * via the official SDK, and the session is then re-fetched from the API so
 * the stored state never depends on the webhook body alone.
 */

import Stripe from "stripe";
import type { Cents } from "../domain/money";
import type {
  CreatePaymentRequest,
  CreatedPayment,
  NormalizedStatus,
  PaymentProvider,
  PaymentSnapshot,
  WebhookVerification,
} from "./provider";

const STRIPE_LOCALES = { nl: "nl", en: "en", pap: "en" } as const;

export class StripeProvider implements PaymentProvider {
  readonly name = "stripe" as const;
  private client: Stripe;
  private webhookSecret: string;

  constructor(secretKey: string, webhookSecret: string) {
    this.client = new Stripe(secretKey);
    this.webhookSecret = webhookSecret;
  }

  async createPayment(request: CreatePaymentRequest): Promise<CreatedPayment> {
    const session = await this.client.checkout.sessions.create({
      mode: "payment",
      locale: STRIPE_LOCALES[request.locale],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: request.currency.toLowerCase(),
            unit_amount: request.amountCents,
            product_data: { name: request.description },
          },
        },
      ],
      metadata: {
        paymentId: request.paymentId,
        bookingReference: request.bookingReference,
      },
      payment_intent_data: {
        metadata: {
          paymentId: request.paymentId,
          bookingReference: request.bookingReference,
        },
      },
      success_url: request.redirectUrl,
      cancel_url: request.redirectUrl,
    });
    if (!session.url) {
      throw new Error(`Stripe session ${session.id} came back without a checkout URL`);
    }
    return { providerPaymentId: session.id, checkoutUrl: session.url };
  }

  async verifyWebhook(rawBody: string, headers: Headers): Promise<WebhookVerification> {
    const signature = headers.get("stripe-signature");
    if (!signature) return { ok: false, reason: "missing Stripe-Signature" };
    let event: Stripe.Event;
    try {
      event = await this.client.webhooks.constructEventAsync(
        rawBody,
        signature,
        this.webhookSecret,
      );
    } catch (error) {
      return { ok: false, reason: `signature verification failed: ${String(error)}` };
    }

    // Only checkout session events carry our session id; everything else is
    // acknowledged without action.
    const object = event.data.object as { object?: string; id?: string };
    if (object.object === "checkout.session" && object.id) {
      return { ok: true, providerPaymentId: object.id };
    }
    return { ok: true };
  }

  async fetchPayment(providerPaymentId: string): Promise<PaymentSnapshot> {
    const session = await this.client.checkout.sessions.retrieve(providerPaymentId, {
      expand: ["payment_intent"],
    });
    const intent =
      typeof session.payment_intent === "object" ? session.payment_intent : null;

    let status: NormalizedStatus = "open";
    if (session.status === "expired") status = "expired";
    else if (session.payment_status === "paid") status = "paid";
    else if (intent?.status === "processing") status = "pending";
    else if (intent?.status === "canceled") status = "cancelled";
    else if (
      intent?.latest_charge &&
      typeof intent.latest_charge === "object" &&
      (intent.latest_charge as Stripe.Charge).refunded
    ) {
      status = "refunded";
    }

    const method = intent?.payment_method_types?.[0] ?? null;
    return {
      providerPaymentId: session.id,
      status,
      paidAmountCents: session.amount_total ?? null,
      currency: session.currency?.toUpperCase() ?? null,
      method,
      paymentId: session.metadata?.paymentId ?? null,
      raw: session,
    };
  }

  async refund(
    providerPaymentId: string,
    amountCents: Cents,
    description: string,
  ): Promise<void> {
    const session = await this.client.checkout.sessions.retrieve(providerPaymentId);
    const intentId =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;
    if (!intentId) {
      throw new Error(`Stripe session ${providerPaymentId} has no payment intent to refund`);
    }
    await this.client.refunds.create({
      payment_intent: intentId,
      amount: amountCents,
      metadata: { description },
    });
  }
}
