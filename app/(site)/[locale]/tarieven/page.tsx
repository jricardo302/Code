import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { getDb } from "@/lib/db/client";
import { loadPricingContext } from "@/lib/booking/service";
import { formatCents } from "@/lib/domain/money";
import { basisPointsToPercent } from "@/lib/domain/money";

// Prices come from the database; render on demand so a season edit in
// /admin is visible immediately and the build needs no database.
export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "rates" });
  return { title: t("title"), description: t("intro") };
}

export default async function RatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("rates");
  const tc = await getTranslations("common");

  const ctx = await loadPricingContext(getDb(), "lighthouse");
  const moneyLocale = locale === "nl" ? "nl-NL" : "en-IE";
  const money = (cents: number) =>
    formatCents(cents, { locale: moneyLocale, currency: ctx.policy.currency });

  // Representative bands for the table: pick the next occurrence of each
  // label family from the seed data by price level.
  const prices = ctx.seasons.map((s) => s.nightlyPriceCents);
  const high = Math.max(...prices);
  const low = Math.min(...prices);
  const shoulder = ctx.seasons
    .map((s) => s.nightlyPriceCents)
    .find((p) => p !== high && p !== low) ?? high;

  const seasonRows = [
    { key: "seasonHigh", dates: t("highDates"), price: high, minNights: 5 },
    { key: "seasonShoulder", dates: t("shoulderDates"), price: shoulder, minNights: 3 },
    { key: "seasonLow", dates: t("lowDates"), price: low, minNights: 3 },
  ] as const;

  return (
    <div className="mx-auto max-w-4xl px-4 py-16 md:px-6">
      <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/85">{t("intro")}</p>

      <table className="mt-12 w-full border-collapse text-left">
        <caption className="sr-only">{t("title")}</caption>
        <thead>
          <tr className="border-b-2 border-navy/20 text-sm uppercase tracking-wide text-ink/60">
            <th scope="col" className="py-3 pr-4 font-semibold">&nbsp;</th>
            <th scope="col" className="py-3 pr-4 font-semibold">{t("calendarTitle")}</th>
            <th scope="col" className="py-3 text-right font-semibold">{tc("perNight")}</th>
          </tr>
        </thead>
        <tbody>
          {seasonRows.map((row) => (
            <tr key={row.key} className="border-b border-navy/10">
              <th scope="row" className="py-4 pr-4 align-top font-semibold text-navy">
                {t(row.key)}
                <span className="block text-sm font-normal text-ink/60">
                  {t("minStay", { nights: row.minNights })}
                </span>
              </th>
              <td className="py-4 pr-4 align-top leading-6 text-ink/80">{row.dates}</td>
              <td className="py-4 text-right align-top font-semibold text-navy">
                {money(row.price)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <ul className="mt-8 space-y-2 text-ink/80">
        <li>{t("cleaningFee", { amount: money(ctx.policy.cleaningFeeCents) })}</li>
        <li>{t("tax", { pct: basisPointsToPercent(ctx.policy.taxRateBps) })}</li>
        <li>{t("deposit")}</li>
      </ul>

      <div className="mt-12">
        <Link href="/boeken" className="btn-primary">
          {tc("checkAvailability")}
        </Link>
        <p className="mt-3 text-sm text-ink/60">{t("calendarHint")}</p>
      </div>
    </div>
  );
}
