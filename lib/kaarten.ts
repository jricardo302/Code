import kaartenBestand from "@/content/cards.json";

/**
 * De honderd kaarten, ingelezen uit het bestand dat `scripts/kaarten.mjs`
 * genereert. Eén bron voor website, printbestanden en CSV — zo kan de site
 * nooit andere vragen tonen dan er op de kaarten staan.
 */

export type Kaart = {
  card_number: number;
  level: 1 | 2 | 3;
  level_naam: string;
  category: string;
  question: string;
  color: string;
  text_color: string;
  print_front: string;
  notes: string;
};

export type NiveauInfo = {
  naam: string;
  ondertitel: string;
  kleur: string;
  tekstkleur: string;
  doel: string;
};

export const KAARTEN = kaartenBestand.kaarten as Kaart[];

export const AFSLUITKAART = kaartenBestand.afsluitkaart;

export const NIVEAUS: Record<1 | 2 | 3, NiveauInfo> = {
  1: kaartenBestand.niveaus["1"],
  2: kaartenBestand.niveaus["2"],
  3: kaartenBestand.niveaus["3"],
};

export function kaartenVanNiveau(niveau: 1 | 2 | 3): Kaart[] {
  return KAARTEN.filter((kaart) => kaart.level === niveau);
}

export function aantalPerNiveau(niveau: 1 | 2 | 3): number {
  return kaartenVanNiveau(niveau).length;
}

/**
 * Een vaste, gespreide greep uit een niveau — voor de voorbeelden op de site.
 * Bewust deterministisch: server en client moeten dezelfde kaarten tonen,
 * anders krijg je een hydration-mismatch, en een build moet reproduceerbaar zijn.
 */
export function voorbeelden(niveau: 1 | 2 | 3, hoeveel: number): Kaart[] {
  const alle = kaartenVanNiveau(niveau);
  const stap = Math.max(1, Math.floor(alle.length / hoeveel));
  const gekozen: Kaart[] = [];
  for (let i = 0; gekozen.length < hoeveel && i < alle.length; i += stap) {
    gekozen.push(alle[i]);
  }
  return gekozen;
}

/** Alle categorieën van een niveau, op volgorde van eerste voorkomen. */
export function categorieen(niveau: 1 | 2 | 3): string[] {
  return [...new Set(kaartenVanNiveau(niveau).map((kaart) => kaart.category))];
}
