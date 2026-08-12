/**
 * Boots the E2E Postgres on 127.0.0.1:55440, applies migrations, seeds the
 * property. The port and connection string are fixed so playwright.config
 * can hand DATABASE_URL to the web server statically.
 */

import { execFileSync, execSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, rmSync } from "node:fs";
import path from "node:path";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "@/lib/db/schema";
import { curacaoSeasons } from "@/lib/domain/curacao-seasons";

const PG_BIN = "/usr/lib/postgresql/16/bin";
export const E2E_PORT = 55440;
export const E2E_DATABASE_URL = `postgres://postgres@127.0.0.1:${E2E_PORT}/lighthouse_e2e`;

const DATA_ROOT = path.join(process.env.E2E_PG_DIR ?? "/tmp/lighthouse-e2e-pg");

function run(cmd: string): void {
  execSync(cmd, { stdio: "pipe" });
}

export default async function globalSetup(): Promise<() => void> {
  if (!existsSync(path.join(PG_BIN, "initdb"))) {
    throw new Error("postgres binaries not found; E2E needs /usr/lib/postgresql/16");
  }

  rmSync(DATA_ROOT, { recursive: true, force: true });
  mkdirSync(DATA_ROOT, { recursive: true });

  const asNobody = process.getuid?.() === 0;
  const wrap = (cmd: string) =>
    asNobody ? `su -s /bin/bash nobody -c "${cmd.replace(/"/g, '\\"')}"` : cmd;
  if (asNobody) run(`chmod 777 ${DATA_ROOT}`);

  run(wrap(`${PG_BIN}/initdb -D ${DATA_ROOT}/data -U postgres --auth=trust -E UTF8`));
  run(
    wrap(
      `${PG_BIN}/pg_ctl -D ${DATA_ROOT}/data -o "-p ${E2E_PORT} -c listen_addresses=127.0.0.1 -c unix_socket_directories=${DATA_ROOT} -c fsync=off" -l ${DATA_ROOT}/log start`,
    ),
  );
  run(wrap(`${PG_BIN}/createdb -h 127.0.0.1 -p ${E2E_PORT} -U postgres lighthouse_e2e`));

  const journal = JSON.parse(
    readFileSync(path.join(process.cwd(), "drizzle/meta/_journal.json"), "utf8"),
  ) as { entries: { tag: string }[] };
  for (const entry of journal.entries) {
    execFileSync("psql", [
      "-h", "127.0.0.1", "-p", String(E2E_PORT), "-U", "postgres", "-d", "lighthouse_e2e",
      "-v", "ON_ERROR_STOP=1", "-q", "-f",
      path.join(process.cwd(), "drizzle", `${entry.tag}.sql`),
    ], { stdio: "pipe" });
  }

  // Seed the property + seasons, matching production seed values.
  const sql = postgres(E2E_DATABASE_URL, { prepare: false, max: 1, onnotice: () => {} });
  const db = drizzle(sql, { schema });
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
      minAdvanceDays: 1,
      addressLine: "Kaya Platio 18, Katoentuin",
      city: "Willemstad",
    })
    .returning();
  const year = new Date().getFullYear();
  await db
    .insert(schema.seasons)
    .values(curacaoSeasons(year, year + 2).map((s) => ({ ...s, propertyId: property.id })));
  await sql.end();

  return () => {
    try {
      run(wrap(`${PG_BIN}/pg_ctl -D ${DATA_ROOT}/data stop -m immediate`));
    } catch {
      // already stopped
    }
    rmSync(DATA_ROOT, { recursive: true, force: true });
  };
}
