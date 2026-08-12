/**
 * GET /api/cron — the site's heartbeat, run hourly by Vercel Cron.
 *
 * Everything time-driven lives here, and each duty is independently
 * idempotent, so an overlapping or repeated run changes nothing:
 *  1. expire pending bookings whose payment hold lapsed
 *  2. send balance reminders once the due window opens (35 days out)
 *  3. send practical arrival mails 3 days out
 *  4. mirror Airbnb / Booking.com iCal feeds into blocked_dates
 *  5. sweep expired rate-limit windows
 *
 * Authenticated via CRON_SECRET, which Vercel sends as a Bearer token.
 */

import { and, eq, gt, isNull, lte, sql } from "drizzle-orm";
import { NextResponse } from "next/server";
import { timingSafeEqual } from "node:crypto";
import { audit } from "@/lib/booking/audit";
import { expireStaleHolds } from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { bookings, properties } from "@/lib/db/schema";
import { addDays, todayInTimezone } from "@/lib/domain/dates";
import { sendArrivalInfo, sendBalanceReminder } from "@/lib/email/send";
import { syncAllFeeds } from "@/lib/ical/import";
import { sweepRateLimits } from "@/lib/rate-limit";

export const maxDuration = 120;

function authorized(request: Request): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return process.env.NODE_ENV !== "production";
  const header = request.headers.get("authorization") ?? "";
  const expected = `Bearer ${secret}`;
  if (header.length !== expected.length) return false;
  return timingSafeEqual(Buffer.from(header), Buffer.from(expected));
}

export async function GET(request: Request): Promise<NextResponse> {
  if (!authorized(request)) return new NextResponse("unauthorized", { status: 401 });

  const db = getDb();
  const report: Record<string, unknown> = {};

  // 1. Lapsed holds.
  const expired = await expireStaleHolds(db);
  for (const booking of expired) {
    await audit(db, {
      actor: "system",
      action: "booking.hold_expired",
      entity: "booking",
      entityId: booking.id,
    });
  }
  report.expiredHolds = expired.length;

  // Per-property "today", so a future second property in another timezone
  // would not shift this one's reminders.
  const props = await db.select().from(properties);
  let balanceReminders = 0;
  let arrivalMails = 0;

  for (const property of props) {
    const today = todayInTimezone(property.timezone);

    // 2. Balance due (arrival minus balanceDueDays is stored on the row).
    const dueRows = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, property.id),
          eq(bookings.status, "confirmed"),
          isNull(bookings.balanceReminderSentAt),
          sql`${bookings.balanceDueDate} is not null`,
          lte(bookings.balanceDueDate, today),
          gt(bookings.balanceCents, 0),
          gt(bookings.arrivalDate, today),
        ),
      );
    for (const { id } of dueRows) {
      try {
        if (await sendBalanceReminder(db, id)) balanceReminders++;
      } catch (error) {
        console.error(`[cron] balance reminder failed for ${id}`, error);
      }
    }

    // 3. Arrival mail, three days out (also catches shorter-notice bookings).
    const soonRows = await db
      .select({ id: bookings.id })
      .from(bookings)
      .where(
        and(
          eq(bookings.propertyId, property.id),
          eq(bookings.status, "confirmed"),
          isNull(bookings.arrivalEmailSentAt),
          lte(bookings.arrivalDate, addDays(today, 3)),
          gt(bookings.arrivalDate, today),
        ),
      );
    for (const { id } of soonRows) {
      try {
        if (await sendArrivalInfo(db, id)) arrivalMails++;
      } catch (error) {
        console.error(`[cron] arrival mail failed for ${id}`, error);
      }
    }
  }
  report.balanceReminders = balanceReminders;
  report.arrivalMails = arrivalMails;

  // 4. Channel calendars.
  report.icalSync = await syncAllFeeds(db);

  // 5. Rate-limit hygiene.
  await sweepRateLimits(db);

  return NextResponse.json({ ok: true, ...report });
}
