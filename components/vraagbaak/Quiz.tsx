"use client";

import Link from "next/link";
import { useState } from "react";

import { useOpslag } from "@/lib/vraagbaak/opslag";
import { QUIZVRAGEN, quizOordeel } from "@/lib/vraagbaak/quiz";

export function Quiz() {
  const [nummer, zetNummer] = useState(0);
  const [gekozen, zetGekozen] = useState<number | null>(null);
  const [antwoorden, zetAntwoorden] = useState<number[]>([]);
  const [besteScore, zetBesteScore] = useOpslag<number>("quiz-beste", -1);

  const totaal = QUIZVRAGEN.length;
  const klaar = antwoorden.length === totaal;
  const vraag = QUIZVRAGEN[nummer];
  const goed = antwoorden.filter((a, i) => a === QUIZVRAGEN[i].goed).length;

  function kies(index: number) {
    if (gekozen !== null) return;
    zetGekozen(index);
  }

  function verder() {
    if (gekozen === null) return;
    const nieuw = [...antwoorden, gekozen];
    zetAntwoorden(nieuw);
    zetGekozen(null);
    if (nieuw.length === totaal) {
      const score = nieuw.filter((a, i) => a === QUIZVRAGEN[i].goed).length;
      if (score > besteScore) zetBesteScore(score);
    } else {
      zetNummer(nieuw.length);
    }
  }

  function opnieuw() {
    zetAntwoorden([]);
    zetGekozen(null);
    zetNummer(0);
  }

  if (klaar) {
    const gemist = QUIZVRAGEN.filter((v, i) => antwoorden[i] !== v.goed);
    return (
      <div>
        <div className="rounded-2xl bg-rj-blauw p-7 text-white sm:p-10">
          <p className="text-sm font-extrabold tracking-[0.18em] text-rj-groen uppercase">
            Je score
          </p>
          <p className="mt-3 text-5xl font-extrabold sm:text-6xl">
            {goed}
            <span className="text-white/40"> / {totaal}</span>
          </p>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-white/85">
            {quizOordeel(goed, totaal)}
          </p>
          {besteScore > goed && (
            <p className="mt-2 text-sm text-white/60">
              Je beste score op dit apparaat was {besteScore}.
            </p>
          )}
          <button
            type="button"
            onClick={opnieuw}
            className="mt-6 rounded-full bg-rj-groen px-5 py-2.5 font-extrabold text-rj-blauw transition-opacity hover:opacity-85"
          >
            Nog een keer
          </button>
        </div>

        {gemist.length > 0 && (
          <div className="mt-8">
            <h2 className="text-xl font-extrabold text-rj-blauw">
              Wat je nog even moet nalezen
            </h2>
            <ul className="mt-4 space-y-3">
              {gemist.map((v) => (
                <li
                  key={v.id}
                  className="rounded-2xl border border-rj-lijn bg-white p-5"
                >
                  <p className="font-extrabold text-rj-blauw">{v.vraag}</p>
                  <p className="mt-2 flex gap-2 leading-relaxed text-rj-grijs">
                    <span
                      aria-hidden
                      className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-rj-groen"
                    />
                    <span>
                      <span className="font-semibold text-rj-blauw">
                        {v.opties[v.goed]}
                      </span>{" "}
                      — {v.uitleg}
                    </span>
                  </p>
                  <Link
                    href={v.bron.href}
                    className="mt-3 inline-block text-sm font-extrabold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4"
                  >
                    {v.bron.tekst} →
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  }

  const juist = gekozen !== null && gekozen === vraag.goed;

  return (
    <div>
      <div className="flex items-center gap-4">
        <div
          className="h-2 flex-1 overflow-hidden rounded-full bg-rj-lijn"
          role="progressbar"
          aria-valuenow={nummer + 1}
          aria-valuemin={1}
          aria-valuemax={totaal}
          aria-label="Voortgang door de quiz"
        >
          <div
            className="h-full rounded-full bg-rj-groen transition-[width] duration-300"
            style={{ width: `${((nummer + (gekozen === null ? 0 : 1)) / totaal) * 100}%` }}
          />
        </div>
        <p className="shrink-0 text-sm font-extrabold text-rj-grijs">
          {nummer + 1} / {totaal}
        </p>
      </div>

      <div className="mt-6 rounded-2xl border border-rj-lijn bg-white p-6 sm:p-8">
        <h2 className="text-xl font-extrabold text-balance text-rj-blauw sm:text-2xl">
          {vraag.vraag}
        </h2>

        <ul className="mt-6 space-y-2.5">
          {vraag.opties.map((optie, i) => {
            const dezeGekozen = gekozen === i;
            const dezeGoed = i === vraag.goed;
            const toonUitslag = gekozen !== null;

            let stijl =
              "border-rj-lijn bg-white hover:border-rj-groen hover:bg-rj-groen-licht/40";
            if (toonUitslag && dezeGoed)
              stijl = "border-rj-groen bg-rj-groen-licht";
            else if (toonUitslag && dezeGekozen)
              stijl = "border-rj-blauw bg-rj-blauw-licht";
            else if (toonUitslag) stijl = "border-rj-lijn bg-white opacity-60";

            return (
              <li key={optie}>
                <button
                  type="button"
                  onClick={() => kies(i)}
                  disabled={toonUitslag}
                  className={`flex w-full items-center gap-3 rounded-xl border-2 px-4 py-3.5 text-left transition-colors disabled:cursor-default ${stijl}`}
                >
                  <span
                    aria-hidden
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 border-current text-xs font-extrabold text-rj-blauw"
                  >
                    {"ABCD"[i]}
                  </span>
                  <span className="font-semibold text-rj-blauw">{optie}</span>
                  {toonUitslag && dezeGoed && (
                    <span
                      aria-label="Juist antwoord"
                      className="ml-auto shrink-0 font-extrabold text-rj-blauw"
                    >
                      ✓
                    </span>
                  )}
                </button>
              </li>
            );
          })}
        </ul>

        {gekozen !== null && (
          <div className="mt-6 border-t border-rj-lijn pt-6">
            <p className="font-extrabold text-rj-blauw">
              {juist ? "Klopt." : "Net niet."}
            </p>
            <p className="mt-2 leading-relaxed text-rj-grijs">{vraag.uitleg}</p>
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={verder}
                className="rounded-full bg-rj-blauw px-5 py-2.5 font-extrabold text-white transition-colors hover:bg-rj-blauw/85"
              >
                {nummer + 1 === totaal ? "Naar je score" : "Volgende vraag"}
              </button>
              <Link
                href={vraag.bron.href}
                className="text-sm font-extrabold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4"
              >
                {vraag.bron.tekst} →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
