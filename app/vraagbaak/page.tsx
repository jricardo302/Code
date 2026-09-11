import Link from "next/link";

import { Begroeting } from "@/components/vraagbaak/Begroeting";
import { Icoon, Kaart, Sectie, Tabel, Vinklijst } from "@/components/vraagbaak/ui";
import { Zoeken } from "@/components/vraagbaak/Zoeken";
import { EERSTE_WEEK } from "@/lib/vraagbaak/inwerken";
import { ORGANISATIE, TEAM } from "@/lib/vraagbaak/organisatie";
import { DRIE_DINGEN, QUIZ_SECTIE, SECTIES, SPELREGELS } from "@/lib/vraagbaak/secties";

export default function Start() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <Begroeting />

      <div className="mt-8">
        <Zoeken variant="groot" />
      </div>

      <Sectie
        titel="Drie dingen die je meteen moet weten"
        intro="De rest kun je opzoeken. Deze drie niet."
      >
        <ol className="grid gap-4 sm:grid-cols-3">
          {DRIE_DINGEN.map((ding, i) => (
            <li key={ding.kop}>
              <Kaart className="flex h-full flex-col">
                <span
                  aria-hidden
                  className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-rj-groen text-base font-extrabold text-rj-blauw"
                >
                  {i + 1}
                </span>
                <p className="font-extrabold text-rj-blauw">{ding.kop}</p>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-rj-grijs">
                  {ding.tekst}
                </p>
                <Link
                  href={ding.href}
                  className="mt-4 text-sm font-extrabold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4"
                >
                  {ding.actie} →
                </Link>
              </Kaart>
            </li>
          ))}
        </ol>
      </Sectie>

      <Sectie
        titel="Waar wil je heen?"
        intro="De nummering is dezelfde als die van de mappen in Drive, zodat je het daar terugvindt."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {SECTIES.map((sectie) => (
            <li key={sectie.slug}>
              <Link
                href={sectie.href}
                className="group flex h-full gap-4 rounded-2xl border border-rj-lijn bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-rj-groen hover:shadow-[0_8px_24px_-12px_rgba(23,28,51,0.35)]"
              >
                <span
                  aria-hidden
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rj-groen-licht text-rj-blauw transition-colors group-hover:bg-rj-groen"
                >
                  <Icoon naam={sectie.icoon} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.65rem] font-extrabold tracking-[0.2em] text-rj-grijs">
                    {sectie.nummer}
                  </span>
                  <span className="mt-0.5 block font-extrabold text-rj-blauw">
                    {sectie.titel}
                  </span>
                  <span className="mt-1 block text-sm leading-relaxed text-rj-grijs">
                    {sectie.kop}
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link
          href={QUIZ_SECTIE.href}
          className="group mt-4 flex items-center gap-4 rounded-2xl bg-rj-blauw p-5 text-white transition-colors hover:bg-rj-blauw/90"
        >
          <span
            aria-hidden
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-rj-groen text-rj-blauw"
          >
            <Icoon naam={QUIZ_SECTIE.icoon} />
          </span>
          <span>
            <span className="block font-extrabold">{QUIZ_SECTIE.titel}</span>
            <span className="mt-1 block text-sm text-white/75">
              {QUIZ_SECTIE.kop}
            </span>
          </span>
          <span
            aria-hidden
            className="ml-auto shrink-0 text-2xl transition-transform group-hover:translate-x-1"
          >
            →
          </span>
        </Link>
      </Sectie>

      <Sectie
        titel="Je eerste week in het kort"
        intro="Begin je net? Dit is de volgorde. Het volledige plan staat bij Inwerken."
      >
        <ol className="space-y-3">
          {EERSTE_WEEK.map((moment) => (
            <li
              key={moment.wanneer}
              className="flex flex-col gap-2 rounded-2xl border border-rj-lijn bg-white p-5 sm:flex-row sm:gap-6"
            >
              <span className="shrink-0 text-sm font-extrabold tracking-wide text-rj-blauw uppercase sm:w-32">
                {moment.wanneer}
              </span>
              <span className="flex-1 leading-relaxed text-rj-grijs">
                {moment.wat}
              </span>
              <span className="shrink-0 self-start rounded-full bg-rj-blauw-licht px-2.5 py-1 text-xs font-extrabold text-rj-blauw">
                {moment.waar}
              </span>
            </li>
          ))}
        </ol>
      </Sectie>

      <Sectie
        id="team"
        titel="Wie is wie"
        intro="Weet je niet bij wie je moet zijn? Begin hier."
      >
        <ul className="grid gap-4 sm:grid-cols-2">
          {TEAM.map((lid) => (
            <li key={lid.naam}>
              <Kaart className="h-full">
                <p className="font-extrabold text-rj-blauw">{lid.naam}</p>
                <p className="mt-0.5 text-sm font-semibold text-rj-grijs">
                  {lid.rol}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-rj-grijs">
                  {lid.waarvoor}
                </p>
                {lid.rolSlug && (
                  <Link
                    href={`/vraagbaak/rollen#${lid.rolSlug}`}
                    className="mt-3 inline-block text-sm font-extrabold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4"
                  >
                    Wat die rol doet →
                  </Link>
                )}
              </Kaart>
            </li>
          ))}
        </ul>

        <div className="mt-4">
          <Tabel
            koppen={["Waarvoor", "Hoe je ze bereikt"]}
            rijen={[
              [
                "Algemeen",
                <a
                  key="tel"
                  href={`tel:${ORGANISATIE.telefoonLink}`}
                  className="font-semibold underline decoration-rj-groen decoration-2 underline-offset-4"
                >
                  {ORGANISATIE.telefoon}
                </a>,
              ],
              ["Bezoekadres", ORGANISATIE.adres],
              [
                "Aanmeldingen",
                <a
                  key="aanmelden"
                  href="mailto:aanmelden@ricardojeugdhulp.nl"
                  className="font-semibold underline decoration-rj-groen decoration-2 underline-offset-4"
                >
                  aanmelden@ricardojeugdhulp.nl
                </a>,
              ],
              [
                "Facturen en financiën",
                <a
                  key="finance"
                  href="mailto:finance@ricardojeugdhulp.nl"
                  className="font-semibold underline decoration-rj-groen decoration-2 underline-offset-4"
                >
                  finance@ricardojeugdhulp.nl
                </a>,
              ],
            ]}
          />
        </div>
      </Sectie>

      <Sectie
        titel="Spelregels voor deze vraagbaak"
        intro="Iedereen leest mee, alleen de beheerder schrijft."
      >
        <Kaart>
          <Vinklijst punten={SPELREGELS} />
        </Kaart>
      </Sectie>
    </div>
  );
}
