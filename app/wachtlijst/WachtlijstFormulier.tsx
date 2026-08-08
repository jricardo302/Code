"use client";

import Link from "next/link";
import { useActionState, useEffect, useId, useRef } from "react";

import {
  Formuliermelding,
  Gelukt,
  Honeypot,
  Veld,
} from "@/components/velden";
import { Knop } from "@/components/ui";
import { LEEG } from "@/lib/formulier-status";
import { DOELEN, FUNCTIES } from "@/lib/schema";

import { meldAanVoorWachtlijst } from "./actions";

export function WachtlijstFormulier({ contactMail }: { contactMail: string }) {
  const [status, formActie, bezig] = useActionState(
    meldAanVoorWachtlijst,
    LEEG,
  );
  const id = useId();
  const meldingRef = useRef<HTMLDivElement>(null);

  const fouten = status.status === "fout" ? status.fouten : {};
  const waarden = status.status === "fout" ? status.waarden : {};

  const tekst = (veld: string) => {
    const waarde = waarden[veld];
    return typeof waarde === "string" ? waarde : undefined;
  };
  const lijst = (veld: string) => {
    const waarde = waarden[veld];
    return Array.isArray(waarde) ? waarde : [];
  };

  // Springt naar de melding zodra er iets te melden valt.
  useEffect(() => {
    if (status.status !== "leeg") {
      meldingRef.current?.scrollIntoView({ block: "center" });
    }
  }, [status]);

  if (status.status === "gelukt") {
    return (
      <div ref={meldingRef}>
        <Gelukt kop={`Staat genoteerd, ${status.voornaam}`}>
          <p>
            {status.samenvatting} Je hoeft nu niets te doen en je hebt nergens
            voor betaald.
          </p>
          <p>
            Zodra de eerste oplage van de pers komt krijg je als eerste bericht,
            met de leverdatum erbij. Pas dan bestel je echt.
          </p>
          <p className="text-sm text-creme/60">
            Klopt er iets niet? Mail{" "}
            <a href={`mailto:${contactMail}`}>{contactMail}</a> en we passen het
            aan.
          </p>
          <p>
            <Link href="/">Terug naar de homepage</Link>
          </p>
        </Gelukt>
      </div>
    );
  }

  return (
    <form
      action={formActie}
      noValidate
      className="rounded-3xl border border-paars-diep/12 bg-kraft/60 p-6 sm:p-9"
    >
      <div ref={meldingRef} aria-live="polite">
        <Formuliermelding
          fouten={fouten.formulier}
          heeftFout={status.status === "fout"}
        />
      </div>

      <div className="space-y-5">
        <Veld
          id={id}
          naam="naam"
          label="Naam"
          required
          autoComplete="name"
          placeholder="Hoe mogen we je noemen?"
          fouten={fouten.naam}
          waarde={tekst("naam")}
        />

        <Veld
          id={id}
          naam="email"
          label="E-mailadres"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="jij@organisatie.nl"
          fouten={fouten.email}
          waarde={tekst("email")}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id={id}
            naam="organisatie"
            label="Organisatie of praktijk"
            optioneel
            autoComplete="organization"
            placeholder="Waar werk je?"
            fouten={fouten.organisatie}
            waarde={tekst("organisatie")}
          />
          <Veld
            id={id}
            naam="functie"
            label="Functie"
            optioneel
            fouten={fouten.functie}
            waarde={tekst("functie")}
          >
            <option value="">Kies je functie…</option>
            {FUNCTIES.map((functie) => (
              <option key={functie} value={functie}>
                {functie}
              </option>
            ))}
          </Veld>
        </div>

        <div className="sm:max-w-[12rem]">
          <Veld
            id={id}
            naam="aantal"
            label="Aantal exemplaren"
            type="number"
            min={1}
            max={500}
            step={1}
            inputMode="numeric"
            fouten={fouten.aantal}
            waarde={tekst("aantal") ?? "1"}
          />
        </div>

        <fieldset>
          <legend className="mb-1.5 flex items-baseline gap-2 font-semibold text-paars-diep">
            Waar ga je het voor gebruiken?
            <span className="text-xs font-normal text-inkt/45">
              optioneel, meerdere mogen
            </span>
          </legend>
          <div className="mt-2 flex flex-wrap gap-2.5">
            {DOELEN.map((doel) => (
              <label
                key={doel}
                className="cursor-pointer rounded-full border border-paars-diep/15 bg-creme px-4 py-2 text-sm font-medium transition-colors has-checked:border-paars has-checked:bg-paars has-checked:text-creme has-focus-visible:outline has-focus-visible:outline-offset-2 has-focus-visible:outline-paars"
              >
                <input
                  type="checkbox"
                  name="doelen"
                  value={doel}
                  defaultChecked={lijst("doelen").includes(doel)}
                  className="sr-only"
                />
                {doel}
              </label>
            ))}
          </div>
        </fieldset>

        <Veld
          id={id}
          naam="opmerking"
          label="Opmerking of vraag"
          optioneel
          regels={4}
          placeholder="Alles wat we moeten weten. Niks invullen mag ook."
          fouten={fouten.opmerking}
          waarde={tekst("opmerking")}
        />

        <Honeypot id={id} />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Knop type="submit" disabled={bezig} className="w-full sm:w-auto">
          {bezig ? "Even geduld…" : "Zet mij op de wachtlijst"}
        </Knop>
        <p className="text-sm text-inkt/60">
          Je betaalt nu niets en zit nergens aan vast. Geen nieuwsbrief tenzij je
          daar zelf om vraagt.
        </p>
      </div>
    </form>
  );
}
