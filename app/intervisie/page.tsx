import type { Metadata } from "next";
import Link from "next/link";

import { Kaart } from "@/components/Kaart";
import {
  DoosOpen,
  DoosPerspectief,
  DoosVoorkant,
  KaartStapel,
} from "@/components/Kaartendoos";
import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Sectie, VraagAntwoord } from "@/components/ui";
import { NIVEAUS, aantalPerNiveau, categorieen, voorbeelden } from "@/lib/kaarten";
import { HOOFDEDITIE, euro } from "@/lib/product";
import { CONTACT_MAIL, SITE_URL, VERKOOP_OPEN } from "@/lib/site";

import { Bestelpaneel } from "./Bestelpaneel";

export const metadata: Metadata = {
  title: "IK ZIE, IK ZIE… INTERVISIE — 100 vraagkaarten",
  description:
    "Het intervisiekaartspel voor jeugdhulp, jeugd-GGZ en GGZ: 100 vraagkaarten in drie niveaus, handleiding met drie speelvormen en een premium magnetische doos. Voor 2 tot 10 professionals.",
  alternates: { canonical: "/intervisie" },
  openGraph: {
    title: "IK ZIE, IK ZIE… INTERVISIE — 100 vraagkaarten",
    description:
      "100 vraagkaarten in drie niveaus voor intervisie in jeugdhulp en GGZ.",
    url: "/intervisie",
  },
};

const watKrijgJe = [
  {
    kop: "100 vraagkaarten",
    tekst:
      "Verdeeld over drie niveaus, genummerd 001 tot 100. Crème karton, matte afwerking, afgeronde hoeken, 70 × 120 mm.",
  },
  {
    kop: "1 afsluitkaart",
    tekst:
      "Voor het einde van elke sessie: wat zie je nu dat je aan het begin nog niet zag?",
  },
  {
    kop: "1 veiligheidskaart",
    tekst:
      "De afspraken die het gesprek dragen. Anonimiseren, passen mag, luisteren vóór adviseren.",
  },
  {
    kop: "Handleiding",
    tekst:
      "Drie speelvormen van 15, 45 en 90 minuten. Eén A6-boekje, geen studieboek.",
  },
  {
    kop: "Magnetische klapdoos",
    tekst:
      "132 × 80 × 42 mm, mat diep paars met crème belettering. Stevig genoeg om jaren mee te gaan.",
  },
];

const watDoetHet = [
  "Makkelijker beginnen: geen werkvorm om uit te leggen",
  "Voorbij de standaard casusbespreking komen",
  "Andere perspectieven expliciet maken",
  "Stilstaan bij je eigen aandeel, niet alleen bij de cliënt",
  "Systemischer kijken naar wie er nog meer meedoet",
  "Veiliger reflecteren, ook als het spannend wordt",
];

