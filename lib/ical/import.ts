/**
 * Incoming iCal sync: Airbnb and Booking.com publish busy calendars; this
 * module mirrors them into blocked_dates.
 *
 * Two invariants keep imports safe:
 *  - every imported row carries `source = feed.label`, so imported blocks are
 *    never confused with the owner's own blocks, and
 *  - the sync replaces exactly the rows of its own source and nothing else —
 *    delete-then-insert inside one transaction, so a broken feed download
 *    aborts the transaction and yesterday's mirror stays in place.
 */

import { and, eq } from "drizzle-orm";
import type { Db } from "../db/client";
import { blockedDates, icalFeeds, type IcalFeed } from "../db/schema";
import { isCalendarDate, type CalendarDate } from "../domain/dates";

export interface ParsedEvent {
  uid: string;
  /** First blocked night. */
  start: CalendarDate;
  /** Exclusive end, straight from DTEND;VALUE=DATE semantics. */
  end: CalendarDate;
  summary: string;
}

/** Unfold RFC 5545 folded lines: CRLF followed by space/tab continues a line. */
function unfoldLines(ics: string): string[] {
  return ics
    .replace(/\r\n[ \t]/g, "")
    .replace(/\n[ \t]/g, "")
    .split(/\r?\n/);
}

/** `20261215` or `20261215T140000Z` -> `2026-12-15`. */
function toCalendar(value: string): CalendarDate | null {
  const match = /^(\d{4})(\d{2})(\d{2})/.exec(value.trim());
  if (!match) return null;
  const date = `${match[1]}-${match[2]}-${match[3]}`;
  return isCalendarDate(date) ? date : null;
}

/**
 * The subset of iCal we need: VEVENT blocks with UID, DTSTART, DTEND.
 * Anything unparseable is skipped, not fatal — feeds are third-party data.
 */
export function parseIcalEvents(ics: string): ParsedEvent[] {
  const events: ParsedEvent[] = [];
  let current: Partial<ParsedEvent> | null = null;

  for (const line of unfoldLines(ics)) {
    if (line === "BEGIN:VEVENT") {
      current = {};
      continue;
    }
    if (line === "END:VEVENT") {
      if (current?.uid && current.start && current.end && current.end > current.start) {
        events.push({
          uid: current.uid,
          start: current.start,
          end: current.end,
          summary: current.summary ?? "",
        });
      }
      current = null;
      continue;
    }
    if (!current) continue;

    const colon = line.indexOf(":");
    if (colon < 0) continue;
    const name = line.slice(0, colon).split(";")[0]!.toUpperCase();
    const value = line.slice(colon + 1);

    switch (name) {
      case "UID":
        current.uid = value.trim();
        break;
      case "DTSTART":
        current.start = toCalendar(value) ?? current.start;
        break;
      case "DTEND":
        current.end = toCalendar(value) ?? current.end;
        break;
      case "SUMMARY":
        current.summary = value.trim();
        break;
    }
  }
  return events;
}

export interface SyncResult {
  feed: string;
  imported: number;
  ok: boolean;
  error?: string;
}

/** Mirror one feed. Never throws — the cron reports per-feed outcomes. */
export async function syncFeed(
  db: Db,
  feed: IcalFeed,
  fetchImpl: typeof fetch = fetch,
): Promise<SyncResult> {
  if (!feed.url) return { feed: feed.label, imported: 0, ok: false, error: "no url" };

  try {
    const response = await fetchImpl(feed.url, {
      headers: { "user-agent": "lighthouse-curacao-ical-sync/1.0" },
      signal: AbortSignal.timeout(20_000),
    });
    if (!response.ok) throw new Error(`feed answered ${response.status}`);
    const events = parseIcalEvents(await response.text());

    await db.transaction(async (tx) => {
      await tx
        .delete(blockedDates)
        .where(
          and(
            eq(blockedDates.propertyId, feed.propertyId),
            eq(blockedDates.source, feed.label),
          ),
        );
      if (events.length > 0) {
        await tx.insert(blockedDates).values(
          events.map((event) => ({
            propertyId: feed.propertyId,
            startDate: event.start,
            endDate: event.end,
            source: feed.label,
            externalUid: event.uid,
            reason: event.summary || null,
          })),
        );
      }
    });

    await db
      .update(icalFeeds)
      .set({
        lastSyncAt: new Date(),
        lastSyncStatus: "ok",
        lastSyncError: null,
        importedCount: events.length,
        updatedAt: new Date(),
      })
      .where(eq(icalFeeds.id, feed.id));

    return { feed: feed.label, imported: events.length, ok: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    await db
      .update(icalFeeds)
      .set({ lastSyncAt: new Date(), lastSyncStatus: "error", lastSyncError: message, updatedAt: new Date() })
      .where(eq(icalFeeds.id, feed.id));
    return { feed: feed.label, imported: 0, ok: false, error: message };
  }
}

export async function syncAllFeeds(db: Db): Promise<SyncResult[]> {
  const feeds = await db.query.icalFeeds.findMany({
    where: and(eq(icalFeeds.direction, "import"), eq(icalFeeds.active, true)),
  });
  const results: SyncResult[] = [];
  for (const feed of feeds) results.push(await syncFeed(db, feed));
  return results;
}
