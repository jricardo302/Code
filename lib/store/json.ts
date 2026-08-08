import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, writeFile } from "node:fs/promises";
import path from "node:path";

import type {
  Inzending,
  InzendingStore,
  NieuweInzending,
  Soort,
} from "./types";

// De turbopackIgnore hieronder houdt de build-tracer rustig: dit pad wordt pas
// tijdens runtime bepaald, niet tijdens de build.
const bestandsPad = path.resolve(
  /* turbopackIgnore: true */ process.env.INZENDINGEN_BESTAND ??
    "data/inzendingen.json",
);

/**
 * Serieel schrijven. Node draait één request niet per se alleen, dus zonder
 * deze wachtrij kan een gelijktijdige inzending de vorige overschrijven.
 */
let ketting: Promise<unknown> = Promise.resolve();

function inDeRij<T>(taak: () => Promise<T>): Promise<T> {
  const resultaat = ketting.then(taak, taak);
  ketting = resultaat.catch(() => undefined);
  return resultaat;
}

async function lees(): Promise<Inzending[]> {
  try {
    const inhoud = await readFile(bestandsPad, "utf8");
    const data: unknown = JSON.parse(inhoud);
    return Array.isArray(data) ? (data as Inzending[]) : [];
  } catch (fout) {
    if ((fout as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw fout;
  }
}

async function schrijf(inzendingen: Inzending[]): Promise<void> {
  await mkdir(path.dirname(bestandsPad), { recursive: true });
  // Eerst naar een tijdelijk bestand, dan hernoemen: nooit een half bestand.
  const tijdelijk = `${bestandsPad}.${process.pid}.tmp`;
  await writeFile(tijdelijk, `${JSON.stringify(inzendingen, null, 2)}\n`, "utf8");
  await rename(tijdelijk, bestandsPad);
}

export const jsonStore: InzendingStore = {
  naam: "json",

  async bewaar(invoer: NieuweInzending) {
    return inDeRij(async () => {
      const inzendingen = await lees();
      const inzending: Inzending = {
        ...invoer,
        id: randomUUID(),
        aangemaaktOp: new Date().toISOString(),
      };
      inzendingen.push(inzending);
      await schrijf(inzendingen);
      return inzending;
    });
  },

  async lijst(soort?: Soort) {
    const inzendingen = await lees();
    return inzendingen
      .filter((inzending) => !soort || inzending.soort === soort)
      .sort((a, b) => b.aangemaaktOp.localeCompare(a.aangemaaktOp));
  },
};
