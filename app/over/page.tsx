import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Prozablok, Sectie } from "@/components/ui";
import { CONTACT_MAIL, MERK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Over dit spel",
  description:
    "Waarom IK ZIE, IK ZIE… bestaat, hoe de honderd vragen tot stand kwamen, en wat het spel uitdrukkelijk niet is.",
  alternates: { canonical: "/over" },
  openGraph: {
    title: "Over dit spel",
    description: "Waarom IK ZIE, IK ZIE… bestaat en hoe de vragen tot stand kwamen.",
    url: "/over",
  },
};

export default function OverPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        <section className="px-5 pt-14 pb-4 sm:pt-20">
          <div className="mx-auto max-w-2xl">
            <Kopje>Over dit spel</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Ik zie, ik zie wat jij niet ziet
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Het spelletje van vroeger ging over kijken: jij ziet iets, ik nog
              niet, en samen komen we erachter wat het is. Dat is precies wat
              goede intervisie doet.
            </p>
          </div>
        </section>

        <Sectie>
          <div className="mx-auto max-w-2xl">
            <Prozablok>
              <h2>Waarom het bestaat</h2>
              <p>
                Achter elk dossier zit een mens. Achter elke professional ook —
                en die tweede wordt structureel overgeslagen. Je praat de hele
                dag over anderen en bijna nooit over hoe het jou vergaat terwijl
                je dat doet. En als er dan eindelijk een moment voor is, gaat het
                over wie er notuleert en of we het uur netjes volkrijgen.
              </p>
              <p>
                Dat ligt niet aan de mensen. Het ligt aan de vraag. Zolang de
                vraag is wat de cliënt anders moet doen, blijft het gesprek bij
                de cliënt. Verschuif hem, en er gaat iets open.
              </p>

              <h2>Hoe de honderd vragen tot stand kwamen</h2>
              <p>
                We zijn begonnen bij wat er over reflectief en systemisch werken
                bekend is: perspectiefwisseling, hypothesevorming, aandacht voor
                wie er in het systeem niet gehoord wordt, en het onderzoeken van
                je eigen aandeel — tegenoverdracht, de reddersreflex, de
                onuitgesproken aanname.
              </p>
              <p>Daarna is elke vraag langs dezelfde lat gelegd:</p>
              <ul>
                <li>Eén centrale vraag per kaart, niet twee.</li>
                <li>Duidelijk Nederlands, geen jargon dat niets toevoegt.</li>
                <li>
                  Uitnodigend in plaats van beschuldigend. Geen vraag die een
                  oordeel al ingebakken heeft.
                </li>
                <li>
                  Nooit ten koste van cliënten of gezinnen. Ook de grappige
                  kaarten niet.
                </li>
                <li>
                  Beantwoordbaar zonder dat je herleidbare gegevens hoeft te
                  delen.
                </li>
                <li>
                  Geen pseudo-therapie met collega&apos;s: niveau 3 gaat over je
                  professionele handelen, niet over je privéleven.
                </li>
              </ul>
              <p>
                Wat dubbel was is eruit, wat te lang was is ingekort. Er wordt
                programmatisch gecontroleerd dat het er exact honderd zijn, dat
                geen vraag twee keer voorkomt en dat de nummering klopt — zodat
                er nooit een verkeerde set bij de drukker belandt.
              </p>

              <h2>Wat het niet is</h2>
              <p>
                Het is geen scholing, geen erkende methodiek en geen accreditatie
                waard. Het is niet SKJ-geaccrediteerd en de werking is niet in
                onderzoek aangetoond — dat beweren we dus ook niet. Het vervangt
                geen supervisie, geen diagnostiek, geen behandeling en geen
                veiligheidsprocedure.
              </p>
              <p>
                Wat het wel is: honderd goed geformuleerde vragen in een doos die
                je op tafel wilt leggen. Meer hoeft het niet te zijn.
              </p>

              <h2>Wat er nog komt</h2>
              <p>
                INTERVISIE is de eerste editie. {MERK} is opgezet als merk, niet
                als één product: er liggen ideeën voor edities rond casuïstiek,
                jeugd-GGZ, systemisch werken, teams en ouders. Welke er komt
                hangt af van wat professionals er zelf van vinden.
              </p>
              <p>
                Meedenken of meetesten? Mail{" "}
                <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>. We lezen
                alles.
              </p>
            </Prozablok>
          </div>
        </Sectie>

        <Sectie toon="donker">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl text-creme sm:text-4xl">
              Mooi genoeg om te laten liggen.
              <br />
              Simpel genoeg om direct te gebruiken.
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <KnopLink href="/intervisie" variant="licht">
                Bekijk het spel
              </KnopLink>
              <KnopLink href="/contact" variant="randLicht">
                Neem contact op
              </KnopLink>
            </div>
          </div>
        </Sectie>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
