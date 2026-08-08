import "server-only";

import Stripe from "stripe";

/**
 * Stripe-client, pas aangemaakt wanneer hij nodig is.
 *
 * Zonder STRIPE_SECRET_KEY draait de site gewoon — alleen de checkout doet het
 * dan niet. Dat is bewust: de site moet live kunnen vóór het betaalaccount
 * rond is, want de wachtlijst is dan het enige dat telt.
 *
 * De sleutel wordt nergens naar de client gestuurd. `server-only` zorgt dat
 * dit bestand niet per ongeluk in een client component belandt.
 */

let client: Stripe | null = null;

export function stripeIsGeconfigureerd(): boolean {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripe(): Stripe {
  if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error(
      "STRIPE_SECRET_KEY ontbreekt. Zet 'm in .env.local (zie .env.example).",
    );
  }
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY, {
    // Zonder expliciete versie volgt de SDK de versie van je account; met een
    // vaste waarde verandert het gedrag niet als Stripe iets uitrolt.
    apiVersion: "2026-07-29.dahlia",
    appInfo: { name: "ikzieikzie.eu", url: "https://www.ikzieikzie.eu" },
  });
  return client;
}

/**
 * Btw-tarief. Onze prijzen zijn inclusief btw; Stripe rekent het bedrag dus
 * niet op, maar splitst het uit op de factuur. Zonder STRIPE_BTW_TARIEF_ID
 * wordt er niets uitgesplitst en verantwoord je de btw zelf in de boekhouding.
 */
export function btwTariefIds(): string[] | undefined {
  const id = process.env.STRIPE_BTW_TARIEF_ID;
  return id ? [id] : undefined;
}
