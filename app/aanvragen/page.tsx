import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { CONTACT_MAIL } from "@/lib/site";

import { AanvraagFormulier } from "./AanvraagFormulier";

export const metadata: Metadata = {
  title: "Bestellen",
  description:
    "Bestel Ik zie ik zie…, het intervisiespel voor de jeugdzorg. Je betaalt pas als de eerste oplage klaarligt.",
  alternates: { canonical: "/aanvragen" },
  openGraph: {
    title: "Bestellen",
    description:
      "Bestel het intervisiespel voor de jeugdzorg. Je betaalt pas zodra de dozen er zijn.",
    url: "/aanvragen",
  },
};

export default function AanvragenPagina() {
  return (
    <>
      <SiteHeader />

      <main className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10">
            <h1 className="font-serif text-4xl tracking-tight sm:text-5xl">
              <span className="krijt-lijn">Bestellen</span>
            </h1>
            <p className="mt-5 text-base leading-relaxed text-paars-diep/80 sm:text-lg">
              De eerste oplage is in de maak. Vul hieronder in hoeveel
              exemplaren je wilt, dan leggen we ze voor je klaar. Je betaalt nu
              nog niets: zodra de dozen er zijn mailen we je met de prijs en de
              levertijd, en pas daarna reken je af.
            </p>
          </header>

          <AanvraagFormulier contactMail={CONTACT_MAIL} />

          <p className="mt-8 text-sm leading-relaxed text-paars-diep/60">
            We gebruiken je gegevens alleen om je over het spel te mailen.
            Niet doorverkopen, niet in een marketingfunnel. Wil je eruit? Eén
            mailtje naar{" "}
            <a
              href={`mailto:${CONTACT_MAIL}`}
              className="font-medium text-paars underline decoration-goud decoration-2 underline-offset-4"
            >
              {CONTACT_MAIL}
            </a>{" "}
            en je bent weg.
          </p>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
