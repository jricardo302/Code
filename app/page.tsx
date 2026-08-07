import Link from "next/link";

import { Kaartendoos } from "@/components/Kaartendoos";
import { SiteFooter, SiteHeader, Woordmerk } from "@/components/Merk";
import { CONTACT_MAIL } from "@/lib/site";

const niveaus = [
  {
    nummer: 1,
    omschrijving:
      "Lichte, luchtige ijsbrekers. Om elkaar als mens te leren kennen — niet als functie op een rooster.",
    vragen: [
      "Wat was je eerste bijbaan, en wat gebruik je daar vandaag nog van?",
      "Waar zouden je collega's van opkijken als ze een dag met je meelopen?",
      "Welk liedje zet je op na een rotdienst?",
    ],
    vlak: "bg-lila",
    tekst: "text-paars-diep",
    cijfer: "text-paars-diep/35",
    rand: "border-paars-diep/10",
    bullet: "bg-paars-diep/45",
  },
  {
    nummer: 2,
    omschrijving:
      "Reflectie op je eigen casuïstiek en praktijk. Over het werk zelf, en over de keuzes die je erin maakt.",
    vragen: [
      "Bij welke jongere weet je even niet meer wat je nog kunt doen?",
      "Wanneer schreef je voor het laatst een doel op waar je zelf niet in geloofde?",
      "Welk advies van een collega heb je bewust naast je neergelegd?",
    ],
    vlak: "bg-paars",
    tekst: "text-creme",
    cijfer: "text-creme/35",
    rand: "border-creme/15",
    bullet: "bg-creme/55",
  },
  {
    nummer: 3,
    omschrijving:
      "Persoonlijke reflectie op jou — de behandelaar of begeleider. Hier gaat het niet meer over de casus.",
    vragen: [
      "Welk gezin neem je mee naar huis, ook al zou dat niet moeten?",
      "Waar ben je het bangst voor in dit werk, en tegen wie heb je dat gezegd?",
      "Wat doe jij als het te veel wordt — en wie ziet dat aan je?",
    ],
    vlak: "bg-paars-diep",
    tekst: "text-creme",
    cijfer: "text-goud/45",
    rand: "border-goud/25",
    bullet: "bg-goud/70",
  },
];

const speelvormen = [
  {
    kop: "Met z'n tweeën",
    tekst:
      "Jij en een collega, een half uur, twee koppen koffie. Meer heb je niet nodig — en het werkt ook prima in de auto onderweg naar een gezin.",
  },
  {
    kop: "In je team",
    tekst:
      "Als opening van het teamoverleg. Eén kaart per keer is genoeg; je hoeft er echt geen middag voor vrij te maken.",
  },
  {
    kop: "Als vaste intervisievorm",
    tekst:
      "Met 3 tot 8 mensen. Elke bijeenkomst één niveau, of laat de groep kiezen hoe diep het vandaag mag gaan.",
  },
];

