"use client";

import Link from "next/link";
import { useState } from "react";

import { Knop } from "@/components/ui";
import { OFFERTE_DREMPEL, STAFFELS, euro, stukprijsCenten } from "@/lib/product";

/**
 * Aantal kiezen en afrekenen.
 *
 * De prijs die je hier ziet is een weergave; de prijs die je betaalt wordt op
 * de server berekend (`/api/checkout`). Dat moet ook, want alles wat de browser
 * meestuurt kun je aanpassen.
 *
 * Is de verkoop nog niet open, dan staat hier de wachtlijst. Geen nepknop die
 * niets doet, en geen checkout die op een foutmelding uitloopt.
 */
export function Bestelpaneel({
  slug,
  verkoopOpen,
}: {
  slug: string;
  verkoopOpen: boolean;
}) {
  const [aantal, setAantal] = useState(1);
  const [bezig, setBezig] = useState(false);
  const [fout, setFout] = useState<string | null>(null);

  const stukprijs = stukprijsCenten(aantal);
  const totaal = stukprijs * aantal;
  const voordeel = (STAFFELS[0].prijsCenten - stukprijs) * aantal;

  async function afrekenen() {
    setBezig(true);
    setFout(null);
    try {
      const antwoord = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, aantal }),
      });
      const data = (await antwoord.json()) as { url?: string; fout?: string };

      if (!antwoord.ok || !data.url) {
        setFout(data.fout ?? "Er ging iets mis. Probeer het zo nog een keer.");
        setBezig(false);
        return;
      }
      window.location.href = data.url;
    } catch {
      setFout(
        "We konden de betaalpagina niet bereiken. Controleer je verbinding en probeer het opnieuw.",
      );
      setBezig(false);
    }
  }

  return (
    <div className="rounded-3xl border-2 border-paars-diep/15 bg-creme p-6 sm:p-8">
      <div className="flex items-baseline justify-between gap-4">
        <span className="font-merk text-3xl font-black text-paars-diep">
          {euro(stukprijs)}
        </span>
        <span className="text-sm text-inkt/60">per spel, incl. btw</span>
      </div>

      {verkoopOpen ? (
        <>
          <div className="mt-7">
            <label
              htmlFor="aantal"
              className="mb-2 block font-semibold text-paars-diep"
            >
              Aantal
            </label>
            <div className="flex items-center gap-3">
              <div className="flex items-center rounded-full border border-paars-diep/20">
                <button
                  type="button"
                  onClick={() => setAantal((n) => Math.max(1, n - 1))}
                  disabled={aantal <= 1}
                  aria-label="Eén minder"
                  className="px-4 py-2.5 text-lg font-black text-paars-diep transition-colors hover:text-paars disabled:opacity-35"
                >
                  −
                </button>
                <input
                  id="aantal"
                  type="number"
                  min={1}
                  max={OFFERTE_DREMPEL - 1}
                  value={aantal}
                  inputMode="numeric"
                  onChange={(e) => {
                    const waarde = Number(e.target.value);
                    if (Number.isNaN(waarde)) return;
                    setAantal(
                      Math.min(OFFERTE_DREMPEL - 1, Math.max(1, Math.trunc(waarde))),
                    );
                  }}
                  className="w-14 border-x border-paars-diep/20 bg-transparent py-2.5 text-center font-merk font-black text-paars-diep [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button
                  type="button"
                  onClick={() =>
                    setAantal((n) => Math.min(OFFERTE_DREMPEL - 1, n + 1))
                  }
                  disabled={aantal >= OFFERTE_DREMPEL - 1}
                  aria-label="Eén meer"
                  className="px-4 py-2.5 text-lg font-black text-paars-diep transition-colors hover:text-paars disabled:opacity-35"
                >
                  +
                </button>
              </div>
              <p className="text-sm text-inkt/70" aria-live="polite">
                Totaal{" "}
                <strong className="font-merk font-black text-paars-diep">
                  {euro(totaal)}
                </strong>
                {voordeel > 0 && (
                  <span className="text-paars"> · {euro(voordeel)} voordeel</span>
                )}
              </p>
            </div>
          </div>

          <Knop
            onClick={afrekenen}
            disabled={bezig}
            className="mt-6 w-full"
            type="button"
          >
            {bezig ? "Betaalpagina openen…" : "Afrekenen"}
          </Knop>

          {fout && (
            <p
              role="alert"
              className="mt-4 rounded-xl border border-red-800/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-900"
            >
              {fout}
            </p>
          )}

          <p className="mt-4 text-center text-xs text-inkt/55">
            Betalen met iDEAL, creditcard, Apple Pay of Google Pay · verzending
            naar Nederland en België · 14 dagen bedenktijd
          </p>
        </>
      ) : (
        <>
          <p className="mt-6 text-sm leading-relaxed text-inkt/80 tekst-mooi">
            De eerste oplage is nog in productie, dus je kunt nu nog niet
            afrekenen. Zet jezelf op de wachtlijst en je hoort als eerste
            wanneer de dozen er zijn — zonder verplichting en zonder betaling.
          </p>
          <Link
            href="/wachtlijst"
            className="mt-6 inline-flex w-full items-center justify-center rounded-full bg-paars-diep px-7 py-3.5 font-merk text-sm font-black tracking-wide text-creme transition-colors hover:bg-paars-zacht sm:text-base"
          >
            Zet mij op de wachtlijst
          </Link>
          <p className="mt-4 text-center text-xs text-inkt/55">
            Nu al zeker weten hoeveel je nodig hebt?{" "}
            <Link href="/teams#offerte" className="underline">
              Vraag een offerte aan
            </Link>
            .
          </p>
        </>
      )}

      <dl className="mt-7 space-y-2 border-t border-paars-diep/10 pt-5 text-sm">
        {STAFFELS.map((staffel) => (
          <div key={staffel.vanaf} className="flex justify-between gap-4">
            <dt className="text-inkt/70">{staffel.label}</dt>
            <dd className="font-semibold text-paars-diep">
              {euro(staffel.prijsCenten)} p/st
            </dd>
          </div>
        ))}
        <div className="flex justify-between gap-4">
          <dt className="text-inkt/70">Vanaf {OFFERTE_DREMPEL} spellen</dt>
          <dd className="font-semibold text-paars">
            <Link href="/teams#offerte" className="underline underline-offset-2">
              offerte
            </Link>
          </dd>
        </div>
      </dl>
    </div>
  );
}
