/**
 * Locale routing: Dutch is the default and lives at the bare path; English
 * under /en. Adding Papiamentu later is one entry in `locales` plus a
 * messages/pap.json — the pathnames below already carry a slot for it.
 */

import { defineRouting } from "next-intl/routing";

export const routing = defineRouting({
  locales: ["nl", "en"],
  defaultLocale: "nl",
  localePrefix: "as-needed",
  pathnames: {
    "/": "/",
    "/huis": { nl: "/huis", en: "/the-house" },
    "/galerij": { nl: "/galerij", en: "/gallery" },
    "/eiland": { nl: "/eiland", en: "/the-island" },
    "/tarieven": { nl: "/tarieven", en: "/rates" },
    "/boeken": { nl: "/boeken", en: "/book" },
    "/boeken/status/[bookingId]": {
      nl: "/boeken/status/[bookingId]",
      en: "/book/status/[bookingId]",
    },
    "/praktisch": { nl: "/praktisch", en: "/practical" },
    "/contact": "/contact",
  },
});

export type AppLocale = (typeof routing.locales)[number];
export type AppPathname = keyof typeof routing.pathnames;
