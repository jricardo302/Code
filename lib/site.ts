/**
 * Merk- en bedrijfsgegevens op één plek.
 *
 * De bedrijfsgegevens hieronder zijn bewust plaatshouders. Ze worden op de
 * juridische pagina's als zodanig getoond — er staat dus nergens een verzonnen
 * KvK- of btw-nummer op de site. Vul ze via .env.local of hier direct in.
 */

export const MERK = "IK ZIE, IK ZIE…";
export const MERK_KORT = "Ik zie, ik zie…";
export const EDITIE = "INTERVISIE";
export const PRODUCT_NAAM = `${MERK} ${EDITIE}`;

export const TAGLINE = "Honderd vragen voor gesprekken die verder kijken.";
export const TAGLINE_KORT = "Kijk. Vraag. Reflecteer.";

export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");

export const CONTACT_MAIL =
  process.env.NEXT_PUBLIC_CONTACT_MAIL ?? "hallo@ikzieikzie.eu";

export const ZAKELIJK_MAIL =
  process.env.NEXT_PUBLIC_ZAKELIJK_MAIL ?? "teams@ikzieikzie.eu";

/**
 * Bedrijfsgegevens. `null` betekent: nog niet bekend. De pagina's tonen dan
 * een expliciete plaatshouder in plaats van iets te verzinnen.
 */
export const BEDRIJF = {
  naam: process.env.NEXT_PUBLIC_BEDRIJFSNAAM ?? null,
  adres: process.env.NEXT_PUBLIC_BEDRIJFSADRES ?? null,
  kvk: process.env.NEXT_PUBLIC_KVK ?? null,
  btw: process.env.NEXT_PUBLIC_BTW ?? null,
  telefoon: process.env.NEXT_PUBLIC_TELEFOON ?? null,
} as const;

/** Toont de waarde, of een duidelijk zichtbare plaatshouder. */
export function ofPlaatshouder(waarde: string | null, wat: string) {
  return waarde ?? `[${wat} — nog invullen]`;
}

/**
 * Staat de webshop open? Zolang de eerste oplage niet is gedrukt verkopen we
 * niets: dan draait de site op de wachtlijst. Zet NEXT_PUBLIC_VERKOOP_OPEN=1
 * zodra er voorraad is.
 */
export const VERKOOP_OPEN = process.env.NEXT_PUBLIC_VERKOOP_OPEN === "1";

export const SOCIALS = [
  { naam: "LinkedIn", url: process.env.NEXT_PUBLIC_LINKEDIN ?? null },
  { naam: "Instagram", url: process.env.NEXT_PUBLIC_INSTAGRAM ?? null },
] as const;
