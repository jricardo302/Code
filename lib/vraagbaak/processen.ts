/**
 * Map 05 — Werkprocessen en formats.
 * Bron: "Werkprocessen en formats — overzicht met links", versie 1.1
 * (bijgewerkt 8 september 2026) en het Inwerkboek, versie 1.1.
 */

export type ProcesStap = {
  nummer: number;
  titel: string;
  wie: string;
  waar: string;
};

export const AANMELDPROCES: ProcesStap[] = [
  {
    nummer: 1,
    titel: "Eerste contact door verwijzer",
    wie: "Coördinerend begeleider",
    waar: "info@ of aanmelden@ricardojeugdhulp.nl, telefoon, website",
  },
  {
    nummer: 2,
    titel: "Beoordeling of de hulpvraag past",
    wie: "Zorgcoördinator, bij twijfel intern overleg",
    waar: "Intern overleg",
  },
  {
    nummer: 3,
    titel: "Formele verwijzing",
    wie: "Verwijzer",
    waar: "Berichtenverkeer, ZorgDomein of beveiligde mail (ZIVVER)",
  },
  {
    nummer: 4,
    titel: "Verwerking in het ECD en aanvraag beschikking",
    wie: "Backoffice MijnVOS",
    waar: "Zilliz en berichtenverkeer JW315",
  },
  {
    nummer: 5,
    titel: "Matching cliënt en begeleider",
    wie: "Zorgcoördinator",
    waar: "Zilliz",
  },
  {
    nummer: 6,
    titel: "Start: contact, intake, startafspraak",
    wie: "Begeleider",
    waar: "Bij de cliënt",
  },
  {
    nummer: 7,
    titel: "Begeleiding en behandeling",
    wie: "Begeleider",
    waar: "Rapportage in Zilliz",
  },
  {
    nummer: 8,
    titel: "Evaluatie, minimaal elke zes maanden",
    wie: "Begeleider met cliënt en ouders",
    waar: "Evaluatieformat",
  },
];

export const WACHTTIJDNORM =
  "Maximaal vier weken tussen aanmelding en start. Loopt het op, dan meldt de zorgcoördinator dat bij de Manager Zorg of directie.";

export const VERWIJZERS = [
  "POH-GGZ",
  "Huisarts",
  "JGZ",
  "SAVE (jeugdreclassering en voogdij)",
  "Leger des Heils",
  "William Schrikker Groep",
  "GGZ-instellingen",
];

export const FORMATS = [
  {
    titel: "F 3.1.3 Aanmeldformulier jeugdhulp",
    wanneer: "Bij een nieuwe aanmelding",
    url: "https://drive.google.com/file/d/1JD4Fdu10nyRXdzdtlfkZmMxX8ZNP6Zfc/view",
  },
  {
    titel: "F 3.1.2 Risicosignalering",
    wanneer: "Bij start van de zorg en bij elke evaluatie",
    url: "https://drive.google.com/file/d/1Yd5wuz4JSb5buvTjV6FLZWpVwSu578WU/view",
  },
  {
    titel: "F 3.1.4 Zorgplan (leeg)",
    wanneer: "Bij de start van een traject en bij wijziging van doelen",
    url: "https://drive.google.com/file/d/1stZ_D1Rq3oqSJ2YF1A9vraBWPYvfb7Pk/view",
  },
  {
    titel: "P 3.1.1 Primair proces",
    wanneer: "De volledige procesbeschrijving van zorgverlening",
    url: "https://drive.google.com/file/d/1ruk1YL562DimHbBmUD1-t5WJ5fD7l1Ey/view",
  },
  {
    titel: "D 1.2.1.1 Documentsjabloon",
    wanneer: "Voor nieuwe interne documenten in HKZ-opmaak",
    url: "https://drive.google.com/file/d/1T7GQxmkoeODbAdsHdWBgBATmQnrcpQ3O/view",
  },
  {
    titel: "P 1.2.1 Documentbeheersing",
    wanneer: "Regels voor versiebeheer van documenten",
    url: "https://drive.google.com/file/d/1nGnZWJ6A4oZWbKn-uc6wATBk6PJeEU3m/view",
  },
];

export const FORMATS_NOOT =
  "Voor het evaluatieformat en de tussenevaluatie: vraag de zorgcoördinator naar de actuele versie. Dat format is nog niet in de kwaliteitsmap opgenomen.";

export type VerlengRoute = {
  slug: string;
  verwijzer: string;
  /** De vraag zoals hij in de wijzer staat. */
  wanneerKiesJeDit: string;
  termijn: string;
  /** Alleen de JGZ-termijn is een vastgelegde eis. */
  hardeEis: boolean;
  hoe: string;
};

