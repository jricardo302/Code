"use server";

import { maakVerwerker } from "@/lib/formulier";
import { stuurOfferteBevestiging } from "@/lib/mail";
import { offerteSchema } from "@/lib/schema";

import { VELDEN } from "./velden";

export const vraagOfferteAan = maakVerwerker({
  schema: offerteSchema,
  soort: "offerte",
  velden: VELDEN,
  naVerwerken: stuurOfferteBevestiging,
  samenvatting: (invoer) =>
    `Je aanvraag voor ${invoer.aantal} spellen voor ${invoer.organisatie} staat genoteerd.`,
});
