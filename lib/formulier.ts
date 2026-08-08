import "server-only";

import type { z } from "zod";

import type { FormulierStatus } from "@/lib/formulier-status";
import type { VeldFouten } from "@/lib/schema";
import { ingevuldeWaarden, leesFormData } from "@/lib/schema";
import { store, type Inzending, type Soort } from "@/lib/store";

/**
 * Alle drie de formulieren op de site doen precies hetzelfde: valideren,
 * opslaan, mailen, en bij een fout de ingevulde waarden teruggeven zodat
 * niemand opnieuw hoeft te typen. Dat staat hier één keer.
 *
 * De statusvorm zelf staat in `lib/formulier-status.ts`, zodat client
 * components die kunnen importeren zonder de opslag mee te nemen.
 */

export type Verwerker = (
  vorigeStatus: FormulierStatus,
  formData: FormData,
) => Promise<FormulierStatus>;

/**
 * Bouwt een server action voor één formulier.
 *
 * `naVerwerken` mag falen zonder de inzending te verliezen: mailen gebeurt
 * daarbinnen en de opslag is op dat moment al gelukt.
 */
export function maakVerwerker<S extends z.ZodType>(opties: {
  schema: S;
  soort: Soort;
  velden: readonly string[];
  arrayVelden?: readonly string[];
  naVerwerken?: (inzending: Inzending) => Promise<void>;
  samenvatting?: (invoer: z.output<S>) => string;
}): Verwerker {
  const arrayVelden = opties.arrayVelden ?? [];

  return async function verwerk(_vorigeStatus, formData) {
    const ruw = leesFormData(formData, opties.velden, arrayVelden);
    const resultaat = opties.schema.safeParse(ruw);
    const waarden = ingevuldeWaarden(formData, opties.velden, arrayVelden);

    if (!resultaat.success) {
      return {
        status: "fout",
        fouten: veldFouten(resultaat.error),
        waarden,
      };
    }

    const invoer = resultaat.data as z.output<S> & {
      website?: string;
      naam: string;
    };

    // Honeypot ingevuld: dat doet geen mens. Doe alsof het gelukt is, zodat
    // de bot geen signaal krijgt dat hij door de mand viel.
    if (invoer.website) {
      return { status: "gelukt", voornaam: invoer.naam.split(" ")[0] };
    }

    try {
      const opslag = await store();
      // De honeypot slaan we niet op: hij zegt niets over de inzender.
      const gegevens = { ...invoer };
      delete gegevens.website;
      const inzending = await opslag.bewaar({
        soort: opties.soort,
        gegevens: gegevens as Record<string, unknown>,
      });

      await opties.naVerwerken?.(inzending);

      return {
        status: "gelukt",
        voornaam: invoer.naam.split(" ")[0],
        samenvatting: opties.samenvatting?.(invoer),
      };
    } catch (fout) {
      console.error(`[ik zie ik zie] ${opties.soort} opslaan mislukt:`, fout);
      return {
        status: "fout",
        fouten: {
          formulier: [
            "Er ging iets mis aan onze kant en je bericht is niet opgeslagen. " +
              "Probeer het zo nog een keer, of mail ons gewoon direct.",
          ],
        },
        waarden,
      };
    }
  };
}

function veldFouten(fout: z.ZodError): VeldFouten {
  const fouten: VeldFouten = {};
  for (const issue of fout.issues) {
    const veld = String(issue.path[0] ?? "formulier");
    (fouten[veld] ??= []).push(issue.message);
  }
  return fouten;
}
