import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje } from "@/components/ui";
import { BEDRIJF, CONTACT_MAIL, ZAKELIJK_MAIL, ofPlaatshouder } from "@/lib/site";

import { ContactFormulier } from "./ContactFormulier";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Vragen over IK ZIE, IK ZIE… INTERVISIE, over meetesten of over een zakelijke bestelling? Stuur een bericht — je krijgt antwoord van een mens.",
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact",
    description: "Vragen over het spel, meetesten of zakelijk bestellen?",
    url: "/contact",
  },
};

export default function ContactPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <Kopje>Contact</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Stel je vraag
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Over het spel, over meetesten, over een bestelling voor je
              organisatie — of gewoon omdat je iets wilt zeggen over de vragen.
              We lezen alles.
            </p>

            <div className="mt-9">
              <ContactFormulier contactMail={CONTACT_MAIL} />
            </div>
          </div>

          <aside className="space-y-8">
            <div className="rounded-3xl border border-paars-diep/12 bg-kraft/60 p-6">
              <h2 className="text-lg">Direct mailen</h2>
              <dl className="mt-4 space-y-3 text-sm">
                <div>
                  <dt className="text-inkt/60">Algemeen</dt>
                  <dd>
                    <a
                      href={`mailto:${CONTACT_MAIL}`}
                      className="font-semibold text-paars underline underline-offset-2"
                    >
                      {CONTACT_MAIL}
                    </a>
                  </dd>
                </div>
                <div>
                  <dt className="text-inkt/60">Zakelijk en offertes</dt>
                  <dd>
                    <a
                      href={`mailto:${ZAKELIJK_MAIL}`}
                      className="font-semibold text-paars underline underline-offset-2"
                    >
                      {ZAKELIJK_MAIL}
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            <div className="rounded-3xl border border-paars-diep/12 bg-kraft/60 p-6">
              <h2 className="text-lg">Bedrijfsgegevens</h2>
              <dl className="mt-4 space-y-3 text-sm">
                {[
                  ["Naam", ofPlaatshouder(BEDRIJF.naam, "bedrijfsnaam")],
                  ["Adres", ofPlaatshouder(BEDRIJF.adres, "adres")],
                  ["KvK-nummer", ofPlaatshouder(BEDRIJF.kvk, "KvK-nummer")],
                  ["Btw-nummer", ofPlaatshouder(BEDRIJF.btw, "btw-nummer")],
                ].map(([term, waarde]) => (
                  <div key={term}>
                    <dt className="text-inkt/60">{term}</dt>
                    <dd className="text-inkt/85">{waarde}</dd>
                  </div>
                ))}
              </dl>
              <p className="mt-5 text-xs leading-relaxed text-inkt/55">
                Gegevens tussen blokhaken zijn nog niet ingevuld. Ze verschijnen
                zodra ze bij de host als omgevingsvariabele zijn gezet — zie de
                README. We verzinnen ze niet.
              </p>
            </div>

            <div className="rounded-3xl border border-paars-diep/12 bg-lila-bleek/50 p-6">
              <h2 className="text-lg">Eerst even kijken?</h2>
              <ul className="mt-3 space-y-2 text-sm">
                {[
                  { href: "/veelgestelde-vragen", label: "Veelgestelde vragen" },
                  { href: "/spelregels", label: "De spelregels" },
                  { href: "/teams", label: "Zakelijk bestellen" },
                ].map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="font-semibold text-paars underline underline-offset-2"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </aside>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
