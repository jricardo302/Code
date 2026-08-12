/**
 * All guest-facing e-mail copy, per locale. Papiamentu falls back to Dutch
 * until the `pap` column is filled in — the structure is already per-locale,
 * so adding it later is filling in strings, not touching code.
 */

export type EmailLocale = "nl" | "en" | "pap";

export function resolveEmailLocale(locale: EmailLocale): "nl" | "en" {
  return locale === "en" ? "en" : "nl";
}

export const emailCopy = {
  nl: {
    confirmation: {
      subject: (ref: string) => `Bevestigd: je verblijf in Lighthouse Curaçao (${ref})`,
      heading: "Je boeking is bevestigd",
      intro:
        "Wat fijn dat je komt! Hieronder vind je de details van je verblijf. Bewaar deze e-mail — je boekingsnummer heb je nodig bij vragen.",
      datesLabel: "Verblijf",
      guestsLabel: "Gasten",
      referenceLabel: "Boekingsnummer",
      breakdownHeading: "Prijsopbouw",
      nights: (n: number, price: string) => `${n} ${n === 1 ? "nacht" : "nachten"} × ${price}`,
      cleaningFee: "Eindschoonmaak",
      tax: (pct: string) => `Logeerbelasting (${pct}%)`,
      total: "Totaal",
      paid: "Betaald",
      balance: (due: string) => `Restbedrag, te voldoen vóór ${due}`,
      balanceNone: "Volledig betaald — je hoeft niets meer te doen.",
      icsHint: "In de bijlage zit een agenda-bestand; open het om je verblijf in je agenda te zetten.",
      outro: "Tot op Curaçao!",
      signature: "Hartelijke groet,\nLighthouse Curaçao",
    },
    balanceReminder: {
      subject: (ref: string) => `Restbetaling voor je verblijf (${ref})`,
      heading: "Je verblijf komt dichterbij",
      intro: (arrival: string, amount: string) =>
        `Over vijf weken, op ${arrival}, staat de deur van Lighthouse Curaçao voor je open. Voor die tijd ontvangen we graag het restbedrag van ${amount}.`,
      payButton: "Restbedrag betalen",
      deadline: (due: string) => `Graag vóór ${due}.`,
      outro: "Vragen over je betaling? Antwoord gerust op deze e-mail.",
    },
    arrival: {
      subject: "Over drie dagen: je verblijf in Lighthouse Curaçao",
      heading: "Bijna zover — praktische informatie",
      intro: (arrival: string) =>
        `Op ${arrival} verwelkomen we je in Lighthouse Curaçao, Kaya Platio 18 in Katoentuin, Willemstad. Alles wat je bij aankomst nodig hebt staat hieronder.`,
      directionsHeading: "Route",
      directions:
        "Vanaf luchthaven Hato is het 15 minuten rijden: volg de borden Willemstad (Otrobanda), neem op de rotonde bij Juliana­plein de afslag Katoentuin en volg Kaya Platio tot nummer 18 — het huis met de witte muur en de zwarte poort.",
      keysHeading: "Sleuteloverdracht",
      keys: (checkIn: string) =>
        `Inchecken kan vanaf ${checkIn}. Onze beheerder verwelkomt je persoonlijk en laat je het huis zien. Deel je aankomsttijd (en vluchtnummer) via WhatsApp, dan staat alles klaar.`,
      wifiHeading: "Wifi",
      wifi: "Netwerknaam en wachtwoord vind je op de kaart naast de koelkast; het netwerk dekt het hele huis en het terras.",
      poolHeading: "Zwembad en huis",
      pool: "Het zwembad wordt wekelijks onderhouden. Handdoeken, strandlakens, linnengoed en een kluisje zijn aanwezig. De airco's werken per kamer.",
      outro: "Goede reis — tot over een paar dagen!",
    },
  },
  en: {
    confirmation: {
      subject: (ref: string) => `Confirmed: your stay at Lighthouse Curaçao (${ref})`,
      heading: "Your booking is confirmed",
      intro:
        "We look forward to welcoming you! Your stay details are below. Keep this e-mail — you'll need your booking reference for any questions.",
      datesLabel: "Stay",
      guestsLabel: "Guests",
      referenceLabel: "Booking reference",
      breakdownHeading: "Price breakdown",
      nights: (n: number, price: string) => `${n} ${n === 1 ? "night" : "nights"} × ${price}`,
      cleaningFee: "Final cleaning",
      tax: (pct: string) => `Turnover tax (${pct}%)`,
      total: "Total",
      paid: "Paid",
      balance: (due: string) => `Balance, due before ${due}`,
      balanceNone: "Paid in full — nothing left to do.",
      icsHint: "A calendar file is attached; open it to add your stay to your calendar.",
      outro: "See you on Curaçao!",
      signature: "Warm regards,\nLighthouse Curaçao",
    },
    balanceReminder: {
      subject: (ref: string) => `Balance payment for your stay (${ref})`,
      heading: "Your stay is getting close",
      intro: (arrival: string, amount: string) =>
        `In five weeks, on ${arrival}, the doors of Lighthouse Curaçao open for you. Before then, we kindly ask you to settle the remaining balance of ${amount}.`,
      payButton: "Pay the balance",
      deadline: (due: string) => `Please pay before ${due}.`,
      outro: "Questions about your payment? Just reply to this e-mail.",
    },
    arrival: {
      subject: "Three days to go: your stay at Lighthouse Curaçao",
      heading: "Almost there — practical information",
      intro: (arrival: string) =>
        `On ${arrival} we welcome you to Lighthouse Curaçao, Kaya Platio 18 in Katoentuin, Willemstad. Everything you need on arrival is below.`,
      directionsHeading: "Directions",
      directions:
        "From Hato airport it is a 15-minute drive: follow the signs to Willemstad (Otrobanda), take the Katoentuin exit at the Julianaplein roundabout and follow Kaya Platio to number 18 — the house with the white wall and the black gate.",
      keysHeading: "Key handover",
      keys: (checkIn: string) =>
        `Check-in is possible from ${checkIn}. Our property manager will welcome you in person and show you the house. Share your arrival time (and flight number) via WhatsApp so everything is ready.`,
      wifiHeading: "Wifi",
      wifi: "The network name and password are on the card next to the fridge; coverage includes the whole house and the terrace.",
      poolHeading: "Pool and house",
      pool: "The pool is serviced weekly. Towels, beach towels, linen and a safe are provided. Each room has its own air-conditioning.",
      outro: "Safe travels — see you in a few days!",
    },
  },
} as const;
