"use client";

import { useState } from "react";

import { VERLENGROUTES } from "@/lib/vraagbaak/processen";

import { Label } from "./ui";

/**
 * De route voor een verlenging hangt af van de verwijzer, en dat is precies
 * waar het misgaat. Eén vraag, vier antwoorden, en daarna staat de termijn en
 * de route erbij.
 */
export function Verlengwijzer() {
  const [gekozen, zetGekozen] = useState<string | null>(null);
  const route = VERLENGROUTES.find((r) => r.slug === gekozen);

  return (
    <div className="overflow-hidden rounded-2xl border border-rj-lijn bg-white">
      <div className="border-b border-rj-lijn bg-rj-mist px-5 py-5 sm:px-6">
        <p className="font-extrabold text-rj-blauw">
          Wie heeft de beschikking afgegeven?
        </p>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {VERLENGROUTES.map((r) => {
            const aan = gekozen === r.slug;
            return (
              <button
                key={r.slug}
                type="button"
                aria-pressed={aan}
                onClick={() => zetGekozen(aan ? null : r.slug)}
                className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                  aan
                    ? "border-rj-blauw bg-rj-blauw text-white"
                    : "border-rj-lijn bg-white hover:border-rj-groen"
                }`}
              >
                <span
                  className={`block font-extrabold ${
                    aan ? "text-white" : "text-rj-blauw"
                  }`}
                >
                  {r.verwijzer}
                </span>
                <span
                  className={`mt-0.5 block text-sm ${
                    aan ? "text-white/75" : "text-rj-grijs"
                  }`}
                >
                  {r.wanneerKiesJeDit}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="px-5 py-6 sm:px-6">
        {route ? (
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-xl font-extrabold text-rj-blauw">
                {route.termijn}
              </p>
              <Label toon={route.hardeEis ? "groen" : "stil"}>
                {route.hardeEis ? "Vastgelegde eis" : "Interne werknorm"}
              </Label>
            </div>
            <p className="mt-3 leading-relaxed text-rj-grijs">{route.hoe}</p>
            {!route.hardeEis && (
              <p className="mt-4 border-t border-rj-lijn pt-4 text-sm text-rj-grijs">
                Alleen de JGZ-termijn van twee maanden is vastgelegd. Deze
                termijn is een interne werknorm en moet nog met de verwijzer
                bevestigd worden — stem hem dus af met de zorgcoördinator.
              </p>
            )}
          </div>
        ) : (
          <p className="text-rj-grijs">
            Kies hierboven de verwijzer, dan staat de termijn en de route
            eronder.
          </p>
        )}
      </div>
    </div>
  );
}
