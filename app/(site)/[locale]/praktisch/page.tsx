import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "practical" });
  return { title: t("title"), description: t("intro") };
}

const SECTIONS = ["checkin", "travel", "health", "houseRules", "cancellation"] as const;

export default async function PracticalPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("practical");

  return (
    <article className="mx-auto max-w-3xl px-4 py-16 md:px-6">
      <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-6 text-lg leading-8 text-ink/85">{t("intro")}</p>

      <dl className="mt-12 space-y-10">
        {SECTIONS.map((section) => (
          <div key={section}>
            <dt className="font-[family-name:var(--font-display)] text-2xl text-navy">
              {t(`${section}Title`)}
            </dt>
            <dd className="mt-3 leading-7 text-ink/80">{t(`${section}Text`)}</dd>
          </div>
        ))}
      </dl>
    </article>
  );
}
