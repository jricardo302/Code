import { NextResponse } from "next/server";

import {
  cookieOpties,
  maakSessieToken,
  SESSIE_COOKIE,
  SESSIE_MAX_AGE,
  STAAT_COOKIE,
  staatKlopt,
  toegangIsIngesteld,
  wisselCodeIn,
} from "@/lib/vraagbaak/toegang";

/** Hier komt Google de gebruiker afleveren, met een code of met een fout. */
export async function GET(verzoek: Request) {
  const binnen = new URL(verzoek.url);
  const naarInloggen = (fout: string) => {
    const terug = new URL("/inloggen", verzoek.url);
    terug.searchParams.set("fout", fout);
    const antwoord = NextResponse.redirect(terug);
    antwoord.cookies.delete({ name: STAAT_COOKIE, path: "/" });
    return antwoord;
  };

  if (!toegangIsIngesteld()) return naarInloggen("niet-ingesteld");
  if (binnen.searchParams.get("error")) return naarInloggen("afgebroken");

  const bewaardeStaat = verzoek.headers
    .get("cookie")
    ?.split(";")
    .map((deel) => deel.trim())
    .find((deel) => deel.startsWith(`${STAAT_COOKIE}=`))
    ?.slice(STAAT_COOKIE.length + 1);

  if (!staatKlopt(bewaardeStaat, binnen.searchParams.get("state"))) {
    return naarInloggen("staat");
  }

  const code = binnen.searchParams.get("code");
  if (!code) return naarInloggen("mislukt");

  const uitkomst = await wisselCodeIn(code);
  if (uitkomst === "domein") return naarInloggen("domein");
  if (uitkomst === "mislukt") return naarInloggen("mislukt");

  const antwoord = NextResponse.redirect(new URL("/vraagbaak", verzoek.url));
  antwoord.cookies.set(
    SESSIE_COOKIE,
    maakSessieToken(uitkomst),
    cookieOpties(SESSIE_MAX_AGE),
  );
  antwoord.cookies.delete({ name: STAAT_COOKIE, path: "/" });
  return antwoord;
}
