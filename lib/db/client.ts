/**
 * One postgres.js pool + one Drizzle instance for the whole app.
 *
 * On Vercel this connects to Supabase's transaction pooler (port 6543), so
 * `prepare: false` is required — pgbouncer in transaction mode cannot hold
 * prepared statements. Locally it is a plain connection and the flag is
 * harmless. Migrations use the direct connection instead (drizzle.config.ts).
 *
 * The globalThis cache stops `next dev`'s hot reload from opening a new pool
 * on every save until Postgres runs out of connections.
 */

import { drizzle, type PostgresJsDatabase } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "./schema";

export type Db = PostgresJsDatabase<typeof schema>;

const globalForDb = globalThis as unknown as {
  __lighthouseSql?: ReturnType<typeof postgres>;
};

function connectionString(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }
  return url;
}

export function getSql(): ReturnType<typeof postgres> {
  if (!globalForDb.__lighthouseSql) {
    globalForDb.__lighthouseSql = postgres(connectionString(), {
      prepare: false,
      max: 10,
      idle_timeout: 20,
      connect_timeout: 10,
    });
  }
  return globalForDb.__lighthouseSql;
}

let cachedDb: Db | null = null;

export function getDb(): Db {
  if (!cachedDb) {
    cachedDb = drizzle(getSql(), { schema });
  }
  return cachedDb;
}
