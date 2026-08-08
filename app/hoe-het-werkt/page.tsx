import type { Metadata } from "next";

import { Kaart } from "@/components/Kaart";
import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Sectie } from "@/components/ui";
import { NIVEAUS, aantalPerNiveau, categorieen, voorbeelden } from "@/lib/kaarten";
import { SPEELVORMEN } from "@/lib/spelregels";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Hoe het werkt",
  description:
    "Zo werkt IK ZIE, IK ZIE… INTERVISIE: kies een niveau, trek een kaart, deel wat je ziet, vraag door. Met uitleg over de drie niveaus en drie speelvormen.",
  alternates: { canonical: "/hoe-het-werkt" },
  openGraph: {
    title: "Hoe het werkt",
    description:
      "Kies een niveau, trek een kaart, deel wat je ziet, vraag door.",
    url: "/hoe-het-werkt",
  },
};

const stappen = [
  {
    nummer: "01",
    kop: "Kies een niveau en trek een kaart",
    tekst:
      "N1 om te openen, N2 om een casus anders te bekijken, N3 om naar jezelf te kijken. De bovenste kaart is de kaart — niet zoeken naar een makkelijke.",
  },
  {
    nummer: "02",
    kop: "Deel wat je ziet",
    tekst:
      "Eén persoon antwoordt. De rest luistert en houdt de mond. Geen aanvullingen, geen ja-maar, en zeker nog geen advies.",
  },
  {
    nummer: "03",
    kop: "Vraag door",
    tekst:
      "De groep stelt open vragen. Niet om iets te bewijzen, maar om te snappen wat de ander ziet. Advies mag pas als de inbrenger erom vraagt.",
  },
  {
    nummer: "04",
    kop: "Neem mee wat je nog niet zag",
    tekst:
      "Sluit af met de afsluitkaart. Iedereen zegt in één zin wat hij of zij meeneemt. Dat duurt twee minuten en is het belangrijkste deel.",
  },
];

export default function HoeHetWerktPagina() {
  const niveauNummers = [1, 2, 3] as const;

  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        <section className="px-5 pt-14 pb-6 sm:pt-20">
          <div className="mx-auto max-w-3xl">
            <Kopje>Hoe het werkt</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Je legt de doos op tafel. Meer voorbereiding is er niet.
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Geen werkvorm om uit te leggen, geen flip-over, geen rolverdeling.
              Iemand trekt een kaart, leest de vraag voor, en binnen twee
              minuten zit je in een gesprek waar je met een agendapunt nooit
              komt.
            </p>
          </div>
        </section>

        {/* Vier stappen */}
        <Sectie>
          <ol className="grid gap-10 sm:grid-cols-2">
            {stappen.map((stap) => (
              <li key={stap.nummer} className="flex gap-6">
                <span className="font-merk text-5xl leading-none font-black text-paars/35">
                  {stap.nummer}
                </span>
                <div>
                  <h2 className="text-xl">{stap.kop}</h2>
                  <p className="mt-3 text-base leading-relaxed text-inkt/80 tekst-mooi">
                    {stap.tekst}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </Sectie>

        {/* Niveaus in detail */}
        <Sectie toon="kraft">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">De drie niveaus van dichtbij</h2>
            <p className="mt-4 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Elke kaart draagt zijn niveau zichtbaar: N1, N2 of N3, op dezelfde
              plek. Zo weet je bij het trekken meteen waar je aan begint.
            </p>
          </div>

          <div className="mt-12 space-y-12">
            {niveauNummers.map((nummer) => {
              const niveau = NIVEAUS[nummer];
              return (
                <div
                  key={nummer}
                  className="grid gap-8 border-t border-paars-diep/12 pt-10 lg:grid-cols-[1fr_auto]"
                >
                  <div>
                    <h3 className="text-2xl">
                      <span className="text-paars">N{nummer}</span>{" "}
                      {niveau.naam.toUpperCase()} — {niveau.ondertitel}
                    </h3>
                    <p className="mt-4 max-w-2xl text-base leading-relaxed text-inkt/80 tekst-mooi">
                      {niveau.doel}
                    </p>
                    <p className="mt-4 text-sm text-inkt/60">
                      <strong className="font-semibold text-paars-diep">
                        {aantalPerNiveau(nummer)} kaarten
                      </strong>{" "}
                      · {categorieen(nummer).join(" · ")}
                    </p>
                    {nummer === 3 && (
                      <p className="mt-5 max-w-2xl rounded-2xl border border-paars/25 bg-lila-bleek/60 px-5 py-4 text-sm leading-relaxed text-inkt/80">
                        Niveau 3 gaat over jouw professionele handelen, niet over
                        je privéleven. De vragen nodigen uit, ze dwingen niet —
                        en passen mag altijd.
                      </p>
                    )}
                  </div>
                  <div className="w-40 shrink-0 sm:w-48">
                    <Kaart kaart={voorbeelden(nummer, 1)[0]} />
                  </div>
                </div>
              );
            })}
          </div>
        </Sectie>

        {/* Speelvormen kort */}
        <Sectie>
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">Hoeveel tijd heb je?</h2>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {SPEELVORMEN.map((vorm) => (
              <div
                key={vorm.naam}
                className="rounded-3xl border border-paars-diep/12 bg-kraft/60 p-6"
              >
                <p className="font-merk text-sm font-black tracking-[0.12em] text-paars uppercase">
                  {vorm.duur}
                </p>
                <h3 className="mt-2 text-xl">{vorm.naam}</h3>
                <p className="mt-3 text-sm leading-relaxed text-inkt/75 tekst-mooi">
                  {vorm.voor}
                </p>
              </div>
            ))}
          </div>
          <KnopLink href="/spelregels" variant="rand" className="mt-9">
            Lees de volledige spelregels
          </KnopLink>
        </Sectie>

        <Sectie toon="donker">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl text-creme sm:text-4xl">
              Een casus kent meer dan één perspectief
            </h2>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
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
    </>
  );
}
