import type { Metadata } from "next";

import {
  DocumentenBlok,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Tabel,
  Vinklijst,
} from "@/components/vraagbaak/ui";
import {
  DOELGROEPEN,
  JIJ_KADER,
  KWALITEIT,
  METHODIEKEN,
  MISSIE,
  ORGANISATIE,
  ORGANISATIE_DOCUMENTEN,
  OVERLEGGEN,
  REGIOS,
  WEEKROOSTER,
} from "@/lib/vraagbaak/organisatie";

export const metadata: Metadata = {
  title: "Over Ricardo Jeugdhulp",
  description:
    "Organisatie, missie en werkwijze van Ricardo Jeugdhulp: doelgroepen, methodieken, gemeenten, weekrooster, overleggen en kwaliteit.",
};

export default function Over() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="01 · Over ons"
        titel="Over Ricardo Jeugdhulp"
        intro="Jeugdhulp zonder verblijf in Almere en Lelystad: ambulante begeleiding, groepsbegeleiding, dagbesteding, Behandeling LVB en Jeugd-GGZ."
      />

      <Sectie id="missie" titel="Waar we het voor doen">
        <div className="rounded-2xl bg-rj-blauw p-7 text-white sm:p-10">
          <p className="text-2xl font-extrabold text-balance text-rj-groen sm:text-3xl">
            {MISSIE.kern}
          </p>
          <p className="mt-5 max-w-2xl leading-relaxed text-white/85">
            {MISSIE.uitleg}
          </p>
          <div className="mt-7 border-t border-white/15 pt-6">
            <p className="text-sm font-extrabold tracking-wide text-rj-groen uppercase">
              Circulaire hulpverlening
            </p>
            <p className="mt-2 max-w-2xl leading-relaxed text-white/85">
              {MISSIE.circulair}
            </p>
          </div>
        </div>
      </Sectie>

      <Sectie id="doelgroepen" titel="Voor wie wij werken">
        <Kaart>
          <Vinklijst punten={DOELGROEPEN} />
        </Kaart>
      </Sectie>

      <Sectie
        id="methodieken"
        titel="Methodieken en werkwijzen"
        intro="We sluiten aan bij wat een jongere zelf belangrijk vindt. De methodiek volgt daarop, niet andersom."
      >
        <ul className="grid gap-3 sm:grid-cols-2">
          {METHODIEKEN.map((m) => (
            <li
              key={m.naam}
              className="rounded-2xl border border-rj-lijn bg-white p-4"
            >
              <p className="font-extrabold text-rj-blauw">{m.naam}</p>
              <p className="mt-1 text-sm leading-relaxed text-rj-grijs">
                {m.uitleg}
              </p>
            </li>
          ))}
        </ul>
      </Sectie>

      <Sectie
        id="gemeenten"
        titel="Waar wij werken, en voor welke gemeenten"
        intro="Productcodes zijn niet uitwisselbaar tussen gemeenten. Gebruik altijd de codelijst van de gemeente van de cliënt, ook als een dienst vergelijkbaar lijkt."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          {REGIOS.map((regio) => (
            <Kaart key={regio.naam} className="h-full">
              <p className="text-lg font-extrabold text-rj-blauw">
                {regio.naam}
              </p>
              <p className="mt-2 leading-relaxed text-rj-grijs">{regio.wat}</p>
              <ul className="mt-4 space-y-2 border-t border-rj-lijn pt-4">
                {regio.letop.map((punt) => (
                  <li key={punt} className="flex gap-2 text-sm text-rj-grijs">
                    <span aria-hidden className="font-extrabold text-rj-groen">
                      !
                    </span>
                    <span>{punt}</span>
                  </li>
                ))}
              </ul>
            </Kaart>
          ))}
        </div>
      </Sectie>

      <Sectie
        id="rooster"
        titel="Groepsaanbod op locatie"
        intro="Bij elke groepsactiviteit is een SKJ-geregistreerde begeleider aanwezig. Uitzondering: de PMT'er."
      >
        <ul className="grid gap-3 sm:grid-cols-5">
          {WEEKROOSTER.map((dag) => (
            <li
              key={dag.dag}
              className="flex flex-col rounded-2xl border border-rj-lijn bg-white p-4"
            >
              <span className="text-xs font-extrabold tracking-[0.14em] text-rj-grijs uppercase">
                {dag.dag}
              </span>
              <span className="mt-2 flex-1 text-sm leading-relaxed font-semibold text-rj-blauw">
                {dag.aanbod}
              </span>
            </li>
          ))}
        </ul>
      </Sectie>

      <Sectie id="overleggen" titel="Overleggen waar je aan meedoet">
        <Tabel
          koppen={["Overleg", "Frequentie", "Voor wie"]}
          rijen={OVERLEGGEN.map((o) => [o.naam, o.frequentie, o.voorWie])}
        />
      </Sectie>

      <Sectie
        id="kwaliteit"
        titel="Kwaliteit en toezicht"
        intro="Waar we op getoetst worden, en door wie."
      >
        <ul className="space-y-3">
          {KWALITEIT.map((k) => (
            <li
              key={k.naam}
              className="rounded-2xl border border-rj-lijn bg-white p-5"
            >
              <p className="font-extrabold text-rj-blauw">{k.naam}</p>
              <p className="mt-1 leading-relaxed text-rj-grijs">{k.tekst}</p>
            </li>
          ))}
        </ul>

        <div className="mt-6">
          <p className="mb-3 text-base font-extrabold tracking-wide text-rj-blauw uppercase">
            Het JIJ-kader — waar de inspectie op doorvraagt
          </p>
          <ol className="grid gap-4 sm:grid-cols-3">
            {JIJ_KADER.map((pijler, i) => (
              <li key={pijler.pijler}>
                <Kaart className="h-full">
                  <span
                    aria-hidden
                    className="mb-3 flex h-8 w-8 items-center justify-center rounded-full bg-rj-groen text-sm font-extrabold text-rj-blauw"
                  >
                    {i + 1}
                  </span>
                  <p className="font-extrabold text-rj-blauw">{pijler.pijler}</p>
                  <p className="mt-2 text-sm leading-relaxed text-rj-grijs">
                    {pijler.tekst}
                  </p>
                </Kaart>
              </li>
            ))}
          </ol>
        </div>
      </Sectie>

      <Sectie id="gegevens" titel="De organisatie op een rij">
        <Tabel
          koppen={["Gegeven", "Waarde"]}
          rijen={[
            ["Statutaire naam", ORGANISATIE.naam],
            ["KvK-nummer", ORGANISATIE.kvk],
            ["AGB-code", ORGANISATIE.agb],
            ["SBI-code", ORGANISATIE.sbi],
            ["Bezoekadres", ORGANISATIE.adres],
            ["Telefoon", ORGANISATIE.telefoon],
            ["Website", ORGANISATIE.website],
            ["Kwaliteitskeurmerk", ORGANISATIE.keurmerk],
          ]}
        />
        <div className="mt-4">
          <LetOp toon="blauw">{ORGANISATIE.opgericht}</LetOp>
        </div>
      </Sectie>

      <DocumentenBlok documenten={ORGANISATIE_DOCUMENTEN} />
    </div>
  );
}
