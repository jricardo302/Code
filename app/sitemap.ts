import type { MetadataRoute } from "next";

import { ARTIKELEN } from "@/content/artikelen";
import { EDITIES } from "@/lib/product";
import { SITE_URL } from "@/lib/site";

/**
 * De sitemap wordt tijdens de build vastgelegd. Zet NEXT_PUBLIC_SITE_URL dus
 * bij je host en niet pas op de draaiende server, anders staat er localhost in.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const vast: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
    { url: `${SITE_URL}/hoe-het-werkt`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${SITE_URL}/spelregels`, changeFrequency: "monthly", priority: 0.7 },
    { url: `${SITE_URL}/teams`, changeFrequency: "monthly", priority: 0.9 },
    {
      url: `${SITE_URL}/veelgestelde-vragen`,
      changeFrequency: "monthly",
      priority: 0.7,
    },
    { url: `${SITE_URL}/blog`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/over`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: "yearly", priority: 0.5 },
    { url: `${SITE_URL}/wachtlijst`, changeFrequency: "monthly", priority: 0.6 },
  ];

  const producten: MetadataRoute.Sitemap = EDITIES.map((editie) => ({
    url: `${SITE_URL}/${editie.slug}`,
    changeFrequency: "weekly",
    priority: 0.95,
  }));

  const artikelen: MetadataRoute.Sitemap = ARTIKELEN.map((artikel) => ({
    url: `${SITE_URL}/blog/${artikel.slug}`,
    lastModified: new Date(artikel.datum),
    changeFrequency: "yearly",
    priority: 0.6,
  }));

  const juridisch: MetadataRoute.Sitemap = [
    "algemene-voorwaarden",
    "privacy",
    "cookies",
    "verzending",
    "retourneren",
    "disclaimer",
  ].map((pad) => ({
    url: `${SITE_URL}/juridisch/${pad}`,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

  return [...vast, ...producten, ...artikelen, ...juridisch];
}
