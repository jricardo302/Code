/**
 * /admin/feeds — channel calendars. The outgoing feed URL to paste into
 * Airbnb/Booking.com, and the incoming feeds the cron mirrors.
 */

import { asc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { currentAdmin } from "@/lib/admin/auth";
import { audit } from "@/lib/booking/audit";
import { getDb } from "@/lib/db/client";
import { icalFeeds, properties } from "@/lib/db/schema";
import { syncFeed } from "@/lib/ical/import";
import { siteUrl } from "@/lib/site-config";

export const dynamic = "force-dynamic";

async function addFeedAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const url = String(formData.get("url"));
  if (!/^https:\/\//.test(url)) return;
  const [property] = await db.select().from(properties).limit(1);
  const [created] = await db
    .insert(icalFeeds)
    .values({
      propertyId: property.id,
      label: String(formData.get("label") || "feed").toLowerCase().replace(/[^a-z0-9_]+/g, "_"),
      direction: "import",
      url,
    })
    .returning();
  await audit(db, {
    actor: (await currentAdmin()) ?? "admin",
    action: "ical_feed.created",
    entity: "ical_feed",
    entityId: created.id,
    after: { label: created.label, url },
  });
  revalidatePath("/admin/feeds");
}

async function syncNowAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const feed = await db.query.icalFeeds.findFirst({
    where: eq(icalFeeds.id, String(formData.get("id"))),
  });
  if (feed) await syncFeed(db, feed);
  revalidatePath("/admin/feeds");
}

async function toggleAction(formData: FormData): Promise<void> {
  "use server";
  const db = getDb();
  const id = String(formData.get("id"));
  const feed = await db.query.icalFeeds.findFirst({ where: eq(icalFeeds.id, id) });
  if (feed) {
    await db.update(icalFeeds).set({ active: !feed.active, updatedAt: new Date() }).where(eq(icalFeeds.id, id));
  }
  revalidatePath("/admin/feeds");
}

export default async function AdminFeedsPage() {
  const db = getDb();
  const [property] = await db.select().from(properties).limit(1);
  const rows = await db.select().from(icalFeeds).orderBy(asc(icalFeeds.createdAt));
  const token = process.env.ICAL_FEED_TOKEN;
  const exportUrl = `${siteUrl()}/api/ical/${property?.id}.ics${token ? `?token=${token}` : ""}`;

  return (
    <div>
      <h1 className="text-3xl">iCal-feeds</h1>

      <section className="mt-6 rounded-md border border-navy/15 bg-white p-4">
        <h2 className="text-lg">Uitgaande feed</h2>
        <p className="mt-1 text-sm text-ink/70">
          Plak deze URL bij Airbnb en Booking.com als geïmporteerde agenda; elke bevestigde
          boeking en eigen blokkade verschijnt daar als bezet.
        </p>
        <code className="mt-2 block overflow-x-auto rounded bg-navy/5 p-2 text-xs">{exportUrl}</code>
      </section>

      <section className="mt-6 rounded-md border border-navy/15 bg-white p-4">
        <h2 className="text-lg">Inkomende feed toevoegen</h2>
        <form action={addFeedAction} className="mt-3 flex flex-wrap items-end gap-2">
          <label className="block">
            <span className="block text-xs text-ink/60">Label (wordt de bron)</span>
            <input name="label" required placeholder="airbnb" className="rounded-md border border-navy/20 px-2 py-1" />
          </label>
          <label className="block flex-1">
            <span className="block text-xs text-ink/60">Feed-URL</span>
            <input name="url" type="url" required placeholder="https://www.airbnb.com/calendar/ical/….ics" className="w-full rounded-md border border-navy/20 px-2 py-1" />
          </label>
          <button type="submit" className="btn-primary px-4 py-1.5">Toevoegen</button>
        </form>
      </section>

      <ul className="mt-6 space-y-2">
        {rows.filter((f) => f.direction === "import").map((feed) => (
          <li key={feed.id} className="rounded-md border border-navy/15 bg-white px-4 py-3 text-sm">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span>
                <strong className="text-navy">{feed.label}</strong>
                <span className={`ml-3 rounded-full px-2 py-0.5 text-xs font-semibold ${feed.active ? "bg-turquoise/15 text-turquoise-deep" : "bg-navy/10 text-ink/50"}`}>
                  {feed.active ? "actief" : "uit"}
                </span>
              </span>
              <span className="flex gap-3">
                <form action={syncNowAction}>
                  <input type="hidden" name="id" value={feed.id} />
                  <button type="submit" className="btn-secondary px-3 py-1">Nu synchroniseren</button>
                </form>
                <form action={toggleAction}>
                  <input type="hidden" name="id" value={feed.id} />
                  <button type="submit" className="text-ink/60 hover:text-terracotta">
                    {feed.active ? "uitzetten" : "aanzetten"}
                  </button>
                </form>
              </span>
            </div>
            <p className="mt-1 break-all text-xs text-ink/50">{feed.url}</p>
            <p className="mt-1 text-xs text-ink/60">
              Laatste sync: {feed.lastSyncAt ? feed.lastSyncAt.toISOString() : "nog niet"} —{" "}
              {feed.lastSyncStatus ?? "—"}
              {feed.lastSyncError ? ` (${feed.lastSyncError})` : ""}
              {typeof feed.importedCount === "number" ? ` · ${feed.importedCount} blokkades` : ""}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}
