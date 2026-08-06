import type { VeldFouten } from "./schema";

/** Wat de bezoeker intikte — om het formulier na een fout niet leeg te gooien. */
export type IngevuldeWaarden = {
  naam: string;
  email: string;
  organisatie: string;
  functie: string;
  aantal: string;
  doelen: string[];
  opmerking: string;
};

export type AanvraagStatus =
  | { status: "leeg" }
  | { status: "fout"; fouten: VeldFouten; waarden: IngevuldeWaarden }
  | { status: "gelukt"; voornaam: string; aantal: number };

export const LEGE_WAARDEN: IngevuldeWaarden = {
  naam: "",
  email: "",
  organisatie: "",
  functie: "",
  aantal: "1",
  doelen: [],
  opmerking: "",
};

export const LEEG_FORMULIER: AanvraagStatus = { status: "leeg" };
