/**
 * De zoekindex. Alles wat in de app staat wordt hier platgeslagen tot losse
 * treffers, zodat iemand die "uren" of "datalek" typt meteen op de juiste
 * regel uitkomt in plaats van op een pagina waar het ergens tussen staat.
 *
 * De index wordt één keer opgebouwd bij het laden van de module en meegestuurd
 * naar de browser; hij is klein genoeg (enkele honderden regels tekst) om
 * volledig client-side te doorzoeken, zonder netwerkverkeer per toetsaanslag.
 */

import { BEGRIPPEN } from "./begrippen";
import { SITUATIES, NOODNUMMERS, PROTOCOLLEN } from "./escalatie";
import {
  AI_REGELS,
  COMMUNICATIE_CLIENTEN,
  COMMUNICATIE_GEMEENTEN,
  LOGOREGELS,
  SCHRIJFREGELS,
} from "./huisstijl";
import { CHECKLIST, FASEN } from "./inwerken";
import {
  METHODIEKEN,
  OVERLEGGEN,
  REGIOS,
  TEAM,
  WEEKROOSTER,
} from "./organisatie";
import {
  AANMELDPROCES,
  FORMATS,
  RAPPORTAGE_REGELS,
  UREN_DEADLINE,
  UREN_REGELS,
  VERLENGROUTES,
} from "./processen";
import { ROLLEN } from "./rollen";
import { SYSTEMEN, VEILIG_WERKEN } from "./systemen";
import { VRAGEN } from "./vragen";

export type Treffer = {
  id: string;
  titel: string;
  tekst: string;
  /** Label van de sectie, voor de chip naast de treffer. */
  sectie: string;
  href: string;
  /**
   * Voorrang bij gelijke woordtreffers. Wie "suïcide" intikt wil de stappen
   * van de escalatiekaart zien, niet het vinkje uit de inwerklijst dat
   * toevallig hetzelfde woord bevat.
   */
  gewicht?: number;
  /**
   * Woorden die net zo zwaar tellen als de titel. De escalatiekaart heet
   * "Suïcidale uitingen of automutilatie" — wie "suïcide" tikt, moet hem
   * evengoed bovenaan krijgen.
   */
  sleutelwoorden?: string;
};

