"use client";

import { useOpslag } from "@/lib/vraagbaak/opslag";
import { ROLLEN } from "@/lib/vraagbaak/rollen";

/**
 * Kies je rol. De keuze blijft in deze browser staan en wordt op de
 * startpagina teruggegeven, zodat je niet elke keer opnieuw hoeft te zoeken
 * welk stuk over jou gaat.
 */
export function RolKiezer() {
  const [gekozen, zetGekozen] = useOpslag<string>("rol", "");

  return (
    <div className="rounded-2xl border border-rj-lijn bg-white p-5 sm:p-6">
      <p className="text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
        Welke rol heb jij?
      </p>
      <p className="mt-1 text-sm text-rj-grijs">
        We onthouden het in deze browser en zetten het op je startpagina.
      </p>
      <div className="mt-4 flex flex-wrap gap-2">
        {ROLLEN.map((rol) => {
          const aan = gekozen === rol.slug;
          return (
            <button
              key={rol.slug}
              type="button"
              aria-pressed={aan}
              onClick={() => zetGekozen(aan ? "" : rol.slug)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                aan
                  ? "bg-rj-blauw text-white"
                  : "border border-rj-lijn bg-white text-rj-grijs hover:border-rj-groen hover:text-rj-blauw"
              }`}
            >
              {rol.kort}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/** Groen lintje op de rol die je hebt gekozen. */
export function JouwRolMarkering({ slug }: { slug: string }) {
  const [gekozen] = useOpslag<string>("rol", "");
  if (gekozen !== slug) return null;
  return (
    <span className="inline-block rounded-full bg-rj-groen px-2.5 py-1 text-xs font-extrabold text-rj-blauw">
      Jouw rol
    </span>
  );
}
