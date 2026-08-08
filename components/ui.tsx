import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";

/**
 * De handvol bouwstenen die op elke pagina terugkomen. Geen UI-bibliotheek:
 * dit is minder code dan de configuratie van een bibliotheek zou zijn.
 */

const knopStijlen = {
  primair:
    "bg-paars-diep text-creme hover:bg-paars-zacht shadow-[0_12px_28px_-16px_rgba(43,23,51,0.9)]",
  licht: "bg-creme text-paars-diep hover:bg-lila-bleek",
  rand: "border-2 border-paars-diep/25 text-paars-diep hover:border-paars hover:text-paars",
  randLicht: "border-2 border-creme/35 text-creme hover:border-lila hover:text-lila",
} as const;

const knopBasis =
  "inline-flex items-center justify-center gap-2 rounded-full px-7 py-3.5 text-center font-merk text-sm font-black tracking-wide transition-colors sm:text-base";

export function KnopLink({
  variant = "primair",
  className = "",
  children,
  ...props
}: ComponentProps<typeof Link> & { variant?: keyof typeof knopStijlen }) {
  return (
    <Link
      className={`${knopBasis} ${knopStijlen[variant]} ${className}`}
      {...props}
    >
      {children}
    </Link>
  );
}

export function Knop({
  variant = "primair",
  className = "",
  children,
  ...props
}: ComponentProps<"button"> & { variant?: keyof typeof knopStijlen }) {
  return (
    <button
      className={`${knopBasis} ${knopStijlen[variant]} disabled:cursor-not-allowed disabled:opacity-55 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}

/** Klein label boven een kop. Geeft de sectie een naam zonder een extra kop. */
export function Kopje({
  children,
  toon = "donker",
}: {
  children: ReactNode;
  toon?: "donker" | "licht";
}) {
  return (
    <p
      className={`font-merk text-[0.68rem] font-black tracking-[0.2em] uppercase ${
        toon === "licht" ? "text-lila" : "text-paars"
      }`}
    >
      {children}
    </p>
  );
}

export function Sectie({
  id,
  children,
  className = "",
  toon = "creme",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  toon?: "creme" | "kraft" | "donker" | "lila";
}) {
  const vlakken = {
    creme: "bg-creme",
    kraft: "bg-kraft/70 border-y border-paars-diep/10",
    donker: "op-donker doos-verloop text-creme",
    lila: "bg-lila-bleek/60 border-y border-paars-diep/10",
  } as const;

  return (
    <section
      id={id}
      className={`${vlakken[toon]} scroll-mt-20 px-5 py-16 sm:py-24 ${className}`}
    >
      <div className="mx-auto max-w-6xl">{children}</div>
    </section>
  );
}

/** Vraag-en-antwoord met <details>: werkt zonder JavaScript en is toetsenbaar. */
export function VraagAntwoord({
  vraag,
  children,
}: {
  vraag: string;
  children: ReactNode;
}) {
  return (
    <details className="group border-b border-paars-diep/12 py-1">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-4 py-4 font-merk text-base font-black text-paars-diep marker:hidden sm:text-lg">
        {vraag}
        <span
          aria-hidden
          className="relative h-4 w-4 shrink-0 text-paars transition-transform duration-200 group-open:rotate-45"
        >
          <span className="absolute top-1/2 left-0 h-0.5 w-4 -translate-y-1/2 rounded bg-current" />
          <span className="absolute top-0 left-1/2 h-4 w-0.5 -translate-x-1/2 rounded bg-current" />
        </span>
      </summary>
      <div className="pb-5 text-sm leading-relaxed text-inkt/80 tekst-mooi sm:text-base [&_a]:font-semibold [&_a]:text-paars [&_a]:underline [&_a]:underline-offset-2 [&_p+p]:mt-3">
        {children}
      </div>
    </details>
  );
}

/** Vaste opmaak voor de lopende tekst op tekstpagina's (juridisch, artikelen). */
export function Prozablok({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-5 text-base leading-relaxed text-inkt/85 tekst-mooi [&_a]:font-semibold [&_a]:text-paars [&_a]:underline [&_a]:underline-offset-2 [&_h2]:mt-10 [&_h2]:text-2xl [&_h3]:mt-8 [&_h3]:text-lg [&_li]:ml-5 [&_li]:list-disc [&_ol_li]:list-decimal [&_ul]:space-y-2">
      {children}
    </div>
  );
}

/** Zichtbare markering dat hier nog echte gegevens moeten komen. */
export function Plaatshouder({ children }: { children: ReactNode }) {
  return (
    <mark className="rounded bg-lila/35 px-1.5 py-0.5 text-inkt">
      {children}
    </mark>
  );
}
