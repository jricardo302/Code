/**
 * Eén opslagvorm voor alle formulieren op de site.
 *
 * Er zijn drie soorten inzendingen — wachtlijst, offerteaanvraag en
 * contactbericht — en die hebben elk andere velden. In plaats van drie tabellen
 * met drie migratiepaden bewaren we ze in één tabel met een `soort` en een
 * `gegevens`-object. De vorm van `gegevens` wordt bewaakt door zod
 * (`lib/schema.ts`) vóórdat er iets de opslag in gaat; de opslag zelf hoeft er
 * niets van te weten.
 *
 * Dat maakt een nieuwe editie of een nieuw formulier een kwestie van een schema
 * toevoegen, niet van een migratie draaien.
 */

export const SOORTEN = ["wachtlijst", "offerte", "contact", "bestelling"] as const;

export type Soort = (typeof SOORTEN)[number];

export type Inzending = {
  id: string;
  soort: Soort;
  /** Gevalideerde formuliervelden. Per soort een andere vorm. */
  gegevens: Record<string, unknown>;
  aangemaaktOp: string; // ISO 8601
};

export type NieuweInzending = Omit<Inzending, "id" | "aangemaaktOp">;

export interface InzendingStore {
  naam: "json" | "postgres";
  bewaar(inzending: NieuweInzending): Promise<Inzending>;
  /** Nieuwste eerst. Zonder `soort` komt alles terug. */
  lijst(soort?: Soort): Promise<Inzending[]>;
}

/** Handige weergavenaam per soort, voor het beheeroverzicht. */
export const SOORT_LABELS: Record<Soort, string> = {
  wachtlijst: "Wachtlijst",
  offerte: "Offerteaanvraag",
  contact: "Contactbericht",
  bestelling: "Bestelling",
};
