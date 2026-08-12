/**
 * GET /api/availability?from=&to= — unavailable [start,end) ranges for the
 * calendar. Merged bookings + blocks; no statuses, no sources, no names —
 * the outside world only learns "free" or "taken".
 */

import { NextResponse } from "next/server";
import { jsonError, rateLimitGate } from "@/lib/api/http";
import { loadPricingContext, unavailableRanges } from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { addDays, isCalendarDate, nightsBetween } from "@/lib/domain/dates";
import { PROPERTY_SLUG } from "@/lib/site-config";

export async function GET(request: Request): Promise<NextResponse> {
  const limited = await rateLimitGate("quote", request.headers);
  if (limited) return limited;

  const url = new URL(request.url);
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  if (!isCalendarDate(from) || !isCalendarDate(to) || to <= from) {
    return jsonError(400, "INVALID_INPUT", "from/to must be YYYY-MM-DD with to after from");
  }
  if (nightsBetween(from, to) > 400) {
    return jsonError(400, "INVALID_INPUT", "window too large");
  }

  const db = getDb();
  const ctx = await loadPricingContext(db, PROPERTY_SLUG);
  const ranges = await unavailableRanges(db, ctx.property.id, from, to);

  return NextResponse.json(
    {
      from,
      to,
      today: ctx.today,
      minAdvanceDays: ctx.property.minAdvanceDays,
      maxAdvanceDays: ctx.property.maxAdvanceDays,
      maxGuests: ctx.property.maxGuests,
      bookableUntil: addDays(ctx.today, ctx.property.maxAdvanceDays),
      unavailable: ranges,
    },
    // Never cached: a guest re-opening the calendar right after someone else
    // booked must see the taken nights immediately.
    { headers: { "cache-control": "no-store" } },
  );
}
