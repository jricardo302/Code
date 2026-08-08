import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // Het beheeroverzicht, de betaalterugkeer en de API horen niet in de index.
      disallow: ["/beheer", "/bestellen", "/api"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
