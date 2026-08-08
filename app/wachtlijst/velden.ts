/**
 * Welke velden dit formulier kent. Apart van `actions.ts`, omdat een bestand
 * met "use server" alleen async functies mag exporteren.
 */
export const VELDEN = [
  "naam",
  "email",
  "organisatie",
  "functie",
  "aantal",
  "doelen",
  "opmerking",
  "website",
] as const;

export const ARRAY_VELDEN = ["doelen"] as const;
