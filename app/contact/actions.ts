"use server";

import { maakVerwerker } from "@/lib/formulier";
import { stuurContactBevestiging } from "@/lib/mail";
import { contactSchema } from "@/lib/schema";

import { VELDEN } from "./velden";

export const stuurBericht = maakVerwerker({
  schema: contactSchema,
  soort: "contact",
  velden: VELDEN,
  naVerwerken: stuurContactBevestiging,
});
