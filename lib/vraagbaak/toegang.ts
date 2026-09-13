import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";
import { cache } from "react";

import { SITE_URL } from "@/lib/site";

/**
 * Toegang tot de vraagbaak loopt via Google Workspace: alleen wie inlogt met
 * een mailadres op een toegestaan domein komt binnen. Er staat geen wachtwoord
 * in de app en er wordt niets van de gebruiker opgeslagen buiten de cookie —
 * die bevat alleen naam, mailadres en een vervaltijd, ondertekend met HMAC.
 *
 * Dezelfde opzet als `lib/beheer-auth.ts`, maar met Google ervoor in plaats van
 * een gedeeld wachtwoord, zodat je iemand per persoon de toegang kunt ontnemen
 * door het account in Workspace te blokkeren.
 */

export const SESSIE_COOKIE = "vraagbaak_sessie";
export const STAAT_COOKIE = "vraagbaak_staat";

/** Eén werkdag: 's ochtends inloggen is genoeg voor de hele dag. */
const GELDIG_MS = 12 * 60 * 60 * 1000;
/** De heenreis naar Google mag best even duren, maar niet een uur. */
export const STAAT_GELDIG_S = 10 * 60;

/** Het pad waar Google je na het inloggen terugstuurt. */
export const TERUG_PAD = "/api/vraagbaak/terug";

export type Gebruiker = { email: string; naam: string };

function instelling(naam: string): string | undefined {
  const waarde = process.env[naam];
  return waarde && waarde.length > 0 ? waarde : undefined;
}

/** Zonder client-id en -secret blijft de vraagbaak voor iedereen dicht. */
export function toegangIsIngesteld(): boolean {
  return Boolean(
    instelling("GOOGLE_CLIENT_ID") && instelling("GOOGLE_CLIENT_SECRET"),
  );
}

