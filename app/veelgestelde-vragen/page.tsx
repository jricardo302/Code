import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, VraagAntwoord } from "@/components/ui";
import { FAQ, FAQ_GROEPEN, faqSchema } from "@/lib/faq";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Veelgestelde vragen",
  description:
    "Antwoorden over IK ZIE, IK ZIE… INTERVISIE: aantal spelers, duur, SKJ, privacy bij casuïstiek, zakelijke bestellingen, levering en retourneren.",
  alternates: { canonical: "/veelgestelde-vragen" },
  openGraph: {
    title: "Veelgestelde vragen",
    description:
      "Antwoorden over het intervisiekaartspel: spelers, duur, SKJ, privacy, bestellen en retourneren.",
    url: "/veelgestelde-vragen",
  },
};

export default function FaqPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <header className="mb-12">
            <Kopje>Veelgestelde vragen</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Alles wat mensen ons <span className="merk-streep">vragen</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Staat je vraag er niet bij? Mail gerust — je krijgt antwoord van
              een mens.
            </p>
          </header>

          {FAQ_GROEPEN.map((groep) => (
            <section key={groep} className="mb-12">
              <h2 className="mb-2 text-xl text-paars">{groep}</h2>
              {FAQ.filter((vraag) => vraag.groep === groep).map((item) => (
                <VraagAntwoord key={item.vraag} vraag={item.vraag}>
                  <p>{item.antwoord}</p>
                </VraagAntwoord>
              ))}
            </section>
          ))}

          <div className="rounded-3xl border-2 border-paars-diep/15 bg-kraft/60 p-7 sm:p-9">
            <h2 className="text-2xl">Nog een vraag?</h2>
            <p className="mt-3 text-base leading-relaxed text-inkt/80 tekst-mooi">
              Stuur een bericht of mail direct naar{" "}
              <a
                href={`mailto:${CONTACT_MAIL}`}
                className="font-semibold text-paars underline underline-offset-2"
              >
                {CONTACT_MAIL}
              </a>
              .
            </p>
            <KnopLink href="/contact" className="mt-6">
              Stel je vraag
            </KnopLink>
          </div>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema()) }}
      />
    </>
  );
}
