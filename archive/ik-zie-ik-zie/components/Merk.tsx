import Link from "next/link";

/**
 * Het woordmerk: "ik zie ik zie…" met de tweede helft in accentpaars en de
 * puntjes in goud. Met `ondertekst` komt het vaste onderschrift eronder —
 * dat doet het uitleggen dat de naam zelf niet doet.
 *
 * De maten staan expliciet in de props en worden niet afgeleid van de naam:
 * een em-maat groeit mee met een 7xl-kop en dan schreeuwt het onderschrift
 * net zo hard als het merk zelf.
 */
export function Woordmerk({
  className = "",
  ondertekst = false,
  ondertekstKlasse = "text-[0.7rem] tracking-[0.22em]",
  gecentreerd = false,
}: {
  className?: string;
  ondertekst?: boolean;
  ondertekstKlasse?: string;
  gecentreerd?: boolean;
}) {
  return (
    <span
      className={`inline-flex flex-col ${
        gecentreerd ? "items-center" : "items-start"
      }`}
    >
      <span className={`font-serif tracking-tight ${className}`}>
        ik zie <span className="text-paars">ik zie</span>
        <span className="text-goud">…</span>
      </span>
      {ondertekst && (
        <span
          className={`font-sans font-semibold uppercase opacity-70 ${ondertekstKlasse}`}
        >
          het intervisiespel
        </span>
      )}
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paars-diep/10 bg-creme/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="leading-tight">
          <Woordmerk
            className="text-xl sm:text-2xl"
            ondertekst
            ondertekstKlasse="text-[0.6rem] tracking-[0.2em]"
          />
          <span className="sr-only">— naar de homepage</span>
        </Link>
        <Link
          href="/aanvragen"
          className="shrink-0 rounded-full border border-paars-diep/15 bg-paars-diep px-4 py-2 text-sm font-semibold whitespace-nowrap text-creme transition-colors hover:bg-paars sm:px-5"
        >
          Bestellen
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ mail }: { mail: string }) {
  return (
    <footer className="mt-auto border-t border-paars-diep/10 bg-kraft/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-4 px-5 py-9 text-sm text-paars-diep/70 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <Woordmerk
            className="text-lg"
            ondertekst
            ondertekstKlasse="text-[0.6rem] tracking-[0.2em]"
          />
          <p className="mt-2 max-w-sm">
            Gemaakt door mensen die zelf op maandagochtend in de intervisie
            zitten.
          </p>
        </div>
        <p className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <a
            href={`mailto:${mail}`}
            className="font-semibold text-paars underline decoration-goud decoration-2 underline-offset-4"
          >
            {mail}
          </a>
          <span aria-hidden className="text-goud">
            ·
          </span>
          <span>© {new Date().getFullYear()}</span>
        </p>
      </div>
    </footer>
  );
}
