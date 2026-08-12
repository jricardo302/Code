/**
 * The page the guest lands on after the payment provider redirects back.
 * State comes from the database (which the webhook updates), never from
 * query parameters a guest could edit.
 */

import { and, desc, eq } from "drizzle-orm";
import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDb } from "@/lib/db/client";
import { bookings, payments } from "@/lib/db/schema";
import { getPaymentProvider } from "@/lib/payments/registry";
import { startPayment } from "@/lib/payments/service";
import type { ProviderName } from "@/lib/payments/provider";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("title"), robots: { index: false } };
}

async function retryPaymentAction(formData: FormData): Promise<void> {
  "use server";
  const bookingId = String(formData.get("bookingId") ?? "");
  const db = getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!booking || booking.status !== "pending") return;

  // Reuse the provider of the most recent attempt.
  const [lastPayment] = await db
    .select()
    .from(payments)
    .where(eq(payments.bookingId, bookingId))
    .orderBy(desc(payments.createdAt))
    .limit(1);
  if (!lastPayment) return;

  const provider = getPaymentProvider(lastPayment.provider as ProviderName);
  const step = booking.paymentPlan === "deposit" ? "deposit" : "full";
  const { checkoutUrl } = await startPayment(db, provider, booking, step);
  redirect(checkoutUrl);
}

export default async function BookingStatusPage({
  params,
}: {
  params: Promise<{ locale: string; bookingId: string }>;
}) {
  const { locale, bookingId } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book.status");

  if (!/^[0-9a-f-]{36}$/.test(bookingId)) notFound();
  const db = getDb();
  const booking = await db.query.bookings.findFirst({ where: eq(bookings.id, bookingId) });
  if (!booking) notFound();

  const [openBalance] = await db
    .select()
    .from(payments)
    .where(and(eq(payments.bookingId, bookingId), eq(payments.status, "paid")))
    .limit(1);

  let title: string;
  let text: string;
  let canRetry = false;

  switch (booking.status) {
    case "confirmed":
      title = t("confirmedTitle");
      text = t("confirmedText", { reference: booking.reference });
      break;
    case "pending":
      if (openBalance) {
        title = t("checking");
        text = t("pendingText");
      } else {
        title = t("pendingTitle");
        text = t("pendingText");
      }
      canRetry = true;
      break;
    case "expired":
      title = t("expiredTitle");
      text = t("expiredText");
      break;
    default:
      title = t("failedTitle");
      text = t("failedText");
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-24 text-center md:px-6">
      <h1 className="text-4xl">{title}</h1>
      <p className="mt-6 text-lg leading-8 text-ink/85">{text}</p>
      {booking.status === "confirmed" ? (
        <p className="mt-4 font-mono text-sm text-ink/60">{booking.reference}</p>
      ) : null}
      {canRetry ? (
        <form action={retryPaymentAction} className="mt-8">
          <input type="hidden" name="bookingId" value={booking.id} />
          <button type="submit" className="btn-primary">
            {t("retryButton")}
          </button>
        </form>
      ) : null}
    </div>
  );
}
