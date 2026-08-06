import type { Metadata } from "next";
import Link from "next/link";

import { Woordmerk } from "@/components/Merk";
import { beheerIsIngesteld, isAangemeld } from "@/lib/beheer-auth";
import { store } from "@/lib/store";

import { logUit } from "./actions";
import { LoginFormulier } from "./LoginFormulier";

export const metadata: Metadata = {
  title: "Beheer",
  robots: { index: false, follow: false },
};

// Nooit prerenderen: deze pagina hangt volledig aan de sessiecookie en aan
// env-variabelen die tijdens de build nog niet gezet hoeven te zijn.
export const dynamic = "force-dynamic";

function Omhulsel({ children }: { children: React.ReactNode }) {
  return (
    <main className="px-5 py-14 sm:py-20">
      <div className="mx-auto max-w-5xl">
        <Link href="/" className="text-xl">
          <Woordmerk />
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

export default async function BeheerPagina() {
  if (!beheerIsIngesteld()) {
    return (
      <Omhulsel>
        <h1 className="mt-8 font-serif text-3xl tracking-tight">Beheer</h1>
        <div className="mt-6 rounded-2xl border border-goud/40 bg-kraft/60 p-6 text-paars-diep/85">
          <p className="font-semibold">
            Dit overzicht is nog niet beveiligd, dus het blijft dicht.
          </p>
          <p className="mt-3 text-sm leading-relaxed">
            Zet <code className="rounded bg-paars-diep/10 px-1.5 py-0.5">BEHEER_WACHTWOORD</code>{" "}
            in je <code className="rounded bg-paars-diep/10 px-1.5 py-0.5">.env.local</code>{" "}
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
        <h1 className="mt-8 font-serif text-3xl tracking-tight">Beheer</h1>
        <p className="mt-3 mb-7 text-paars-diep/70">
          Even bewijzen dat je erbij hoort.
        </p>
        <div className="max-w-md">
          <LoginFormulier />
        </div>
      </Omhulsel>
    );
  }

  const aanvragen = await (await store()).lijst();
  const totaalExemplaren = aanvragen.reduce(
    (som, aanvraag) => som + aanvraag.aantal,
    0,
  );

  return (
    <Omhulsel>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl tracking-tight sm:text-4xl">
            Aanvragen
          </h1>
          <p className="mt-2 text-paars-diep/70">
            {aanvragen.length === 0
              ? "Nog niets binnen."
              : `${aanvragen.length} ${
                  aanvragen.length === 1 ? "aanvraag" : "aanvragen"
                }, samen ${totaalExemplaren} ${
                  totaalExemplaren === 1 ? "exemplaar" : "exemplaren"
                }.`}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/beheer/export"
            className="rounded-full bg-paars-diep px-5 py-2.5 text-sm font-semibold text-creme transition-colors hover:bg-paars"
          >
            Download CSV
          </a>
          <form action={logUit}>
            <button
              type="submit"
              className="rounded-full border border-paars-diep/20 px-5 py-2.5 text-sm font-semibold text-paars-diep transition-colors hover:border-paars hover:text-paars"
            >
              Uitloggen
            </button>
          </form>
        </div>
      </div>

      {aanvragen.length === 0 ? (
        <div className="mt-8 rounded-2xl border border-dashed border-paars-diep/25 bg-kraft/40 px-6 py-16 text-center">
          <p className="font-serif text-xl text-paars-diep/80">
            Hier is het nog stil.
          </p>
          <p className="mx-auto mt-2 max-w-sm text-sm text-paars-diep/60">
            Zodra iemand het formulier invult, verschijnt de aanvraag hier — en
            kun je de hele lijst als CSV downloaden.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-x-auto rounded-2xl border border-paars-diep/10 bg-creme/70">
          <table className="w-full min-w-[52rem] border-collapse text-sm">
            <thead>
              <tr className="border-b border-paars-diep/10 bg-kraft/70 text-left">
                <th scope="col" className="px-4 py-3 font-semibold">
                  Naam
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  E-mail
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Organisatie
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Functie
                </th>
                <th scope="col" className="px-4 py-3 text-right font-semibold">
                  Aantal
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Doel
                </th>
                <th scope="col" className="px-4 py-3 font-semibold">
                  Datum
                </th>
              </tr>
            </thead>
            <tbody>
              {aanvragen.map((aanvraag) => (
                <tr
                  key={aanvraag.id}
                  className="border-b border-paars-diep/8 align-top last:border-0 hover:bg-lila/15"
                >
                  <td className="px-4 py-3 font-medium">
                    {aanvraag.naam}
                    {aanvraag.opmerking && (
                      <p className="mt-1 max-w-[18rem] text-xs leading-relaxed text-paars-diep/60 italic">
                        &ldquo;{aanvraag.opmerking}&rdquo;
                      </p>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <a
                      href={`mailto:${aanvraag.email}`}
                      className="text-paars underline decoration-goud/60 underline-offset-2"
                    >
                      {aanvraag.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-paars-diep/75">
                    {aanvraag.organisatie ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-paars-diep/75">
                    {aanvraag.functie ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-right font-semibold tabular-nums">
                    {aanvraag.aantal}
                  </td>
                  <td className="px-4 py-3 text-paars-diep/75">
                    {aanvraag.doelen.length > 0
                      ? aanvraag.doelen.join(", ")
                      : "—"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap text-paars-diep/75">
                    {datumOpmaak.format(new Date(aanvraag.aangemaaktOp))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Omhulsel>
  );
}
