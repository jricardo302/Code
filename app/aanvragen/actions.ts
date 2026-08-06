"use server";

import { z } from "zod";

import type {
  AanvraagStatus,
  IngevuldeWaarden,
} from "@/lib/aanvraag-status";
import { stuurBevestiging } from "@/lib/mail";
import { aanvraagSchema, leesFormData, type VeldFouten } from "@/lib/schema";
import { store } from "@/lib/store";

function alsTekst(waarde: FormDataEntryValue | null): string {
  return typeof waarde === "string" ? waarde : "";
}

export async function verstuurAanvraag(
  _vorigeStatus: AanvraagStatus,
  formData: FormData,
): Promise<AanvraagStatus> {
  // Server-side validatie — de client-side checks zijn een service, geen slot.
  const resultaat = aanvraagSchema.safeParse(leesFormData(formData));

  const waarden: IngevuldeWaarden = {
    naam: alsTekst(formData.get("naam")),
    email: alsTekst(formData.get("email")),
    organisatie: alsTekst(formData.get("organisatie")),
    functie: alsTekst(formData.get("functie")),
    aantal: alsTekst(formData.get("aantal")) || "1",
    doelen: formData.getAll("doelen").map(alsTekst).filter(Boolean),
    opmerking: alsTekst(formData.get("opmerking")),
  };

  if (!resultaat.success) {
    return {
      status: "fout",
      fouten: z.flattenError(resultaat.error).fieldErrors as VeldFouten,
      waarden,
    };
  }

  const invoer = resultaat.data;

  // Honeypot ingevuld: dat doet geen mens. Doe alsof het gelukt is.
  if (invoer.website) {
    return {
      status: "gelukt",
      voornaam: invoer.naam.split(" ")[0],
      aantal: invoer.aantal,
    };
  }

  try {
    const opslag = await store();
    const aanvraag = await opslag.bewaar({
      naam: invoer.naam,
      email: invoer.email,
      organisatie: invoer.organisatie ?? null,
      functie: invoer.functie ?? null,
      aantal: invoer.aantal,
      doelen: invoer.doelen,
      opmerking: invoer.opmerking ?? null,
    });

    await stuurBevestiging(aanvraag);

    return {
      status: "gelukt",
      voornaam: aanvraag.naam.split(" ")[0],
      aantal: aanvraag.aantal,
    };
  } catch (fout) {
    console.error("[InterVISIE] Aanvraag opslaan mislukt:", fout);
    return {
      status: "fout",
      fouten: {
        formulier: [
          "Er ging iets mis aan onze kant en je aanvraag is niet opgeslagen. " +
            "Probeer het zo nog een keer, of mail ons gewoon even direct.",
        ],
      },
      waarden,
    };
  }
}
