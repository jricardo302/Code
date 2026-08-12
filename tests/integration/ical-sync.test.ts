/**
 * Feed sync against a real Postgres: imported blocks carry the feed label,
 * re-syncs replace only their own source, and a broken download keeps
 * yesterday's mirror.
 */

import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { and, eq } from "drizzle-orm";
import { blockedDates, icalFeeds, properties } from "@/lib/db/schema";
import { syncFeed } from "@/lib/ical/import";
import {
  pgAvailable,
  seedTestProperty,
  startTestCluster,
  type TestCluster,
} from "./setup-db";

const RUN = pgAvailable();

function feedBody(events: { uid: string; start: string; end: string }[]): string {
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    ...events.flatMap((e) => [
      "BEGIN:VEVENT",
      `UID:${e.uid}`,
      `DTSTART;VALUE=DATE:${e.start}`,
      `DTEND;VALUE=DATE:${e.end}`,
      "SUMMARY:Reserved",
      "END:VEVENT",
    ]),
    "END:VCALENDAR",
  ].join("\r\n");
}

const fetchOk = (body: string): typeof fetch =>
  (async () => new Response(body, { status: 200 })) as typeof fetch;

describe.runIf(RUN)("ical feed sync (integration)", () => {
  let cluster: TestCluster;
  let propertyId: string;

  beforeAll(async () => {
    cluster = await startTestCluster();
    await seedTestProperty(cluster.db);
    const [property] = await cluster.db.select().from(properties);
    propertyId = property.id;
  }, 60_000);

  afterAll(() => cluster?.stop());

  async function makeFeed(label: string) {
    const [feed] = await cluster.db
      .insert(icalFeeds)
      .values({
        propertyId,
        label,
        direction: "import",
        url: `https://example.com/${label}.ics`,
      })
      .returning();
    return feed;
  }

  it("imports events with the feed label as source", async () => {
    const feed = await makeFeed("airbnb");
    const result = await syncFeed(
      cluster.db,
      feed,
      fetchOk(feedBody([
        { uid: "a1@airbnb.com", start: "20261220", end: "20261227" },
        { uid: "a2@airbnb.com", start: "20270110", end: "20270115" },
      ])),
    );
    expect(result).toMatchObject({ ok: true, imported: 2 });

    const rows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "airbnb"));
    expect(rows).toHaveLength(2);
    expect(rows.every((r) => r.externalUid?.endsWith("@airbnb.com"))).toBe(true);
  });

  it("re-sync replaces its own source and leaves owner blocks alone", async () => {
    await cluster.db.insert(blockedDates).values({
      propertyId,
      startDate: "2027-05-01",
      endDate: "2027-05-08",
      source: "owner",
      reason: "eigen verblijf",
    });

    const [feed] = await cluster.db
      .select()
      .from(icalFeeds)
      .where(eq(icalFeeds.label, "airbnb"));
    // The feed now has only one event; the other was cancelled on Airbnb.
    const result = await syncFeed(
      cluster.db,
      feed,
      fetchOk(feedBody([{ uid: "a1@airbnb.com", start: "20261220", end: "20261227" }])),
    );
    expect(result).toMatchObject({ ok: true, imported: 1 });

    const airbnbRows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "airbnb"));
    const ownerRows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "owner"));
    expect(airbnbRows).toHaveLength(1); // cancelled block is gone
    expect(ownerRows).toHaveLength(1); // untouched
  });

  it("keeps yesterday's mirror when the download breaks", async () => {
    const [feed] = await cluster.db
      .select()
      .from(icalFeeds)
      .where(eq(icalFeeds.label, "airbnb"));
    const failingFetch = (async () => new Response("nope", { status: 503 })) as typeof fetch;
    const result = await syncFeed(cluster.db, feed, failingFetch);
    expect(result.ok).toBe(false);

    const rows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "airbnb"));
    expect(rows).toHaveLength(1); // previous mirror intact

    const [updated] = await cluster.db
      .select()
      .from(icalFeeds)
      .where(eq(icalFeeds.id, feed.id));
    expect(updated.lastSyncStatus).toBe("error");
  });

  it("two feeds never touch each other's rows", async () => {
    const bookingCom = await makeFeed("booking_com");
    await syncFeed(
      cluster.db,
      bookingCom,
      fetchOk(feedBody([{ uid: "b1@booking.com", start: "20270301", end: "20270308" }])),
    );
    const airbnbRows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "airbnb"));
    const bookingRows = await cluster.db
      .select()
      .from(blockedDates)
      .where(eq(blockedDates.source, "booking_com"));
    expect(airbnbRows).toHaveLength(1);
    expect(bookingRows).toHaveLength(1);
  });
});

describe.runIf(!RUN)("ical feed sync (integration)", () => {
  it.skip("skipped: postgres binaries not found", () => {});
});
