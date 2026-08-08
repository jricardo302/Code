import type Stripe from "stripe";

import { stuurBestelbevestiging } from "@/lib/mail";
import { store } from "@/lib/store";
import { stripe, stripeIsGeconfigureerd } from "@/lib/stripe";

/**
 * Stripe vertelt ons hier dat er betaald is.
 *
 * Vertrouw nooit de terugkeerpagina in de browser als bewijs van betaling —
 * die kan iedereen openen. Dit endpoint is de enige plek waar een bestelling
 * als betaald wordt vastgelegd, en alleen als de handtekening klopt.
 *
 * Zet het endpoint in het Stripe-dashboard op:
 *   https://www.ikzieikzie.eu/api/stripe/webhook
 * en luister naar `checkout.session.completed`.
 */

export async function POST(request: Request) {
  const geheim = process.env.STRIPE_WEBHOOK_SECRET;

  if (!stripeIsGeconfigureerd() || !geheim) {
    // Niet geconfigureerd is geen fout van Stripe: 503 zodat er opnieuw
    // geprobeerd wordt zodra de sleutels er wél zijn.
    return new Response("Webhook niet geconfigureerd.", { status: 503 });
  }

  const handtekening = request.headers.get("stripe-signature");
  if (!handtekening) {
    return new Response("Handtekening ontbreekt.", { status: 400 });
  }

  // De ruwe body is nodig: de handtekening gaat over de bytes, niet over het
  // object dat JSON.parse ervan maakt.
  const body = await request.text();

  let gebeurtenis: Stripe.Event;
  try {
    gebeurtenis = await stripe().webhooks.constructEventAsync(
      body,
      handtekening,
      geheim,
    );
  } catch (fout) {
    console.error("[ik zie ik zie] Webhook-handtekening klopt niet:", fout);
    return new Response("Ongeldige handtekening.", { status: 400 });
  }

  if (gebeurtenis.type !== "checkout.session.completed") {
    // Alles wat we niet gebruiken netjes bevestigen, anders blijft Stripe het
    // opnieuw aanbieden.
    return new Response(null, { status: 204 });
  }

  const sessie = gebeurtenis.data.object;

  if (sessie.payment_status !== "paid") {
    return new Response(null, { status: 204 });
  }

  const bestelling = {
    sessieId: sessie.id,
    editie: sessie.metadata?.editie ?? null,
    aantal: Number(sessie.metadata?.aantal ?? 0) || null,
    bedragCenten: sessie.amount_total,
    valuta: sessie.currency,
    email: sessie.customer_details?.email ?? null,
    naam: sessie.customer_details?.name ?? null,
    land: sessie.customer_details?.address?.country ?? null,
    verzendadres: sessie.collected_information?.shipping_details ?? null,
    betaalstatus: sessie.payment_status,
  };

  try {
    const opslag = await store();
    await opslag.bewaar({ soort: "bestelling", gegevens: bestelling });
  } catch (fout) {
    // 500 teruggeven zodat Stripe het opnieuw probeert: een betaalde
    // bestelling die we niet opslaan is het ergste wat hier kan gebeuren.
    console.error("[ik zie ik zie] Bestelling opslaan mislukt:", fout);
    return new Response("Opslaan mislukt.", { status: 500 });
  }

  // Mail mag mislukken; de bestelling staat al vast.
  await stuurBestelbevestiging(bestelling);

  return new Response(null, { status: 204 });
}
