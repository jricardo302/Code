import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/beheer", "/vraagbaak", "/inloggen"],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