export default function Home() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        {/* Hero */}
        <section className="relative overflow-hidden px-5 pt-16 pb-20 sm:pt-24 sm:pb-28">
          <div
            aria-hidden
            className="pointer-events-none absolute -top-32 left-1/2 h-96 w-[52rem] -translate-x-1/2 rounded-full bg-lila/30 blur-3xl"
          />
          <div className="relative mx-auto max-w-3xl text-center">
            <p className="mb-6 inline-flex items-center gap-2 rounded-full border border-goud/40 bg-kraft/70 px-4 py-1.5 text-xs font-semibold tracking-[0.18em] text-paars-diep/75 uppercase">
              100 vragen · 3 niveaus · 2–8 spelers
            </p>

            <h1 className="text-5xl leading-[0.95] font-normal tracking-tight sm:text-7xl">
              <Woordmerk />
            </h1>

            <p className="mt-5 font-serif text-xl text-paars-diep/85 tekst-balans sm:text-2xl">
              het kaartspel voor wie <em className="not-italic">ándere</em>{" "}
              mensen begeleidt
            </p>

            <p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-paars-diep/75 tekst-balans sm:text-lg">
              Honderd vragen, drie niveaus en één afspraak: je zegt alleen wat
              je zelf wilt zeggen. In de praktijk blijkt dat verrassend veel.
            </p>

            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/aanvragen"
                className="w-full rounded-full bg-paars-diep px-8 py-3.5 text-center font-semibold text-creme shadow-[0_10px_24px_-12px_rgba(59,30,74,0.9)] transition-transform hover:-translate-y-0.5 hover:bg-paars sm:w-auto"
              >
                Vraag InterVISIE aan
              </Link>
              <a
                href="#niveaus"
                className="w-full rounded-full border border-paars-diep/20 px-8 py-3.5 text-center font-semibold text-paars-diep transition-colors hover:border-paars hover:text-paars sm:w-auto"
              >
                Eerst even kijken
              </a>
            </div>
          </div>
        </section>

        {/* Waarom dit spel bestaat */}
        <section className="border-y border-paars-diep/10 bg-kraft/70 px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-2xl">
            <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Waarom dit spel <span className="krijt-lijn">bestaat</span>
            </h2>

            <div className="mt-7 space-y-5 text-base leading-relaxed text-paars-diep/85 sm:text-lg">
              <p>
                Achter elk dossier zit een mens. Achter elke behandelaar ook —
                en die tweede wordt structureel vergeten.
              </p>
              <p>
                We merkten het aan onszelf. Je praat de hele dag over anderen en
                bijna nooit over hoe het jou vergaat terwijl je dat doet. En als
                er dan eindelijk een moment voor is, gaat het over de methodiek,
                over wie er notuleert, en over of we het uur netjes volkrijgen.
              </p>
              <p>
                Intervisie is geen extraatje: voor je{" "}
                <strong className="font-semibold">SKJ-herregistratie</strong>{" "}
                moet je aantonen dat je samen met vakgenoten reflecteert op je
                werk. Volkomen terecht. Alleen — een verplichting is nog geen
                gesprek. Een goede vraag wel.
              </p>
              <p>
                InterVISIE is honderd van die vragen, op honderd kaarten. Je
                legt de doos op tafel, iemand trekt er een, en je bent binnen
                twee minuten op een plek waar je met een agendapunt nooit komt.
                Geen werkvorm om uit te leggen, geen flip-over. Gewoon een
                kaart.
              </p>
            </div>

            <p className="mt-8 border-l-2 border-goud pl-4 text-sm text-paars-diep/60">
              De eisen voor herregistratie worden af en toe bijgesteld. Kijk
              voor de actuele voorwaarden op skjeugd.nl — wij maken kaarten,
              geen juridisch advies.
            </p>
          </div>
        </section>

        {/* Drie niveaus */}
        <section id="niveaus" className="scroll-mt-20 px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <div className="max-w-2xl">
              <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
                Drie niveaus, drie lagen dieper
              </h2>
              <p className="mt-4 text-base leading-relaxed text-paars-diep/75 sm:text-lg">
                De kaarten zijn gesorteerd, dus je bepaalt zelf hoe diep je
                gaat. Blijf gerust een hele avond in niveau 1 hangen als dat is
                wat de groep nodig heeft. Niemand houdt bij hoe ver je komt.
              </p>
            </div>

            <div className="mt-10 grid gap-5 md:grid-cols-3">
              {niveaus.map((niveau) => (
                <article
                  key={niveau.nummer}
                  className={`group relative flex flex-col rounded-2xl border ${niveau.rand} ${niveau.vlak} ${niveau.tekst} p-6 shadow-[0_16px_32px_-24px_rgba(59,30,74,0.8)] transition-transform duration-300 ease-out hover:-translate-y-1 hover:rotate-[-0.6deg]`}
                >
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute top-3 right-5 font-serif text-6xl leading-none font-bold ${niveau.cijfer}`}
                  >
                    {niveau.nummer}
                  </span>

                  <h3 className="relative font-serif text-xl font-semibold">
                    Niveau {niveau.nummer}
                  </h3>

                  <p className="relative mt-3 text-sm leading-relaxed opacity-90">
                    {niveau.omschrijving}
                  </p>

                  <p className="relative mt-6 text-[0.7rem] font-semibold tracking-[0.16em] uppercase opacity-60">
                    Bijvoorbeeld
                  </p>

                  <ul className="relative mt-3 space-y-3 text-sm">
                    {niveau.vragen.map((vraag) => (
                      <li key={vraag} className="flex gap-2.5">
                        <span
                          aria-hidden
                          className={`mt-2 h-1.5 w-1.5 shrink-0 rounded-full ${niveau.bullet}`}
                        />
                        <span className="italic opacity-95">
                          &ldquo;{vraag}&rdquo;
                        </span>
                      </li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>

            <p className="mt-5 text-sm text-paars-diep/55">
              Dit zijn voorbeelden om de sfeer te pakken. De echte honderd
              zitten in de doos.
            </p>
          </div>
        </section>

        {/* Voor wie */}
        <section className="border-y border-paars-diep/10 bg-kraft/70 px-5 py-16 sm:py-24">
          <div className="mx-auto max-w-5xl">
            <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
              Voor wie
            </h2>
            <p className="mt-4 max-w-2xl text-base leading-relaxed text-paars-diep/80 sm:text-lg">
              Behandelaren, begeleiders, gedragswetenschappers en
              gezinshuisouders. Kortom: iedereen die beroepsmatig naast een
              ander gaat staan en daar zelf ook iets van meekrijgt.
            </p>

            <div className="mt-10 grid gap-5 sm:grid-cols-3">
              {speelvormen.map((vorm, index) => (
                <div
                  key={vorm.kop}
                  className="rounded-2xl border border-paars-diep/10 bg-creme/80 p-6 transition-transform duration-300 hover:-translate-y-1"
                >
                  <span
                    aria-hidden
                    className="font-serif text-sm font-bold text-goud"
                  >
                    0{index + 1}
                  </span>
                  <h3 className="mt-2 font-serif text-xl font-semibold">
                    {vorm.kop}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-paars-diep/75">
                    {vorm.tekst}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* De doos */}
        <section className="relative overflow-hidden bg-paars-diep px-5 py-16 sm:py-24">
          {/* Zachte lichtval achter de doos, zoals op een studio-achtergrond */}
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(60%_55%_at_50%_42%,rgba(201,168,224,0.22),transparent_70%)]"
          />
          <div className="relative mx-auto max-w-5xl">
            <div className="mx-auto max-w-2xl text-center">
              <h2 className="font-serif text-3xl tracking-tight text-creme sm:text-4xl">
                En zo ziet &apos;ie eruit
              </h2>
              <p className="mt-4 text-base leading-relaxed text-creme/70 sm:text-lg">
                Een plat doosje met magneetsluiting, diep paars, het woordmerk
                in goudfolie. Honderd kaarten met ronde hoeken en een fijne
                gouden keylijn. Groot genoeg om op tafel te zien liggen, klein
                genoeg voor je rugtas.
              </p>
            </div>

            <div className="mt-14">
              <Kaartendoos />
            </div>
          </div>
        </section>

        {/* Call to action */}
        <section className="px-5 pb-20 sm:pb-28">
          <div className="mx-auto max-w-3xl rounded-3xl border border-goud/30 bg-paars-diep px-6 py-12 text-center text-creme sm:px-12 sm:py-16">
            <h2 className="font-serif text-3xl tracking-tight sm:text-4xl">
              De eerste oplage ligt er bijna
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-creme/80 tekst-balans">
              Nog niet te koop, wel te reserveren. Laat je gegevens achter en je
              hoort het als eerste zodra de dozen klaarstaan. Je betaalt nu
              niets — het is een aanvraag, geen bestelling.
            </p>
            <Link
              href="/aanvragen"
              className="mt-8 inline-block rounded-full bg-goud px-8 py-3.5 font-semibold text-paars-diep transition-transform hover:-translate-y-0.5"
            >
              Vraag InterVISIE aan
            </Link>
          </div>
        </section>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
