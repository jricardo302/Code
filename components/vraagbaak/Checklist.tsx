"use client";

import { useMemo } from "react";

import { CHECKLIST } from "@/lib/vraagbaak/inwerken";
import { useOpslag } from "@/lib/vraagbaak/opslag";

type Dienstverband = "loondienst" | "zzp";

/** Buiten de component, zodat de standaardwaarde stabiel blijft. */
const NIETS_AFGEVINKT: string[] = [];

/** Ring die laat zien hoe ver je bent. Puur decoratief; het getal telt. */
function Ring({ deel, maat = 56 }: { deel: number; maat?: number }) {
  const straal = maat / 2 - 4;
  const omtrek = 2 * Math.PI * straal;
  return (
    <svg
      width={maat}
      height={maat}
      viewBox={`0 0 ${maat} ${maat}`}
      aria-hidden
      className="shrink-0 -rotate-90"
    >
      <circle
        cx={maat / 2}
        cy={maat / 2}
        r={straal}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        className="text-rj-lijn"
      />
      <circle
        cx={maat / 2}
        cy={maat / 2}
        r={straal}
        fill="none"
        stroke="currentColor"
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={omtrek}
        strokeDashoffset={omtrek * (1 - deel)}
        className="text-rj-groen transition-[stroke-dashoffset] duration-500"
      />
    </svg>
  );
}

export function Checklist() {
  const [dienstverband, zetDienstverband] = useOpslag<Dienstverband>(
    "dienstverband",
    "loondienst",
  );
  const [afgevinkt, zetAfgevinkt] = useOpslag<string[]>("onboarding", NIETS_AFGEVINKT);

  const fasen = useMemo(
    () =>
      CHECKLIST.map((fase) => ({
        ...fase,
        punten: fase.punten.filter(
          (p) => !p.alleen || p.alleen === dienstverband,
        ),
      })),
    [dienstverband],
  );

  const alle = fasen.flatMap((f) => f.punten.map((p) => p.id));
  const klaar = alle.filter((id) => afgevinkt.includes(id)).length;
  const deel = alle.length ? klaar / alle.length : 0;

  function wissel(id: string) {
    zetAfgevinkt((vorig) =>
      vorig.includes(id) ? vorig.filter((x) => x !== id) : [...vorig, id],
    );
  }

  return (
    <div>
      <div className="flex flex-col gap-5 rounded-2xl border border-rj-lijn bg-white p-5 sm:flex-row sm:items-center sm:p-6">
        <div className="flex items-center gap-4">
          <Ring deel={deel} />
          <div>
            <p className="text-2xl font-extrabold text-rj-blauw">
              {klaar} <span className="text-rj-grijs">/ {alle.length}</span>
            </p>
            <p className="text-sm text-rj-grijs">
              {deel === 1
                ? "Alles afgevinkt. Teken het schema af met je leidinggevende."
                : "punten afgerond"}
            </p>
          </div>
        </div>

        <fieldset className="sm:ml-auto">
          <legend className="mb-2 text-xs font-extrabold tracking-wide text-rj-grijs uppercase">
            Jouw dienstverband
          </legend>
          <div className="flex gap-2">
            {(["loondienst", "zzp"] as const).map((optie) => (
              <button
                key={optie}
                type="button"
                aria-pressed={dienstverband === optie}
                onClick={() => zetDienstverband(optie)}
                className={`rounded-full px-4 py-2 text-sm font-extrabold transition-colors ${
                  dienstverband === optie
                    ? "bg-rj-blauw text-white"
                    : "border border-rj-lijn bg-white text-rj-grijs hover:border-rj-blauw/40 hover:text-rj-blauw"
                }`}
              >
                {optie === "loondienst" ? "Loondienst" : "Zzp'er"}
              </button>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="mt-6 space-y-6">
        {fasen.map((fase) => {
          const faseKlaar = fase.punten.filter((p) =>
            afgevinkt.includes(p.id),
          ).length;
          return (
            <section
              key={fase.slug}
              id={fase.slug}
              className="scroll-mt-28 overflow-hidden rounded-2xl border border-rj-lijn bg-white"
            >
              <header className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-rj-lijn bg-rj-mist px-5 py-4">
                <h3 className="text-lg font-extrabold text-rj-blauw">
                  {fase.titel}
                </h3>
                <p className="text-sm text-rj-grijs">{fase.wanneer}</p>
                <p className="ml-auto text-sm font-extrabold text-rj-blauw">
                  {faseKlaar}/{fase.punten.length}
                </p>
              </header>
              <ul className="divide-y divide-rj-lijn">
                {fase.punten.map((punt) => {
                  const aan = afgevinkt.includes(punt.id);
                  return (
                    <li key={punt.id}>
                      <label className="flex cursor-pointer items-start gap-3 px-5 py-3.5 transition-colors hover:bg-rj-groen-licht/50">
                        <input
                          type="checkbox"
                          checked={aan}
                          onChange={() => wissel(punt.id)}
                          className="mt-1 h-5 w-5 shrink-0 accent-rj-groen"
                        />
                        <span className="min-w-0 flex-1">
                          <span
                            className={`block leading-relaxed ${
                              aan
                                ? "text-rj-grijs line-through decoration-rj-groen decoration-2"
                                : "text-rj-blauw"
                            }`}
                          >
                            {punt.actie}
                          </span>
                          <span className="mt-0.5 block text-xs font-extrabold tracking-wide text-rj-grijs uppercase">
                            {punt.wie}
                          </span>
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>

      {klaar > 0 && (
        <button
          type="button"
          onClick={() => zetAfgevinkt([])}
          className="mt-5 text-sm font-semibold text-rj-grijs underline underline-offset-4 hover:text-rj-blauw"
        >
          Alles weer leegmaken
        </button>
      )}
    </div>
  );
}
