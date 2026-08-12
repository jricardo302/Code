/**
 * /admin/boekingen — every booking, newest first, with the owner's actions:
 * cancel, register a manual payment, resend the confirmation, and create a
 * manual booking (phone/e-mail guests).
 */

import { desc, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/booking/audit";
import { cancelBooking, createBooking } from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { bookings, guests, payments } from "@/lib/db/schema";
import { isCalendarDate } from "@/lib/domain/dates";
import { formatCents, fromDecimalString } from "@/lib/domain/money";
import { resendConfirmation } from "@/lib/email/send";
import { registerManualPayment } from "@/lib/payments/service";
import { PROPERTY_SLUG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

async function actor(): Promise<string> {
  return (await currentAdmin()) ?? "admin";
}

async function cancelAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  const reason = String(formData.get("reason") || "geannuleerd door beheer");
  const before = await db.query.bookings.findFirst({ where: eq(bookings.id, id) });
  const after = await cancelBooking(db, id, reason);
  await audit(db, {
    actor: await actor(),
    action: "booking.cancelled",
    entity: "booking",
    entityId: id,
    before: { status: before?.status },
    after: { status: after.status, reason },
  });
  revalidatePath("/admin/boekingen");
}

async function manualPaymentAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  const amountCents = fromDecimalString(String(formData.get("amount")));
  const note = String(formData.get("note") || "handmatige betaling");
  await registerManualPayment(db, id, amountCents, note, await actor());
  revalidatePath("/admin/boekingen");
}

async function resendAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  await resendConfirmation(db, id);
  await audit(db, {
    actor: await actor(),
    action: "booking.confirmation_resent",
    entity: "booking",
    entityId: id,
  });
  revalidatePath("/admin/boekingen");
}

async function createManualAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const arrivalDate = String(formData.get("arrival"));
  const departureDate = String(formData.get("departure"));
  if (!isCalendarDate(arrivalDate) || !isCalendarDate(departureDate)) return;
  const { booking } = await createBooking(db, {
    propertySlug: PROPERTY_SLUG,
    arrivalDate,
    departureDate,
    guestCount: Number(formData.get("guests") || 2),
    paymentPlan: "full",
    source: "manual",
    guest: {
      email: String(formData.get("email")).toLowerCase(),
      firstName: String(formData.get("firstName")),
      lastName: String(formData.get("lastName")),
      locale: "nl",
    },
  });
  await audit(db, {
    actor: await actor(),
    action: "booking.manual_created",
    entity: "booking",
    entityId: booking.id,
    after: { reference: booking.reference, arrivalDate, departureDate },
  });
  revalidatePath("/admin/boekingen");
}

