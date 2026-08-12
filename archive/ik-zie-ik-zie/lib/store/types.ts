export type Aanvraag = {
  id: string;
  naam: string;
  email: string;
  organisatie: string | null;
  functie: string | null;
  aantal: number;
  doelen: string[];
  opmerking: string | null;
  aangemaaktOp: string; // ISO 8601
};

export type NieuweAanvraag = Omit<Aanvraag, "id" | "aangemaaktOp">;

export interface AanvraagStore {
  naam: "json" | "postgres";
  bewaar(aanvraag: NieuweAanvraag): Promise<Aanvraag>;
  lijst(): Promise<Aanvraag[]>;
}
