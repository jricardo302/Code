import type { Metadata } from "next";
import Link from "next/link";
import type { ReactNode } from "react";

import { Woordmerk } from "@/components/Merk";
import { beheerIsIngesteld, isAangemeld } from "@/lib/beheer-auth";
import { SOORTEN, SOORT_LABELS, store, type Inzending, type Soort } from "@/lib/store";

import { logUit } from "./actions";
import { LoginFormulier } from "./LoginFormulier";

export const metadata: Metadata = {
  title: "Beheer",
  robots: { index: false, follow: false },
};

// Nooit prerenderen: deze pagina hangt volledig aan de sessiecookie en aan
// env-variabelen die tijdens de build nog niet gezet hoeven te zijn.
export const dynamic = "force-dynamic";

function Omhulsel({ children }: { children: ReactNode }) {
  return (
    <main className="px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <Link href="/">
          <Woordmerk className="text-lg" />
        </Link>
        {children}
      </div>
    </main>
  );
}

const datumOpmaak = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

/** Een waarde uit `gegevens` leesbaar maken zonder te weten wat erin zit. */
function toon(waarde: unknown): string {
  if (waarde == null || waarde === "") return "—";
  if (Array.isArray(waarde)) return waarde.length ? waarde.join(", ") : "—";
  if (typeof waarde === "boolean") return waarde ? "ja" : "nee";
  if (typeof waarde === "object") return JSON.stringify(waarde);
  return String(waarde);
}

export default async function BeheerPagina() {
  if (!beheerIsIngesteld()) {
    return (
      <Omhulsel>
        <h1 className="mt-8 text-3xl">Beheer</h1>
        <div className="mt-6 rounded-2xl border border-paars/40 bg-kraft/60 p-6 text-inkt/85">
          <p className="font-semibold">
            Dit overzicht is nog niet beveiligd, dus het blijft dicht.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Zet{" "}
            <code className="rounded bg-paars-diep/10 px-1.5 py-0.5">
              BEHEER_WACHTWOORD
            </code>{" "}
            in je{" "}
            <code className="rounded bg-paars-diep/10 px-1.5 py-0.5">
              .env.local
            </code>{" "}
            (of in de omgevingsvariabelen van je host) en start de server
            opnieuw op. Zie README.md.
          </p>
        </div>
      </Omhulsel>
    );
  }

  if (!(await isAangemeld())) {
    return (
      <Omhulsel>
        <h1 className="mt-8 text-3xl">Beheer</h1>
        <p className="mt-3 mb-7 text-inkt/70">
          Even bewijzen dat je erbij hoort.
        </p>
        <div className="max-w-md">
          <LoginFormulier />
        </div>
      </Omhulsel>
    );
  }

  const alles = await (await store()).lijst();
  const perSoort = new Map<Soort, Inzending[]>(
    SOORTEN.map((soort) => [
      soort,
      alles.filter((inzending) => inzending.soort === soort),
    ]),
  );

  return (
    <Omhulsel>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl">Inzendingen</h1>
          <p className="mt-2 text-inkt/70">
            {alles.length === 0
              ? "Nog niets binnen."
              : `${alles.length} in totaal.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/beheer/export"
            className="rounded-full bg-paars-diep px-5 py-2.5 text-sm font-bold text-creme transition-colors hover:bg-paars-zacht"
          >
            Download alles als CSV
          </a>
          <form action={logUit}>
            <button
              type="submit"
              className="rounded-full border border-paars-diep/20 px-5 py-2.5 text-sm font-bold text-paars-diep transition-colors hover:border-paars hover:text-paars"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </div>

      {/* Tellers per soort */}
      <dl className="mt-8 grid gap-3 sm:grid-cols-4">
        {SOORTEN.map((soort) => (
          <div
            key={soort}
            className="rounded-2xl border border-paars-diep/12 bg-kraft/50 px-5 py-4"
          >
            <dt className="text-sm text-inkt/65">{SOORT_LABELS[soort]}</dt>
            <dd className="mt-1 font-merk text-2xl font-black text-paars-diep">
              {perSoort.get(soort)?.length ?? 0}
            </dd>
          </div>
        ))}
      </dl>

      {alles.length === 0 ? (
        <div className="mt-10 rounded-2xl border border-dashed border-paars-diep/25 bg-kraft/40 px-6 py-16 text-center">
          <p className="text-xl text-inkt/80">Hier is het nog stil.</p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-inkt/60">
            Zodra iemand een formulier invult of een bestelling plaatst,
            verschijnt het hier — en kun je de lijst als CSV downloaden.
          </p>
        </div>
      ) : (
        SOORTEN.filter((soort) => (perSoort.get(soort)?.length ?? 0) > 0).map(
          (soort) => {
            const rijen = perSoort.get(soort) ?? [];
            // Kolommen afleiden uit de gegevens: elke soort heeft eigen velden.
            const kolommen = [
              ...new Set(rijen.flatMap((rij) => Object.keys(rij.gegevens))),
            ];

            return (
              <section key={soort} className="mt-12">
                <div className="flex flex-wrap items-baseline justify-between gap-3">
                  <h2 className="text-2xl">
                    {SOORT_LABELS[soort]}{" "}
                    <span className="text-inkt/45">({rijen.length})</span>
                  </h2>
                  <a
                    href={`/beheer/export?soort=${soort}`}
                    className="text-sm font-semibold text-paars underline underline-offset-2"
                  >
                    CSV van deze lijst
                  </a>
                </div>

                <div className="mt-4 overflow-x-auto rounded-2xl border border-paars-diep/10 bg-creme">
                  <table className="w-full border-collapse text-sm">
                    <thead>
                      <tr className="border-b border-paars-diep/10 bg-kraft/70 text-left">
                        <th scope="col" className="px-4 py-3 font-semibold">
                          Datum
                        </th>
                        {kolommen.map((kolom) => (
                          <th
                            key={kolom}
                            scope="col"
                            className="px-4 py-3 font-semibold whitespace-nowrap"
                          >
                            {kolom}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {rijen.map((rij) => (
                        <tr
                          key={rij.id}
                          className="border-b border-paars-diep/10 align-top last:border-0 hover:bg-lila/15"
                        >
                          <td className="px-4 py-3 whitespace-nowrap text-inkt/70">
                            {datumOpmaak.format(new Date(rij.aangemaaktOp))}
                          </td>
                          {kolommen.map((kolom) => (
                            <td
                              key={kolom}
                              className="max-w-[22rem] px-4 py-3 text-inkt/85"
                            >
                              {kolom === "email" && rij.gegevens[kolom] ? (
                                <a
                                  href={`mailto:${String(rij.gegevens[kolom])}`}
                                  className="text-paars underline underline-offset-2"
                                >
                                  {String(rij.gegevens[kolom])}
                                </a>
                              ) : (
                                toon(rij.gegevens[kolom])
                              )}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            );
          },
        )
      )}
    </Omhulsel>
  );
}
