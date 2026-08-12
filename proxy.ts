/**
 * Locale negotiation (Next 16 calls this proxy; it is middleware). API
 * routes, admin, the fake checkout and static assets are excluded — only
 * guest-facing pages carry a locale.
 */

import createProxy from "next-intl/middleware";
import { routing } from "./i18n/routing";

export default createProxy(routing);

export const config = {
  matcher: "/((?!api|admin|betalen|_next|_vercel|.*\\..*).*)",
};
