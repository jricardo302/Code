/** Plaatshouder-gegevens. Vervang ze via .env.local of hier direct. */
export const CONTACT_MAIL =
  process.env.NEXT_PUBLIC_CONTACT_MAIL ?? "hallo@intervisie-spel.nl";

export const SITE_NAAM = "InterVISIE";

/**
 * Basis-URL voor canonical links, sitemap en Open Graph-tags. Deze waarde wordt
 * tijdens de *build* vastgelegd (robots.txt en sitemap.xml zijn statisch), dus
 * zet NEXT_PUBLIC_SITE_URL bij je host en niet pas op de server.
 * Vergeten? Op Vercel vallen we terug op het productiedomein van het project.
 */
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ??
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "http://localhost:3000");
