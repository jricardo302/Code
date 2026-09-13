import type { Metadata } from "next";

import { SituatieLijst } from "@/components/vraagbaak/SituatieLijst";
import {
  DocumentLink,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Stappen,
} from "@/components/vraagbaak/ui";
import {
  MELDCODE_STAPPEN,
  NOODNUMMERS,
  PROTOCOLLEN,
} from "@/lib/vraagbaak/escalatie";

export const metadata: Metadata = {
  title: "Wat doe je bij…",
  description:
    "De escalatiekaart van Ricardo Jeugdhulp: noodnummers, stappen per situatie en het overzicht van alle protocollen.",
};

export default function Nood() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="04 · Protocollen en veiligheid"
        titel="Wat doe je bij…"
        intro="De escalatiekaart. Sla hem op je telefoon op of print hem uit. Bij twijfel: opschalen. Niet melden is nooit de veilige keuze."
      />

      <Sectie
        id="bellen"
        titel="Direct bellen"
        intro="Tik op een nummer om te bellen."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {NOODNUMMERS.map((n) => (
            <li
              key={n.wie}
              className={
                n.eerst
                  ? "rounded-2xl bg-rj-blauw p-5 text-white sm:col-span-2"
                  : "rounded-2xl border border-rj-lijn bg-white p-5"
              }
            >
              <p
                className={`text-sm font-semibold ${
                  n.eerst ? "text-white/75" : "text-rj-grijs"
                }`}
              >
                {n.situatie}
              </p>
              <p
                className={`mt-1 font-extrabold ${
                  n.eerst ? "text-rj-groen" : "text-rj-blauw"
                }`}
              >
                {n.wie}
              </p>
              {n.nummer ? (
                <a
                  href={`tel:${n.nummer.replace(/[^0-9+]/g, "")}`}
                  className={`mt-2 inline-block text-2xl font-extrabold tracking-tight underline decoration-rj-groen decoration-2 underline-offset-4 ${
                    n.eerst ? "text-white sm:text-4xl" : "text-rj-blauw"
                  }`}
                >
                  {n.nummer}
                </a>
              ) : (
                <p className="mt-2 font-semibold text-rj-grijs">
                  Nummer van de regio waar de cliënt woont
                </p>
              )}
              {n.toelichting && (
                <p
                  className={`mt-1 text-sm ${
                    n.eerst ? "text-white/70" : "text-rj-grijs"
                  }`}
                >
                  {n.toelichting}
                </p>
              )}
            </li>
          ))}
        </ul>
      </Sectie>

      <Sectie
        id="situaties"
        titel="Per situatie"
        intro="Zoek je situatie op en loop de stappen langs."
      >
        <SituatieLijst />
      </Sectie>

      <Sectie
        id="meldcode"
        titel="De meldcode in vijf stappen"
        intro="Het verplichte stappenplan bij signalen van huiselijk geweld en kindermishandeling."
      >
        <Kaart>
          <Stappen
            stappen={MELDCODE_STAPPEN.map((s) => `${s.stap} — ${s.tekst}`)}
          />
        </Kaart>
        <div className="mt-4">
          <LetOp titel="Direct escaleren">
            Aandachtsfunctionaris is Joël Ricardo. Bij acuut gevaar 112. Recent
            seksueel misdrijf: Centrum Seksueel Geweld 0800-0188. Bij een
            onthulling van een strafbaar feit: niet doorvragen, direct melden.
            Bij vermoeden van eergerelateerd geweld: stop de meldcode en ga
            direct naar het expertteam van Veilig Thuis.
          </LetOp>
        </div>
      </Sectie>

      <Sectie
        id="protocollen"
        titel="Alle protocollen"
        intro="De protocollen zelf blijven in de kwaliteitsmap staan. Deze links wijzen naar de originele, geldige versie. Maak geen eigen kopieën. Geen toegang? Vraag die aan bij de directie."
      >
        <div className="space-y-8">
          {PROTOCOLLEN.map((groep) => (
            <div key={groep.titel}>
              <h3 className="text-base font-extrabold tracking-wide text-rj-blauw uppercase">
                {groep.titel}
              </h3>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {groep.documenten.map((doc) => (
                  <DocumentLink key={doc.url} {...doc} />
                ))}
              </div>
              {groep.toelichting && (
                <p className="mt-3 text-sm leading-relaxed text-rj-grijs">
                  {groep.toelichting}
                </p>
              )}
            </div>
          ))}
        </div>

        <div className="mt-8">
          <LetOp toon="blauw" titel="Mis je een protocol?">
            Dit overzicht bevat de protocollen die je voor je eigen werk nodig
            hebt. De volledige kwaliteitsmap met alle audit-, bestuurs- en
            contractdocumenten is niet toegankelijk voor het team; die wordt
            beheerd door de directie. Heb je voor je werk een document nodig dat
            hier niet bij staat, vraag het dan aan bij de directie.
          </LetOp>
        </div>
      </Sectie>
    </div>
  );
}