export default async function AdminBookingsPage() {
  const db = getDb();
  const rows = await db
    .select({
      booking: bookings,
      guestName: sql<string>`${guests.firstName} || ' ' || ${guests.lastName}`,
      guestEmail: guests.email,
      paidCents: sql<string>`coalesce((select sum(p.amount_cents) from ${payments} p where p.booking_id = ${bookings.id} and p.status = 'paid'), 0)`,
    })
    .from(bookings)
    .innerJoin(guests, eq(guests.id, bookings.guestId))
    .orderBy(desc(bookings.createdAt))
    .limit(200);

  const money = (cents: number) => formatCents(cents, { currency: "EUR" });

  return (
    <div>
      <h1 className="text-3xl">Boekingen</h1>

      <details className="mt-6 rounded-md border border-navy/15 bg-white p-4">
        <summary className="cursor-pointer font-medium text-navy">
          Handmatige boeking aanmaken (telefoon / e-mail)
        </summary>
        <form action={createManualAction} className="mt-4 grid gap-3 sm:grid-cols-3">
          <input name="firstName" required placeholder="Voornaam" className="rounded-md border border-navy/20 px-3 py-2" />
          <input name="lastName" required placeholder="Achternaam" className="rounded-md border border-navy/20 px-3 py-2" />
          <input name="email" type="email" required placeholder="E-mail" className="rounded-md border border-navy/20 px-3 py-2" />
          <input name="arrival" required placeholder="Aankomst (2027-01-10)" pattern="\d{4}-\d{2}-\d{2}" className="rounded-md border border-navy/20 px-3 py-2" />
          <input name="departure" required placeholder="Vertrek (2027-01-17)" pattern="\d{4}-\d{2}-\d{2}" className="rounded-md border border-navy/20 px-3 py-2" />
          <input name="guests" type="number" min="1" max="6" defaultValue="2" className="rounded-md border border-navy/20 px-3 py-2" />
          <button type="submit" className="btn-primary sm:col-span-3">Aanmaken (direct bevestigd)</button>
        </form>
        <p className="mt-2 text-xs text-ink/60">
          De prijs wordt volgens de seizoenen berekend; registreer daarna eventueel een handmatige betaling.
        </p>
      </details>

      <ul className="mt-8 space-y-4">
        {rows.map(({ booking, guestName, guestEmail, paidCents }) => {
          const paid = Number(paidCents);
          const outstanding = booking.totalCents - paid;
          return (
            <li key={booking.id} id={booking.id} className="rounded-md border border-navy/15 bg-white p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <div>
                  <span className="font-mono text-sm font-semibold text-navy">{booking.reference}</span>
                  <span
                    className={`ml-3 rounded-full px-2 py-0.5 text-xs font-semibold ${
                      booking.status === "confirmed" ? "bg-turquoise/15 text-turquoise-deep"
                      : booking.status === "pending" ? "bg-terracotta/15 text-terracotta-deep"
                      : "bg-navy/10 text-ink/60"
                    }`}
                  >
                    {booking.status}
                  </span>
                  <span className="ml-3 text-sm text-ink/70">{booking.source}</span>
                </div>
                <span className="tabular-nums text-sm text-ink/80">
                  {booking.arrivalDate} → {booking.departureDate} · {booking.guests}p
                </span>
              </div>
              <p className="mt-2 text-sm text-ink/80">
                {guestName} · {guestEmail}
              </p>
              <p className="mt-1 text-sm tabular-nums text-ink/80">
                Totaal {money(booking.totalCents)} · betaald {money(paid)}
                {outstanding > 0 ? ` · open ${money(outstanding)}` : " · voldaan"}
                {booking.balanceDueDate ? ` · rest vóór ${booking.balanceDueDate}` : ""}
              </p>

              {booking.status === "pending" || booking.status === "confirmed" ? (
                <div className="mt-3 flex flex-wrap items-end gap-3 border-t border-navy/10 pt-3 text-sm">
                  <form action={manualPaymentAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={booking.id} />
                    <label className="block">
                      <span className="block text-xs text-ink/60">Bedrag (bijv. 688.55)</span>
                      <input name="amount" required pattern="\d+(\.\d{1,2})?" className="w-28 rounded-md border border-navy/20 px-2 py-1" />
                    </label>
                    <input name="note" placeholder="omschrijving" className="w-36 rounded-md border border-navy/20 px-2 py-1" />
                    <button type="submit" className="btn-secondary px-3 py-1">Betaling registreren</button>
                  </form>
                  {booking.status === "confirmed" ? (
                    <form action={resendAction}>
                      <input type="hidden" name="id" value={booking.id} />
                      <button type="submit" className="btn-secondary px-3 py-1">Bevestiging opnieuw mailen</button>
                    </form>
                  ) : null}
                  <form action={cancelAction} className="flex items-end gap-2">
                    <input type="hidden" name="id" value={booking.id} />
                    <input name="reason" placeholder="reden" className="w-36 rounded-md border border-navy/20 px-2 py-1" />
                    <button type="submit" className="rounded-md border border-terracotta px-3 py-1 font-medium text-terracotta hover:bg-terracotta hover:text-white">
                      Annuleren
                    </button>
                  </form>
                </div>
              ) : null}
            </li>
          );
        })}
      </ul>
    </div>
  );
}
