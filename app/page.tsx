import type { Metadata } from "next";

import { Kaart } from "@/components/Kaart";
import { DoosOpen, DoosPerspectief, KaartStapel } from "@/components/Kaartendoos";
import { SiteFooter, SiteHeader, Woordmerk } from "@/components/Merk";
import { Kopje, KnopLink, Sectie, VraagAntwoord } from "@/components/ui";
import { NIVEAUS, aantalPerNiveau, voorbeelden } from "@/lib/kaarten";
import { HOOFDEDITIE, euro } from "@/lib/product";
import { CONTACT_MAIL, SITE_URL, VERKOOP_OPEN } from "@/lib/site";

export const metadata: Metadata = {
  title: "IK ZIE, IK ZIE… — intervisiekaartspel voor jeugdhulp en GGZ",
  description:
    "100 vraagkaarten in drie niveaus voor intervisie, casuïstiekbespreking en teamreflectie in jeugdhulp, jeugd-GGZ en GGZ. Voor 2 tot 10 professionals.",
  alternates: { canonical: "/" },
};

const doelgroepen = [
  { kop: "Jeugdhulp", tekst: "Ambulant begeleiders, jeugd- en gezinsprofessionals, jeugdzorgwerkers." },
  { kop: "Jeugd-GGZ & GGZ", tekst: "Behandelaren, psychologen, GZ-psychologen, vaktherapeuten." },
  { kop: "Gedragswetenschap", tekst: "Gedragswetenschappers, orthopedagogen, systeemtherapeuten." },
  { kop: "Wijk- en jeugdteams", tekst: "Lokale teams, jeugdbescherming, gecertificeerde instellingen." },
  { kop: "Zorgcoördinatie", tekst: "Zorg- en behandelcoördinatoren, regiebehandelaren, teammanagers." },
  { kop: "Opleiding", tekst: "Hogescholen, opleidingsinstituten, werkbegeleiders, stagebegeleiders." },
];

const momenten = [
  "De wekelijkse of maandelijkse intervisie",
  "Casuïstiekbespreking en MDO-reflectie",
  "Opening of afsluiting van een teamdag",
  "Eén-op-één werkbegeleiding",
  "Onboarding van nieuwe collega's",
  "Als aanvulling naast supervisie",
];

const stappen = [
  {
    nummer: "01",
    kop: "Trek een kaart",
    tekst: "Kies eerst een niveau. Wie aan de beurt is trekt de bovenste kaart en leest de vraag hardop voor.",
  },
  {
    nummer: "02",
    kop: "Deel wat je ziet",
    tekst: "Eén persoon antwoordt. De rest luistert. Nog geen adviezen, nog geen oplossingen.",
  },
  {
    nummer: "03",
    kop: "Vraag door",
    tekst: "De groep stelt open vragen. Onderzoeken gaat vóór oplossen — en verschillen mogen bestaan.",
  },
  {
    nummer: "04",
    kop: "Neem mee wat je nog niet zag",
    tekst: "Rond af met de afsluitkaart. Iedereen zegt in één zin wat hij of zij meeneemt.",
  },
];

