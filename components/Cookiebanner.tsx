"use client";

import Link from "next/link";
import Script from "next/script";
import { useCallback, useSyncExternalStore } from "react";

const SLEUTEL = "ikzieikzie.toestemming";
const GEBEURTENIS = "ikzieikzie:toestemming";
const GA_ID = process.env.NEXT_PUBLIC_GA_ID;

/** "ja" of "nee" = gekozen. "geen" = nog niet gekozen. `null` = nog niet gehydrateerd. */
type Opgeslagen = "ja" | "nee" | "geen";

function abonneer(opFrisseLezing: () => void) {
  // `storage` vangt een keuze in een ander tabblad, het eigen event de klik hier.
  window.addEventListener("storage", opFrisseLezing);
  window.addEventListener(GEBEURTENIS, opFrisseLezing);
  return () => {
    window.removeEventListener("storage", opFrisseLezing);
    window.removeEventListener(GEBEURTENIS, opFrisseLezing);
  };
}

function lees(): Opgeslagen {
  try {
    const waarde = window.localStorage.getItem(SLEUTEL);
    return waarde === "ja" || waarde === "nee" ? waarde : "geen";
  } catch {
    // Private mode of geblokkeerde opslag: dan vragen we het gewoon opnieuw.
    return "geen";
  }
}

/**
 * Toestemming vóór meten, niet erna.
 *
 * De site zet uit zichzelf geen enkele cookie en laadt geen tracker. Pas als
 * NEXT_PUBLIC_GA_ID gezet is verschijnt deze balk, en pas na een expliciete
 * "ja" wordt Google Analytics geladen. Zonder key: geen balk, want dan valt
 * er niets te vragen. Impliciete toestemming ("door verder te surfen…") is
 * geen toestemming — zie docs/juridisch-onderzoek.md.
 *
 * De keuze komt uit localStorage via `useSyncExternalStore` en niet uit een
 * effect: op de server bestaat die opslag niet, en zo krijg je één nette
 * overgang van "onbekend" naar "gelezen" in plaats van een extra render.
 *
 * Geen pop-up over het scherm, geen tweede laag, en geen donkere knop voor
 * weigeren: beide keuzes staan er even groot bij.
 */
export function Cookiebanner() {
  const keuze = useSyncExternalStore<Opgeslagen | null>(
    abonneer,
    lees,
    () => null, // op de server weten we nog niets
  );

  const kies = useCallback((nieuweKeuze: "ja" | "nee") => {
    try {
      window.localStorage.setItem(SLEUTEL, nieuweKeuze);
    } catch {
      // Niet kunnen onthouden is vervelend, maar geen reden om te crashen.
    }
    window.dispatchEvent(new Event(GEBEURTENIS));
  }, []);

  if (!GA_ID) return null;

  return (
    <>
      {keuze === "ja" && (
        <>
          <Script
            src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
            strategy="afterInteractive"
          />
          <Script id="ga4" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments)}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {keuze === "geen" && (
        <div
          role="dialog"
          aria-labelledby="cookiekop"
          className="fixed inset-x-0 bottom-0 z-50 border-t border-paars-diep/15 bg-creme/98 px-5 py-4 shadow-[0_-12px_32px_-24px_rgba(43,23,51,0.7)] backdrop-blur"
        >
          <div className="mx-auto flex max-w-5xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2
                id="cookiekop"
                className="font-merk text-sm font-black text-paars-diep"
              >
                Mogen we meten hoeveel mensen hier komen?
              </h2>
              <p className="mt-1 text-sm text-inkt/75">
                Alleen statistiek, niets advertentiegerichts. Zeg je nee, dan
                werkt de site precies hetzelfde.{" "}
                <Link
                  href="/juridisch/cookies"
                  className="font-semibold text-paars underline underline-offset-2"
                >
                  Cookiebeleid
                </Link>
              </p>
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                onClick={() => kies("nee")}
                className="rounded-full border-2 border-paars-diep/25 px-5 py-2 text-sm font-bold text-paars-diep transition-colors hover:border-paars hover:text-paars"
              >
                Nee, liever niet
              </button>
              <button
                onClick={() => kies("ja")}
                className="rounded-full bg-paars-diep px-5 py-2 text-sm font-bold text-creme transition-colors hover:bg-paars-zacht"
              >
                Prima
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
