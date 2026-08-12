/**
 * Boots a throwaway Postgres 16 cluster for integration tests, applies the
 * real migrations, and hands back a Drizzle client. Requires the postgres
 * server binaries (present in CI and the dev container); tests are skipped
 * with a clear message when they are missing.
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";

const PG_BIN = "/usr/lib/postgresql/16/bin";
const PORT = 55433;

export type TestDb = ReturnType<typeof drizzle<typeof schema>>;

export interface TestCluster {
  db: TestDb;
  sql: ReturnType<typeof postgres>;
  stop: () => void;
}

export function pgAvailable(): boolean {
  return existsSync(path.join(PG_BIN, "initdb"));
}

function run(cmd: string): void {
  execSync(cmd, { stdio: "pipe" });
}

export async function startTestCluster(): Promise<TestCluster> {
  const dataDir = mkdtempSync(path.join(tmpdir(), "lighthouse-pg-"));
  const asNobody = process.getuid?.() === 0;
  const wrap = (cmd: string) =>
    asNobody ? `su -s /bin/bash nobody -c "${cmd.replace(/"/g, '\\"')}"` : cmd;

  if (asNobody) run(`chmod 777 ${dataDir}`);
  run(wrap(`${PG_BIN}/initdb -D ${dataDir}/data -U postgres --auth=trust -E UTF8`));
  run(
    wrap(
      `${PG_BIN}/pg_ctl -D ${dataDir}/data -o "-k ${dataDir} -p ${PORT} -c listen_addresses='' -c fsync=off" -l ${dataDir}/log start`,
    ),
  );
  run(wrap(`${PG_BIN}/createdb -h ${dataDir} -p ${PORT} -U postgres lighthouse_test`));

  // Apply the real migrations, in journal order, exactly as production would.
  for (const file of ["0000_init.sql", "0001_booking_exclusion.sql", "0002_rate_limits.sql", "0003_guests_email_plain_unique.sql", "0004_booking_reference_seq.sql"]) {
    execFileSync("psql", [
      "-h", dataDir, "-p", String(PORT), "-U", "postgres", "-d", "lighthouse_test",
      "-v", "ON_ERROR_STOP=1", "-q", "-f", path.join(process.cwd(), "drizzle", file),
    ], { stdio: "pipe" });
  }

  const sql = postgres({
    host: dataDir,
    port: PORT,
    username: "postgres",
    database: "lighthouse_test",
    prepare: false,
    max: 10,
    onnotice: () => {},
  });
  const db = drizzle(sql, { schema });

  return {
    db,
    sql,
    stop: () => {
      try {
        void sql.end({ timeout: 2 });
        run(wrap(`${PG_BIN}/pg_ctl -D ${dataDir}/data stop -m immediate`));
      } finally {
        rmSync(dataDir, { recursive: true, force: true });
      }
    },
  };
}

/** A fresh property + its Curaçao seasons, returning the slug to book under. */
export async function seedTestProperty(db: TestDb): Promise<string> {
  const { curacaoSeasons } = await import("@/lib/domain/curacao-seasons");
  const [property] = await db
    .insert(schema.properties)
    .values({
      slug: "lighthouse",
      name: "Lighthouse Curaçao",
      currency: "EUR",
      maxGuests: 6,
      bedrooms: 3,
      bathrooms: 2,
      cleaningFeeCents: 150_00,
      addressLine: "Kaya Platio 18, Katoentuin",
      city: "Willemstad",
    })
    .returning();
  await db.insert(schema.seasons).values(
    curacaoSeasons(2026, 2029).map((s) => ({ ...s, propertyId: property.id })),
  );
  return property.slug;
}
