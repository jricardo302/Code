/**
 * Provider selection from environment. Mollie leads (iDEAL for the Dutch
 * majority), Stripe is the international fallback, and the fake provider
 * exists only where real money must not move.
 */

import { FakeProvider } from "./fake";
import { MollieProvider } from "./mollie";
import type { PaymentProvider, ProviderName } from "./provider";
import { StripeProvider } from "./stripe";
import { siteUrl } from "../site-config";

const cache = new Map<ProviderName, PaymentProvider>();

export function getPaymentProvider(name: ProviderName): PaymentProvider {
  const cached = cache.get(name);
  if (cached) return cached;

  let provider: PaymentProvider;
  switch (name) {
    case "mollie": {
      const key = process.env.MOLLIE_API_KEY;
      if (!key) throw new Error("MOLLIE_API_KEY is not set");
      provider = new MollieProvider(key, process.env.MOLLIE_WEBHOOK_SECRET);
      break;
    }
    case "stripe": {
      const key = process.env.STRIPE_SECRET_KEY;
      const secret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!key) throw new Error("STRIPE_SECRET_KEY is not set");
      if (!secret) throw new Error("STRIPE_WEBHOOK_SECRET is not set");
      provider = new StripeProvider(key, secret);
      break;
    }
    case "fake":
      provider = new FakeProvider(siteUrl());
      break;
  }
  cache.set(name, provider);
  return provider;
}

/** Providers the booking UI may offer, in display order. */
export function enabledProviders(): ProviderName[] {
  const enabled: ProviderName[] = [];
  if (process.env.MOLLIE_API_KEY) enabled.push("mollie");
  if (process.env.STRIPE_SECRET_KEY && process.env.STRIPE_WEBHOOK_SECRET) enabled.push("stripe");
  if (process.env.PAYMENT_PROVIDER_FAKE === "1") enabled.push("fake");
  if (enabled.length === 0) {
    throw new Error(
      "No payment provider configured. Set MOLLIE_API_KEY (and/or STRIPE_SECRET_KEY + STRIPE_WEBHOOK_SECRET).",
    );
  }
  return enabled;
}
