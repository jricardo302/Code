/**
 * /admin/seizoenen — the price calendar. Editing a season never touches
 * existing bookings: their price was frozen at booking time.
 */

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/booking/audit";
import { getDb } from "@/lib/db/client";
import { properties, seasons } from "@/lib/db/schema";
import { isCalendarDate } from "@/lib/domain/dates";
import { formatCents, fromDecimalString } from "@/lib/domain/money";

export const dynamic = "force-dynamic";

async function upsertAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id") || "");
  const startDate = String(formData.get("startDate"));
  const endDate = String(formData.get("endDate"));
  if (!isCalendarDate(startDate) || !isCalendarDate(endDate) || endDate < startDate) return;

  const values = {
    label: String(formData.get("label") || "Seizoen"),
    startDate,
    endDate,
    nightlyPriceCents: fromDecimalString(String(formData.get("price"))),
    minNights: Math.max(1, Number(formData.get("minNights") || 1)),
    priority: Number(formData.get("priority") || 10),
    updatedAt: new Date(),
  };

  if (id) {
    const before = await db.query.seasons.findFirst({ where: eq(seasons.id, id) });
    await db.update(seasons).set(values).where(eq(seasons.id, id));
    await audit(db, {
      actor: (await currentAdmin()) ?? "admin",
      action: "season.updated",
      entity: "season",
      entityId: id,
      before,
      after: values,
    });
  } else {
    const [property] = await db.select().from(properties).limit(1);
    const [created] = await db
      .insert(seasons)
      .values({ ...values, propertyId: property.id })
      .returning();
    await audit(db, {
      actor: (await currentAdmin()) ?? "admin",
      action: "season.created",
      entity: "season",
      entityId: created.id,
      after: values,
    });
  }
  revalidatePath("/admin/seizoenen");
}

async function deleteAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  const before = await db.query.seasons.findFirst({ where: eq(seasons.id, id) });
  await db.delete(seasons).where(eq(seasons.id, id));
  await audit(db, {
    actor: (await currentAdmin()) ?? "admin",
    action: "season.deleted",
    entity: "season",
    entityId: id,
    before,
  });
  revalidatePath("/admin/seizoenen");
}

function SeasonForm({
  season,
}: {
  season?: typeof seasons.$inferSelect;
}) {
  return (
    <form action={upsertAction} className="grid gap-2 sm:grid-cols-7">
      {season ? <input type="hidden" name="id" value={season.id} /> : null}
      <input name="label" defaultValue={season?.label} placeholder="Naam" required className="rounded-md border border-navy/20 px-2 py-1 sm:col-span-2" />
      <input name="startDate" defaultValue={season?.startDate} placeholder="2027-12-15" pattern="\d{4}-\d{2}-\d{2}" required className="rounded-md border border-navy/20 px-2 py-1" />
      <input name="endDate" defaultValue={season?.endDate} placeholder="2028-04-15" pattern="\d{4}-\d{2}-\d{2}" required className="rounded-md border border-navy/20 px-2 py-1" />
      <input name="price" defaultValue={season ? (season.nightlyPriceCents / 100).toFixed(2) : ""} placeholder="285.00" pattern="\d+(\.\d{1,2})?" required className="rounded-md border border-navy/20 px-2 py-1" />
      <input name="minNights" type="number" min="1" defaultValue={season?.minNights ?? 3} className="rounded-md border border-navy/20 px-2 py-1" />
      <div className="flex gap-1">
        <input name="priority" type="number" defaultValue={season?.priority ?? 10} title="prioriteit" className="w-16 rounded-md border border-navy/20 px-2 py-1" />
        <button type="submit" className="btn-secondary flex-1 px-2 py-1 text-sm">
          {season ? "Opslaan" : "Toevoegen"}
        </button>
      </div>
    </form>
  );
}

export default async function AdminSeasonsPage() {
  const db = getDb();
  const rows = await db.select().from(seasons).orderBy(asc(seasons.startDate));

  return (
    <div>
      <h1 className="text-3xl">Seizoenen en prijzen</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Prijs per nacht in euro&apos;s. Overlappende periodes mogen: de hoogste prioriteit wint —
        handig voor een afwijkende kerstweek boven op het hoogseizoen. Bestaande boekingen
        houden altijd hun oorspronkelijke prijs.
      </p>

      <div className="mt-6 rounded-md border border-navy/15 bg-white p-4">
        <h2 className="mb-3 text-lg">Nieuw seizoen</h2>
        <SeasonForm />
        <p className="mt-2 text-xs text-ink/50">
          naam · begindatum · einddatum (beide inclusief) · prijs/nacht · min. nachten · prioriteit
        </p>
      </div>

      <ul className="mt-6 space-y-2">
        {rows.map((season) => (
          <li key={season.id} className="rounded-md border border-navy/15 bg-white p-3">
            <div className="mb-2 flex items-baseline justify-between">
              <span className="text-sm font-semibold text-navy">
                {season.label} — {formatCents(season.nightlyPriceCents, { currency: "EUR" })}/nacht
              </span>
              <form action={deleteAction}>
                <input type="hidden" name="id" value={season.id} />
                <button type="submit" className="text-sm text-terracotta hover:underline">
                  verwijderen
                </button>
              </form>
            </div>
            <SeasonForm season={season} />
          </li>
        ))}
      </ul>
    </div>
  );
}
