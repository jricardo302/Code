import type { Metadata } from "next";

import { Verlengwijzer } from "@/components/vraagbaak/Verlengwijzer";
import {
  DocumentLink,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Tabel,
  Vinklijst,
  VerderLink,
} from "@/components/vraagbaak/ui";
import {
  AANMELDPROCES,
  CASUISTIEKOVERLEG,
  DOSSIER_WAAR,
  FORMATS,
  FORMATS_NOOT,
  JGZ_VERSUS_JGO,
  NOG_TE_BEVESTIGEN,
  PRODUCTCATEGORIEEN,
  PRODUCTCODE_NOOT,
  RAPPORTAGE_REGELS,
  UREN_DEADLINE,
  UREN_REGELS,
  VERLENG_KWALITEITSEIS,
  VERWIJZERS,
  WACHTTIJDNORM,
} from "@/lib/vraagbaak/processen";

export const metadata: Metadata = {
  title: "Werkprocessen",
  description:
    "Van aanmelding tot start, de lege formulieren, verlenging van beschikkingen, uren en productcodes, dossiervoering en het casuïstiekoverleg.",
};

export default function Werk() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="05 · Werkprocessen en formats"
        titel="Hoe het werk loopt"
        intro="Van de eerste mail van een verwijzer tot de declaratie aan het einde van de maand."
      />

      <Sectie
        id="aanmelding"
        titel="Van aanmelding tot start"
        intro={WACHTTIJDNORM}
      >
        <ol className="space-y-3">
          {AANMELDPROCES.map((stap) => (
            <li
              key={stap.nummer}
              className="flex gap-4 rounded-2xl border border-rj-lijn bg-white p-5"
            >
              <span
                aria-hidden
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-rj-blauw text-sm font-extrabold text-white"
              >
                {stap.nummer}
              </span>
              <div className="min-w-0 flex-1">
                <p className="font-extrabold text-rj-blauw">{stap.titel}</p>
                <p className="mt-1 text-sm text-rj-grijs">
                  <span className="font-semibold">{stap.wie}</span> · {stap.waar}
                </p>
              </div>
            </li>
          ))}
        </ol>

        <div className="mt-6">
          <Kaart>
            <p className="text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
              Van wie komen aanmeldingen binnen
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {VERWIJZERS.map((v) => (
                <li
                  key={v}
                  className="rounded-full bg-rj-blauw-licht px-3 py-1.5 text-sm font-semibold text-rj-blauw"
                >
                  {v}
                </li>
              ))}
            </ul>
          </Kaart>
        </div>
      </Sectie>

      <Sectie
        id="verlengen"
        titel="Een beschikking loopt af — wat nu?"
        intro="Een beschikking is de toekenning van zorg aan de cliënt, met een einddatum. De route hangt af van wie hem heeft afgegeven."
      >
        <Verlengwijzer />

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <LetOp titel="Kwaliteitseis aan het verslag">
            {VERLENG_KWALITEITSEIS}
          </LetOp>
          <LetOp toon="blauw" titel="JGZ is niet JGO">
            <p>{JGZ_VERSUS_JGO.jgz}</p>
            <p className="mt-2">{JGZ_VERSUS_JGO.jgo}</p>
            <p className="mt-2 font-semibold">{JGZ_VERSUS_JGO.waarschuwing}</p>
          </LetOp>
        </div>
      </Sectie>

      <Sectie id="uren" titel="Uren, productcodes en declaratie">
        <div className="rounded-2xl bg-rj-blauw p-6 text-white sm:p-8">
          <p className="text-sm font-extrabold tracking-[0.18em] text-rj-groen uppercase">
            Harde deadline
          </p>
          <p className="mt-2 text-2xl font-extrabold sm:text-3xl">
            {UREN_DEADLINE.kop}
          </p>
          <p className="mt-3 max-w-2xl leading-relaxed text-white/85">
            {UREN_DEADLINE.tekst}
          </p>
        </div>

        <div className="mt-5">
          <Kaart>
            <Vinklijst punten={UREN_REGELS} />
          </Kaart>
        </div>

        <div className="mt-5">
          <p className="mb-3 text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
            De productcategorieën
          </p>
          <ul className="flex flex-wrap gap-2">
            {PRODUCTCATEGORIEEN.map((c) => (
              <li
                key={c}
                className="rounded-full border border-rj-lijn bg-white px-3 py-1.5 text-sm font-semibold text-rj-blauw"
              >
                {c}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-2xl border-l-4 border-rj-groen bg-rj-groen-licht p-5 leading-relaxed text-rj-blauw">
            {PRODUCTCODE_NOOT}
          </p>
        </div>
      </Sectie>

      <Sectie id="dossier" titel="Dossiervoering" intro={DOSSIER_WAAR}>
        <Kaart>
          <p className="mb-4 text-lg font-extrabold text-rj-blauw">
            Wat niet in het dossier staat, is niet gebeurd.
          </p>
          <Vinklijst punten={RAPPORTAGE_REGELS} />
        </Kaart>
      </Sectie>

      <Sectie id="casuistiek" titel="Casuïstiekoverleg" intro={CASUISTIEKOVERLEG.wat}>
        <Kaart>
          <p className="leading-relaxed text-rj-grijs">
            {CASUISTIEKOVERLEG.hoe}
          </p>
          <div className="mt-5">
            <DocumentLink
              titel="Casuïstiekoverleg — programma"
              waarvoor="De opzet van het overleg"
              url={CASUISTIEKOVERLEG.programma}
            />
          </div>
        </Kaart>
      </Sectie>

      <Sectie
        id="formats"
        titel="De lege formulieren"
        intro="Download het lege formulier via de link en sla je ingevulde versie op in het cliëntdossier in Zilliz — nooit in Drive."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          {FORMATS.map((f) => (
            <DocumentLink
              key={f.url}
              titel={f.titel}
              waarvoor={f.wanneer}
              url={f.url}
            />
          ))}
        </div>
        <p className="mt-4 text-sm leading-relaxed text-rj-grijs">
          {FORMATS_NOOT}
        </p>
      </Sectie>

      <Sectie
        id="open"
        titel="Nog te bevestigen"
        intro="Deze punten zijn nog niet definitief vastgelegd. Vraag ernaar bij de zorgcoördinator of directie; ga niet uit van aannames."
      >
        <Tabel
          koppen={["Punt", "Bij wie"]}
          rijen={NOG_TE_BEVESTIGEN.map((punt) => [
            punt,
            "Zorgcoördinator of directie",
          ])}
        />
      </Sectie>

      <p className="py-4">
        <VerderLink href="/vraagbaak/systemen">
          Waar je dit allemaal vastlegt: Zilliz en de andere systemen
        </VerderLink>
      </p>
    </div>
  );
}
