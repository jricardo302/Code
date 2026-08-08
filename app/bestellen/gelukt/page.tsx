import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { KnopLink } from "@/components/ui";
import { CONTACT_MAIL, PRODUCT_NAAM } from "@/lib/site";
import { stripe, stripeIsGeconfigureerd } from "@/lib/stripe";

export const metadata: Metadata = {
  title: "Bedankt voor je bestelling",
  robots: { index: false, follow: false },
};

/**
 * De terugkeerpagina na Stripe Checkout.
 *
 * Deze pagina bevestigt níets administratief — dat doet de webhook. Hier
 * halen we de sessie alleen op om de bezoeker te kunnen begroeten met wat hij
 * net besteld heeft. Lukt dat niet, dan tonen we een neutrale bevestiging in
 * plaats van een foutmelding: de betaling is dan nog steeds gelukt.
 */
export default async function GeluktPagina({ searchParams }: PageProps<"/bestellen/gelukt">) {
  const params = await searchParams;
  const sessieId = typeof params.sessie === "string" ? params.sessie : null;

  let voornaam: string | null = null;
  let email: string | null = null;

  if (sessieId && stripeIsGeconfigureerd()) {
    try {
      const sessie = await stripe().checkout.sessions.retrieve(sessieId);
      voornaam = sessie.customer_details?.name?.split(" ")[0] ?? null;
      email = sessie.customer_details?.email ?? null;
    } catch (fout) {
      console.error("[ik zie ik zie] Sessie ophalen mislukt:", fout);
    }
  }

  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-16 sm:py-24">
        <div className="mx-auto max-w-2xl text-center">
          <p
            aria-hidden
            className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-paars text-3xl text-creme"
          >
            ✓
          </p>

          <h1 className="mt-8 text-4xl sm:text-5xl">
            {voornaam ? `Bedankt, ${voornaam}` : "Bedankt voor je bestelling"}
          </h1>

          <div className="mx-auto mt-6 max-w-lg space-y-4 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
            <p>
              Je bestelling van {PRODUCT_NAAM} is gelukt en je betaling is
              verwerkt.
            </p>
            <p>
              {email ? (
                <>
                  Je krijgt een bevestiging op <strong>{email}</strong>, plus een
                  betaalbewijs van onze betaaldienst.
                </>
              ) : (
                <>
                  Je krijgt een bevestiging per mail, plus een betaalbewijs van
                  onze betaaldienst.
                </>
              )}{" "}
              Zodra het pakket onderweg is laten we het weten.
            </p>
            <p className="text-sm text-inkt/60">
              Je hebt 14 dagen bedenktijd na ontvangst. Klopt er iets niet? Mail{" "}
              <a
                href={`mailto:${CONTACT_MAIL}`}
                className="font-semibold text-paars underline underline-offset-2"
              >
                {CONTACT_MAIL}
              </a>
              .
            </p>
          </div>

          <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
            <KnopLink href="/spelregels">Lees vast de spelregels</KnopLink>
            <KnopLink href="/" variant="rand">
              Terug naar de homepage
            </KnopLink>
          </div>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
