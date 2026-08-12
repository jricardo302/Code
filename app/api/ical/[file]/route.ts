/**
 * GET /api/ical/[propertyId].ics — the outgoing feed Airbnb and Booking.com
 * subscribe to: every live booking and every blocked night, as busy events.
 * Guest names never leave the house; summaries are "Booked"/"Blocked".
 *
 * The URL carries a token (?token=...) so the feed is not world-readable:
 * calendar platforms happily fetch any URL you give them, secrets included.
 */

import { and, eq, gte, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db/client";
import { blockedDates, bookings, properties } from "@/lib/db/schema";
import { addDays, todayInTimezone } from "@/lib/domain/dates";
import { buildIcs, type IcsEvent } from "@/lib/email/ics";

function tokenOk(provided: string | null): boolean {
  const expected = process.env.ICAL_FEED_TOKEN;
  if (!expected) return true; // feed deliberately public
  if (!provided || provided.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(provided), Buffer.from(expected));
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
): Promise<NextResponse> {
  const { file } = await params;
  if (!file.endsWith(".ics")) return new NextResponse("not found", { status: 404 });
  const propertyId = file.slice(0, -4);

  const url = new URL(request.url);
  if (!tokenOk(url.searchParams.get("token"))) {
    return new NextResponse("forbidden", { status: 403 });
  }

  const db = getDb();
  const property = await db.query.properties.findFirst({
    where: eq(properties.id, propertyId),
  });
  if (!property) return new NextResponse("not found", { status: 404 });

  // History is noise to a channel manager; export from 60 days back.
  const horizon = addDays(todayInTimezone(property.timezone), -60);

  const [bookingRows, blockRows] = await Promise.all([
    db
      .select({
        id: bookings.id,
        arrivalDate: bookings.arrivalDate,
        departureDate: bookings.departureDate,
        reference: bookings.reference,
      })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, property.id),
          inArray(bookings.status, ["pending", "confirmed"]),
          gte(bookings.departureDate, horizon),
        ),
      ),
    db
      .select({
        id: blockedDates.id,
        startDate: blockedDates.startDate,
        endDate: blockedDates.endDate,
        source: blockedDates.source,
      })
      .from(blockedDates)
      .where(
        and(
          eq(blockedDates.propertyId, property.id),
          gte(blockedDates.endDate, horizon),
        ),
      ),
  ]);

  const events: IcsEvent[] = [
    ...bookingRows.map((b) => ({
      uid: `booking-${b.id}@lighthouse-curacao`,
      start: b.arrivalDate,
      end: b.departureDate,
      summary: "Booked",
    })),
    // Blocks imported *from* a channel are not echoed back to channels:
    // Airbnb re-importing its own blocks via us creates phantom conflicts.
    ...blockRows
      .filter((b) => b.source === "owner")
      .map((b) => ({
        uid: `block-${b.id}@lighthouse-curacao`,
        start: b.startDate,
        end: b.endDate,
        summary: "Blocked",
      })),
  ];

  const ics = buildIcs(events, { calendarName: property.name });
  return new NextResponse(ics, {
    headers: {
      "content-type": "text/calendar; charset=utf-8",
      "content-disposition": `attachment; filename="${property.slug}.ics"`,
      "cache-control": "private, max-age=300",
    },
  });
}
