import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import islandBeach from "@/public/images/island-beach.jpg";
import islandWillemstad from "@/public/images/island-willemstad.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "island" });
  return { title: t("title"), description: t("intro") };
}

export default async function IslandPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("island");

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="max-w-2xl text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/85">{t("intro")}</p>

      <div className="tile relative mt-12 aspect-[21/9]">
        <Image
          src={islandBeach}
          alt={t("beachesTitle")}
          placeholder="blur"
          fill
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-16 grid gap-x-12 gap-y-10 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">{t("beachesTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("beachesText")}</p>
        </section>
        <section>
          <h2 className="text-2xl">{t("cityTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("cityText")}</p>
        </section>
        <section>
          <h2 className="text-2xl">{t("foodTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("foodText")}</p>
        </section>
        <section>
          <h2 className="text-2xl">{t("divingTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("divingText")}</p>
        </section>
      </div>

      <div className="tile relative mt-16 aspect-[21/9]">
        <Image
          src={islandWillemstad}
          alt={t("cityTitle")}
          placeholder="blur"
          fill
          loading="lazy"
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover"
        />
      </div>
    </article>
  );
}