export default function ProductPagina() {
  const niveauNummers = [1, 2, 3] as const;

  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: HOOFDEDITIE.naam,
    description: HOOFDEDITIE.korteOmschrijving,
    brand: { "@type": "Brand", name: "IK ZIE, IK ZIE…" },
    inLanguage: "nl",
    numberOfPages: undefined,
    url: `${SITE_URL}/intervisie`,
    offers: {
      "@type": "Offer",
      price: (HOOFDEDITIE.prijsCenten / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/intervisie`,
      availability: VERKOOP_OPEN
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
      shippingDetails: {
        "@type": "OfferShippingDetails",
        shippingDestination: [
          { "@type": "DefinedRegion", addressCountry: "NL" },
          { "@type": "DefinedRegion", addressCountry: "BE" },
        ],
      },
    },
  };

  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        {/* Productkop met koopblok */}
        <section className="px-5 py-12 sm:py-16">
          <div className="mx-auto grid max-w-6xl gap-12 lg:grid-cols-[1.15fr_0.85fr]">
            <div>
              <nav aria-label="Kruimelpad" className="text-sm text-inkt/55">
                <Link href="/" className="hover:text-paars">
                  Home
                </Link>{" "}
                / <span className="text-inkt/75">INTERVISIE</span>
              </nav>

              <h1 className="mt-5 text-4xl sm:text-5xl">
                IK ZIE, IK ZIE…
                <br />
                <span className="text-paars">INTER</span>
                <span className="merk-streep">VISIE</span>
              </h1>

              <p className="mt-6 max-w-xl text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
                Honderd vraagkaarten voor intervisie, casuïstiekbespreking en
                teamreflectie in jeugdhulp, jeugd-GGZ en GGZ. Drie niveaus, van
                een luchtige opening tot de vraag die je liever overslaat.
              </p>

              <ul className="mt-7 grid gap-2 text-sm text-inkt/80 sm:grid-cols-2">
                {[
                  `${HOOFDEDITIE.aantalKaarten} vraagkaarten`,
                  `${HOOFDEDITIE.niveaus} niveaus`,
                  HOOFDEDITIE.spelers,
                  "Nederlandstalig",
                  "Handleiding met 3 speelvormen",
                  "Premium magnetische doos",
                ].map((punt) => (
                  <li key={punt} className="flex gap-2.5">
                    <span
                      aria-hidden
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-paars"
                    />
                    {punt}
                  </li>
                ))}
              </ul>

              <div className="mt-10">
                <DoosPerspectief className="w-full max-w-xl" />
              </div>
            </div>

            <div id="bestellen" className="scroll-mt-24 lg:sticky lg:top-24 lg:self-start">
              <Bestelpaneel slug={HOOFDEDITIE.slug} verkoopOpen={VERKOOP_OPEN} />
            </div>
          </div>
        </section>

        {/* Wat doet het */}
        <Sectie toon="kraft">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Kopje>Wat het doet</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                Het verschuift de vraag
              </h2>
              <p className="mt-5 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
                Van <em>wat moet de cliënt anders doen</em> naar{" "}
                <em>wat zien wij, wat missen wij, en wat vraagt dit van ons</em>.
                Dat is het hele idee. De rest is honderd goed geformuleerde
                vragen en een doos die je op tafel wilt leggen.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {watDoetHet.map((punt) => (
                <li
                  key={punt}
                  className="rounded-2xl border border-paars-diep/12 bg-creme px-5 py-4 text-sm text-inkt/85"
                >
                  {punt}
                </li>
              ))}
            </ul>
          </div>
        </Sectie>

        {/* De drie niveaus met echte kaarten */}
        <Sectie>
          <div className="max-w-2xl">
            <Kopje>De kaarten</Kopje>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Honderd vragen, drie niveaus
            </h2>
          </div>

          <div className="mt-12 space-y-14">
            {niveauNummers.map((nummer) => {
              const niveau = NIVEAUS[nummer];
              const kaarten = voorbeelden(nummer, 4);

              return (
                <div key={nummer}>
                  <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
                    <h3 className="text-2xl">
                      <span className="text-paars">N{nummer}</span>{" "}
                      {niveau.naam.toUpperCase()}
                    </h3>
                    <p className="font-merk text-sm font-black tracking-[0.1em] text-inkt/50 uppercase">
                      {aantalPerNiveau(nummer)} kaarten
                    </p>
                  </div>
                  <p className="mt-3 max-w-2xl text-base leading-relaxed text-inkt/80 tekst-mooi">
                    {niveau.doel}
                  </p>
                  <p className="mt-3 text-sm text-inkt/60">
                    Onderwerpen: {categorieen(nummer).join(" · ")}
                  </p>

                  <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    {kaarten.map((kaart) => (
                      <Kaart key={kaart.card_number} kaart={kaart} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          <p className="mt-10 text-sm text-inkt/60">
            Dit zijn echte kaarten uit de set, geen voorbeelden die er speciaal
            voor gemaakt zijn.
          </p>
        </Sectie>

        {/* Wat zit er in de doos */}
        <Sectie toon="donker">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Kopje toon="licht">In de doos</Kopje>
              <h2 className="mt-4 text-3xl text-creme sm:text-4xl">
                Wat je krijgt
              </h2>
              <dl className="mt-8 space-y-5">
                {watKrijgJe.map((item) => (
                  <div key={item.kop}>
                    <dt className="font-merk font-black text-creme">
                      {item.kop}
                    </dt>
                    <dd className="mt-1 text-sm leading-relaxed text-creme/70 tekst-mooi">
                      {item.tekst}
                    </dd>
                  </div>
                ))}
              </dl>
            </div>

            <div className="space-y-8">
              <DoosVoorkant className="w-full rounded-2xl" />
              <div className="flex items-center gap-6">
                <KaartStapel className="w-28 shrink-0" />
                <DoosOpen className="flex-1" />
              </div>
            </div>
          </div>
        </Sectie>

        {/* Specificaties */}
        <Sectie toon="kraft">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Kopje>Specificaties</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">De harde feiten</h2>
              <p className="mt-5 text-sm leading-relaxed text-inkt/70 tekst-mooi">
                De productiespecificaties liggen vast, maar worden bij de
                definitieve drukker nog getoetst aan diens dieline en
                stansvormen. Zie{" "}
                <Link
                  href="/juridisch/verzending"
                  className="font-semibold text-paars underline underline-offset-2"
                >
                  verzending
                </Link>{" "}
                voor levertijden.
              </p>
            </div>

            <dl className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
              {[
                ["Aantal vraagkaarten", "100"],
                ["Afsluit- en veiligheidskaart", "2"],
                ["Niveaus", "3 (N1 Licht, N2 Casus, N3 Spiegel)"],
                ["Kaartformaat", "70 × 120 mm"],
                ["Kaartkarton", "300–350 g/m², mat"],
                ["Hoeken", "Afgerond"],
                ["Doos", "Magnetische klapdoos, 132 × 80 × 42 mm"],
                ["Taal", "Nederlands"],
                ["Aantal spelers", "2–10 professionals"],
                ["Sessieduur", "15, 45 of 90 minuten"],
                ["Prijs", `${euro(HOOFDEDITIE.prijsCenten)} incl. 21% btw`],
                ["Verzending", "Nederland en België"],
              ].map(([term, waarde]) => (
                <div
                  key={term}
                  className="flex justify-between gap-4 border-b border-paars-diep/10 py-3.5"
                >
                  <dt className="text-sm text-inkt/65">{term}</dt>
                  <dd className="text-right text-sm font-semibold text-paars-diep">
                    {waarde}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Sectie>

        {/* Vragen */}
        <Sectie>
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Kopje>Vragen over dit spel</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">Voor je bestelt</h2>
              <KnopLink
                href="/veelgestelde-vragen"
                variant="rand"
                className="mt-7"
              >
                Alle vragen
              </KnopLink>
            </div>
            <div>
              <VraagAntwoord vraag="Is dit alleen voor jeugdhulp?">
                <p>
                  Nee. De kaarten zijn geschreven met jeugdhulp en jeugd-GGZ als
                  vertrekpunt, maar het overgrote deel gaat over reflecteren op
                  je eigen handelen — en dat werkt net zo goed in de GGZ, in een
                  wijkteam, in de gehandicaptenzorg of in een opleiding.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Is dit een officiële intervisiemethode?">
                <p>
                  Nee. Het is een hulpmiddel, geen methodiek met een keurmerk.
                  Werk je met een vaste gestructureerde methode — incidentmethode,
                  vijfstappenmethode, roddelmethode — dan kun je deze kaarten
                  daarbinnen gebruiken als bron van vragen.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Hoe lang duurt een sessie?">
                <p>
                  Dat kies je zelf. In de handleiding staan drie vormen: een
                  check-in van een kwartier, een verdiepend gesprek van 30 tot 45
                  minuten, en een volledige sessie van 60 tot 90 minuten rond één
                  casus.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Wanneer wordt mijn bestelling verzonden?">
                <p>
                  De eerste oplage is nog in productie. Bestel je nu, dan
                  ontvang je bericht met de verwachte leverdatum voordat er iets
                  verstuurd wordt. Zodra er voorraad is versturen we binnen twee
                  werkdagen.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Kan ik retourneren?">
                <p>
                  Ja. Je hebt 14 dagen bedenktijd na ontvangst, zonder opgaaf van
                  reden. Zie{" "}
                  <Link href="/juridisch/retourneren">retourneren</Link> voor hoe
                  dat werkt.
                </p>
              </VraagAntwoord>
            </div>
          </div>
        </Sectie>

        {/* Slot-CTA */}
        <Sectie toon="donker">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-creme sm:text-4xl">
              Soms verandert niet de casus.
              <br />
              Maar wel hoe je ernaar kijkt.
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <KnopLink href="#bestellen" variant="licht">
                {VERKOOP_OPEN ? "Bestel het spel" : "Naar het bestelblok"}
              </KnopLink>
              <KnopLink href="/teams" variant="randLicht">
                Voor je hele team
              </KnopLink>
            </div>
          </div>
        </Sectie>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
