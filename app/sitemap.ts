import type { MetadataRoute } from "next";
import { routing } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { siteUrl } from "@/lib/site-config";

const PAGES = ["/", "/huis", "/galerij", "/eiland", "/tarieven", "/boeken", "/praktisch", "/contact"] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  return PAGES.map((pathname) => ({
    url: `${base}${getPathname({ locale: "nl", href: pathname })}`,
    changeFrequency: pathname === "/tarieven" || pathname === "/boeken" ? "daily" : "monthly",
    priority: pathname === "/" ? 1 : pathname === "/boeken" ? 0.9 : 0.7,
    alternates: {
      languages: Object.fromEntries(
        routing.locales.map((locale) => [
          locale,
          `${base}${getPathname({ locale, href: pathname })}`,
        ]),
      ),
    },
  }));
}