function bouwIndex(): Treffer[] {
  const t: Treffer[] = [];

  for (const s of SITUATIES) {
    t.push({
      id: `nood-${s.slug}`,
      titel: s.titel,
      tekst: [s.vraag, ...s.stappen, ...s.trefwoorden].join(" "),
      sleutelwoorden: s.trefwoorden.join(" "),
      sectie: "Veiligheid",
      href: `/vraagbaak/nood#${s.slug}`,
      gewicht: 6,
    });
  }

  for (const n of NOODNUMMERS) {
    t.push({
      id: `nummer-${n.wie}`,
      titel: `${n.wie}${n.nummer ? ` — ${n.nummer}` : ""}`,
      tekst: [n.situatie, n.toelichting].filter(Boolean).join(" "),
      sectie: "Veiligheid",
      href: "/vraagbaak/nood",
      gewicht: 4,
    });
  }

  for (const groep of PROTOCOLLEN) {
    for (const doc of groep.documenten) {
      t.push({
        id: `protocol-${doc.titel}`,
        titel: doc.titel,
        tekst: `${doc.waarvoor} ${groep.titel}`,
        sectie: "Protocollen",
        href: "/vraagbaak/nood#protocollen",
      });
    }
  }

  for (const v of VRAGEN) {
    t.push({
      id: `vraag-${v.id}`,
      titel: v.vraag,
      tekst: v.antwoord,
      sectie: "Veelgestelde vragen",
      href: `/vraagbaak/vragen#${v.id}`,
      gewicht: 3,
    });
  }

  for (const b of BEGRIPPEN) {
    t.push({
      id: `begrip-${b.term}`,
      titel: b.term,
      tekst: b.uitleg,
      sectie: "Begrip",
      href: `/vraagbaak/vragen#begrippen`,
      gewicht: 2,
    });
  }

  for (const r of ROLLEN) {
    t.push({
      id: `rol-${r.slug}`,
      titel: r.naam,
      tekst: [
        r.kern,
        ...(r.watJeDoet ?? []),
        ...(r.ritme ?? []).flatMap((x) => x.punten),
        ...(r.extra?.punten ?? []),
        r.aangesprokenOp,
        r.opschalen,
        r.eisen,
      ]
        .filter(Boolean)
        .join(" "),
      sectie: "Rollen",
      href: `/vraagbaak/rollen#${r.slug}`,
    });
  }

  for (const p of AANMELDPROCES) {
    t.push({
      id: `proces-${p.nummer}`,
      titel: `Stap ${p.nummer}: ${p.titel}`,
      tekst: `${p.wie} ${p.waar}`,
      sectie: "Werkprocessen",
      href: "/vraagbaak/werk",
    });
  }

  for (const v of VERLENGROUTES) {
    t.push({
      id: `verleng-${v.slug}`,
      titel: `Verlengen via ${v.verwijzer}`,
      tekst: `${v.wanneerKiesJeDit} ${v.termijn} ${v.hoe}`,
      sectie: "Verlengen",
      href: `/vraagbaak/werk#verlengen`,
    });
  }

  for (const f of FORMATS) {
    t.push({
      id: `format-${f.titel}`,
      titel: f.titel,
      tekst: f.wanneer,
      sectie: "Formats",
      href: "/vraagbaak/werk#formats",
    });
  }

  t.push({
    id: "uren",
    titel: "Uren, productcodes en declaratie",
    tekst: `${UREN_DEADLINE.kop}. ${UREN_DEADLINE.tekst} ${UREN_REGELS.join(" ")}`,
    sectie: "Werkprocessen",
    href: "/vraagbaak/werk#uren",
  });

  t.push({
    id: "rapportage",
    titel: "Regels voor rapporteren",
    tekst: RAPPORTAGE_REGELS.join(" "),
    sectie: "Dossier",
    href: "/vraagbaak/werk#dossier",
  });

  for (const s of SYSTEMEN) {
    t.push({
      id: `systeem-${s.slug}`,
      titel: s.naam,
      tekst: `${s.waarvoor} Toegang via ${s.toegang} ${(s.activatie ?? []).join(" ")}`,
      sectie: "Systemen",
      href: `/vraagbaak/systemen#${s.slug}`,
    });
  }

  t.push({
    id: "veilig-werken",
    titel: "Veilig werken",
    tekst: VEILIG_WERKEN.map((v) => [v.regel, v.waarom].filter(Boolean).join(" ")).join(" "),
    sectie: "Systemen",
    href: "/vraagbaak/systemen#veilig",
  });

  for (const lid of TEAM) {
    t.push({
      id: `team-${lid.naam}`,
      titel: `${lid.naam} — ${lid.rol}`,
      tekst: lid.waarvoor,
      sectie: "Wie is wie",
      href: "/vraagbaak#team",
    });
  }

  for (const m of METHODIEKEN) {
    t.push({
      id: `methodiek-${m.naam}`,
      titel: m.naam,
      tekst: m.uitleg,
      sectie: "Over ons",
      href: "/vraagbaak/over#methodieken",
    });
  }

  for (const r of REGIOS) {
    t.push({
      id: `regio-${r.naam}`,
      titel: r.naam,
      tekst: `${r.wat} ${r.letop.join(" ")}`,
      sectie: "Over ons",
      href: "/vraagbaak/over#gemeenten",
    });
  }

  for (const w of WEEKROOSTER) {
    t.push({
      id: `rooster-${w.dag}`,
      titel: `${w.dag} op locatie`,
      tekst: w.aanbod,
      sectie: "Over ons",
      href: "/vraagbaak/over#rooster",
    });
  }

  for (const o of OVERLEGGEN) {
    t.push({
      id: `overleg-${o.naam}`,
      titel: o.naam,
      tekst: `${o.frequentie} ${o.voorWie}`,
      sectie: "Over ons",
      href: "/vraagbaak/over#overleggen",
    });
  }

  for (const fase of CHECKLIST) {
    for (const punt of fase.punten) {
      t.push({
        id: `check-${punt.id}`,
        titel: punt.actie,
        tekst: `${fase.titel} — ${punt.wie}`,
        sectie: "Inwerken",
        href: `/vraagbaak/inwerken#${fase.slug}`,
      });
    }
  }

  for (const fase of FASEN) {
    for (const doel of fase.doelen) {
      t.push({
        id: `fase-${fase.slug}-${doel.onderwerp}`,
        titel: `${doel.onderwerp} (${fase.periode})`,
        tekst: `${doel.watJeDoet} ${doel.resultaat}`,
        sectie: "Inwerkplan",
        href: `/vraagbaak/inwerken#${fase.slug}`,
      });
    }
  }

  const huisstijlRegels: [string, string[], string][] = [
    ["Logogebruik", LOGOREGELS, "logo"],
    ["Schrijfregels", SCHRIJFREGELS, "schrijven"],
    ["Communicatie met gemeenten", COMMUNICATIE_GEMEENTEN, "gemeenten"],
    ["Communicatie met cliënten", COMMUNICATIE_CLIENTEN, "clienten"],
    ["Gebruik van AI", AI_REGELS, "ai"],
  ];
  for (const [titel, regels, anker] of huisstijlRegels) {
    t.push({
      id: `huisstijl-${anker}`,
      titel,
      tekst: regels.join(" "),
      sectie: "Huisstijl",
      href: `/vraagbaak/huisstijl#${anker}`,
    });
  }

  return t;
}

export const ZOEKINDEX: Treffer[] = bouwIndex();

/** Diakrieten weg en kleine letters, zodat "suicide" ook "suïcide" vindt. */
function normaliseer(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

const GENORMALISEERD = ZOEKINDEX.map((t) => ({
  treffer: t,
  titel: normaliseer(t.titel),
  sleutelwoorden: normaliseer(t.sleutelwoorden ?? ""),
  tekst: normaliseer(`${t.titel} ${t.tekst} ${t.sectie}`),
}));

/**
 * Zoekt op alle woorden in de vraag: een treffer telt alleen mee als elk woord
 * erin voorkomt. Een woord in de titel weegt zwaarder dan een woord in de
 * tekst, en een titel die met de zoekterm begint staat bovenaan.
 */
export function zoek(vraag: string, maximaal = 12): Treffer[] {
  const genormaliseerd = normaliseer(vraag.trim());
  if (genormaliseerd.length < 2) return [];
  const woorden = genormaliseerd.split(/\s+/).filter(Boolean);

  const gescoord: { treffer: Treffer; score: number }[] = [];
  for (const item of GENORMALISEERD) {
    let score = item.treffer.gewicht ?? 0;
    let compleet = true;
    for (const woord of woorden) {
      if (!item.tekst.includes(woord)) {
        compleet = false;
        break;
      }
      score += 1;
      if (item.titel.includes(woord) || item.sleutelwoorden.includes(woord))
        score += 3;
      if (item.titel.startsWith(woord)) score += 4;
    }
    if (compleet) gescoord.push({ treffer: item.treffer, score });
  }

  return gescoord
    .sort((a, b) => b.score - a.score)
    .slice(0, maximaal)
    .map((g) => g.treffer);
}
