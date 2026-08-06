"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";

import {
  LEEG_FORMULIER,
  LEGE_WAARDEN,
  type IngevuldeWaarden,
} from "@/lib/aanvraag-status";
import { DOELEN, FUNCTIES } from "@/lib/schema";

import { verstuurAanvraag } from "./actions";

const invoerKlassen =
  "w-full rounded-xl border border-paars-diep/15 bg-creme/70 px-4 py-3 text-paars-diep " +
  "placeholder:text-paars-diep/35 transition-colors focus:border-paars focus:bg-creme " +
  "aria-[invalid=true]:border-red-700/60 aria-[invalid=true]:bg-red-50";

function Fout({ id, fouten }: { id: string; fouten?: string[] }) {
  if (!fouten?.length) return null;
  return (
    <p id={id} className="mt-1.5 text-sm font-medium text-red-800">
      {fouten[0]}
    </p>
  );
}

function Label({
  htmlFor,
  children,
  optioneel = false,
}: {
  htmlFor: string;
  children: React.ReactNode;
  optioneel?: boolean;
}) {
  return (
    <label
      htmlFor={htmlFor}
      className="mb-1.5 flex items-baseline gap-2 font-semibold text-paars-diep"
    >
      {children}
      {optioneel && (
        <span className="text-xs font-normal text-paars-diep/45">
          optioneel
        </span>
      )}
    </label>
  );
}

