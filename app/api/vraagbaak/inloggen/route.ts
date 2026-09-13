import { NextResponse } from "next/server";

import {
  cookieOpties,
  googleStartUrl,
  maakStaatWaarde,
  STAAT_COOKIE,
  STAAT_GELDIG_S,
  toegangIsIngesteld,
} from "@/lib/vraagbaak/toegang";

/** Stuurt de gebruiker naar Google om een werkaccount te kiezen. */
export async function GET(verzoek: Request) {
  const terug = new URL("/inloggen", verzoek.url);

  if (!toegangIsIngesteld()) {
    terug.searchParams.set("fout", "niet-ingesteld");
    return NextResponse.redirect(terug);
  }

  // De staat reist mee naar Google en komt terug; zo weten we dat het antwoord
  // bij ons verzoek hoort en niet bij een link die iemand anders stuurde.
  const staat = maakStaatWaarde();
  const antwoord = NextResponse.redirect(googleStartUrl(staat));
  antwoord.cookies.set(STAAT_COOKIE, staat, cookieOpties(STAAT_GELDIG_S));
  return antwoord;
}
