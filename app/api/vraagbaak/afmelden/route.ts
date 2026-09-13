import { NextResponse } from "next/server";

import { SESSIE_COOKIE } from "@/lib/vraagbaak/toegang";

/** Afmelden verandert iets, dus alleen via POST (een knop, geen link). */
export async function POST(verzoek: Request) {
  const antwoord = NextResponse.redirect(new URL("/inloggen", verzoek.url), {
    status: 303,
  });
  antwoord.cookies.delete({ name: SESSIE_COOKIE, path: "/" });
  return antwoord;
}
