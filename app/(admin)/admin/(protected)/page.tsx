/**
 * /admin — the calendar: a month of nights, each stamped with what occupies
 * it. Bookings link through to their detail row on /admin/boekingen.
 */

import Link from "next/link";
import { and, eq, gt, inArray, lt } from "drizzle-orm";
import { getDb } from "@/lib/db/client";
import { blockedDates, bookings, guests, properties } from "@/lib/db/schema";
import { addDays, todayInTimezone, type CalendarDate } from "@/lib/domain/dates";

export const dynamic = "force-dynamic";

function monthStart(date: CalendarDate): CalendarDate {
  return `${date.slice(0, 7)}-01`;
}
function addMonths(date: CalendarDate, months: number): CalendarDate {
  const year = Number(date.slice(0, 4));
  const month = Number(date.slice(5, 7)) - 1 + months;
  const y = year + Math.floor(month / 12);
  const m = ((month % 12) + 12) % 12;
  return `${String(y).padStart(4, "0")}-${String(m + 1).padStart(2, "0")}-01`;
}

export default async function AdminCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ maand?: string }>;
}) {
  const { maand } = await searchParams;
  const db = getDb();
  const [property] = await db.select().from(properties).limit(1);
  if (!property) {
    return <p>Geen woning gevonden — draai eerst <code>npm run db:seed</code>.</p>;
  }

  const today = todayInTimezone(property.timezone);
  const view = /^\d{4}-\d{2}$/.test(maand ?? "") ? `${maand}-01` : monthStart(today);
  const nextView = addMonths(view, 1);

  const [bookingRows, blockRows] = await Promise.all([
    db
      .select({
        id: bookings.id,
        reference: bookings.reference,
        status: bookings.status,
        arrivalDate: bookings.arrivalDate,
        departureDate: bookings.departureDate,
        lastName: guests.lastName,
      })
      .from(bookings)
      .innerJoin(guests, eq(guests.id, bookings.guestId))
      .where(
        and(
          eq(bookings.propertyId, property.id),
          inArray(bookings.status, ["pending", "confirmed"]),
          lt(bookings.arrivalDate, nextView),
          gt(bookings.departureDate, view),
        ),
      ),
    db
      .select()
      .from(blockedDates)
      .where(
        and(
          eq(blockedDates.propertyId, property.id),
          lt(blockedDates.startDate, nextView),
          gt(blockedDates.endDate, view),
        ),
      ),
  ]);

  const days: CalendarDate[] = [];
  for (let d = view; d < nextView; d = addDays(d, 1)) days.push(d);

  function occupancy(date: CalendarDate) {
    const booking = bookingRows.find((b) => date >= b.arrivalDate && date < b.departureDate);
    if (booking) return { kind: booking.status, label: `${booking.reference} · ${booking.lastName}`, id: booking.id };
    const block = blockRows.find((b) => date >= b.startDate && date < b.endDate);
    if (block) return { kind: "blocked", label: block.source === "owner" ? (block.reason ?? "geblokkeerd") : block.source, id: null };
    return null;
  }

  const monthLabel = new Intl.DateTimeFormat("nl-NL", {
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${view}T00:00:00Z`));

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl capitalize">{monthLabel}</h1>
        <div className="flex gap-2">
          <Link href={`/admin?maand=${addMonths(view, -1).slice(0, 7)}`} className="btn-secondary px-3 py-1 text-sm">
            ← vorige
          </Link>
          <Link href={`/admin?maand=${nextView.slice(0, 7)}`} className="btn-secondary px-3 py-1 text-sm">
            volgende →
          </Link>
        </div>
      </div>

      <ol className="mt-6 grid grid-cols-1 gap-1 sm:grid-cols-2 lg:grid-cols-4">
        {days.map((date) => {
          const occ = occupancy(date);
          return (
            <li
              key={date}
              className={`rounded-md border px-3 py-2 text-sm ${
                occ?.kind === "confirmed" ? "border-turquoise/40 bg-turquoise/10"
                : occ?.kind === "pending" ? "border-terracotta/40 bg-terracotta/10"
                : occ?.kind === "blocked" ? "border-navy/20 bg-navy/5"
                : "border-navy/10 bg-white"
              } ${date === today ? "ring-2 ring-terracotta/60" : ""}`}
            >
              <span className="font-mono text-xs text-ink/60">{date}</span>
              {occ ? (
                occ.id ? (
                  <Link href={`/admin/boekingen#${occ.id}`} className="mt-1 block truncate font-medium text-navy hover:text-turquoise-deep">
                    {occ.label}
                  </Link>
                ) : (
                  <span className="mt-1 block truncate text-ink/80">{occ.label}</span>
                )
              ) : (
                <span className="mt-1 block text-ink/30">vrij</span>
              )}
            </li>
          );
        })}
      </ol>

      <p className="mt-6 text-sm text-ink/60">
        <span className="mr-4"><span className="mr-1 inline-block h-3 w-3 rounded-sm bg-turquoise/40 align-middle" /> bevestigd</span>
        <span className="mr-4"><span className="mr-1 inline-block h-3 w-3 rounded-sm bg-terracotta/40 align-middle" /> in behandeling</span>
        <span><span className="mr-1 inline-block h-3 w-3 rounded-sm bg-navy/20 align-middle" /> geblokkeerd / extern</span>
      </p>
    </div>
  );
}
