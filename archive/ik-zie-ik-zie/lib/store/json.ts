import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type { Aanvraag, AanvraagStore, NieuweAanvraag } from "./types";

// De turbopackIgnore hieronder houdt de build-tracer rustig: dit pad wordt pas
// tijdens runtime bepaald, niet tijdens de build.
const bestandsPad = path.resolve(
  /* turbopackIgnore: true */ process.env.AANVRAGEN_BESTAND ??
    "data/aanvragen.json",
);

/**
 * Serieel schrijven. Node draait één request niet per se alleen, dus zonder
 * deze wachtrij kan een gelijktijdige aanvraag de vorige overschrijven.
 */
let ketting: Promise<unknown> = Promise.resolve();

function inDeRij<T>(taak: () => Promise<T>): Promise<T> {
  const resultaat = ketting.then(taak, taak);
  ketting = resultaat.catch(() => undefined);
  return resultaat;
}

async function lees(): Promise<Aanvraag[]> {
  try {
    const inhoud = await readFile(bestandsPad, "utf8");
    const data: unknown = JSON.parse(inhoud);
    return Array.isArray(data) ? (data as Aanvraag[]) : [];
  } catch (fout) {
    if ((fout as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw fout;
  }
}

async function schrijf(aanvragen: Aanvraag[]): Promise<void> {
  await mkdir(path.dirname(bestandsPad), { recursive: true });
  // Eerst naar een tijdelijk bestand, dan hernoemen: nooit een half bestand.
  const tijdelijk = `${bestandsPad}.${process.pid}.tmp`;
  await writeFile(tijdelijk, `${JSON.stringify(aanvragen, null, 2)}\n`, "utf8");
  await rename(tijdelijk, bestandsPad);
}

export const jsonStore: AanvraagStore = {
  naam: "json",

  async bewaar(invoer: NieuweAanvraag) {
    return inDeRij(async () => {
      const aanvragen = await lees();
      const aanvraag: Aanvraag = {
        ...invoer,
        id: randomUUID(),
        aangemaaktOp: new Date().toISOString(),
      };
      aanvragen.push(aanvraag);
      await schrijf(aanvragen);
      return aanvraag;
    });
  },

  async lijst() {
    const aanvragen = await lees();
    return aanvragen.sort((a, b) =>
      b.aangemaaktOp.localeCompare(a.aangemaaktOp),
    );
  },
};
