import type { Aanvraag } from "./store";

const KOLOMMEN = [
  "Datum",
  "Naam",
  "E-mail",
  "Organisatie",
  "Functie",
  "Aantal",
  "Doel",
  "Opmerking",
] as const;

/**
 * Excel voert cellen die met = + - @ beginnen uit als formule. Daar zetten we
 * een apostrof voor; het blijft leesbaar en het rekent niets uit.
 */
function ontschadelijk(waarde: string): string {
  return /^[=+\-@\t\r]/.test(waarde) ? `'${waarde}` : waarde;
}

function cel(waarde: string | number | null | undefined): string {
  const tekst = ontschadelijk(String(waarde ?? ""));
  return `"${tekst.replaceAll('"', '""')}"`;
}

/**
 * Puntkomma's als scheidingsteken en een BOM vooraan: zo opent het bestand in
 * een Nederlandse Excel meteen goed, zonder importwizard.
 */
export function naarCsv(aanvragen: Aanvraag[]): string {
  const regels = [
    KOLOMMEN.map(cel).join(";"),
    ...aanvragen.map((aanvraag) =>
      [
        cel(new Date(aanvraag.aangemaaktOp).toLocaleString("nl-NL")),
        cel(aanvraag.naam),
        cel(aanvraag.email),
        cel(aanvraag.organisatie),
        cel(aanvraag.functie),
        cel(aanvraag.aantal),
        cel(aanvraag.doelen.join(", ")),
        cel(aanvraag.opmerking?.replaceAll(/\s*\n\s*/g, " ")),
      ].join(";"),
    ),
  ];

  return `﻿${regels.join("\r\n")}\r\n`;
}

export function csvBestandsnaam(nu = new Date()): string {
  return `intervisie-aanvragen-${nu.toISOString().slice(0, 10)}.csv`;
}
