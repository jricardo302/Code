import type { VeldFouten } from "@/lib/schema";

/**
 * De statusvorm die een formulier en zijn server action delen.
 *
 * Bewust los van `lib/formulier.ts`: dat bestand raakt de opslag aan, en een
 * client component die daar `LEEG` uit importeert sleept de hele
 * Postgres-driver het browserbundel in. Types en de beginwaarde horen hier,
 * de verwerking daar.
 */
export type FormulierStatus =
  | { status: "leeg" }
  | {
      status: "fout";
      fouten: VeldFouten;
      waarden: Record<string, string | string[]>;
    }
  | { status: "gelukt"; voornaam: string; samenvatting?: string };

export const LEEG: FormulierStatus = { status: "leeg" };
