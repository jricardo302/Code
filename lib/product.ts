import { EDITIE, MERK } from "@/lib/site";

/**
 * Het assortiment. Eén editie nu, maar de vorm is bewust een lijst: er komen
 * meer edities (CASUÏSTIEK, JEUGD-GGZ, SYSTEMISCH WERKEN, TEAM, OUDERS) en
 * die moeten er straks bij kunnen zonder de webshop te herbouwen.
 *
 * Alle bedragen in hele centen, inclusief btw. Rekenen met floats en euro's
 * gaat een keer mis; centen als integer niet.
 */

export type Editie = {
  slug: string;
  merk: string;
  editie: string;
  naam: string;
  status: "beschikbaar" | "in-productie" | "gepland";
  korteOmschrijving: string;
  /** Prijs per stuk bij één exemplaar, in centen incl. btw. */
  prijsCenten: number;
  btwTarief: number;
  aantalKaarten: number;
  niveaus: number;
  spelers: string;
  /** Stripe Price-id. Leeg = de checkout maakt een prijs op basis van prijsCenten. */
  stripePriceId: string | null;
};

export const EDITIES: Editie[] = [
  {
    slug: "intervisie",
    merk: MERK,
    editie: EDITIE,
    naam: `${MERK} ${EDITIE}`,
    status: "in-productie",
    korteOmschrijving:
      "Honderd vraagkaarten in drie niveaus, voor intervisie en casuïstiek in jeugdhulp en GGZ.",
    prijsCenten: 3995,
    btwTarief: 0.21,
    aantalKaarten: 100,
    niveaus: 3,
    spelers: "2–10 professionals",
    stripePriceId: process.env.STRIPE_PRICE_INTERVISIE ?? null,
  },
];

export const HOOFDEDITIE = EDITIES[0];

export function editieBijSlug(slug: string): Editie | undefined {
  return EDITIES.find((editie) => editie.slug === slug);
}

/**
 * Staffelkorting. Onder de eerste drempel geldt gewoon de stukprijs.
 * De staffels lopen door tot 24; vanaf 25 sturen we mensen naar een offerte,
 * omdat daar verzending, facturatie en levertijd echt anders liggen.
 */
export const STAFFELS = [
  { vanaf: 1, prijsCenten: 3995, label: "1 spel" },
  { vanaf: 5, prijsCenten: 3795, label: "vanaf 5 spellen" },
  { vanaf: 10, prijsCenten: 3595, label: "vanaf 10 spellen" },
] as const;

/** Boven dit aantal loopt de bestelling via een offerte, niet via de checkout. */
export const OFFERTE_DREMPEL = 25;

export function stukprijsCenten(aantal: number): number {
  let prijs: number = STAFFELS[0].prijsCenten;
  for (const staffel of STAFFELS) {
    if (aantal >= staffel.vanaf) prijs = staffel.prijsCenten;
  }
  return prijs;
}

// ---------------------------------------------------------------------------
// Verzending
// ---------------------------------------------------------------------------

export const VERZENDING = {
  /** Landen waar de checkout naartoe verzendt. */
  landen: ["NL", "BE"] as const,
  nl: { kostenCenten: 495, gratisVanafCenten: 7500, naam: "Nederland" },
  be: { kostenCenten: 795, gratisVanafCenten: 9500, naam: "België" },
} as const;

export function verzendkostenCenten(
  land: "NL" | "BE",
  ordertotaalCenten: number,
): number {
  const regel = land === "BE" ? VERZENDING.be : VERZENDING.nl;
  return ordertotaalCenten >= regel.gratisVanafCenten ? 0 : regel.kostenCenten;
}

// ---------------------------------------------------------------------------
// Weergave
// ---------------------------------------------------------------------------

const euroFormatter = new Intl.NumberFormat("nl-NL", {
  style: "currency",
  currency: "EUR",
});

export function euro(centen: number): string {
  return euroFormatter.format(centen / 100);
}

/** Bedrag exclusief btw, voor de zakelijke pagina. */
export function exclBtwCenten(centenInclBtw: number, tarief: number): number {
  return Math.round(centenInclBtw / (1 + tarief));
}
