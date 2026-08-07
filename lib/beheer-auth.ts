import { createHmac, timingSafeEqual } from "node:crypto";
import { cookies } from "next/headers";

const COOKIE = "ikzieikzie_beheer";
const GELDIG_MS = 8 * 60 * 60 * 1000; // 8 uur

function wachtwoord(): string | undefined {
  const waarde = process.env.BEHEER_WACHTWOORD;
  return waarde && waarde.length > 0 ? waarde : undefined;
}

export function beheerIsIngesteld(): boolean {
  return Boolean(wachtwoord());
}

function vergelijkVeilig(a: string, b: string): boolean {
  const bufferA = Buffer.from(a, "utf8");
  const bufferB = Buffer.from(b, "utf8");
  if (bufferA.length !== bufferB.length) return false;
  return timingSafeEqual(bufferA, bufferB);
}

/** Sessietoken = vervaltijd + HMAC daarover, ondertekend met het wachtwoord. */
function onderteken(vervalt: number, geheim: string): string {
  return createHmac("sha256", geheim).update(String(vervalt)).digest("hex");
}

function maakToken(geheim: string): string {
  const vervalt = Date.now() + GELDIG_MS;
  return `${vervalt}.${onderteken(vervalt, geheim)}`;
}

function tokenIsGeldig(token: string | undefined, geheim: string): boolean {
  if (!token) return false;
  const [vervaltTekst, handtekening] = token.split(".");
  const vervalt = Number(vervaltTekst);
  if (!Number.isFinite(vervalt) || vervalt < Date.now()) return false;
  if (!handtekening) return false;
  return vergelijkVeilig(handtekening, onderteken(vervalt, geheim));
}

/** Controleert het ingevoerde wachtwoord en zet bij succes de sessiecookie. */
export async function meldAan(ingevoerd: string): Promise<boolean> {
  const geheim = wachtwoord();
  if (!geheim) return false;
  if (!vergelijkVeilig(ingevoerd, geheim)) return false;

  const cookieOpslag = await cookies();
  cookieOpslag.set(COOKIE, maakToken(geheim), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/beheer",
    maxAge: GELDIG_MS / 1000,
  });
  return true;
}

export async function meldAf(): Promise<void> {
  const cookieOpslag = await cookies();
  cookieOpslag.delete({ name: COOKIE, path: "/beheer" });
}

export async function isAangemeld(): Promise<boolean> {
  const geheim = wachtwoord();
  if (!geheim) return false;
  const cookieOpslag = await cookies();
  return tokenIsGeldig(cookieOpslag.get(COOKIE)?.value, geheim);
}
