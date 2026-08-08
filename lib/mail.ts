import { CONTACT_MAIL, MERK, PRODUCT_NAAM } from "@/lib/site";
import type { Inzending } from "@/lib/store";

/**
 * Optionele transactiemail via Resend (https://resend.com) — puur `fetch`,
 * dus geen extra dependency.
 *
 * Zonder RESEND_API_KEY slaat de site het mailen stilletjes over. Wat er is
 * ingevuld staat dan nog steeds in de opslag en op /beheer. Dat is de juiste
 * volgorde: een inzending die is opgeslagen mag nooit sneuvelen op een
 * mailserver.
 *
 * Andere provider (Postmark, SendGrid, eigen SMTP)? Vervang alleen `verstuur()`.
 */

const API = "https://api.resend.com/emails";

export function mailIsGeconfigureerd(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.MAIL_AFZENDER);
}

async function verstuur(bericht: {
  to: string;
  subject: string;
  text: string;
  replyTo?: string;
}): Promise<void> {
  const antwoord = await fetch(API, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: process.env.MAIL_AFZENDER,
      to: bericht.to,
      subject: bericht.subject,
      text: bericht.text,
      ...(bericht.replyTo ? { reply_to: bericht.replyTo } : {}),
    }),
  });

  if (!antwoord.ok) {
    throw new Error(
      `Resend gaf ${antwoord.status}: ${await antwoord.text().catch(() => "")}`,
    );
  }
}

/** Verstuurt, maar laat de aanroeper nooit struikelen over een mailfout. */
async function probeer(taak: () => Promise<void>, wat: string): Promise<void> {
  if (!mailIsGeconfigureerd()) return;
  try {
    await taak();
  } catch (fout) {
    console.error(`[ik zie ik zie] ${wat} mislukt:`, fout);
  }
}

const ondertekening = ["", "Tot ziens,", MERK, "ikzieikzie.eu"].join("\n");

// ---------------------------------------------------------------------------
// Wachtlijst
// ---------------------------------------------------------------------------

export async function stuurWachtlijstBevestiging(
  inzending: Inzending,
): Promise<void> {
  const gegevens = inzending.gegevens as {
    naam: string;
    email: string;
    aantal: number;
    organisatie?: string;
    functie?: string;
    doelen?: string[];
    opmerking?: string;
  };

  await probeer(async () => {
    await verstuur({
      to: gegevens.email,
      subject: "Je staat op de wachtlijst",
      text: [
        `Hoi ${gegevens.naam.split(" ")[0]},`,
        "",
        `Je staat genoteerd voor ${gegevens.aantal} ${
          gegevens.aantal === 1 ? "exemplaar" : "exemplaren"
        } van ${PRODUCT_NAAM}.`,
        "",
        "Je hoeft nu niets te doen en je hebt nog nergens voor betaald.",
        "Zodra de eerste oplage van de pers komt, krijg je als eerste bericht",
        "met de leverdatum. Pas dan bestel je echt.",
        "",
        "Wil je je aanmelding wijzigen of intrekken? Reageer op deze mail.",
        ondertekening,
      ].join("\n"),
    });

    await kopieNaarOns("Nieuwe aanmelding wachtlijst", [
      `Naam:        ${gegevens.naam}`,
      `E-mail:      ${gegevens.email}`,
      `Organisatie: ${gegevens.organisatie ?? "-"}`,
      `Functie:     ${gegevens.functie ?? "-"}`,
      `Aantal:      ${gegevens.aantal}`,
      `Doel:        ${gegevens.doelen?.join(", ") || "-"}`,
      "",
      `Opmerking:   ${gegevens.opmerking ?? "-"}`,
    ]);
  }, "Wachtlijstbevestiging");
}

// ---------------------------------------------------------------------------
// Offerte
// ---------------------------------------------------------------------------

