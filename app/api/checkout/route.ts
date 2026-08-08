import { NextResponse } from "next/server";
import { z } from "zod";

import {
  OFFERTE_DREMPEL,
  VERZENDING,
  editieBijSlug,
  stukprijsCenten,
  verzendkostenCenten,
} from "@/lib/product";
import { SITE_URL } from "@/lib/site";
import { btwTariefIds, stripe, stripeIsGeconfigureerd } from "@/lib/stripe";

/**
 * Start een Stripe Checkout-sessie en stuurt de bezoeker daarheen.
 *
 * De prijs wordt hier op de server berekend, niet meegestuurd door de client:
 * anders kan iedereen met een devtools-venster zijn eigen bedrag bepalen.
 *
 * Betaalmethoden staan bewust niet in deze code. Zonder `payment_method_types`
 * gebruikt Stripe wat er in het dashboard aanstaat — iDEAL, creditcard,
 * Apple Pay en Google Pay verschijnen dan vanzelf zodra je ze daar aanzet, en
 * dat hoeft geen deploy te kosten. Voor iDEAL-opvolger Wero geldt hetzelfde.
 */

const verzoekSchema = z.object({
  slug: z.string().min(1).max(60),
  aantal: z.coerce.number().int().min(1).max(OFFERTE_DREMPEL - 1),
});

export async function POST(request: Request) {
  if (!stripeIsGeconfigureerd()) {
    return NextResponse.json(
      {
        fout:
          "De betaalomgeving is nog niet gekoppeld. Zet STRIPE_SECRET_KEY " +
          "in de omgeving van je host. Zolang die ontbreekt kun je je wel op " +
          "de wachtlijst zetten.",
      },
      { status: 503 },
    );
  }

  let invoer: z.infer<typeof verzoekSchema>;
  try {
    invoer = verzoekSchema.parse(await request.json());
  } catch {
    return NextResponse.json(
      { fout: "Ongeldige bestelling." },
      { status: 400 },
    );
  }

  const editie = editieBijSlug(invoer.slug);
  if (!editie) {
    return NextResponse.json(
      { fout: "Dit spel kennen we niet." },
      { status: 404 },
    );
  }

  const stukprijs = stukprijsCenten(invoer.aantal);
  const subtotaal = stukprijs * invoer.aantal;

  try {
    const sessie = await stripe().checkout.sessions.create({
      mode: "payment",
      locale: "nl",
      line_items: [
        {
          quantity: invoer.aantal,
          tax_rates: btwTariefIds(),
          price_data: {
            currency: "eur",
            unit_amount: stukprijs,
            product_data: {
              name: editie.naam,
              description: `${editie.aantalKaarten} vraagkaarten · ${editie.niveaus} niveaus · ${editie.spelers}`,
            },
          },
        },
      ],
      shipping_address_collection: {
        allowed_countries: [...VERZENDING.landen],
      },
      shipping_options: [
        verzendoptie("NL", subtotaal),
        verzendoptie("BE", subtotaal),
      ],
      allow_promotion_codes: true,
      billing_address_collection: "auto",
      automatic_tax: { enabled: false },
      metadata: {
        editie: editie.slug,
        aantal: String(invoer.aantal),
        stukprijs_centen: String(stukprijs),
      },
      custom_text: {
        submit: {
          message:
            "De eerste oplage is in productie. Je krijgt per mail bericht met de verwachte leverdatum.",
        },
      },
      success_url: `${SITE_URL}/bestellen/gelukt?sessie={CHECKOUT_SESSION_ID}`,
      cancel_url: `${SITE_URL}/intervisie#bestellen`,
    });

    if (!sessie.url) {
      throw new Error("Stripe gaf geen checkout-URL terug.");
    }

    return NextResponse.json({ url: sessie.url });
  } catch (fout) {
    console.error("[ik zie ik zie] Checkout aanmaken mislukt:", fout);
    return NextResponse.json(
      {
        fout:
          "We kregen de betaalpagina niet open. Probeer het zo nog een keer, " +
          "of mail ons even.",
      },
      { status: 502 },
    );
  }
}

/** Eén verzendoptie per land, met gratis verzending boven de drempel. */
function verzendoptie(land: "NL" | "BE", subtotaalCenten: number) {
  const regel = land === "BE" ? VERZENDING.be : VERZENDING.nl;
  const kosten = verzendkostenCenten(land, subtotaalCenten);

  return {
    shipping_rate_data: {
      type: "fixed_amount" as const,
      display_name:
        kosten === 0
          ? `${regel.naam} — gratis verzending`
          : `Verzending ${regel.naam}`,
      fixed_amount: { amount: kosten, currency: "eur" },
      delivery_estimate: {
        minimum: { unit: "business_day" as const, value: 2 },
        maximum: { unit: "business_day" as const, value: 5 },
      },
    },
  };
}
