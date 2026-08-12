import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { CONTACT_EMAIL } from "@/lib/site-config";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "contact" });
  return { title: t("title"), description: t("intro") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("contact");
  const tf = await getTranslations("footer");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-8 text-ink/85">{t("intro")}</p>

      <div className="mt-12 space-y-8">
        <div>
          <h2 className="text-xl">{t("emailLabel")}</h2>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-2 inline-block text-lg font-medium text-turquoise-deep hover:underline"
          >
            {CONTACT_EMAIL}
          </a>
          <p className="mt-1 text-sm text-ink/60">{t("responseTime")}</p>
          <p className="mt-1 text-sm text-ink/60">{t("bookingRefHint")}</p>
        </div>
        <div>
          <h2 className="text-xl">{t("addressTitle")}</h2>
          <p className="mt-2 leading-7 text-ink/80">{tf("address")}</p>
        </div>
      </div>
    </article>
  );
}