/** Mailadressen op deze domeinen mogen binnen. Meerdere: komma's ertussen. */
export function toegestaneDomeinen(): string[] {
  return (instelling("VRAAGBAAK_DOMEIN") ?? "ricardojeugdhulp.nl")
    .split(",")
    .map((domein) => domein.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Sleutel waarmee de sessiecookie wordt ondertekend. Staat er geen eigen
 * geheim ingesteld, dan leiden we er één af uit het client-secret; dat scheelt
 * een instelling en de afgeleide sleutel is niet het secret zelf.
 */
function sessieGeheim(): string {
  const eigen = instelling("VRAAGBAAK_SESSIE_GEHEIM");
  if (eigen) return eigen;
  const clientSecret = instelling("GOOGLE_CLIENT_SECRET");
  if (!clientSecret) {
    throw new Error("Vraagbaak: GOOGLE_CLIENT_SECRET ontbreekt.");
  }
  return createHmac("sha256", clientSecret)
    .update("vraagbaak-sessie-v1")
    .digest("hex");
}

/** Moet letterlijk gelijk zijn aan wat in Google Cloud staat geregistreerd. */
export function terugAdres(): string {
  return new URL(TERUG_PAD, SITE_URL).toString();
}

export function cookieOpties(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  } as const;
}

function onderteken(data: string): string {
  return createHmac("sha256", sessieGeheim()).update(data).digest("base64url");
}

function gelijk(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

export function maakStaatWaarde(): string {
  return randomBytes(24).toString("base64url");
}

export function staatKlopt(
  bewaard: string | undefined,
  ontvangen: string | null,
): boolean {
  if (!bewaard || !ontvangen) return false;
  return gelijk(bewaard, ontvangen);
}

export function maakSessieToken(gebruiker: Gebruiker): string {
  const lading = Buffer.from(
    JSON.stringify({ ...gebruiker, vervalt: Date.now() + GELDIG_MS }),
  ).toString("base64url");
  return `${lading}.${onderteken(lading)}`;
}

export const SESSIE_MAX_AGE = GELDIG_MS / 1000;

function leesSessieToken(token: string | undefined): Gebruiker | null {
  if (!token) return null;
  const [lading, handtekening] = token.split(".");
  if (!lading || !handtekening) return null;
  if (!gelijk(handtekening, onderteken(lading))) return null;

  try {
    const inhoud: unknown = JSON.parse(
      Buffer.from(lading, "base64url").toString("utf8"),
    );
    if (typeof inhoud !== "object" || inhoud === null) return null;
    const { email, naam, vervalt } = inhoud as Record<string, unknown>;
    if (typeof email !== "string" || typeof vervalt !== "number") return null;
    if (vervalt < Date.now()) return null;
    return { email, naam: typeof naam === "string" && naam ? naam : email };
  } catch {
    return null;
  }
}

/**
 * Wie is er ingelogd? `cache` zorgt dat de cookie per render één keer wordt
 * gelezen, ook als meerdere componenten het vragen.
 */
export const huidigeGebruiker = cache(async (): Promise<Gebruiker | null> => {
  if (!toegangIsIngesteld()) return null;
  const cookieOpslag = await cookies();
  return leesSessieToken(cookieOpslag.get(SESSIE_COOKIE)?.value);
});

/** De pagina van Google waar de gebruiker zijn account kiest. */
export function googleStartUrl(staat: string): string {
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", instelling("GOOGLE_CLIENT_ID") ?? "");
  url.searchParams.set("redirect_uri", terugAdres());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", staat);
  url.searchParams.set("prompt", "select_account");

  // Eén domein? Dan laat Google meteen de juiste werkaccounts zien.
  const domeinen = toegestaneDomeinen();
  if (domeinen.length === 1) url.searchParams.set("hd", domeinen[0]);

  return url.toString();
}

export type Weigering = "domein" | "mislukt";

/**
 * Wisselt de code van Google in voor een id-token en leest daar de gebruiker
 * uit. De handtekening van het token hoeven we niet zelf na te rekenen: het
 * komt rechtstreeks van Google over TLS, wat Google zelf als afdoende
 * beschrijft. De inhoud controleren we wel — publiek, uitgiftedatum en domein.
 */
export async function wisselCodeIn(
  code: string,
): Promise<Gebruiker | Weigering> {
  let data: unknown;
  try {
    const antwoord = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "content-type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: instelling("GOOGLE_CLIENT_ID") ?? "",
        client_secret: instelling("GOOGLE_CLIENT_SECRET") ?? "",
        redirect_uri: terugAdres(),
        grant_type: "authorization_code",
      }),
      cache: "no-store",
    });
    if (!antwoord.ok) return "mislukt";
    data = await antwoord.json();
  } catch {
    return "mislukt";
  }

  const idToken = (data as { id_token?: unknown } | null)?.id_token;
  if (typeof idToken !== "string") return "mislukt";

  const delen = idToken.split(".");
  if (delen.length !== 3) return "mislukt";

  let claims: Record<string, unknown>;
  try {
    claims = JSON.parse(Buffer.from(delen[1], "base64url").toString("utf8"));
  } catch {
    return "mislukt";
  }

  if (claims.aud !== instelling("GOOGLE_CLIENT_ID")) return "mislukt";
  if (
    claims.iss !== "accounts.google.com" &&
    claims.iss !== "https://accounts.google.com"
  ) {
    return "mislukt";
  }
  if (typeof claims.exp !== "number" || claims.exp * 1000 < Date.now()) {
    return "mislukt";
  }
  if (claims.email_verified !== true) return "mislukt";

  const email =
    typeof claims.email === "string" ? claims.email.toLowerCase() : "";
  const domein = email.split("@")[1] ?? "";
  if (!toegestaneDomeinen().includes(domein)) return "domein";

  const naam =
    typeof claims.name === "string" && claims.name ? claims.name : email;
  return { email, naam };
}
