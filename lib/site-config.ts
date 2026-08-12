/** The site's own absolute URL, for redirects, webhooks, e-mail links, JSON-LD. */
export function siteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : null) ??
    "http://localhost:3000";
  return url.replace(/\/$/, "");
}

export const SITE_NAME = "Lighthouse Curaçao";
export const CONTACT_EMAIL = process.env.NEXT_PUBLIC_CONTACT_MAIL ?? "stay@lighthouse-curacao.com";
export const PROPERTY_SLUG = "lighthouse";
