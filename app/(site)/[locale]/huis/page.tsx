import Image from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import housePorch from "@/public/images/house-porch.jpg";
import houseInterior from "@/public/images/house-interior.jpg";
import gardenPool from "@/public/images/garden-pool.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "house" });
  return { title: t("title"), description: t("intro") };
}

export default async function HousePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("house");

  const facts = ["bedrooms", "bathrooms", "pool", "aircon", "wifi", "parking"] as const;

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="max-w-2xl text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-6 max-w-2xl text-lg leading-8 text-ink/85">{t("intro")}</p>

      <div className="tile relative mt-12 aspect-[21/9]">
        <Image
          src={housePorch}
          alt={t("title")}
          placeholder="blur"
          fill
          priority
          sizes="(min-width: 1152px) 1104px, 100vw"
          className="object-cover"
        />
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <section>
          <h2 className="text-2xl">{t("bedroomsTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("bedroomsText")}</p>
          <h2 className="mt-10 text-2xl">{t("livingTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("livingText")}</p>
        </section>
        <div className="tile relative aspect-[4/3] md:mt-2">
          <Image
            src={houseInterior}
            alt=""
            placeholder="blur"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
      </div>

      <div className="mt-16 grid gap-12 md:grid-cols-2">
        <div className="tile relative order-2 aspect-[4/3] md:order-1">
          <Image
            src={gardenPool}
            alt=""
            placeholder="blur"
            fill
            loading="lazy"
            sizes="(min-width: 768px) 50vw, 100vw"
            className="object-cover"
          />
        </div>
        <section className="order-1 md:order-2">
          <h2 className="text-2xl">{t("outsideTitle")}</h2>
          <p className="mt-3 leading-7 text-ink/80">{t("outsideText")}</p>

          <h2 className="mt-10 text-2xl">{t("factsTitle")}</h2>
          <ul className="mt-4 grid gap-2 text-ink/85">
            {facts.map((fact) => (
              <li key={fact} className="flex items-center gap-3">
                <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-terracotta" />
                {t(`facts.${fact}`)}
              </li>
            ))}
          </ul>
        </section>
      </div>
    </article>
  );
}
