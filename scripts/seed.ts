/**
 * Seed: the property and the Curaçao season calendar, idempotently — running
 * it twice updates rather than duplicates. Seasons are seeded for this year
 * through +2, so the calendar is bookable ~18 months out from day one.
 *
 *   npx tsx scripts/seed.ts            # uses DATABASE_URL from .env.local
 */

import "dotenv/config";
import { eq, and } from "drizzle-orm";
import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../lib/db/schema";
import { curacaoSeasons } from "../lib/domain/curacao-seasons";

async function main(): Promise<void> {
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL is not set (copy .env.example to .env.local)");
  const sql = postgres(url, { prepare: false, max: 1, onnotice: () => {} });
  const db = drizzle(sql, { schema });

  // --- The property -------------------------------------------------------
  const propertyValues = {
    slug: "lighthouse",
    name: "Lighthouse Curaçao",
    timezone: "America/Curacao",
    currency: "EUR",
    maxGuests: 6,
    bedrooms: 3,
    bathrooms: 2,
    cleaningFeeCents: 150_00,
    taxRateBps: 700,
    taxOnCleaningFee: true,
    depositBps: 3000,
    balanceDueDays: 35,
    payInFullWithinDays: 35,
    holdMinutes: 30,
    minNightsFloor: 1,
    maxNights: 90,
    minAdvanceDays: 1,
    maxAdvanceDays: 540,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    addressLine: "Kaya Platio 18, Katoentuin",
    city: "Willemstad",
    country: "CW",
    latitude: "12.1361",
    longitude: "-68.9550",
  } as const;

  const existing = await db.query.properties.findFirst({
    where: eq(schema.properties.slug, propertyValues.slug),
  });
  const property = existing
    ? (
        await db
          .update(schema.properties)
          .set({ ...propertyValues, updatedAt: new Date() })
          .where(eq(schema.properties.id, existing.id))
          .returning()
      )[0]
    : (await db.insert(schema.properties).values(propertyValues).returning())[0];
  console.log(`${existing ? "updated" : "created"} property ${property.slug} (${property.id})`);

  // --- Seasons ------------------------------------------------------------
  // Idempotent per (label): same label -> update dates/price, new -> insert.
  const year = new Date().getFullYear();
  const bands = curacaoSeasons(year, year + 2, {
    highCents: 285_00,
    shoulderCents: 225_00,
    lowCents: 189_00,
  });
  let inserted = 0;
  let updated = 0;
  for (const band of bands) {
    const found = await db.query.seasons.findFirst({
      where: and(
        eq(schema.seasons.propertyId, property.id),
        eq(schema.seasons.label, band.label),
      ),
    });
    if (found) {
      await db
        .update(schema.seasons)
        .set({ ...band, updatedAt: new Date() })
        .where(eq(schema.seasons.id, found.id));
      updated++;
    } else {
      await db.insert(schema.seasons).values({ ...band, propertyId: property.id });
      inserted++;
    }
  }
  console.log(`seasons: ${inserted} inserted, ${updated} updated (${year}–${year + 2})`);
  console.log("high 15 Dec–15 Apr €285 (min 5) · shoulder €225 (min 3) · low 1 Jul–31 Aug €189 (min 3)");

  await sql.end();
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
