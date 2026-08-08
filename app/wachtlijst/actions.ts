"use server";

import { maakVerwerker } from "@/lib/formulier";
import { stuurWachtlijstBevestiging } from "@/lib/mail";
import { wachtlijstSchema } from "@/lib/schema";

import { ARRAY_VELDEN, VELDEN } from "./velden";

export const meldAanVoorWachtlijst = maakVerwerker({
  schema: wachtlijstSchema,
  soort: "wachtlijst",
  velden: VELDEN,
  arrayVelden: ARRAY_VELDEN,
  naVerwerken: stuurWachtlijstBevestiging,
  samenvatting: (invoer) =>
    invoer.aantal === 1
      ? "Eén exemplaar staat op je naam."
      : `${invoer.aantal} exemplaren staan op je naam.`,
});
