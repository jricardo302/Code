"use client";

import { useMemo, useState } from "react";

import { BEGRIPPEN } from "@/lib/vraagbaak/begrippen";

function normaliseer(s: string) {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");
}

export function Begrippenlijst() {
  const [filter, zetFilter] = useState("");
  const [alleenEersteWeek, zetAlleenEersteWeek] = useState(false);

  const zichtbaar = useMemo(() => {
    const q = normaliseer(filter.trim());
    return BEGRIPPEN.filter((b) => {
      if (alleenEersteWeek && !b.eersteWeek) return false;
      if (!q) return true;
      return normaliseer(`${b.term} ${b.uitleg}`).includes(q);
    });
  }, [filter, alleenEersteWeek]);

  return (
    <div>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
        <label className="flex-1">
          <span className="text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
            Zoek een begrip
          </span>
          <input
            value={filter}
            onChange={(e) => zetFilter(e.target.value)}
            type="search"
            placeholder="Bijvoorbeeld: JW315, meldcode, perceel"
            className="mt-2 w-full rounded-xl border-2 border-rj-lijn bg-white px-4 py-3 text-rj-blauw outline-none transition-colors placeholder:text-rj-grijs/60 focus:border-rj-groen"
          />
        </label>
        <button
          type="button"
          aria-pressed={alleenEersteWeek}
          onClick={() => zetAlleenEersteWeek((v) => !v)}
          className={`shrink-0 rounded-xl px-4 py-3 text-sm font-extrabold transition-colors ${
            alleenEersteWeek
              ? "bg-rj-blauw text-white"
              : "border-2 border-rj-lijn bg-white text-rj-grijs hover:border-rj-groen hover:text-rj-blauw"
          }`}
        >
          Alleen je eerste week
        </button>
      </div>

      <p className="mt-3 text-sm text-rj-grijs">
        {zichtbaar.length} van {BEGRIPPEN.length} begrippen
      </p>

      {zichtbaar.length === 0 ? (
        <p className="mt-4 rounded-2xl border border-rj-lijn bg-white p-6 text-rj-grijs">
          Niets gevonden. Staat het begrip er niet bij? Meld het bij de directie,
          dan komt het erin.
        </p>
      ) : (
        <dl className="mt-4 divide-y divide-rj-lijn overflow-hidden rounded-2xl border border-rj-lijn bg-white">
          {zichtbaar.map((b) => (
            <div
              key={b.term}
              className="grid gap-1 px-5 py-4 sm:grid-cols-[12rem_1fr] sm:gap-5 sm:px-6"
            >
              <dt className="flex items-start gap-2 font-extrabold text-rj-blauw">
                {b.term}
                {b.eersteWeek && (
                  <span
                    title="Kom je in je eerste week al tegen"
                    aria-label="Kom je in je eerste week al tegen"
                    className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rj-groen"
                  />
                )}
              </dt>
              <dd className="leading-relaxed text-rj-grijs">{b.uitleg}</dd>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}
