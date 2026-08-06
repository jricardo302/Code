import { z } from "zod";

export const FUNCTIES = [
  "Behandelaar",
  "Begeleider",
  "Gedragswetenschapper",
  "Gezinshuisouder",
  "Anders",
] as const;

export const DOELEN = [
  "Eigen gebruik",
  "Team",
  "Vaste intervisiegroep",
  "Cadeau",
] as const;

export type Functie = (typeof FUNCTIES)[number];
export type Doel = (typeof DOELEN)[number];

/**
 * Eén schema voor client en server. Leeg-string-velden uit een FormData
 * worden hier naar `undefined` gemapt, zodat "optioneel" ook echt optioneel is.
 */
const optioneleTekst = (max: number) =>
  z
    .string()
    .trim()
    .max(max, `Dit veld mag maximaal ${max} tekens bevatten.`)
    .transform((waarde) => (waarde === "" ? undefined : waarde))
    .optional();

export const aanvraagSchema = z.object({
  naam: z
    .string()
    .trim()
    .min(2, "Vul je naam even in — al is het maar je voornaam.")
    .max(80, "Dat is wel een heel lange naam. Maximaal 80 tekens."),
  email: z
    .string()
    .trim()
    .min(1, "Zonder e-mailadres kunnen we je niets laten weten.")
    .pipe(
      z.email("Dit lijkt geen geldig e-mailadres. Staat de @ er wel in?"),
    )
    .transform((waarde) => waarde.toLowerCase())
    .pipe(z.string().max(160, "Dat e-mailadres is te lang.")),
  organisatie: optioneleTekst(120),
  functie: z
    .union([z.enum(FUNCTIES), z.literal("")])
    .optional()
    .transform((waarde) => (waarde === "" ? undefined : waarde)),
  aantal: z.coerce
    .number({ error: "Vul een getal in." })
    .int("Halve spellen verkopen we niet.")
    .min(1, "Minimaal 1 exemplaar.")
    .max(500, "Meer dan 500? Mail ons even, dan regelen we het persoonlijk.")
    .default(1),
  doelen: z.array(z.enum(DOELEN)).default([]),
  opmerking: optioneleTekst(2000),
  // Honeypot: onzichtbaar veld dat alleen bots invullen.
  website: z.string().max(0).optional().or(z.literal("")),
});

export type AanvraagInvoer = z.infer<typeof aanvraagSchema>;

export type VeldFouten = Partial<
  Record<keyof AanvraagInvoer | "formulier", string[]>
>;

/** Haalt de ruwe waarden uit een FormData, klaar om te valideren. */
export function leesFormData(formData: FormData) {
  return {
    naam: formData.get("naam") ?? "",
    email: formData.get("email") ?? "",
    organisatie: formData.get("organisatie") ?? "",
    functie: formData.get("functie") ?? "",
    aantal: formData.get("aantal") ?? 1,
    doelen: formData.getAll("doelen"),
    opmerking: formData.get("opmerking") ?? "",
    website: formData.get("website") ?? "",
  };
}
