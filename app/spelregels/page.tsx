import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Sectie } from "@/components/ui";
import { AFSLUITVRAAG, AFSPRAKEN, BASISSPEL, SPEELVORMEN } from "@/lib/spelregels";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Spelregels",
  description:
    "De spelregels van IK ZIE, IK ZIE… INTERVISIE: het basisspel in zeven stappen, de afspraken over veiligheid en privacy, en drie speelvormen van 15, 45 en 90 minuten.",
  alternates: { canonical: "/spelregels" },
  openGraph: {
    title: "Spelregels",
    description:
      "Het basisspel, de afspraken over veiligheid en privacy, en drie speelvormen.",
    url: "/spelregels",
  },
};

export default function SpelregelsPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        <section className="px-5 pt-14 pb-4 sm:pt-20">
          <div className="mx-auto max-w-3xl">
            <Kopje>Spelregels</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Zeven stappen, en één afspraak die alles draagt
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Het spel is expres simpel gehouden. Je hoeft niets uit te leggen,
              niets voor te bereiden en geen rollen te verdelen. Wat je wél doet
              is de afspraken hardop maken voordat je begint — dat is het enige
              wat er echt toe doet.
            </p>
          </div>
        </section>

        {/* Basisspel */}
        <Sectie>
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl sm:text-4xl">Het basisspel</h2>
            <ol className="mt-8 space-y-1">
              {BASISSPEL.map((regel) => (
                <li
                  key={regel.stap}
                  className="flex gap-5 border-b border-paars-diep/10 py-4"
                >
                  <span className="w-8 shrink-0 font-merk text-lg font-black text-paars/60">
                    {regel.stap}
                  </span>
                  <span className="text-base text-inkt/85 tekst-mooi">
                    {regel.tekst}
                  </span>
                </li>
              ))}
            </ol>
          </div>
        </Sectie>

        {/* Veiligheidskaart */}
        <Sectie toon="donker">
          <div className="mx-auto max-w-3xl">
            <Kopje toon="licht">De veiligheidskaart</Kopje>
            <h2 className="mt-4 text-3xl text-creme sm:text-4xl">
              Spreek vrij. Deel zorgvuldig.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-creme/75 tekst-mooi">
              Deze kaart zit in de doos en wordt aan het begin van elke sessie
              hardop voorgelezen. Niet omdat het moet, maar omdat een groep die
              de afspraken kent eerder iets durft te zeggen.
            </p>
            <ul className="mt-8 space-y-4">
              {AFSPRAKEN.map((afspraak) => (
                <li key={afspraak} className="flex gap-3.5">
                  <span
                    aria-hidden
                    className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lila"
                  />
                  <span className="text-base leading-relaxed text-creme/90">
                    {afspraak}
                  </span>
                </li>
              ))}
            </ul>
            <p className="mt-8 border-l-2 border-lila/50 pl-5 text-sm leading-relaxed text-creme/60 tekst-mooi">
              Dit spel ondersteunt reflectie. Het is geen vervanging van formele
              supervisie, diagnostiek, behandeling, klinische besluitvorming,
              veiligheidsprocedures, de Meldcode of je eigen professionele
              oordeel.
            </p>
          </div>
        </Sectie>

        {/* Speelvormen */}
        <Sectie toon="kraft">
          <div className="mx-auto max-w-4xl">
            <h2 className="text-3xl sm:text-4xl">Drie speelvormen</h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-inkt/80 tekst-mooi">
              Kies wat past bij de tijd die je hebt. Alle drie de vormen staan
              in het boekje in de doos.
            </p>

            <div className="mt-10 grid gap-6 md:grid-cols-3">
              {SPEELVORMEN.map((vorm) => (
                <article
                  key={vorm.naam}
                  className="flex flex-col rounded-3xl border border-paars-diep/12 bg-creme p-6"
                >
                  <p className="font-merk text-sm font-black tracking-[0.12em] text-paars uppercase">
                    {vorm.duur}
                  </p>
                  <h3 className="mt-2 text-xl">{vorm.naam}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-inkt/75 tekst-mooi">
                    {vorm.voor}
                  </p>

                  <ol className="mt-5 space-y-2.5 text-sm text-inkt/85">
                    {vorm.stappen.map((stap, index) => (
                      <li key={stap} className="flex gap-2.5">
                        <span className="font-merk font-black text-paars/50 tabular-nums">
                          {index + 1}.
                        </span>
                        <span className="tekst-mooi">{stap}</span>
                      </li>
                    ))}
                  </ol>

                  <dl className="mt-6 flex gap-5 border-t border-paars-diep/10 pt-4 text-xs text-inkt/60">
                    <div>
                      <dt className="font-semibold text-paars-diep">Niveaus</dt>
                      <dd>{vorm.niveaus}</dd>
                    </div>
                    <div>
                      <dt className="font-semibold text-paars-diep">Personen</dt>
                      <dd>{vorm.personen}</dd>
                    </div>
                  </dl>
                </article>
              ))}
            </div>
          </div>
        </Sectie>

        {/* Afsluitkaart */}
        <Sectie>
          <div className="mx-auto max-w-3xl rounded-3xl border-2 border-paars/30 bg-lila-bleek/50 p-8 text-center sm:p-12">
            <Kopje>De afsluitkaart</Kopje>
            <p className="mt-6 font-merk text-2xl leading-tight font-black text-paars-diep tekst-balans sm:text-3xl">
              {AFSLUITVRAAG}
            </p>
            <p className="mx-auto mt-6 max-w-lg text-sm leading-relaxed text-inkt/70 tekst-mooi">
              Deze kaart zit los in de doos en telt niet mee bij de honderd. Hij
              komt aan het einde van elke sessie, ongeacht welk niveau je
              speelde. Iedereen antwoordt, in één zin.
            </p>
            <KnopLink href="/intervisie#bestellen" className="mt-8">
              Bestel het spel
            </KnopLink>
          </div>
        </Sectie>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
