"use client";

import type { ReactNode } from "react";

/**
 * De losse onderdelen waar de drie formulieren uit bestaan. Eén set klassen,
 * één foutweergave, één honeypot — zodat een nieuw formulier geen nieuw
 * ontwerp is.
 */

export const invoerKlassen =
  "w-full rounded-xl border border-paars-diep/15 bg-creme px-4 py-3 text-inkt " +
  "placeholder:text-inkt/35 transition-colors focus:border-paars " +
  "aria-[invalid=true]:border-red-700/70 aria-[invalid=true]:bg-red-50";

export function Fout({ id, fouten }: { id: string; fouten?: string[] }) {
  if (!fouten?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-800">
      {fouten[0]}
    </p>
  );
}

export function Label({
  htmlFor,
  children,
  optioneel = false,
}: {
  htmlFor: string;
  children: ReactNode;
  optioneel?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline gap-2 font-semibold text-paars-diep"
    >
      {children}
      {optioneel && (
        <span className="text-xs font-normal text-inkt/45">optioneel</span>
      )}
    </label>
  );
}

/**
 * Eén tekstveld met label, foutmelding en de juiste aria-koppeling. Dat laatste
 * gaat het vaakst mis als je het per veld met de hand doet.
 */
export function Veld({
  id,
  naam,
  label,
  fouten,
  waarde,
  optioneel = false,
  type = "text",
  regels,
  children,
  ...rest
}: {
  id: string;
  naam: string;
  label: string;
  fouten?: string[];
  waarde?: string;
  optioneel?: boolean;
  type?: string;
  /** Ingevuld = textarea met dit aantal regels. */
  regels?: number;
  /** Ingevuld = select met deze opties. */
  children?: ReactNode;
} & Omit<React.InputHTMLAttributes<HTMLInputElement>, "id" | "name" | "type">) {
  const veldId = `${id}-${naam}`;
  const foutId = `${veldId}-fout`;
  const gedeeld = {
    id: veldId,
    name: naam,
    defaultValue: waarde,
    "aria-invalid": Boolean(fouten?.length),
    "aria-describedby": fouten?.length ? foutId : undefined,
    className: invoerKlassen,
  };

  return (
    <div>
      <Label htmlFor={veldId} optioneel={optioneel}>
        {label}
      </Label>
      {children ? (
        <select {...gedeeld}>{children}</select>
      ) : regels ? (
        <textarea
          {...gedeeld}
          rows={regels}
          className={`${invoerKlassen} resize-y`}
          placeholder={rest.placeholder}
        />
      ) : (
        <input {...gedeeld} type={type} {...rest} />
      )}
      <Fout id={foutId} fouten={fouten} />
    </div>
  );
}

/** Onzichtbaar voor mensen, onweerstaanbaar voor bots. */
export function Honeypot({ id }: { id: string }) {
  return (
    <div
      aria-hidden
      className="absolute -left-[9999px] h-0 w-0 overflow-hidden"
    >
      <label htmlFor={`${id}-website`}>Website (niet invullen)</label>
      <input
        id={`${id}-website`}
        name="website"
        type="text"
        tabIndex={-1}
        autoComplete="off"
      />
    </div>
  );
}

export function Formuliermelding({
  fouten,
  heeftFout,
}: {
  fouten?: string[];
  heeftFout: boolean;
}) {
  if (fouten?.length) {
    return (
      <p className="mb-6 rounded-xl border border-red-800/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
        {fouten[0]}
      </p>
    );
  }
  if (heeftFout) {
    return (
      <p className="mb-6 rounded-xl border border-red-800/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
        Er ontbreekt nog iets — hieronder zie je wat.
      </p>
    );
  }
  return null;
}

/** Wat er staat nadat het gelukt is. Eén vorm voor alle formulieren. */
export function Gelukt({
  kop,
  children,
}: {
  kop: string;
  children: ReactNode;
}) {
  return (
    <div className="op-donker rounded-3xl doos-verloop px-6 py-12 text-center text-creme sm:px-12">
      <h2 className="text-3xl text-creme sm:text-4xl">{kop}</h2>
      <div className="mx-auto mt-5 max-w-md space-y-4 leading-relaxed text-creme/80 tekst-mooi [&_a]:font-semibold [&_a]:text-lila [&_a]:underline [&_a]:underline-offset-4">
        {children}
      </div>
    </div>
  );
}
