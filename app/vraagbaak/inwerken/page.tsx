import type { Metadata } from "next";

import { Checklist } from "@/components/vraagbaak/Checklist";
import {
  DocumentenBlok,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Vinklijst,
  VerderLink,
} from "@/components/vraagbaak/ui";
import {
  AFTEKENING,
  AFTEKEN_TOELICHTING,
  EERDER_OPSCHALEN,
  EERSTE_WEEK_LEESLIJST,
  FASEN,
  INWERK_DOCUMENTEN,
  NOG_NIET_VASTGELEGD,
  UITGANGSPUNTEN_INWERKPLAN,
} from "@/lib/vraagbaak/inwerken";

export const metadata: Metadata = {
  title: "Inwerken",
  description:
    "Onboardingchecklist met aftekenschema en het inwerkplan van 30, 60 en 90 dagen bij Ricardo Jeugdhulp.",
};

export default function Inwerken() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="02 · Inwerken en onboarding"
        titel="Je eerste negentig dagen"
        intro="Vink af wat geregeld is en zie in één oogopslag wat er nog ligt. Kies eerst je dienstverband — dan verdwijnen de punten die niet voor jou gelden."
      />

      <Sectie
        id="checklist"
        titel="Onboardingchecklist"
        intro="Deze lijst staat alleen in jouw browser. Er gaat niets naar een server."
      >
        <Checklist />
        <div className="mt-5">
          <LetOp toon="blauw" titel="Over het aftekenschema">
            {AFTEKEN_TOELICHTING}
          </LetOp>
        </div>
      </Sectie>

      <Sectie
        id="leeslijst"
        titel="Wat je in je eerste week gelezen moet hebben"
        intro="Teken dit daarna af met je leidinggevende."
      >
        <Kaart>
          <Vinklijst punten={EERSTE_WEEK_LEESLIJST} />
          <p className="mt-5 border-t border-rj-lijn pt-5 text-sm leading-relaxed text-rj-grijs italic">
            {AFTEKENING}
          </p>
        </Kaart>
      </Sectie>

      <Sectie
        id="inwerkplan"
        titel="Het inwerkplan in drie fasen"
        intro="Elke fase heeft een meetbaar resultaat en eindigt met een gesprek van een half uur."
      >
        <Kaart className="mb-6">
          <Vinklijst punten={UITGANGSPUNTEN_INWERKPLAN} />
        </Kaart>

        <div className="space-y-6">
          {FASEN.map((fase, i) => (
            <section
              key={fase.slug}
              id={fase.slug}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-rj-lijn bg-white"
            >
              <header className="flex flex-wrap items-center gap-x-4 gap-y-1 bg-rj-blauw px-5 py-4 text-white sm:px-6">
                <span
                  aria-hidden
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rj-groen text-sm font-extrabold text-rj-blauw"
                >
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-extrabold">{fase.titel}</h3>
                  <p className="text-sm text-rj-groen">{fase.periode}</p>
                </div>
                <p className="w-full text-sm text-white/75 sm:ml-auto sm:w-auto sm:max-w-xs sm:text-right">
                  {fase.belofte}
                </p>
              </header>

              <ul className="divide-y divide-rj-lijn">
                {fase.doelen.map((doel) => (
                  <li
                    key={doel.onderwerp}
                    className="grid gap-2 px-5 py-4 sm:grid-cols-[8rem_1fr_1fr] sm:gap-5 sm:px-6"
                  >
                    <span className="text-sm font-extrabold tracking-wide text-rj-blauw uppercase">
                      {doel.onderwerp}
                    </span>
                    <span className="leading-relaxed text-rj-grijs">
                      {doel.watJeDoet}
                    </span>
                    <span className="flex items-start gap-2 leading-relaxed text-rj-blauw">
                      <span
                        aria-hidden
                        className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rj-groen"
                      />
                      {doel.resultaat}
                    </span>
                  </li>
                ))}
              </ul>

              <p className="border-t border-rj-lijn bg-rj-mist px-5 py-4 text-sm leading-relaxed text-rj-grijs sm:px-6">
                {fase.gesprek}
              </p>
            </section>
          ))}
        </div>
      </Sectie>

      <Sectie id="opschalen" titel="Signalen om eerder op te schalen">
        <LetOp titel="Wacht niet op het volgende gesprek">
          <p className="mb-4">{EERDER_OPSCHALEN.inleiding}</p>
          <ul className="grid gap-2 sm:grid-cols-2">
            {EERDER_OPSCHALEN.signalen.map((s) => (
              <li key={s} className="flex gap-2">
                <span aria-hidden className="font-extrabold">
                  ·
                </span>
                <span>{s}</span>
              </li>
            ))}
          </ul>
        </LetOp>
      </Sectie>

      <Sectie
        id="open"
        titel="Wat nog niet vastligt"
        intro="Deze punten zijn organisatiebreed nog niet vastgelegd. Vraag ernaar bij de directie of de zorgcoördinator; ga niet uit van aannames."
      >
        <Kaart>
          <ul className="space-y-2.5">
            {NOG_NIET_VASTGELEGD.map((punt) => (
              <li key={punt} className="flex gap-3 text-rj-grijs">
                <span aria-hidden className="font-extrabold text-rj-groen">
                  ?
                </span>
                <span>{punt}</span>
              </li>
            ))}
          </ul>
        </Kaart>
      </Sectie>

      <p className="py-4">
        <VerderLink href="/vraagbaak/rollen">
          Wat er in jouw rol van je verwacht wordt
        </VerderLink>
      </p>

      <DocumentenBlok documenten={INWERK_DOCUMENTEN} />
    </div>
  );
}
