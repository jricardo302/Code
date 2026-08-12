import type { Metadata } from "next";
import { NextIntlClientProvider } from "next-intl";
import { getMessages, getTranslations, setRequestLocale } from "next-intl/server";
import { BookingWizard } from "@/components/booking/BookingWizard";
import { loadPricingContext } from "@/lib/booking/service";
import { getDb } from "@/lib/db/client";
import { enabledProviders } from "@/lib/payments/registry";
import { PROPERTY_SLUG } from "@/lib/site-config";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "book" });
  return { title: t("title"), description: t("intro") };
}

export default async function BookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("book");
  const messages = await getMessages();
  const ctx = await loadPricingContext(getDb(), PROPERTY_SLUG);

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/85">{t("intro")}</p>
      <div className="mt-12">
        <NextIntlClientProvider messages={{ common: messages.common, book: messages.book }}>
          <BookingWizard providers={enabledProviders()} holdMinutes={ctx.property.holdMinutes} />
        </NextIntlClientProvider>
      </div>
    </div>
  );
}
