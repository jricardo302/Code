import { Pool } from "pg";

import type { Aanvraag, AanvraagStore, NieuweAanvraag } from "./types";

const verbindingsString =
  process.env.DATABASE_URL ?? process.env.POSTGRES_URL ?? "";

// Eén pool per proces; in dev overleeft die de hot reloads via globalThis.
const globaal = globalThis as typeof globalThis & {
  __ikzieikziePool?: Pool;
  __ikzieikzieMigratie?: Promise<void>;
};

function pool(): Pool {
  globaal.__ikzieikziePool ??= new Pool({
    connectionString: verbindingsString,
    // Vercel Postgres, Neon en Supabase vragen allemaal om TLS.
    ssl: /localhost|127\.0\.0\.1/.test(verbindingsString)
      ? undefined
      : { rejectUnauthorized: false },
    max: 3,
  });
  return globaal.__ikzieikziePool;
}

/** Maakt de tabel aan als die er nog niet is. Draait hooguit één keer per proces. */
function zorgVoorTabel(): Promise<void> {
  globaal.__ikzieikzieMigratie ??= pool()
    .query(
      `CREATE TABLE IF NOT EXISTS aanvragen (
         id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         naam          text NOT NULL,
         email         text NOT NULL,
         organisatie   text,
         functie       text,
         aantal        integer NOT NULL DEFAULT 1,
         doelen        text[] NOT NULL DEFAULT '{}',
         opmerking     text,
         aangemaakt_op timestamptz NOT NULL DEFAULT now()
       )`,
    )
    .then(() => undefined)
    .catch((fout) => {
      // Niet cachen als het misging, anders blijft de fout hangen.
      globaal.__ikzieikzieMigratie = undefined;
      throw fout;
    });
  return globaal.__ikzieikzieMigratie;
}

type Rij = {
  id: string;
  naam: string;
  email: string;
  organisatie: string | null;
  functie: string | null;
  aantal: number;
  doelen: string[] | null;
  opmerking: string | null;
  aangemaakt_op: Date;
};

function naarAanvraag(rij: Rij): Aanvraag {
  return {
    id: rij.id,
    naam: rij.naam,
    email: rij.email,
    organisatie: rij.organisatie,
    functie: rij.functie,
    aantal: rij.aantal,
    doelen: rij.doelen ?? [],
    opmerking: rij.opmerking,
    aangemaaktOp: rij.aangemaakt_op.toISOString(),
  };
}

export const postgresStore: AanvraagStore = {
  naam: "postgres",

  async bewaar(invoer: NieuweAanvraag) {
    await zorgVoorTabel();
    const { rows } = await pool().query<Rij>(
      `INSERT INTO aanvragen (naam, email, organisatie, functie, aantal, doelen, opmerking)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        invoer.naam,
        invoer.email,
        invoer.organisatie,
        invoer.functie,
        invoer.aantal,
        invoer.doelen,
        invoer.opmerking,
      ],
    );
    return naarAanvraag(rows[0]);
  },

  async lijst() {
    await zorgVoorTabel();
    const { rows } = await pool().query<Rij>(
      "SELECT * FROM aanvragen ORDER BY aangemaakt_op DESC",
    );
    return rows.map(naarAanvraag);
  },
};
