/**
 * /admin/blokkades — nights that are simply not for rent: own stays,
 * maintenance, and (read-only) whatever the channel feeds imported.
 */

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/booking/audit";
import { getDb } from "@/lib/db/client";
import { blockedDates, properties } from "@/lib/db/schema";
import { isCalendarDate } from "@/lib/domain/dates";

export const dynamic = "force-dynamic";

async function addAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const startDate = String(formData.get("startDate"));
  const endDate = String(formData.get("endDate"));
  if (!isCalendarDate(startDate) || !isCalendarDate(endDate) || endDate <= startDate) return;
  const [property] = await db.select().from(properties).limit(1);
  const [created] = await db
    .insert(blockedDates)
    .values({
      propertyId: property.id,
      startDate,
      endDate,
      source: "owner",
      reason: String(formData.get("reason") || "") || null,
    })
    .returning();
  await audit(db, {
    actor: (await currentAdmin()) ?? "admin",
    action: "blocked_date.created",
    entity: "blocked_date",
    entityId: created.id,
    after: { startDate, endDate },
  });
  revalidatePath("/admin/blokkades");
}

async function removeAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  const before = await db.query.blockedDates.findFirst({ where: eq(blockedDates.id, id) });
  // Owner blocks only; imported blocks belong to their feed and would come
  // straight back on the next sync anyway.
  if (before?.source !== "owner") return;
  await db.delete(blockedDates).where(eq(blockedDates.id, id));
  await audit(db, {
    actor: (await currentAdmin()) ?? "admin",
    action: "blocked_date.deleted",
    entity: "blocked_date",
    entityId: id,
    before,
  });
  revalidatePath("/admin/blokkades");
}

export default async function AdminBlockedPage() {
  const db = getDb();
  const rows = await db.select().from(blockedDates).orderBy(asc(blockedDates.startDate));

  return (
    <div>
      <h1 className="text-3xl">Blokkades</h1>
      <p className="mt-2 max-w-2xl text-sm text-ink/70">
        Einddatum is exclusief: een blokkade t/m 8 januari eindigt op 2027-01-09.
        Geïmporteerde blokkades (Airbnb, Booking.com) zijn hier zichtbaar maar alleen
        via de feed te wijzigen.
      </p>

      <form action={addAction} className="mt-6 flex flex-wrap items-end gap-2 rounded-md border border-navy/15 bg-white p-4">
        <label className="block">
          <span className="block text-xs text-ink/60">Eerste nacht</span>
          <input name="startDate" required placeholder="2027-05-01" pattern="\d{4}-\d{2}-\d{2}" className="rounded-md border border-navy/20 px-2 py-1" />
        </label>
        <label className="block">
          <span className="block text-xs text-ink/60">Eerste vrije nacht</span>
          <input name="endDate" required placeholder="2027-05-08" pattern="\d{4}-\d{2}-\d{2}" className="rounded-md border border-navy/20 px-2 py-1" />
        </label>
        <label className="block flex-1">
          <span className="block text-xs text-ink/60">Reden</span>
          <input name="reason" placeholder="eigen verblijf" className="w-full rounded-md border border-navy/20 px-2 py-1" />
        </label>
        <button type="submit" className="btn-primary px-4 py-1.5">Blokkeren</button>
      </form>

      <ul className="mt-6 space-y-2">
        {rows.map((block) => (
          <li key={block.id} className="flex items-center justify-between rounded-md border border-navy/15 bg-white px-4 py-2 text-sm">
            <span className="tabular-nums">
              {block.startDate} → {block.endDate}
              <span className="ml-3 text-ink/60">{block.reason ?? "—"}</span>
              <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-semibold ${block.source === "owner" ? "bg-navy/10 text-navy" : "bg-terracotta/10 text-terracotta-deep"}`}>
                {block.source}
              </span>
            </span>
            {block.source === "owner" ? (
              <form action={removeAction}>
                <input type="hidden" name="id" value={block.id} />
                <button type="submit" className="text-terracotta hover:underline">
                  vrijgeven
                </button>
              </form>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}
