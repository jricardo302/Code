import { z } from "zod";

/**
 * Eén schema per formulier, gedeeld door client en server.
 *
 * De HTML-attributen in de formulieren zijn een service voor de bezoeker; de
 * echte controle gebeurt hier, op de server. Lege strings uit een FormData
 * worden naar `undefined` gemapt, zodat "optioneel" ook echt optioneel is.
 */

const optioneleTekst = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Dit veld mag maximaal ${max} tekens bevatten.`)
    .transform((waarde) => (waarde === "" ? undefined : waarde))
    .optional();

const naam = z
  .string()
  .trim()
  .min(2, "Vul je naam even in — al is het maar je voornaam.")
  .max(80, "Dat is wel een heel lange naam. Maximaal 80 tekens.");

const email = z
  .string()
  .trim()
  .min(1, "Zonder e-mailadres kunnen we je niets laten weten.")
  .pipe(z.email("Dit lijkt geen geldig e-mailadres. Staat de @ er wel in?"))
  .transform((waarde) => waarde.toLowerCase())
  .pipe(z.string().max(160, "Dat e-mailadres is te lang."));

/** Onzichtbaar veld dat alleen bots invullen. */
const honeypot = z.string().max(0).optional().or(z.literal(""));

// ---------------------------------------------------------------------------
// Gedeelde keuzelijsten
// ---------------------------------------------------------------------------

export const FUNCTIES = [
  "Ambulant begeleider",
  "Jeugd- en gezinsprofessional",
  "Jeugdzorgwerker",
  "Behandelaar",
  "Gedragswetenschapper",
  "Orthopedagoog",
  "(GZ-)psycholoog",
  "Systeem- of vaktherapeut",
  "Zorg- of behandelcoördinator",
  "Teammanager",
  "Opleider of docent",
  "Anders",
] as const;

export const SECTOREN = [
  "Jeugdhulp",
  "Jeugdbescherming",
  "Jeugd-GGZ",
  "GGZ",
  "Wijk- of jeugdteam",
  "Gehandicaptenzorg",
  "Onderwijs of opleiding",
  "Anders",
] as const;

export const DOELEN = [
  "Eigen gebruik",
  "Mijn team",
  "Vaste intervisiegroep",
  "Opleiding of les",
  "Cadeau voor een collega",
] as const;

// ---------------------------------------------------------------------------
// Wachtlijst
// ---------------------------------------------------------------------------

export const wachtlijstSchema = z.object({
  naam,
  email,
  organisatie: optioneleTekst(120),
  functie: z
    .union([z.enum(FUNCTIES), z.literal("")])
    .optional()
    .transform((waarde) => (waarde === "" ? undefined : waarde)),
  aantal: z.coerce
    .number({ error: "Vul een getal in." })
    .int("Halve spellen verkopen we niet.")
    .min(1, "Minimaal 1 exemplaar.")
    .max(500, "Meer dan 500? Vraag een offerte aan, dan rekenen we het door.")
    .default(1),
  doelen: z.array(z.enum(DOELEN)).default([]),
  opmerking: optioneleTekst(2000),
  website: honeypot,
});

// ---------------------------------------------------------------------------
// Offerteaanvraag (zakelijk)
// ---------------------------------------------------------------------------

export const offerteSchema = z.object({
  naam,
  email,
  organisatie: z
    .string()
    .trim()
    .min(2, "Vul de naam van je organisatie in.")
    .max(140, "Maximaal 140 tekens."),
  functie: optioneleTekst(120),
  telefoon: optioneleTekst(40),
  sector: z
    .union([z.enum(SECTOREN), z.literal("")])
    .optional()
    .transform((waarde) => (waarde === "" ? undefined : waarde)),
  aantal: z.coerce
    .number({ error: "Vul een aantal in." })
    .int("Vul een heel aantal in.")
    .min(5, "Voor minder dan 5 spellen kun je gewoon bestellen in de webshop.")
    .max(5000, "Meer dan 5.000? Bel ons even, dan denken we mee."),
  opFactuur: z.coerce.boolean().default(false),
  gewensteLevering: optioneleTekst(120),
  opmerking: optioneleTekst(2000),
  website: honeypot,
});

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export const contactSchema = z.object({
  naam,
  email,
  organisatie: optioneleTekst(120),
  onderwerp: z
    .string()
    .trim()
    .min(2, "Waar gaat het over?")
    .max(140, "Maximaal 140 tekens."),
  bericht: z
    .string()
    .trim()
    .min(10, "Schrijf iets meer, dan kunnen we je beter helpen.")
    .max(4000, "Maximaal 4.000 tekens."),
  website: honeypot,
});

export type WachtlijstInvoer = z.infer<typeof wachtlijstSchema>;
export type OfferteInvoer = z.infer<typeof offerteSchema>;
export type ContactInvoer = z.infer<typeof contactSchema>;

export type VeldFouten = Record<string, string[] | undefined>;

/**
 * Haalt de velden van een schema uit een FormData. Checkbox-groepen komen als
 * array terug, de rest als string — zo hoeft geen enkel formulier zijn eigen
 * uitleesfunctie te schrijven.
 */
export function leesFormData(
  formData: FormData,
  velden: readonly string[],
  arrayVelden: readonly string[] = [],
): Record<string, unknown> {
  const waarden: Record<string, unknown> = {};
  for (const veld of velden) {
    waarden[veld] = arrayVelden.includes(veld)
      ? formData.getAll(veld)
      : (formData.get(veld) ?? "");
  }
  return waarden;
}

/** Ruwe waarden terug naar het formulier, zodat niemand opnieuw hoeft te typen. */
export function ingevuldeWaarden(
  formData: FormData,
  velden: readonly string[],
  arrayVelden: readonly string[] = [],
): Record<string, string | string[]> {
  const waarden: Record<string, string | string[]> = {};
  for (const veld of velden) {
    if (arrayVelden.includes(veld)) {
      waarden[veld] = formData
        .getAll(veld)
        .map((waarde) => (typeof waarde === "string" ? waarde : ""))
        .filter(Boolean);
    } else {
      const waarde = formData.get(veld);
      waarden[veld] = typeof waarde === "string" ? waarde : "";
    }
  }
  return waarden;
}
