import Image, { type StaticImageData } from "next/image";
import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import hero from "@/public/images/hero.jpg";
import housePorch from "@/public/images/house-porch.jpg";
import houseInterior from "@/public/images/house-interior.jpg";
import gardenPool from "@/public/images/garden-pool.jpg";
import gardenWall from "@/public/images/garden-wall.jpg";
import islandBeach from "@/public/images/island-beach.jpg";
import islandWillemstad from "@/public/images/island-willemstad.jpg";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "gallery" });
  return { title: t("title"), description: t("intro") };
}

const PHOTOS: { src: StaticImageData; alt: string; wide?: boolean }[] = [
  { src: hero, alt: "Het huis en het zwembad in de avond", wide: true },
  { src: housePorch, alt: "De voorzijde met porch" },
  { src: gardenPool, alt: "Het zwembad in de ochtend" },
  { src: houseInterior, alt: "De woonkamer" },
  { src: gardenWall, alt: "De ommuurde tuin met bougainville" },
  { src: islandBeach, alt: "Strand aan de westkust", wide: true },
  { src: islandWillemstad, alt: "De Handelskade in Willemstad" },
];

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("gallery");

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 md:px-6">
      <h1 className="text-4xl md:text-5xl">{t("title")}</h1>
      <p className="mt-4 max-w-2xl text-lg leading-8 text-ink/85">{t("intro")}</p>

      <ul className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2">
        {PHOTOS.map((photo, i) => (
          <li key={i} className={photo.wide ? "sm:col-span-2" : undefined}>
            <div className={`tile relative ${photo.wide ? "aspect-[21/9]" : "aspect-[4/3]"}`}>
              <Image
                src={photo.src}
                alt={photo.alt}
                placeholder="blur"
                fill
                loading={i === 0 ? "eager" : "lazy"}
                priority={i === 0}
                sizes={photo.wide ? "(min-width: 1152px) 1104px, 100vw" : "(min-width: 640px) 50vw, 100vw"}
                className="object-cover"
              />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
