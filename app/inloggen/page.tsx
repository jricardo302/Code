import type { Metadata } from "next";
import Image from "next/image";
import { Montserrat } from "next/font/google";
import { redirect } from "next/navigation";

import { ORGANISATIE } from "@/lib/vraagbaak/organisatie";
import {
  huidigeGebruiker,
  toegangIsIngesteld,
  toegestaneDomeinen,
} from "@/lib/vraagbaak/toegang";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Inloggen — Vraagbaak Ricardo Jeugdhulp",
  description: "Inloggen op de interne vraagbaak van Ricardo Jeugdhulp.",
  robots: { index: false, follow: false },
};

const MELDINGEN: Record<string, string> = {
  "niet-ingesteld":
    "De toegang is nog niet ingesteld. Vraag de beheerder om de vraagbaak aan te zetten.",
  afgebroken: "Je hebt het inloggen afgebroken. Probeer het gerust opnieuw.",
  staat:
    "Het inloggen duurde te lang of de link klopte niet meer. Begin opnieuw.",
  domein:
    "Dat account hoort niet bij Ricardo Jeugdhulp. Log in met je werkadres.",
  mislukt: "Er ging iets mis bij Google. Probeer het nog een keer.",
};

export default async function InloggenPagina({
  searchParams,
}: PageProps<"/inloggen">) {
  if (await huidigeGebruiker()) redirect("/vraagbaak");

  const { fout } = await searchParams;
  const sleutel = typeof fout === "string" ? fout : "";
  const melding = MELDINGEN[sleutel];
  const kanInloggen = toegangIsIngesteld();
  const domeinen = toegestaneDomeinen();

  return (
    <div
      className={`${montserrat.variable} flex min-h-full flex-1 flex-col bg-rj-mist font-rj text-rj-blauw`}
    >
      <header className="border-b border-rj-lijn bg-white">
        <div className="mx-auto flex max-w-2xl items-center px-5 py-4">
          <span className="text-[0.68rem] font-bold tracking-[0.14em] text-rj-grijs uppercase">
            Kennisbank Ricardo Jeugdhulp
          </span>
          {/* Het logo staat rechtsboven — vaste plek volgens de huisstijl. */}
          <Image
            src="/vraagbaak/logo.png"
            alt="Ricardo Jeugdhulp"
            width={2291}
            height={675}
            priority
            className="ml-auto h-7 w-auto sm:h-9"
          />
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-5 py-16">
        <div className="w-full max-w-md rounded-3xl border border-rj-lijn bg-white p-8 shadow-sm sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
            Vraagbaak
          </h1>
          <p className="mt-3 text-sm leading-relaxed text-rj-grijs">
            Deze kennisbank is voor de medewerkers van {ORGANISATIE.naam} — log
            in met je werkaccount, dan staat alles voor je klaar.
          </p>

          {melding ? (
            <p
              role="alert"
              className="mt-6 rounded-2xl bg-rj-groen-licht px-4 py-3 text-sm font-semibold text-rj-blauw"
            >
              {melding}
            </p>
          ) : null}

          {kanInloggen ? (
            <>
              <a
                href="/api/vraagbaak/inloggen"
                className="mt-8 flex w-full items-center justify-center gap-3 rounded-full bg-rj-blauw px-6 py-4 text-base font-extrabold text-white ring-2 ring-rj-groen transition-colors hover:bg-rj-blauw/85"
              >
                <GoogleMerk />
                Inloggen met Google
              </a>
              <p className="mt-5 text-xs leading-relaxed text-rj-grijs">
                Gebruik je adres op{" "}
                <span className="font-bold">
                  {domeinen.map((domein) => `@${domein}`).join(" of ")}
                </span>
                . Een privé-Gmail komt er niet in. Lukt het niet, vraag dan of je
                account nog actief is.
              </p>
            </>
          ) : (
            <p className="mt-8 rounded-2xl border border-rj-lijn bg-rj-mist px-4 py-3 text-sm leading-relaxed text-rj-grijs">
              De vraagbaak staat nog dicht: de koppeling met Google Workspace is
              niet ingesteld. Zolang dat zo is komt niemand binnen.
            </p>
          )}
        </div>
      </main>

      <footer className="bg-rj-blauw px-5 py-6 text-center text-xs text-white/50">
        Geen cliëntgegevens in deze app. Cliëntinformatie hoort uitsluitend in
        Zilliz.
      </footer>
    </div>
  );
}

/** Het Google-logo hoort onveranderd op de knop te staan. */
function GoogleMerk() {
  return (
    <svg aria-hidden viewBox="0 0 48 48" className="h-5 w-5 shrink-0">
      <path
        fill="#FFC107"
        d="M43.6 20.1H42V20H24v8h11.3c-1.6 4.7-6.1 8-11.3 8a12 12 0 1 1 7.9-21l5.7-5.7A20 20 0 1 0 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
      <path
        fill="#FF3D00"
        d="m6.3 14.7 6.6 4.8A12 12 0 0 1 24 12c3.1 0 5.8 1.2 7.9 3.1l5.7-5.7A20 20 0 0 0 6.3 14.7z"
      />
      <path
        fill="#4CAF50"
        d="M24 44c5.2 0 9.9-2 13.4-5.2l-6.2-5.2A11.9 11.9 0 0 1 12.7 28l-6.5 5A20 20 0 0 0 24 44z"
      />
      <path
        fill="#1976D2"
        d="M43.6 20.1H42V20H24v8h11.3a12 12 0 0 1-4.1 5.6l6.2 5.2C37 40.2 44 35 44 24c0-1.3-.1-2.6-.4-3.9z"
      />
    </svg>
  );
}
