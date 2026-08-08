"use client";

import { useActionState, useEffect, useId, useRef } from "react";

import { Knop } from "@/components/ui";
import { Formuliermelding, Gelukt, Honeypot, Veld } from "@/components/velden";
import { LEEG } from "@/lib/formulier-status";
import { SECTOREN } from "@/lib/schema";

import { vraagOfferteAan } from "./actions";

export function OfferteFormulier({ contactMail }: { contactMail: string }) {
  const [status, formActie, bezig] = useActionState(vraagOfferteAan, LEEG);
  const id = useId();
  const meldingRef = useRef<HTMLDivElement>(null);

  const fouten = status.status === "fout" ? status.fouten : {};
  const waarden = status.status === "fout" ? status.waarden : {};

  const tekst = (veld: string) => {
    const waarde = waarden[veld];
    return typeof waarde === "string" ? waarde : undefined;
  };

  useEffect(() => {
    if (status.status !== "leeg") {
      meldingRef.current?.scrollIntoView({ block: "center" });
    }
  }, [status]);

  if (status.status === "gelukt") {
    return (
      <div ref={meldingRef}>
        <Gelukt kop={`Bedankt, ${status.voornaam}`}>
          <p>{status.samenvatting}</p>
          <p>
            Je krijgt binnen twee werkdagen een offerte met prijs, levertijd en
            verzendwijze. Betalen op factuur kan.
          </p>
          <p className="text-sm text-creme/60">
            Wil je iets aanvullen? Mail{" "}
            <a href={`mailto:${contactMail}`}>{contactMail}</a>.
          </p>
        </Gelukt>
      </div>
    );
  }

  return (
    <form
      action={formActie}
      noValidate
      className="rounded-3xl border border-paars-diep/12 bg-creme p-6 sm:p-9"
    >
      <div ref={meldingRef} aria-live="polite">
        <Formuliermelding
          fouten={fouten.formulier}
          heeftFout={status.status === "fout"}
        />
      </div>

      <div className="space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id={id}
            naam="organisatie"
            label="Organisatie"
            required
            autoComplete="organization"
            placeholder="Naam van je organisatie"
            fouten={fouten.organisatie}
            waarde={tekst("organisatie")}
          />
          <Veld
            id={id}
            naam="sector"
            label="Sector"
            optioneel
            fouten={fouten.sector}
            waarde={tekst("sector")}
          >
            <option value="">Kies een sector…</option>
            {SECTOREN.map((sector) => (
              <option key={sector} value={sector}>
                {sector}
              </option>
            ))}
          </Veld>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id={id}
            naam="naam"
            label="Contactpersoon"
            required
            autoComplete="name"
            fouten={fouten.naam}
            waarde={tekst("naam")}
          />
          <Veld
            id={id}
            naam="functie"
            label="Functie"
            optioneel
            autoComplete="organization-title"
            fouten={fouten.functie}
            waarde={tekst("functie")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
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
          <Veld
            id={id}
            naam="telefoon"
            label="Telefoonnummer"
            type="tel"
            optioneel
            autoComplete="tel"
            fouten={fouten.telefoon}
            waarde={tekst("telefoon")}
          />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Veld
            id={id}
            naam="aantal"
            label="Aantal spellen"
            type="number"
            min={5}
            max={5000}
            step={1}
            required
            inputMode="numeric"
            placeholder="25"
            fouten={fouten.aantal}
            waarde={tekst("aantal")}
          />
          <Veld
            id={id}
            naam="gewensteLevering"
            label="Gewenste levering"
            optioneel
            placeholder="Bijv. vóór de teamdag in november"
            fouten={fouten.gewensteLevering}
            waarde={tekst("gewensteLevering")}
          />
        </div>

        <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-paars-diep/15 bg-kraft/50 px-5 py-4 text-sm has-checked:border-paars has-checked:bg-lila-bleek/60">
          <input
            type="checkbox"
            name="opFactuur"
            value="true"
            defaultChecked={tekst("opFactuur") === "true"}
            className="mt-0.5 h-4 w-4 accent-[#8B5FBF]"
          />
          <span className="text-inkt/85">
            We betalen graag op factuur
            <span className="mt-0.5 block text-xs text-inkt/60">
              Standaard betaaltermijn 30 dagen. Een inkoopordernummer mag je in
              de opmerking kwijt.
            </span>
          </span>
        </label>

        <Veld
          id={id}
          naam="opmerking"
          label="Toelichting"
          optioneel
          regels={4}
          placeholder="Bijvoorbeeld: verdelen over drie locaties, of een inkoopordernummer."
          fouten={fouten.opmerking}
          waarde={tekst("opmerking")}
        />

        <Honeypot id={id} />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Knop type="submit" disabled={bezig} className="w-full sm:w-auto">
          {bezig ? "Even geduld…" : "Vraag een offerte aan"}
        </Knop>
        <p className="text-sm text-inkt/60">
          Vrijblijvend. Je zit nergens aan vast en er komt geen verkoper langs.
        </p>
      </div>
    </form>
  );
}
