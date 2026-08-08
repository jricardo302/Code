import { Pool } from "pg";

import type {
  Inzending,
  InzendingStore,
  NieuweInzending,
  Soort,
} from "./types";

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
      `CREATE TABLE IF NOT EXISTS inzendingen (
         id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
         soort         text NOT NULL,
         gegevens      jsonb NOT NULL DEFAULT '{}'::jsonb,
         aangemaakt_op timestamptz NOT NULL DEFAULT now()
       );
       CREATE INDEX IF NOT EXISTS inzendingen_soort_datum
         ON inzendingen (soort, aangemaakt_op DESC);`,
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
  soort: string;
  gegevens: Record<string, unknown> | null;
  aangemaakt_op: Date;
};

function naarInzending(rij: Rij): Inzending {
  return {
    id: rij.id,
    soort: rij.soort as Soort,
    gegevens: rij.gegevens ?? {},
    aangemaaktOp: rij.aangemaakt_op.toISOString(),
  };
}

export const postgresStore: InzendingStore = {
  naam: "postgres",

  async bewaar(invoer: NieuweInzending) {
    await zorgVoorTabel();
    const { rows } = await pool().query<Rij>(
      `INSERT INTO inzendingen (soort, gegevens)
       VALUES ($1, $2)
       RETURNING *`,
      [invoer.soort, JSON.stringify(invoer.gegevens)],
    );
    return naarInzending(rows[0]);
  },

  async lijst(soort?: Soort) {
    await zorgVoorTabel();
    const { rows } = soort
      ? await pool().query<Rij>(
          "SELECT * FROM inzendingen WHERE soort = $1 ORDER BY aangemaakt_op DESC",
          [soort],
        )
      : await pool().query<Rij>(
          "SELECT * FROM inzendingen ORDER BY aangemaakt_op DESC",
        );
    return rows.map(naarInzending);
  },
};
