import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations, setRequestLocale } from "next-intl/server";
import Script from "next/script";
import { routing } from "@/i18n/routing";
import { fontClasses } from "@/lib/fonts";
import { SITE_NAME, siteUrl } from "@/lib/site-config";
import { Footer } from "@/components/site/Footer";
import { Header } from "@/components/site/Header";
import "../../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "common" });
  return {
    metadataBase: new URL(siteUrl()),
    title: {
      default: `${SITE_NAME} — ${t("tagline")}`,
      template: `%s — ${SITE_NAME}`,
    },
    description: t("tagline"),
    openGraph: {
      siteName: SITE_NAME,
      images: [{ url: "/images/og.jpg", width: 1200, height: 630 }],
      locale: locale === "nl" ? "nl_NL" : "en_US",
      type: "website",
    },
    alternates: {
      languages: { nl: "/", en: "/en", "x-default": "/" },
    },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: "common" });
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;

  return (
    <html lang={locale} className={fontClasses}>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-navy focus:px-4 focus:py-2 focus:text-sand"
        >
          {t("skipToContent")}
        </a>
        <NextIntlClientProvider>
          <Header />
          <main id="main">{children}</main>
          <Footer />
        </NextIntlClientProvider>
        {plausibleDomain ? (
          <Script
            defer
            data-domain={plausibleDomain}
            src="https://plausible.io/js/script.js"
            strategy="afterInteractive"
          />
        ) : null}
      </body>
    </html>
  );
}
