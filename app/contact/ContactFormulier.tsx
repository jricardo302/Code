"use client";

import { useActionState, useEffect, useId, useRef } from "react";

import { Knop } from "@/components/ui";
import { Formuliermelding, Gelukt, Honeypot, Veld } from "@/components/velden";
import { LEEG } from "@/lib/formulier-status";

import { stuurBericht } from "./actions";

export function ContactFormulier({ contactMail }: { contactMail: string }) {
  const [status, formActie, bezig] = useActionState(stuurBericht, LEEG);
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
          <p>
            Je bericht is binnen. We reageren meestal binnen twee werkdagen — en
            altijd met een echt antwoord van een mens.
          </p>
          <p className="text-sm text-creme/60">
            Haast? Mail dan direct naar{" "}
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
      className="rounded-3xl border border-paars-diep/12 bg-kraft/60 p-6 sm:p-9"
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
            naam="naam"
            label="Naam"
            required
            autoComplete="name"
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
        </div>

        <Veld
          id={id}
          naam="organisatie"
          label="Organisatie"
          optioneel
          autoComplete="organization"
          fouten={fouten.organisatie}
          waarde={tekst("organisatie")}
        />

        <Veld
          id={id}
          naam="onderwerp"
          label="Onderwerp"
          required
          placeholder="Waar gaat het over?"
          fouten={fouten.onderwerp}
          waarde={tekst("onderwerp")}
        />

        <Veld
          id={id}
          naam="bericht"
          label="Je bericht"
          required
          regels={6}
          fouten={fouten.bericht}
          waarde={tekst("bericht")}
        />

        <Honeypot id={id} />
      </div>

      <div className="mt-8 flex flex-col items-start gap-4 sm:flex-row sm:items-center">
        <Knop type="submit" disabled={bezig} className="w-full sm:w-auto">
          {bezig ? "Even geduld…" : "Verstuur"}
        </Knop>
        <p className="text-sm text-inkt/60">
          We gebruiken je gegevens alleen om te antwoorden.
        </p>
      </div>
    </form>
  );
}
