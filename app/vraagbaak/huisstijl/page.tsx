import type { Metadata } from "next";
import Image from "next/image";

import { Handtekening } from "@/components/vraagbaak/Handtekening";
import {
  DocumentenBlok,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Vinklijst,
} from "@/components/vraagbaak/ui";
import {
  AI_REGELS,
  COMMUNICATIE_CLIENTEN,
  COMMUNICATIE_GEMEENTEN,
  HANDTEKENING_VELDEN,
  HUISSTIJL_DOCUMENTEN,
  LETTERTYPE,
  LOGOREGELS,
  MERKKLEUREN,
  SCHRIJFREGELS,
} from "@/lib/vraagbaak/huisstijl";

export const metadata: Metadata = {
  title: "Huisstijl en communicatie",
  description:
    "Kleuren, lettertype, logogebruik, de e-mailhandtekening, schrijfregels en de afspraken over communicatie met gemeenten, cliënten en AI-tools.",
};

export default function Huisstijl() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="07 · Huisstijl en communicatie"
        titel="Zo zien en klinken wij"
        intro="Rustig, warm en professioneel. Veel wit, donkerblauwe koppen, groen spaarzaam als accent, en het logo consequent rechtsboven."
      />

      <Sectie id="kleuren" titel="De merkkleuren">
        <ul className="grid gap-4 sm:grid-cols-3">
          {MERKKLEUREN.map((kleur) => (
            <li
              key={kleur.hex}
              className="overflow-hidden rounded-2xl border border-rj-lijn bg-white"
            >
              {/* Ring erbij, anders valt het witte staal weg tegen de kaart. */}
              <div
                className="h-24 border-b border-rj-lijn ring-1 ring-rj-lijn ring-inset"
                style={{ backgroundColor: kleur.hex }}
              />
              <div className="p-5">
                <p className="font-extrabold text-rj-blauw">{kleur.naam}</p>
                <p className="mt-0.5 font-mono text-sm text-rj-grijs">
                  {kleur.hex}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-rj-grijs">
                  {kleur.gebruik}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </Sectie>

      <Sectie id="lettertype" titel="Het lettertype" intro={LETTERTYPE.tekst}>
        <Kaart>
          <p className="text-4xl font-extrabold tracking-tight text-rj-blauw">
            Passende zorg begint met de juiste match.
          </p>
          <p className="mt-4 max-w-xl leading-relaxed text-rj-grijs">
            Deze pagina is gezet in {LETTERTYPE.kop}. Heb je Mont geïnstalleerd,
            dan zie je Mont; anders Montserrat. Het verschil is met het blote oog
            nauwelijks te zien, en dat is precies de bedoeling.
          </p>
        </Kaart>
      </Sectie>

      <Sectie id="logo" titel="Het logo">
        <div className="grid gap-4 sm:grid-cols-[auto_1fr] sm:items-start">
          <div className="flex items-center justify-center rounded-2xl border border-rj-lijn bg-white p-8">
            <Image
              src="/vraagbaak/logo.png"
              alt="Het logo van Ricardo Jeugdhulp"
              width={2291}
              height={675}
              className="h-16 w-auto"
            />
          </div>
          <Kaart>
            <Vinklijst punten={LOGOREGELS} />
          </Kaart>
        </div>
      </Sectie>

      <Sectie
        id="handtekening"
        titel="Je e-mailhandtekening"
        intro="Vul je naam en functie in, kopieer hem en plak hem in Gmail bij Instellingen → Handtekening."
      >
        <Handtekening />
        <div className="mt-5">
          <LetOp toon="blauw">{HANDTEKENING_VELDEN.vertrouwelijkheid}</LetOp>
        </div>
      </Sectie>

      <Sectie id="schrijven" titel="Schrijfregels">
        <Kaart>
          <Vinklijst punten={SCHRIJFREGELS} />
        </Kaart>
      </Sectie>

      <Sectie id="gemeenten" titel="Communicatie met gemeenten en verwijzers">
        <Kaart>
          <Vinklijst punten={COMMUNICATIE_GEMEENTEN} />
        </Kaart>
      </Sectie>

      <Sectie id="clienten" titel="Communicatie met cliënten en ouders">
        <Kaart>
          <Vinklijst punten={COMMUNICATIE_CLIENTEN} />
        </Kaart>
      </Sectie>

      <Sectie id="ai" titel="Gebruik van AI">
        <LetOp titel="De inhoudelijke verantwoordelijkheid blijft bij jou">
          <ul className="mt-2 space-y-2.5">
            {AI_REGELS.map((regel) => (
              <li key={regel} className="flex gap-2">
                <span aria-hidden className="font-extrabold">
                  ·
                </span>
                <span>{regel}</span>
              </li>
            ))}
          </ul>
        </LetOp>
      </Sectie>

      <DocumentenBlok documenten={HUISSTIJL_DOCUMENTEN} />
    </div>
  );
}
