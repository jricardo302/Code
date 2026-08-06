import Link from "next/link";

export function Woordmerk({ className = "" }: { className?: string }) {
  return (
    <span className={`font-serif tracking-tight ${className}`}>
      inter<span className="font-bold text-paars">VISIE</span>
    </span>
  );
}

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paars-diep/10 bg-creme/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-5 py-3.5">
        <Link href="/" className="text-xl sm:text-2xl">
          <Woordmerk />
          <span className="sr-only">— naar de homepage</span>
        </Link>
        <Link
          href="/aanvragen"
          className="rounded-full border border-paars-diep/15 bg-paars-diep px-4 py-2 text-sm font-semibold text-creme transition-colors hover:bg-paars sm:px-5"
        >
          Vraag InterVISIE aan
        </Link>
      </div>
    </header>
  );
}

export function SiteFooter({ mail }: { mail: string }) {
  return (
    <footer className="mt-auto border-t border-paars-diep/10 bg-kraft/60">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-5 py-9 text-sm text-paars-diep/70 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <Woordmerk className="text-base" /> — gemaakt door mensen die zelf op
          maandagochtend in de intervisie zitten.
        </p>
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
