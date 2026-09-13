/**
 * Map 08 — Veelgestelde vragen.
 * Bron: "Veelgestelde vragen", versie 1.1 (5 september 2026).
 */

export type Vraag = {
  id: string;
  categorie: "Werk en cliënten" | "Veiligheid" | "Administratie" | "Praktisch";
  vraag: string;
  antwoord: string;
  /** Optionele doorverwijzing binnen de app. */
  naar?: { tekst: string; href: string };
};

export const VRAGEN: Vraag[] = [
  {
    id: "aanmelding-eigen-mail",
    categorie: "Werk en cliënten",
    vraag: "Ik heb een nieuwe aanmelding binnengekregen op mijn eigen mailadres. Wat nu?",
    antwoord:
      "Stuur hem door naar aanmelden@ricardojeugdhulp.nl. Alle aanmeldingen lopen via dat adres, zodat niets blijft liggen als iemand ziek of vrij is.",
    naar: { tekst: "Zie het aanmeldproces", href: "/vraagbaak/werk" },
  },
  {
    id: "casus-past",
    categorie: "Werk en cliënten",
    vraag: "Ik twijfel of een casus bij ons past.",
    antwoord:
      "Vraag de verwijzer de casus op de mail te zetten, breng het in in het interne overleg en besluit samen. We starten pas bij een passende hulpvraag en een goede match.",
  },
  {
    id: "no-show",
    categorie: "Werk en cliënten",
    vraag: "Mijn cliënt komt structureel niet opdagen.",
    antwoord:
      "Leg vast wat je hebt gedaan om contact te krijgen en meld het bij de zorgcoördinator. In Almere declareer je bij no-show alleen de reistijd.",
  },
  {
    id: "beschikking-loopt-af",
    categorie: "Werk en cliënten",
    vraag: "De beschikking van mijn cliënt loopt bijna af.",
    antwoord:
      "Stel de evaluatie op en stem af met de zorgcoördinator. Voor JGZ Almere moet het evaluatieformulier twee maanden vóór de einddatum binnen zijn bij aanmelden@jgzalmere.nl, met aanmelden@ricardojeugdhulp.nl in cc. Bij SAVE, WSG en Leger des Heils loopt de verlenging rechtstreeks via hen.",
    naar: { tekst: "Gebruik de verlengwijzer", href: "/vraagbaak/werk#verlengen" },
  },
  {
    id: "jgz-jgo",
    categorie: "Werk en cliënten",
    vraag: "Wat is het verschil tussen JGZ en JGO?",
    antwoord:
      "JGZ is de gemeentelijke jeugdgezondheidszorg en toegang in Almere. JGO is het jeugdhulpteam op scholen voor speciaal onderwijs. Verschillende routes, verschillende contactpersonen.",
  },
  {
    id: "beschikking-contract",
    categorie: "Werk en cliënten",
    vraag: "Wat is het verschil tussen een beschikking en een contract?",
    antwoord:
      "Een beschikking is de toekenning van zorg aan de cliënt door de gemeente. Een contract of raamovereenkomst is de afspraak tussen jou en Ricardo Jeugdhulp.",
  },
  {
    id: "zorgen-veiligheid",
    categorie: "Veiligheid",
    vraag: "Ik maak me zorgen over de veiligheid van een kind, maar ik weet het niet zeker.",
    antwoord:
      "Juist dan overleggen. Leg je signalen feitelijk vast, bespreek met je leidinggevende en schakel de aandachtsfunctionaris (Joël Ricardo) in. Je mag ook anoniem advies vragen bij Veilig Thuis: 0800-2000, 24 uur per dag.",
    naar: { tekst: "Naar de escalatiekaart", href: "/vraagbaak/nood" },
  },
  {
    id: "niet-meer-leven",
    categorie: "Veiligheid",
    vraag: "Een jongere zegt dat hij niet meer wil leven.",
    antwoord:
      "Bij directe dreiging bel je 112, anders de crisisdienst GGZ. Neem elke uiting serieus, leg vast, maak veiligheidsafspraken en meld via de incidentenprocedure.",
    naar: { tekst: "Stappen bij suïcidaliteit", href: "/vraagbaak/nood#suicidaliteit" },
  },
  {
    id: "verkeerde-mail",
    categorie: "Veiligheid",
    vraag: "Ik heb per ongeluk een mail met cliëntgegevens naar de verkeerde persoon gestuurd.",
    antwoord:
      "Meld het direct bij de directie. Niet eerst zelf uitzoeken hoe erg het is. Er geldt een wettelijke meldtermijn.",
    naar: { tekst: "Stappen bij een datalek", href: "/vraagbaak/nood#datalek" },
  },
  {
    id: "incident-groep",
    categorie: "Veiligheid",
    vraag: "Er is een incident geweest tijdens een groepsactiviteit.",
    antwoord:
      "Eerst veiligheid, dan melden bij je leidinggevende diezelfde dag, daarna MIC-melding volgens P 2.3.1.",
  },
  {
    id: "uren-deadline",
    categorie: "Administratie",
    vraag: "Wanneer moeten mijn uren binnen zijn?",
    antwoord:
      "Vóór de 1e van de nieuwe maand, in minuten en onder de juiste productcode. In de eerste week van de maand wordt er gedeclareerd bij de gemeente.",
    naar: { tekst: "Alles over uren", href: "/vraagbaak/werk#uren" },
  },
  {
    id: "productcode",
    categorie: "Administratie",
    vraag: "Ik weet niet welke productcode ik moet gebruiken.",
    antwoord:
      "Vraag het aan de zorgcoördinator. Gebruik altijd de codelijst van de gemeente van de cliënt; Almere en Lelystad hebben verschillende codes en die zijn niet uitwisselbaar.",
  },
  {
    id: "factuur-zzp",
    categorie: "Administratie",
    vraag: "Waar stuur ik mijn factuur als zzp'er naartoe?",
    antwoord:
      "Naar finance@ricardojeugdhulp.nl, op basis van de goedgekeurde urenuitdraai.",
  },
  {
    id: "lege-formulieren",
    categorie: "Administratie",
    vraag: "Waar vind ik de lege formulieren?",
    antwoord:
      "Bij Werkprocessen staat een overzicht met directe links naar de originele formulieren in de kwaliteitsmap.",
    naar: { tekst: "Naar de formats", href: "/vraagbaak/werk#formats" },
  },
  {
    id: "zilliz-lukt-niet",
    categorie: "Praktisch",
    vraag: "Ik kom niet in Zilliz.",
    antwoord:
      "Meld dit bij de zorgcoördinator. Gebruik nooit het account van een collega.",
  },
  {
    id: "geen-toegang",
    categorie: "Praktisch",
    vraag: "Ik kan een document uit de kennisbank niet openen.",
    antwoord:
      "Toegang wordt per document verleend. Vraag toegang aan bij de directie; ga niet zelf op zoek naar een andere versie van het bestand.",
  },
  {
    id: "ziek",
    categorie: "Praktisch",
    vraag: "Ik ben ziek.",
    antwoord:
      "Loondienst: meld je dezelfde ochtend bij je leidinggevende volgens het verzuimprotocol. Zzp: meld verhindering zo snel mogelijk bij de zorgcoördinator, zodat cliënten opgevangen kunnen worden.",
  },
  {
    id: "casuistiek-zzp",
    categorie: "Praktisch",
    vraag: "Moet ik als zzp'er ook naar het casuïstiekoverleg?",
    antwoord:
      "Ja. Het maandelijkse casuïstiekoverleg van twee uur is verplicht voor alle begeleiders, ook voor zzp'ers.",
  },
  {
    id: "downloaden",
    categorie: "Praktisch",
    vraag: "Mag ik documenten uit deze kennisbank downloaden of doorsturen?",
    antwoord:
      "Binnen de organisatie mag je ze gebruiken voor je werk. Deel niets buiten de organisatie en niet met collega's zonder toegang, en maak geen eigen kopieën van protocollen: werk altijd via de link, zodat je zeker weet dat je de geldende versie hebt.",
  },
  {
    id: "klopt-niet",
    categorie: "Praktisch",
    vraag: "Ik zie iets dat niet klopt in een document.",
    antwoord:
      "Meld het bij de directie. Alleen de beheerder past documenten aan; zo blijft er één versie geldig en blijft het auditspoor kloppen.",
  },
];

export const VRAAG_CATEGORIEEN = [
  "Werk en cliënten",
  "Veiligheid",
  "Administratie",
  "Praktisch",
] as const;

export const VRAAG_ONTBREEKT =
  "Staat je vraag er niet bij? Stel hem aan de zorgcoördinator of je leidinggevende, en meld hem bij de directie zodat hij hier toegevoegd kan worden.";
