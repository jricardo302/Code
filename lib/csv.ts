import type { Inzending, Soort } from "./store";

/**
 * CSV-export van inzendingen.
 *
 * De kolommen worden afgeleid uit de gegevens zelf: elke soort heeft andere
 * velden, en een vaste kolomlijst zou bij een nieuw formulier stilzwijgend
 * gegevens weglaten. De eerste drie kolommen liggen wel vast, zodat elk bestand
 * er hetzelfde uitziet.
 */

const VASTE_KOLOMMEN = ["Datum", "Soort", "Id"] as const;

/**
 * Excel voert cellen die met = + - @ beginnen uit als formule. Daar zetten we
 * een apostrof voor; het blijft leesbaar en het rekent niets uit.
 */
function ontschadelijk(waarde: string): string {
  return /^[=+\-@\t\r]/.test(waarde) ? `'${waarde}` : waarde;
}

function cel(waarde: unknown): string {
  const tekst =
    waarde == null
      ? ""
      : Array.isArray(waarde)
        ? waarde.join(", ")
        : typeof waarde === "object"
          ? JSON.stringify(waarde)
          : String(waarde);

  // Regeleindes plat, anders breekt de rij in Excel over meerdere regels.
  return `"${ontschadelijk(tekst.replaceAll(/\s*\n\s*/g, " ")).replaceAll('"', '""')}"`;
}

/** Alle veldnamen die in deze verzameling voorkomen, op volgorde van verschijnen. */
function gegevenskolommen(inzendingen: Inzending[]): string[] {
  const kolommen = new Set<string>();
  for (const inzending of inzendingen) {
    for (const sleutel of Object.keys(inzending.gegevens)) {
      kolommen.add(sleutel);
    }
  }
  return [...kolommen];
}

/**
 * Puntkomma's als scheidingsteken en een BOM vooraan: zo opent het bestand in
 * een Nederlandse Excel meteen goed, zonder importwizard.
 */
export function naarCsv(inzendingen: Inzending[]): string {
  const extra = gegevenskolommen(inzendingen);
  const regels = [
    [...VASTE_KOLOMMEN, ...extra].map(cel).join(";"),
    ...inzendingen.map((inzending) =>
      [
        cel(new Date(inzending.aangemaaktOp).toLocaleString("nl-NL")),
        cel(inzending.soort),
        cel(inzending.id),
        ...extra.map((kolom) => cel(inzending.gegevens[kolom])),
      ].join(";"),
    ),
  ];

  return `﻿${regels.join("\r\n")}\r\n`;
}

export function csvBestandsnaam(soort: Soort | "alles", nu = new Date()): string {
  return `ikzieikzie-${soort}-${nu.toISOString().slice(0, 10)}.csv`;
}
