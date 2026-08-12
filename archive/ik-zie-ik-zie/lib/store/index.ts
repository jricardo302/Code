import type { AanvraagStore } from "./types";

export type { Aanvraag, NieuweAanvraag } from "./types";

/**
 * Twee opslagvormen, één interface:
 *
 * - geen DATABASE_URL  → JSON-bestand op schijf. Nul configuratie, perfect
 *   voor lokaal ontwikkelen.
 * - wel DATABASE_URL   → Postgres (Vercel Postgres, Neon, Supabase, ...).
 *   Nodig zodra je deployt: serverless bestandssystemen zijn niet blijvend.
 */
const gebruiktPostgres = Boolean(
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL,
);

if (
  !gebruiktPostgres &&
  process.env.NODE_ENV === "production" &&
  process.env.NEXT_PHASE !== "phase-production-build"
) {
  console.warn(
    "[ik zie ik zie] Geen DATABASE_URL gevonden — aanvragen gaan naar een JSON-bestand. " +
      "Op een serverless host (zoals Vercel) raak je die bij de volgende deploy kwijt. " +
      "Zet DATABASE_URL naar een Postgres-database. Zie README.md.",
  );
}

let bewaard: Promise<AanvraagStore> | undefined;

export function store(): Promise<AanvraagStore> {
  bewaard ??= gebruiktPostgres
    ? import("./postgres").then((m) => m.postgresStore)
    : import("./json").then((m) => m.jsonStore);
  return bewaard;
}
