/**
 * GET /admin/export/boekingen.csv — every booking as CSV for the accountant.
 * Amounts as decimal strings in EUR; RFC 4180 quoting; UTF-8 BOM so Excel
 * opens it correctly.
 */

import { desc, eq } from "drizzle-orm";
import { currentAdmin } from "@/lib/admin/auth";
import { getDb } from "@/lib/db/client";
import { bookings, guests, payments } from "@/lib/db/schema";
import { toDecimalString } from "@/lib/domain/money";
import { sql } from "drizzle-orm";

function csvField(value: string | number | null | undefined): string {
  const text = String(value ?? "");
  return /[",\n;]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
}

export async function GET(): Promise<Response> {
  if (!(await currentAdmin())) {
    return new Response("unauthorized", { status: 401 });
  }

  const db = getDb();
  const rows = await db
    .select({
      booking: bookings,
      guestName: sql<string>`${guests.firstName} || ' ' || ${guests.lastName}`,
      guestEmail: guests.email,
      guestCountry: guests.country,
      paidCents: sql<string>`coalesce((select sum(p.amount_cents) from ${payments} p where p.booking_id = ${bookings.id} and p.status = 'paid'), 0)`,
    })
    .from(bookings)
    .innerJoin(guests, eq(guests.id, bookings.guestId))
    .orderBy(desc(bookings.arrivalDate));

  const header = [
    "referentie", "status", "bron", "aankomst", "vertrek", "nachten", "gasten",
    "gast", "email", "land", "logies_eur", "schoonmaak_eur", "belasting_eur",
    "totaal_eur", "betaald_eur", "open_eur", "rest_uiterlijk", "aangemaakt",
  ].join(";");

  const lines = rows.map(({ booking, guestName, guestEmail, guestCountry, paidCents }) => {
    const paid = Number(paidCents);
    return [
      booking.reference,
      booking.status,
      booking.source,
      booking.arrivalDate,
      booking.departureDate,
      booking.nights,
      booking.guests,
      csvField(guestName),
      csvField(guestEmail),
      guestCountry ?? "",
      toDecimalString(booking.accommodationCents),
      toDecimalString(booking.cleaningFeeCents),
      toDecimalString(booking.taxCents),
      toDecimalString(booking.totalCents),
      toDecimalString(paid),
      toDecimalString(booking.totalCents - paid),
      booking.balanceDueDate ?? "",
      booking.createdAt.toISOString().slice(0, 10),
    ].join(";");
  });

  // BOM + semicolons: the dialect Dutch Excel actually opens correctly.
  const csv = "﻿" + [header, ...lines].join("\r\n") + "\r\n";
  return new Response(csv, {
    headers: {
      "content-type": "text/csv; charset=utf-8",
      "content-disposition": `attachment; filename="lighthouse-boekingen-${new Date().toISOString().slice(0, 10)}.csv"`,
      "cache-control": "no-store",
    },
  });
}
