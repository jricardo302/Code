"use client";

import Link from "next/link";

import { useGehydrateerd, useOpslag } from "@/lib/vraagbaak/opslag";
import { ROLLEN } from "@/lib/vraagbaak/rollen";

/** Wisselt per dag, zodat er elke dag iets anders bovenaan staat. */
const TIPS: { tekst: string; href: string; actie: string }[] = [
  {
    tekst:
      "Twijfel je over de veiligheid van een kind? Dan overleg je. Niet melden is nooit de veilige keuze.",
    href: "/vraagbaak/nood#huiselijk-geweld",
    actie: "Stappen bij signalen",
  },
  {
    tekst:
      "JGZ is de gemeentelijke toegang in Almere. JGO is het team op scholen voor speciaal onderwijs. Andere route, andere contactpersoon.",
    href: "/vraagbaak/werk#verlengen",
    actie: "Naar de verlengwijzer",
  },
  {
    tekst:
      "Een productcode van Almere werkt niet in Lelystad. Gebruik altijd de codelijst van de gemeente van de cliënt.",
    href: "/vraagbaak/werk#uren",
    actie: "Uren en productcodes",
  },
  {
    tekst:
      "Schrijf je rapportage alsof de cliënt meeleest. Dat mag hij namelijk.",
    href: "/vraagbaak/werk#dossier",
    actie: "Regels voor rapporteren",
  },
  {
    tekst:
      "Gebruik geen cliëntnamen in AI-tools. Werk met initialen of cliëntnummers.",
    href: "/vraagbaak/huisstijl#ai",
    actie: "Afspraken over AI",
  },
  {
    tekst:
      "Veilig Thuis is 24 uur per dag bereikbaar op 0800-2000, ook voor anoniem advies.",
    href: "/vraagbaak/nood",
    actie: "Alle noodnummers",
  },
  {
    tekst:
      "Het casuïstiekoverleg is verplicht voor álle begeleiders, ook voor zzp'ers.",
    href: "/vraagbaak/werk#casuistiek",
    actie: "Over het overleg",
  },
];

function dagVanHetJaar(datum: Date): number {
  const jaarstart = new Date(datum.getFullYear(), 0, 0);
  return Math.floor((datum.getTime() - jaarstart.getTime()) / 86_400_000);
}

function groet(uur: number): string {
  if (uur < 6) return "Goedenacht";
  if (uur < 12) return "Goedemorgen";
  if (uur < 18) return "Goedemiddag";
  return "Goedenavond";
}

export function Begroeting() {
  // De server weet niet hoe laat het bij jou is, dus groeten we pas na
  // hydratie. Tot die tijd staat er "Welkom" — dat klopt altijd.
  const gehydrateerd = useGehydrateerd();
  const [rolSlug] = useOpslag<string>("rol", "");

  const nu = gehydrateerd ? new Date() : null;
  const rol = ROLLEN.find((r) => r.slug === rolSlug);
  const tip = TIPS[nu ? dagVanHetJaar(nu) % TIPS.length : 0];

  return (
    <div>
      <p className="text-sm font-extrabold tracking-[0.18em] text-rj-grijs uppercase">
        {nu ? groet(nu.getHours()) : "Welkom"}
        {rol && (
          <>
            {" · "}
            <Link
              href={`/vraagbaak/rollen#${rol.slug}`}
              className="text-rj-blauw hover:underline"
            >
              {rol.kort}
            </Link>
          </>
        )}
      </p>
      <h1 className="mt-3 text-4xl font-extrabold tracking-tight text-balance text-rj-blauw sm:text-5xl">
        Alles wat je nodig hebt om je werk goed
        <span className="relative whitespace-nowrap">
          {" "}
          en veilig
          <span
            aria-hidden
            className="absolute inset-x-0 -bottom-1 h-2 rounded-full bg-rj-groen"
          />
        </span>{" "}
        te doen.
      </h1>
      <p className="mt-5 max-w-2xl text-lg leading-relaxed text-rj-grijs">
        Dit is de vraagbaak van Ricardo Jeugdhulp. Zoek wat je zoekt, of loop de
        onderdelen langs. Kom je er niet uit, stel je vraag dan aan je
        leidinggevende of aan de zorgcoördinator.
      </p>

      <div className="mt-7 flex flex-col gap-3 rounded-2xl border-l-4 border-rj-groen bg-rj-groen-licht p-5 sm:flex-row sm:items-center">
        <p className="leading-relaxed text-rj-blauw">
          <span className="font-extrabold">Goed om te weten · </span>
          {tip.tekst}
        </p>
        <Link
          href={tip.href}
          className="shrink-0 rounded-full bg-rj-blauw px-4 py-2 text-center text-sm font-extrabold text-white hover:bg-rj-blauw/85 sm:ml-auto"
        >
          {tip.actie}
        </Link>
      </div>
    </div>
  );
}