export async function stuurOfferteBevestiging(
  inzending: Inzending,
): Promise<void> {
  const g = inzending.gegevens as {
    naam: string;
    email: string;
    organisatie: string;
    aantal: number;
    functie?: string;
    telefoon?: string;
    sector?: string;
    opFactuur?: boolean;
    gewensteLevering?: string;
    opmerking?: string;
  };

  await probeer(async () => {
    await verstuur({
      to: g.email,
      subject: "We hebben je offerteaanvraag binnen",
      text: [
        `Hoi ${g.naam.split(" ")[0]},`,
        "",
        `Je aanvraag voor ${g.aantal} spellen voor ${g.organisatie} staat bij ons.`,
        "We sturen binnen twee werkdagen een offerte met prijs, levertijd en",
        "verzendwijze. Betalen op factuur kan.",
        "",
        `Klopt er iets niet, of wil je het aantal wijzigen? Mail ${CONTACT_MAIL}.`,
        ondertekening,
      ].join("\n"),
      replyTo: g.email,
    });

    await kopieNaarOns(`Offerteaanvraag: ${g.organisatie} (${g.aantal} stuks)`, [
      `Organisatie: ${g.organisatie}`,
      `Contact:     ${g.naam} — ${g.email}`,
      `Functie:     ${g.functie ?? "-"}`,
      `Telefoon:    ${g.telefoon ?? "-"}`,
      `Sector:      ${g.sector ?? "-"}`,
      `Aantal:      ${g.aantal}`,
      `Op factuur:  ${g.opFactuur ? "ja" : "nee"}`,
      `Levering:    ${g.gewensteLevering ?? "-"}`,
      "",
      `Opmerking:   ${g.opmerking ?? "-"}`,
    ]);
  }, "Offertebevestiging");
}

// ---------------------------------------------------------------------------
// Contact
// ---------------------------------------------------------------------------

export async function stuurContactBevestiging(
  inzending: Inzending,
): Promise<void> {
  const g = inzending.gegevens as {
    naam: string;
    email: string;
    organisatie?: string;
    onderwerp: string;
    bericht: string;
  };

  await probeer(async () => {
    await verstuur({
      to: g.email,
      subject: `We hebben je bericht ontvangen — ${g.onderwerp}`,
      text: [
        `Hoi ${g.naam.split(" ")[0]},`,
        "",
        "Je bericht is binnen. We reageren meestal binnen twee werkdagen.",
        "",
        "Dit schreef je:",
        "",
        g.bericht,
        ondertekening,
      ].join("\n"),
    });

    await kopieNaarOns(`Contact: ${g.onderwerp}`, [
      `Van:         ${g.naam} — ${g.email}`,
      `Organisatie: ${g.organisatie ?? "-"}`,
      "",
      g.bericht,
    ]);
  }, "Contactbevestiging");
}

// ---------------------------------------------------------------------------
// Bestelling
// ---------------------------------------------------------------------------

export async function stuurBestelbevestiging(bestelling: {
  email: string | null;
  naam: string | null;
  aantal: number | null;
  bedragCenten: number | null;
  sessieId: string;
}): Promise<void> {
  if (!bestelling.email) return;

  const bedrag =
    bestelling.bedragCenten != null
      ? new Intl.NumberFormat("nl-NL", {
          style: "currency",
          currency: "EUR",
        }).format(bestelling.bedragCenten / 100)
      : "—";

  await probeer(async () => {
    await verstuur({
      to: bestelling.email!,
      subject: "Bedankt voor je bestelling",
      text: [
        `Hoi ${(bestelling.naam ?? "").split(" ")[0] || "daar"},`,
        "",
        `Je bestelling van ${bestelling.aantal ?? "?"}x ${PRODUCT_NAAM} is betaald.`,
        `Totaalbedrag: ${bedrag} inclusief btw en verzending.`,
        "",
        "Je krijgt bericht zodra het pakket onderweg is. Stripe stuurt je",
        "daarnaast een betaalbewijs.",
        "",
        "Wil je herroepen? Dat kan tot 14 dagen na ontvangst, zonder opgaaf",
        "van reden. Zie ikzieikzie.eu/juridisch/retourneren.",
        ondertekening,
      ].join("\n"),
    });

    await kopieNaarOns("Nieuwe betaalde bestelling", [
      `Naam:    ${bestelling.naam ?? "-"}`,
      `E-mail:  ${bestelling.email}`,
      `Aantal:  ${bestelling.aantal ?? "-"}`,
      `Bedrag:  ${bedrag}`,
      `Stripe:  ${bestelling.sessieId}`,
    ]);
  }, "Bestelbevestiging");
}

// ---------------------------------------------------------------------------

async function kopieNaarOns(onderwerp: string, regels: string[]): Promise<void> {
  const naar = process.env.MAIL_KOPIE_NAAR;
  if (!naar) return;
  await verstuur({ to: naar, subject: onderwerp, text: regels.join("\n") });
}
