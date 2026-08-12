import Image from "next/image";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL, SITE_NAME, siteUrl } from "@/lib/site-config";
import hero from "@/public/images/hero.jpg";
import housePorch from "@/public/images/house-porch.jpg";
import islandBeach from "@/public/images/island-beach.jpg";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("home");
  const tc = await getTranslations("common");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LodgingBusiness",
    name: SITE_NAME,
    description: tc("tagline"),
    url: siteUrl(),
    email: CONTACT_EMAIL,
    image: `${siteUrl()}/images/og.jpg`,
    address: {
      "@type": "PostalAddress",
      streetAddress: "Kaya Platio 18, Katoentuin",
      addressLocality: "Willemstad",
      addressCountry: "CW",
    },
    numberOfRooms: 3,
    petsAllowed: false,
    checkinTime: "15:00",
    checkoutTime: "11:00",
    amenityFeature: [
      { "@type": "LocationFeatureSpecification", name: "Private pool", value: true },
      { "@type": "LocationFeatureSpecification", name: "Air conditioning", value: true },
      { "@type": "LocationFeatureSpecification", name: "Wifi", value: true },
      { "@type": "LocationFeatureSpecification", name: "Free parking", value: true },
    ],
    makesOffer: {
      "@type": "Offer",
      priceCurrency: "EUR",
      price: "189.00",
      priceSpecification: {
        "@type": "UnitPriceSpecification",
        price: "189.00",
        priceCurrency: "EUR",
        unitText: "night",
      },
      availability: "https://schema.org/InStock",
      url: `${siteUrl()}/${locale === "nl" ? "boeken" : "en/book"}`,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />

      {/* Hero: full-bleed, the horizon motif lives in the image + glow line. */}
      <section className="relative isolate min-h-[82svh] overflow-hidden bg-navy">
        <Image
          src={hero}
          alt=""
          priority
          fill
          placeholder="blur"
          sizes="100vw"
          className="object-cover opacity-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-navy-deep/85 via-navy-deep/30 to-transparent" />
        <div className="relative mx-auto flex min-h-[82svh] max-w-6xl flex-col justify-end px-4 pb-20 pt-32 md:px-6">
          <h1 className="max-w-2xl text-4xl leading-tight text-sand md:text-6xl">
            {t("heroTitle")}
          </h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-sand/85">{t("heroSubtitle")}</p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link href="/boeken" className="btn-primary">
              {tc("bookNow")}
            </Link>
            <Link
              href="/tarieven"
              className="btn-secondary border-sand text-sand hover:border-turquoise hover:text-turquoise"
            >
              {tc("checkAvailability")}
            </Link>
          </div>
        </div>
        <div className="horizon-line absolute inset-x-0 bottom-0" aria-hidden="true" />
      </section>

      {/* USPs on sand. */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 py-20 md:grid-cols-3 md:px-6">
        {(["usp1", "usp2", "usp3"] as const).map((usp) => (
          <div key={usp}>
            <h2 className="text-xl">{t(`${usp}Title`)}</h2>
            <p className="mt-2 leading-7 text-ink/80">{t(`${usp}Text`)}</p>
          </div>
        ))}
      </section>

      {/* Two teasers with image tiles. */}
      <section className="mx-auto grid max-w-6xl gap-8 px-4 pb-24 md:grid-cols-2 md:px-6">
        <Link href="/huis" className="group">
          <div className="tile relative aspect-[4/3]">
            <Image
              src={housePorch}
              alt=""
              placeholder="blur"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <h2 className="mt-4 text-2xl group-hover:text-turquoise-deep">{t("houseTeaser")}</h2>
          <p className="mt-1 leading-7 text-ink/80">{t("houseTeaserText")}</p>
          <span className="mt-2 inline-block font-medium text-terracotta-deep">{t("readMore")} →</span>
        </Link>
        <Link href="/eiland" className="group">
          <div className="tile relative aspect-[4/3]">
            <Image
              src={islandBeach}
              alt=""
              placeholder="blur"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          </div>
          <h2 className="mt-4 text-2xl group-hover:text-turquoise-deep">{t("islandTeaser")}</h2>
          <p className="mt-1 leading-7 text-ink/80">{t("islandTeaserText")}</p>
          <span className="mt-2 inline-block font-medium text-terracotta-deep">{t("readMore")} →</span>
        </Link>
      </section>
    </>
  );
}