export default function Home() {
  const niveauKaarten = [1, 2, 3] as const;

  const productSchema = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: HOOFDEDITIE.naam,
    description: HOOFDEDITIE.korteOmschrijving,
    brand: { "@type": "Brand", name: "IK ZIE, IK ZIE…" },
    category: "Gesprekskaartspel voor professionals",
    inLanguage: "nl",
    url: `${SITE_URL}/intervisie`,
    offers: {
      "@type": "Offer",
      price: (HOOFDEDITIE.prijsCenten / 100).toFixed(2),
      priceCurrency: "EUR",
      url: `${SITE_URL}/intervisie`,
      availability: VERKOOP_OPEN
        ? "https://schema.org/InStock"
        : "https://schema.org/PreOrder",
    },
  };

  return (
    <>
      {/* A. Announcement bar */}
      <p className="op-donker bg-paars-diep px-5 py-2 text-center font-merk text-[0.68rem] font-black tracking-[0.14em] text-creme uppercase sm:text-xs">
        100 vragen · 3 niveaus · één gesprek dat verder kijkt
      </p>

      <SiteHeader />

      <main id="inhoud">
        {/* B. Hero */}
        <section className="relative overflow-hidden px-5 pt-14 pb-16 sm:pt-20 sm:pb-24">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-40 left-1/2 h-[30rem] w-[60rem] -translate-x-1/2 rounded-full bg-lila/25 blur-3xl"
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr]">
            <div>
              <Woordmerk
                className="text-3xl sm:text-4xl"
                toonEditie
                editieKlasse="mt-1.5 text-xs tracking-[0.3em]"
              />

              <h1 className="mt-8 text-4xl leading-[0.98] sm:text-5xl xl:text-6xl">
                Je kijkt de hele dag naar een ander.
                <br />
                <span className="merk-streep">Hoe vaak</span> kijk je naar
                jezelf?
              </h1>

              <p className="mt-6 max-w-lg text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
                Honderd vraagkaarten voor intervisie in jeugdhulp, jeugd-GGZ en
                GGZ. Van een luchtige opening tot de vraag die je liever
                overslaat. Geen methodiek om uit te leggen — je legt de doos op
                tafel en het gesprek begint.
              </p>

              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <KnopLink href="/intervisie#bestellen">
                  {VERKOOP_OPEN ? "Bestel het spel" : "Bestel het spel"}
                </KnopLink>
                <KnopLink href="/hoe-het-werkt" variant="rand">
                  Bekijk hoe het werkt
                </KnopLink>
              </div>

              <p className="mt-6 font-merk text-xs font-black tracking-[0.12em] text-paars-diep/60 uppercase">
                100 vragen · 3 niveaus · voor 2–10 professionals ·{" "}
                {euro(HOOFDEDITIE.prijsCenten)}
              </p>
            </div>

            <div className="relative">
              <DoosPerspectief className="w-full" />
            </div>
          </div>
        </section>

        {/* C. Probleem */}
        <Sectie toon="kraft">
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Kopje>Waarom dit spel bestaat</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                De meeste intervisies gaan over de cliënt. Bijna nooit over ons.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-relaxed text-inkt/85 tekst-mooi sm:text-lg">
              <p>
                Je kent het patroon. Iemand vertelt een casus, het duurt lang,
                en voordat de vraag helder is geeft de eerste collega al advies.
                Dezelfde twee mensen praten, de rest knikt. De klok tikt. Aan
                het eind is er van alles gezegd en is er weinig verschoven.
              </p>
              <p>
                Dat ligt niet aan de mensen. Het ligt aan de vraag. Zolang de
                vraag is <em>wat moet de cliënt anders doen</em>, blijft het
                gesprek bij de cliënt. Verschuif je hem naar{" "}
                <strong className="font-semibold text-paars-diep">
                  wat zien wij, wat missen wij, en wat vraagt dit van ons
                </strong>{" "}
                — dan gaat er iets open.
              </p>
              <p>
                Daar zijn honderd kaarten voor gemaakt. Ze zijn niet slim
                bedacht om je te betrappen. Ze zijn geschreven om het makkelijker
                te maken iets te zeggen wat je anders niet zegt.
              </p>
            </div>
          </div>
        </Sectie>

        {/* D. De drie niveaus */}
        <Sectie id="niveaus">
          <div className="max-w-2xl">
            <Kopje>Drie niveaus</Kopje>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Jij bepaalt hoe diep het vandaag gaat
            </h2>
            <p className="mt-5 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              De kaarten zijn gesorteerd op niveau. Je kunt een hele sessie in
              niveau 1 blijven als dat is wat de groep nodig heeft. Niemand houdt
              bij hoe ver je komt.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {niveauKaarten.map((nummer) => {
              const niveau = NIVEAUS[nummer];
              const kaart = voorbeelden(nummer, 1)[0];
              const donker = nummer === 3;

              return (
                <article
                  key={nummer}
                  className={`flex flex-col rounded-3xl border p-7 ${
                    donker
                      ? "op-donker border-paars-diep bg-paars-diep text-creme"
                      : nummer === 2
                        ? "border-paars/40 bg-paars/10"
                        : "border-lila bg-lila/25"
                  }`}
                >
                  <div className="flex items-baseline gap-3">
                    <span
                      className={`font-merk text-4xl font-black ${donker ? "text-lila" : "text-paars"}`}
                    >
                      N{nummer}
                    </span>
                    <span
                      className={`font-merk text-sm font-black tracking-[0.16em] uppercase ${
                        donker ? "text-creme/70" : "text-paars-diep/70"
                      }`}
                    >
                      {niveau.naam}
                    </span>
                  </div>

                  <h3
                    className={`mt-5 text-xl ${donker ? "text-creme" : "text-paars-diep"}`}
                  >
                    {niveau.ondertitel}
                  </h3>
                  <p
                    className={`mt-3 text-sm leading-relaxed ${donker ? "text-creme/80" : "text-inkt/80"}`}
                  >
                    {niveau.doel}
                  </p>

                  <p
                    className={`mt-6 font-merk text-[0.66rem] font-black tracking-[0.16em] uppercase ${
                      donker ? "text-creme/50" : "text-paars-diep/50"
                    }`}
                  >
                    {aantalPerNiveau(nummer)} kaarten · bijvoorbeeld
                  </p>

                  <div className="mt-4 max-w-[13rem]">
                    <Kaart kaart={kaart} toonNummer={false} />
                  </div>
                </article>
              );
            })}
          </div>
        </Sectie>

        {/* E. Hoe het werkt */}
        <Sectie toon="lila" id="hoe">
          <div className="max-w-2xl">
            <Kopje>Hoe het werkt</Kopje>
            <h2 className="mt-4 text-3xl sm:text-4xl">Vier stappen, meer niet</h2>
          </div>

          <ol className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {stappen.map((stap) => (
              <li key={stap.nummer}>
                <span className="font-merk text-4xl font-black text-paars/45">
                  {stap.nummer}
                </span>
                <h3 className="mt-3 text-lg">{stap.kop}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inkt/80 tekst-mooi">
                  {stap.tekst}
                </p>
              </li>
            ))}
          </ol>

          <div className="mt-12 rounded-3xl border-2 border-paars-diep/15 bg-creme p-7 sm:p-9">
            <Kopje>Spreek vrij. Deel zorgvuldig.</Kopje>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-inkt/85 tekst-mooi">
              In de doos zit een veiligheidskaart met de afspraken die dit
              gesprek mogelijk maken: anonimiseer je casuïstiek, deel geen
              herleidbare persoonsgegevens, iedereen mag een kaart overslaan, en
              bij acute zorgen gelden altijd de protocollen van je organisatie.
            </p>
            <KnopLink href="/spelregels" variant="rand" className="mt-6">
              Lees de spelregels
            </KnopLink>
          </div>
        </Sectie>

        {/* F. Wat zit er in de doos */}
        <Sectie toon="donker">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <Kopje toon="licht">In de doos</Kopje>
              <h2 className="mt-4 text-3xl text-creme sm:text-4xl">
                Een doos die je op tafel wilt leggen
              </h2>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-creme/75 tekst-mooi sm:text-lg">
                Matte magnetische klapdoos in diep paars, crème belettering,
                kaarten van stevig karton met matte afwerking en afgeronde
                hoeken. Geen folie, geen glim — het moet er professioneel
                uitzien, niet feestelijk.
              </p>

              <ul className="mt-8 space-y-3 text-creme/85">
                {[
                  "100 vraagkaarten, verdeeld over 3 niveaus",
                  "1 afsluitkaart voor het einde van elke sessie",
                  "1 veiligheids- en spelregelkaart",
                  "1 handleiding met drie speelvormen (15, 45 en 90 minuten)",
                  "Premium magnetische klapdoos, 132 × 80 × 42 mm",
                ].map((regel) => (
                  <li key={regel} className="flex gap-3">
                    <span
                      aria-hidden
                      className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-lila"
                    />
                    <span className="text-sm leading-relaxed sm:text-base">
                      {regel}
                    </span>
                  </li>
                ))}
              </ul>

              <KnopLink href="/intervisie" variant="licht" className="mt-9">
                Bekijk het spel
              </KnopLink>
            </div>

            <div className="flex items-center justify-center gap-6">
              <KaartStapel className="w-32 shrink-0 sm:w-40" />
              <DoosOpen className="flex-1" />
            </div>
          </div>
        </Sectie>

        {/* G. Voor wie */}
        <Sectie>
          <div className="max-w-2xl">
            <Kopje>Voor wie</Kopje>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Voor iedereen die beroepsmatig naast een ander gaat staan
            </h2>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {doelgroepen.map((groep) => (
              <div
                key={groep.kop}
                className="rounded-2xl border border-paars-diep/12 bg-kraft/50 p-6"
              >
                <h3 className="text-base">{groep.kop}</h3>
                <p className="mt-2 text-sm leading-relaxed text-inkt/75">
                  {groep.tekst}
                </p>
              </div>
            ))}
          </div>

          {/* H. Gebruiksmomenten */}
          <div className="mt-14 rounded-3xl border border-paars-diep/12 bg-lila-bleek/50 p-7 sm:p-9">
            <h3 className="text-xl">Wanneer je het pakt</h3>
            <ul className="mt-5 flex flex-wrap gap-2.5">
              {momenten.map((moment) => (
                <li
                  key={moment}
                  className="rounded-full border border-paars-diep/15 bg-creme px-4 py-2 text-sm text-inkt/80"
                >
                  {moment}
                </li>
              ))}
            </ul>
          </div>
        </Sectie>

        {/* I. Team / bulk */}
        <Sectie toon="kraft" id="teams">
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <Kopje>Voor organisaties</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                Voor je hele team, of voor elke intervisiegroep
              </h2>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
                Vanaf 5 spellen loopt de prijs per stuk terug. Vanaf 25 maken we
                een offerte met levering op factuur, één verzendadres of
                verdeling over locaties. Handig voor teamdagen, opleidingen en
                organisaties met meerdere intervisiegroepen.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <KnopLink href="/teams">Bekijk de teamprijzen</KnopLink>
                <KnopLink href="/teams#offerte" variant="rand">
                  Offerte aanvragen
                </KnopLink>
              </div>
            </div>

            <dl className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { aantal: "1 spel", prijs: euro(3995) },
                { aantal: "Vanaf 5", prijs: `${euro(3795)} p/st` },
                { aantal: "Vanaf 10", prijs: `${euro(3595)} p/st` },
              ].map((rij) => (
                <div
                  key={rij.aantal}
                  className="flex items-baseline justify-between gap-4 rounded-2xl border border-paars-diep/12 bg-creme px-5 py-4"
                >
                  <dt className="text-sm font-semibold text-inkt/75">
                    {rij.aantal}
                  </dt>
                  <dd className="font-merk text-lg font-black text-paars-diep">
                    {rij.prijs}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Sectie>

        {/* J. Reviews — bewust nog leeg. Geen verzonnen sterren. */}
        <Sectie>
          <div className="mx-auto max-w-2xl rounded-3xl border-2 border-dashed border-paars/30 p-8 text-center sm:p-10">
            <Kopje>Ervaringen</Kopje>
            <h2 className="mt-4 text-2xl sm:text-3xl">
              Nog geen reviews — en die verzinnen we niet
            </h2>
            <p className="mt-4 text-base leading-relaxed text-inkt/75 tekst-mooi">
              Het spel wordt op dit moment getest door professionals uit de
              jeugdhulp en de GGZ. Zodra er echte ervaringen zijn, staan ze hier.
              Wil je meedoen met de testronde? Laat het weten.
            </p>
            <KnopLink href="/contact" variant="rand" className="mt-7">
              Ik wil meetesten
            </KnopLink>
          </div>
        </Sectie>

        {/* K. FAQ */}
        <Sectie toon="kraft">
          <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <Kopje>Veelgestelde vragen</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">Kort antwoord</h2>
              <KnopLink
                href="/veelgestelde-vragen"
                variant="rand"
                className="mt-7"
              >
                Alle vragen
              </KnopLink>
            </div>

            <div>
              <VraagAntwoord vraag="Voor hoeveel personen is het spel?">
                <p>
                  Vanaf 2 personen. Het werkt het prettigst met 3 tot 8, en het
                  is bruikbaar tot ongeveer 10. Boven de 10 wordt de wachttijd
                  per persoon te lang; splits dan in twee groepen.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Is het SKJ-geaccrediteerd?">
                <p>
                  Nee. IK ZIE, IK ZIE… is een hulpmiddel, geen scholing en geen
                  geaccrediteerd aanbod. Wat je met de kaarten doet kan wél
                  onderdeel zijn van je eigen intervisie. Of en hoe die meetelt
                  voor herregistratie bepaalt SKJ, niet wij — kijk daarvoor op
                  skjeugd.nl.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Mag ik hier cliëntcasussen bij bespreken?">
                <p>
                  Ja, mits geanonimiseerd. In de doos zit een veiligheidskaart
                  met precies die afspraak: geen namen, geen herleidbare
                  gegevens. Blijf verder bij het privacybeleid van je eigen
                  organisatie — dat gaat altijd voor.
                </p>
              </VraagAntwoord>
              <VraagAntwoord vraag="Mag ik een kaart overslaan?">
                <p>
                  Altijd, zonder uitleg. Dat is een spelregel, geen uitzondering.
                  Een gesprek waarin je niet mag passen is geen veilig gesprek.
                </p>
              </VraagAntwoord>
            </div>
          </div>
        </Sectie>

        {/* L. Slot-CTA */}
        <Sectie toon="donker">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl text-creme sm:text-5xl">
              Geen perfecte antwoorden.
              <br />
              Wel betere vragen.
            </h2>
            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-creme/75 tekst-mooi sm:text-lg">
              {HOOFDEDITIE.naam} — 100 vraagkaarten, 3 niveaus, voor 2 tot 10
              professionals. {euro(HOOFDEDITIE.prijsCenten)} inclusief btw.
            </p>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <KnopLink href="/intervisie#bestellen" variant="licht">
                Bestel het spel
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
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
      />
    </>
  );
}
