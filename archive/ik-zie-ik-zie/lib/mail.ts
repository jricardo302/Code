import type { Aanvraag } from "./store";

/**
 * Optionele bevestigingsmail via Resend (https://resend.com) — puur `fetch`,
 * dus geen extra dependency.
 *
 * TODO (optioneel): zet deze env-vars om mail aan te zetten.
 *   RESEND_API_KEY   = re_xxxxxxxx      (aanmaken op resend.com/api-keys)
 *   MAIL_AFZENDER    = "Ik zie ik zie... <hallo@jouwdomein.nl>"  (geverifieerd domein)
 *   MAIL_KOPIE_NAAR  = jij@jouwdomein.nl (optioneel: seintje bij elke aanvraag)
 *
 * Staat RESEND_API_KEY niet ingevuld, dan slaat de site het mailen stilletjes
 * over. De aanvraag is dan nog steeds opgeslagen — je ziet 'm terug op /beheer.
 * Een andere provider? Vervang alleen `verstuur()` hieronder.
 */

const API = "https://api.resend.com/emails";

export function mailIsGeconfigureerd(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_AFZENDER);
}

async function verstuur(bericht: {
  to: string;
  subject: string;
  text: string;
}): Promise<void> {
  const antwoord = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from: process.env.MAIL_AFZENDER, ...bericht }),
  });

  if (!antwoord.ok) {
    throw new Error(
      `Resend gaf ${antwoord.status}: ${await antwoord.text().catch(() => "")}`,
    );
  }
}

/**
 * Verstuurt de bevestiging (en optioneel een kopie naar jezelf). Faalt nooit
 * hard: een aanvraag die is opgeslagen mag niet stuklopen op een mailserver.
 */
export async function stuurBevestiging(aanvraag: Aanvraag): Promise<void> {
  if (!mailIsGeconfigureerd()) return;

  const voornaam = aanvraag.naam.split(" ")[0];

  try {
    await verstuur({
      to: aanvraag.email,
      subject: "Je bestelling staat genoteerd",
      text: [
        `Hoi ${voornaam},`,
        "",
        `Je bestelling is binnen: ${aanvraag.aantal} ${
          aanvraag.aantal === 1 ? "exemplaar" : "exemplaren"
        } keer Ik zie ik zie…`,
        "",
        "Je hoeft nu niets te doen. Zodra de spellen klaarliggen, mailen we je",
        "over levering en prijs. Betalen doe je pas daarna.",
        "",
        "Klopt er iets niet, of wil je je bestelling wijzigen? Reageer gewoon op",
        "deze mail.",
        "",
        "Tot snel,",
        "Ik zie ik zie…",
      ].join("\n"),
    });

    const kopieNaar = process.env.MAIL_KOPIE_NAAR;
    if (kopieNaar) {
      await verstuur({
        to: kopieNaar,
        subject: `Nieuwe bestelling: ${aanvraag.naam}`,
        text: [
          `Naam:        ${aanvraag.naam}`,
          `E-mail:      ${aanvraag.email}`,
          `Organisatie: ${aanvraag.organisatie ?? "-"}`,
          `Functie:     ${aanvraag.functie ?? "-"}`,
          `Aantal:      ${aanvraag.aantal}`,
          `Doel:        ${aanvraag.doelen.join(", ") || "-"}`,
          "",
          `Opmerking:   ${aanvraag.opmerking ?? "-"}`,
        ].join("\n"),
      });
    }
  } catch (fout) {
    console.error("[ik zie ik zie] Bevestigingsmail mislukt:", fout);
  }
}