export function AanvraagFormulier({ contactMail }: { contactMail: string }) {
  const [status, formActie, bezig] = useActionState(
    verstuurAanvraag,
    LEEG_FORMULIER,
  );
  const id = useId();
  const meldingRef = useRef<HTMLDivElement>(null);

  const fouten = status.status === "fout" ? status.fouten : {};
  const waarden: IngevuldeWaarden =
    status.status === "fout" ? status.waarden : LEGE_WAARDEN;

  // Springt naar de melding zodra er iets te melden valt.
  useEffect(() => {
    if (status.status !== "leeg") {
      meldingRef.current?.scrollIntoView({ block: "center" });
    }
  }, [status]);

  if (status.status === "gelukt") {
    return (
      <div
        ref={meldingRef}
        className="rounded-3xl border border-goud/35 bg-paars-diep px-6 py-12 text-center text-creme sm:px-12"
      >
        <p aria-hidden className="font-serif text-5xl text-goud">
          ✳
        </p>
        <h2 className="mt-5 font-serif text-3xl tracking-tight sm:text-4xl">
          Staat genoteerd, {status.voornaam}!
        </h2>
        <p className="mx-auto mt-4 max-w-md leading-relaxed text-creme/85 tekst-balans">
          {status.aantal === 1
            ? "Eén exemplaar met jouw naam erop."
            : `${status.aantal} exemplaren met jouw naam erop.`}{" "}
          Je hoeft nu niets meer te doen. Zodra InterVISIE klaarligt, hoor je
          van ons — met een echt bericht van een echt mens, geen
          automatiseringsketen.
        </p>
        <p className="mx-auto mt-4 max-w-md text-sm text-creme/60">
          Bedacht je je, of klopt er iets niet? Mail{" "}
          <a
            href={`mailto:${contactMail}`}
            className="underline decoration-goud decoration-2 underline-offset-4"
          >
            {contactMail}
          </a>{" "}
          en we passen het aan.
        </p>
        <Link
          href="/"
          className="mt-8 inline-block rounded-full bg-goud px-7 py-3 font-semibold text-paars-diep transition-transform hover:-translate-y-0.5"
        >
          Terug naar de homepage
        </Link>
      </div>
    );
  }

  return (
    <form
      action={formActie}
      noValidate
      className="rounded-3xl border border-paars-diep/10 bg-kraft/60 p-6 sm:p-9"
    >
      <div ref={meldingRef} aria-live="polite">
        {fouten.formulier?.length ? (
          <p className="mb-6 rounded-xl border border-red-800/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            {fouten.formulier[0]}
          </p>
        ) : status.status === "fout" ? (
          <p className="mb-6 rounded-xl border border-red-800/25 bg-red-50 px-4 py-3 text-sm font-medium text-red-900">
            Er ontbreekt nog iets — hieronder zie je wat.
          </p>
        ) : null}
      </div>

      <div className="space-y-5">
        <div>
          <Label htmlFor={`${id}-naam`}>Naam</Label>
          <input
            id={`${id}-naam`}
            name="naam"
            type="text"
            required
            autoComplete="name"
            defaultValue={waarden.naam}
            placeholder="Hoe mogen we je noemen?"
            aria-invalid={Boolean(fouten.naam)}
            aria-describedby={fouten.naam ? `${id}-naam-fout` : undefined}
            className={invoerKlassen}
          />
          <Fout id={`${id}-naam-fout`} fouten={fouten.naam} />
        </div>

        <div>
          <Label htmlFor={`${id}-email`}>E-mailadres</Label>
          <input
            id={`${id}-email`}
            name="email"
            type="email"
            required
            autoComplete="email"
            inputMode="email"
            defaultValue={waarden.email}
            placeholder="jij@organisatie.nl"
            aria-invalid={Boolean(fouten.email)}
            aria-describedby={fouten.email ? `${id}-email-fout` : undefined}
            className={invoerKlassen}
          />
          <Fout id={`${id}-email-fout`} fouten={fouten.email} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <Label htmlFor={`${id}-organisatie`} optioneel>
              Organisatie of praktijk
            </Label>
            <input
              id={`${id}-organisatie`}
              name="organisatie"
              type="text"
              autoComplete="organization"
              defaultValue={waarden.organisatie}
              placeholder="Waar werk je?"
              aria-invalid={Boolean(fouten.organisatie)}
              aria-describedby={
                fouten.organisatie ? `${id}-organisatie-fout` : undefined
              }
              className={invoerKlassen}
            />
            <Fout
              id={`${id}-organisatie-fout`}
              fouten={fouten.organisatie}
            />
          </div>

          <div>
            <Label htmlFor={`${id}-functie`} optioneel>
              Functie
            </Label>
            <select
              id={`${id}-functie`}
              name="functie"
              defaultValue={waarden.functie}
              aria-invalid={Boolean(fouten.functie)}
              aria-describedby={
                fouten.functie ? `${id}-functie-fout` : undefined
              }
              className={invoerKlassen}
            >
              <option value="">Kies je functie…</option>
              {FUNCTIES.map((functie) => (
                <option key={functie} value={functie}>
                  {functie}
                </option>
              ))}
            </select>
            <Fout id={`${id}-functie-fout`} fouten={fouten.functie} />
          </div>
        </div>

        <div className="sm:max-w-[12rem]">
          <Label htmlFor={`${id}-aantal`}>Aantal exemplaren</Label>
          <input
            id={`${id}-aantal`}
            name="aantal"
            type="number"
            min={1}
            max={500}
            step={1}
            inputMode="numeric"
            defaultValue={waarden.aantal}
            aria-invalid={Boolean(fouten.aantal)}
            aria-describedby={fouten.aantal ? `${id}-aantal-fout` : undefined}
            className={invoerKlassen}
          />
          <Fout id={`${id}-aantal-fout`} fouten={fouten.aantal} />
        </div>

        <fieldset>
          <legend className="mb-1.5 flex items-baseline gap-2 font-semibold text-paars-diep">
            Waar ga je het voor gebruiken?
            <span className="text-xs font-normal text-paars-diep/45">
              optioneel, meerdere mogen
            </span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {DOELEN.map((doel) => (
              <label
                key={doel}
                className="group cursor-pointer rounded-full border border-paars-diep/15 bg-creme/70 px-4 py-2 text-sm font-medium transition-colors has-checked:border-paars has-checked:bg-paars has-checked:text-creme"
              >
                <input
                  type="checkbox"
                  name="doelen"
                  value={doel}
                  defaultChecked={waarden.doelen.includes(doel)}
                  className="sr-only"
                />
                {doel}
              </label>
            ))}
          </div>
          <Fout id={`${id}-doelen-fout`} fouten={fouten.doelen} />
        </fieldset>

        <div>
          <Label htmlFor={`${id}-opmerking`} optioneel>
            Opmerking of vraag
          </Label>
          <textarea
            id={`${id}-opmerking`}
            name="opmerking"
            rows={4}
            defaultValue={waarden.opmerking}
            placeholder={
              'Alles wat we moeten weten. Ook "niks" is een prima antwoord.'
            }
            aria-invalid={Boolean(fouten.opmerking)}
            aria-describedby={
              fouten.opmerking ? `${id}-opmerking-fout` : undefined
            }
            className={`${invoerKlassen} resize-y`}
          />
          <Fout id={`${id}-opmerking-fout`} fouten={fouten.opmerking} />
        </div>

        {/* Honeypot: onzichtbaar voor mensen, onweerstaanbaar voor bots. */}
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label htmlFor={`${id}-website`}>Website (niet invullen)</label>
          <input
            id={`${id}-website`}
            name="website"
            type="text"
            tabIndex={-1}
            autoComplete="off"
          />
        </div>
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <button
          type="submit"
          disabled={bezig}
          className="w-full shrink-0 rounded-full bg-paars-diep px-8 py-3.5 font-semibold whitespace-nowrap text-creme transition-transform hover:-translate-y-0.5 hover:bg-paars disabled:cursor-wait disabled:opacity-60 disabled:hover:translate-y-0 sm:w-auto"
        >
          {bezig ? "Even geduld…" : "Verstuur mijn aanvraag"}
        </button>
        <p className="text-sm text-paars-diep/60">
          Geen betaling, geen nieuwsbrief. Alleen bericht als het spel er is.
        </p>
      </div>
    </form>
  );
}
