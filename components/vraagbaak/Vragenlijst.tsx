"use client";

import Link from "next/link";
import { useState } from "react";

import { VRAAG_CATEGORIEEN, VRAGEN } from "@/lib/vraagbaak/vragen";

/**
 * Alle antwoorden staan open. Dat is bewust: de lijst is kort genoeg, en zo
 * werkt zoeken in de browser (⌘F) én een diepe link naar één vraag.
 */
export function Vragenlijst() {
  const [categorie, zetCategorie] = useState<string>("alles");

  const zichtbaar =
    categorie === "alles"
      ? VRAGEN
      : VRAGEN.filter((v) => v.categorie === categorie);

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {["alles", ...VRAAG_CATEGORIEEN].map((c) => {
          const aan = categorie === c;
          return (
            <button
              key={c}
              type="button"
              aria-pressed={aan}
              onClick={() => zetCategorie(c)}
              className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                aan
                  ? "bg-rj-blauw text-white"
                  : "border border-rj-lijn bg-white text-rj-grijs hover:border-rj-groen hover:text-rj-blauw"
              }`}
            >
              {c === "alles" ? "Alles" : c}
            </button>
          );
        })}
      </div>

      <ul className="mt-6 space-y-3">
        {zichtbaar.map((v) => (
          <li
            key={v.id}
            id={v.id}
            className="scroll-mt-28 rounded-2xl border border-rj-lijn bg-white p-5 sm:p-6"
          >
            <p className="text-[0.65rem] font-extrabold tracking-[0.18em] text-rj-grijs uppercase">
              {v.categorie}
            </p>
            <h3 className="mt-1.5 font-extrabold text-rj-blauw">{v.vraag}</h3>
            <p className="mt-2 leading-relaxed text-rj-grijs">{v.antwoord}</p>
            {v.naar && (
              <Link
                href={v.naar.href}
                className="mt-3 inline-block text-sm font-extrabold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4"
              >
                {v.naar.tekst} →
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}
