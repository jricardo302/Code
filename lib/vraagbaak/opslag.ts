"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Kleine localStorage-haak voor de dingen die deze app onthoudt: je rol, je
 * dienstverband, welke inwerkpunten je hebt afgevinkt en je beste quizscore.
 *
 * Alles blijft in de browser van de medewerker. Er gaat niets naar een server
 * en er staan dus ook nooit cliënt- of personeelsgegevens in — daar zijn Zilliz
 * en het personeelsdossier voor.
 *
 * localStorage is een externe bron die React niet kent, dus lezen we hem via
 * `useSyncExternalStore`. De server-momentopname is bewust leeg: dan is de HTML
 * van server en client identiek en vult React na hydratie de opgeslagen waarde
 * in. Twee tabbladen naast elkaar blijven gelijk lopen, want we luisteren ook
 * naar het storage-event van de browser.
 *
 * `standaard` moet tussen renders dezelfde identiteit houden — geef dus een
 * primitieve waarde mee, of een constante buiten de component. Een verse
 * literal (`[]`) zou elke render een nieuwe waarde opleveren.
 */

const PREFIX = "vraagbaak:";

/** Het storage-event vuurt niet in het tabblad dat zelf schrijft. */
const luisteraars = new Map<string, Set<() => void>>();

function lees(sleutel: string): string | null {
  try {
    return window.localStorage.getItem(sleutel);
  } catch {
    // Privémodus of geblokkeerde opslag: dan werkt alles zonder geheugen.
    // Dat is vervelender, niet stuk.
    return null;
  }
}

function ontleed<T>(rauw: string | null, standaard: T): T {
  if (rauw === null) return standaard;
  try {
    return JSON.parse(rauw) as T;
  } catch {
    return standaard;
  }
}

export function useOpslag<T>(sleutel: string, standaard: T) {
  const volledig = PREFIX + sleutel;

  const abonneer = useCallback(
    (herteken: () => void) => {
      let set = luisteraars.get(volledig);
      if (!set) {
        set = new Set();
        luisteraars.set(volledig, set);
      }
      set.add(herteken);

      const opStorage = (e: StorageEvent) => {
        if (e.key === volledig) herteken();
      };
      window.addEventListener("storage", opStorage);

      return () => {
        set.delete(herteken);
        window.removeEventListener("storage", opStorage);
      };
    },
    [volledig],
  );

  // Een string is stabiel tussen renders; parsen doen we pas in de useMemo,
  // anders geeft elke aanroep een nieuw object terug en blijft React herhalen.
  const rauw = useSyncExternalStore(
    abonneer,
    () => lees(volledig),
    () => null,
  );

  const waarde = useMemo<T>(() => ontleed(rauw, standaard), [rauw, standaard]);

  const bewaar = useCallback(
    (nieuw: T | ((vorig: T) => T)) => {
      // Bij een functie-update lezen we opnieuw uit de opslag in plaats van
      // uit de render, zodat twee wijzigingen vlak na elkaar niet over elkaar
      // heen schrijven.
      const volgend =
        typeof nieuw === "function"
          ? (nieuw as (vorig: T) => T)(ontleed(lees(volledig), standaard))
          : nieuw;

      try {
        window.localStorage.setItem(volledig, JSON.stringify(volgend));
      } catch {
        // Zie boven: zonder opslag werkt de app, alleen zonder geheugen.
      }
      luisteraars.get(volledig)?.forEach((herteken) => herteken());
    },
    [volledig, standaard],
  );

  return [waarde, bewaar] as const;
}

const GEEN_ABONNEMENT = () => () => {};

/**
 * Is de client gehydrateerd? Voor het handjevol dingen dat de server niet kan
 * weten, zoals hoe laat het bij jou is.
 */
export function useGehydrateerd(): boolean {
  return useSyncExternalStore(
    GEEN_ABONNEMENT,
    () => true,
    () => false,
  );
}