export const VERLENGROUTES: VerlengRoute[] = [
  {
    slug: "jgz",
    verwijzer: "JGZ Almere",
    wanneerKiesJeDit:
      "De gemeentelijke toegang in Almere heeft de beschikking afgegeven",
    termijn: "Twee maanden vóór de einddatum",
    hardeEis: true,
    hoe: "Evaluatieformulier naar aanmelden@jgzalmere.nl, met aanmelden@ricardojeugdhulp.nl in cc. De begeleider stelt het op, de zorgcoördinator verstuurt.",
  },
  {
    slug: "save",
    verwijzer: "SAVE, William Schrikker Groep of Leger des Heils",
    wanneerKiesJeDit:
      "Er is een jeugdbeschermer, voogd of jeugdreclasseerder betrokken",
    termijn: "Interne werknorm: tijdig, in overleg met de verwijzer",
    hardeEis: false,
    hoe: "De verlenging loopt rechtstreeks via de verwijzer, niet via JGZ.",
  },
  {
    slug: "jgo",
    verwijzer: "JGO (speciaal onderwijs)",
    wanneerKiesJeDit:
      "De cliënt zit op een school voor (voortgezet) speciaal onderwijs met een JGO-team",
    termijn: "Interne werknorm: ruim vóór de einddatum",
    hardeEis: false,
    hoe: "De begeleider stelt de evaluatie op. Samen met de zorgcoördinator gaat die beveiligd naar de JGO-contactpersoon. JGO stemt af met de gemeente; na akkoord dient Ricardo Jeugdhulp de evaluatie in als verlengingsaanvraag bij de gemeentelijke toegang.",
  },
  {
    slug: "lelystad",
    verwijzer: "Lelystad",
    wanneerKiesJeDit: "De beschikking komt van de gemeente Lelystad",
    termijn: "Interne werknorm",
    hardeEis: false,
    hoe: "Via de route van de betreffende beschikking; administratie via iJw.",
  },
];

export const VERLENG_KWALITEITSEIS =
  "Het evaluatieverslag moet inhoudelijk voldoende zijn. Beschrijf feitelijk wat er is gedaan, wat het effect was, wat er nog nodig is en waarom. Check ook of SAVE of Veilig Thuis betrokken is.";

export const JGZ_VERSUS_JGO = {
  jgz: "JGZ is de jeugdgezondheidszorg: de gemeentelijke toegang in Almere.",
  jgo: "JGO is het jeugdhulpteam op scholen voor speciaal onderwijs.",
  waarschuwing:
    "Verschillende routes, verschillende contactpersonen. Verwar ze niet.",
};

export const UREN_REGELS = [
  "Registreer per cliënt, in minuten, onder de juiste productcode.",
  "Almere en Lelystad hebben verschillende codes. Codes zijn niet uitwisselbaar en wijzigen periodiek. Gebruik altijd de actuele codelijst van de gemeente van de cliënt.",
  "Verkeerde of onvolledige registratie leidt tot afwijzing van de declaratie of tot terugvordering.",
  "No-show in Almere: alleen reistijd declareren.",
  "Zzp'ers factureren op basis van de goedgekeurde urenuitdraai, naar finance@ricardojeugdhulp.nl.",
];

export const UREN_DEADLINE = {
  kop: "Vóór de 1e van de nieuwe maand",
  tekst:
    "Je uren van de vorige maand staan vóór de 1e ingevuld. In de eerste week van de maand declareert de organisatie bij de gemeente. Te laat invullen betekent te laat of geen declaratie.",
};

export const PRODUCTCATEGORIEEN = [
  "Begeleiding individueel (basis en specialistisch)",
  "Begeleiding groep",
  "Dagbesteding",
  "Behandeling Jeugd LVB",
  "Jeugd-GGZ",
  "Dyslexie",
  "Gezinsbegeleiding (alleen in Lelystad)",
];

export const PRODUCTCODE_NOOT =
  "In Lelystad kennen de codes de prefixen 3A (GGZ vrijgevestigde), 3B (GGZ instelling) en 4A (gezinsbegeleiding). In deze kennisbank staan bewust geen specifieke productcodes: de actuele codelijst per gemeente is leidend. Vraag ernaar bij de zorgcoördinator of de backoffice.";

export const RAPPORTAGE_REGELS = [
  "Schrijf feitelijk. Houd feit, observatie, interpretatie en conclusie uit elkaar.",
  "Geen diagnoses of conclusies die je niet kunt onderbouwen.",
  "Schrijf zo dat de cliënt of ouder het kan meelezen. Zij hebben recht op inzage.",
  "Rapporteer op tijd, niet weken later. Wat niet in het dossier staat, is niet gebeurd.",
  "Beschrijf niet meer overleg met ouders dan er werkelijk is geweest.",
];

export const DOSSIER_WAAR =
  "Alles in Zilliz, via de vaste sjablonen onder Cliënt > Dossier > Nieuw > Sjabloon. De zorgcoördinator controleert de dossierkwaliteit maandelijks; ontbrekende stukken worden met jou en de gedragswetenschapper besproken.";

export const CASUISTIEKOVERLEG = {
  wat: "Maandelijks, twee uur, verplicht voor alle begeleiders inclusief zzp'ers.",
  hoe: "Voorgezeten door de zorgcoördinator, inhoudelijk afgestemd met de gedragswetenschapper. De agenda staat een half jaar vooruit gepland. Breng je casus vooraf aan, zodat er voorbereid meegedacht kan worden. Besluiten en actiepunten worden vastgelegd en de volgende keer teruggekoppeld.",
  programma:
    "https://drive.google.com/file/d/1tzyyz3ZdwQh1h0i4qoOsPNpP2feJ1562/view",
};

/** Paragraaf 7 van map 05: wat nog eenmalig bevestigd moet worden. */
export const NOG_TE_BEVESTIGEN = [
  "De namen van de vijf verplichte dossiersjablonen in Zilliz",
  "De interne verlengingstermijnen per verwijzer",
  "De vaste dag van het casuïstiekoverleg",
];
