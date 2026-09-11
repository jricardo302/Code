"use client";

import { useMemo, useState } from "react";

import { SITUATIES } from "@/lib/vraagbaak/escalatie";

import { Stappen } from "./ui";

function normaliseer(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

/**
 * De situaties staan allemaal in de pagina — het filter verbergt alleen wat
 * niet past. Zo blijven diepe links als #datalek werken en kun je bij een
 * leeg filter gewoon alles doorlezen.
 */
export function SituatieLijst() {
  const [filter, zetFilter] = useState("");

  const zichtbaar = useMemo(() => {
    const q = normaliseer(filter.trim());
    if (!q) return SITUATIES;
    return SITUATIES.filter((s) =>
      normaliseer(
        [s.titel, s.vraag, ...s.trefwoorden, ...s.stappen].join(" "),
      ).includes(q),
    );
  }, [filter]);

  return (
    <div>
      <label className="block">
        <span className="text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
          Waar gaat het over?
        </span>
        <input
          value={filter}
          onChange={(e) => zetFilter(e.target.value)}
          type="search"
          placeholder="Bijvoorbeeld: datalek, klacht, niet opgedaagd"
          className="mt-2 w-full rounded-xl border-2 border-rj-lijn bg-white px-4 py-3 text-rj-blauw outline-none transition-colors placeholder:text-rj-grijs/60 focus:border-rj-groen"
        />
      </label>

      {zichtbaar.length === 0 ? (
        <p className="mt-6 rounded-2xl border border-rj-lijn bg-white p-6 leading-relaxed text-rj-grijs">
          Geen situatie gevonden voor “{filter}”. Staat jouw situatie er niet
          bij? Bel dan de directie op 085 250 2096. Bij twijfel opschalen — niet
          melden is nooit de veilige keuze.
        </p>
      ) : (
        <ul className="mt-6 space-y-4">
          {zichtbaar.map((situatie) => (
            <li
              key={situatie.slug}
              id={situatie.slug}
              className="scroll-mt-28 rounded-2xl border border-rj-lijn bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg font-extrabold text-rj-blauw">
                {situatie.titel}
              </h3>
              <p className="mt-1 text-sm text-rj-grijs">{situatie.vraag}</p>

              {situatie.eersteZet && (
                <p className="mt-4 rounded-xl border-l-4 border-rj-groen bg-rj-groen-licht px-4 py-3 font-extrabold text-rj-blauw">
                  {situatie.eersteZet}
                </p>
              )}

              <div className="mt-5">
                <Stappen stappen={situatie.stappen} />
              </div>

              {situatie.verder && (
                <p className="mt-4 border-t border-rj-lijn pt-4 text-sm text-rj-grijs">
                  {situatie.verder}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
