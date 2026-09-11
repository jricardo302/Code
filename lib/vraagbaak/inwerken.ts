/**
 * Map 02 — Inwerken en onboarding.
 * Bron: "Inwerkboek Ricardo Jeugdhulp" v1.1, "Onboardingchecklist en
 * aftekenschema" v1.1 en "Inwerkplan 30-60-90 dagen" v1.1 (5 september 2026).
 */

export type ChecklistPunt = {
  /** Stabiel id — de afvinkstand wordt hierop bewaard in deze browser. */
  id: string;
  actie: string;
  wie: string;
  /** Punten die niet voor iedereen gelden. */
  alleen?: "loondienst" | "zzp";
};

export type ChecklistFase = {
  slug: string;
  titel: string;
  wanneer: string;
  punten: ChecklistPunt[];
};

export const CHECKLIST: ChecklistFase[] = [
  {
    slug: "voor-start",
    titel: "Voor de startdatum",
    wanneer: "Geregeld vóór dag 1",
    punten: [
      { id: "v1", actie: "Getekend contract of raamovereenkomst in het dossier", wie: "Directie" },
      { id: "v2", actie: "VOG aangeleverd en beoordeeld", wie: "Directie" },
      { id: "v3", actie: "Diploma's en SKJ-registratie gecontroleerd, registratienummer vastgelegd", wie: "Directie" },
      { id: "v4", actie: "Vergewisplicht uitgevoerd: referentiecheck en check arbeidsverleden", wie: "Directie" },
      { id: "v5", actie: "Identiteitsbewijs gecontroleerd", wie: "Directie" },
      { id: "v6", actie: "KvK-uittreksel, gegevens opdrachtnemer, IBAN en btw-status aangeleverd", wie: "Directie", alleen: "zzp" },
      { id: "v7", actie: "Gegevens naar salarisadministratie MijnVOS, pensioen PFZW", wie: "Directie", alleen: "loondienst" },
      { id: "v8", actie: "Beroepsaansprakelijkheidsverzekering gecontroleerd", wie: "Directie", alleen: "zzp" },
      { id: "v9", actie: "Google Workspace-account aangemaakt, activatielink verstuurd", wie: "Directie" },
      { id: "v10", actie: "Zilliz-account aangemaakt, activatiecode klaar", wie: "Zorgcoördinator" },
      { id: "v11", actie: "Laptop, werktelefoon en toegangspas of sleutel klaargelegd", wie: "Directie" },
      { id: "v12", actie: "Buddy aangewezen en eerste week ingepland", wie: "Manager Zorg" },
      { id: "v13", actie: "Welkomstmail met praktische info verstuurd", wie: "Directie" },
      { id: "v14", actie: "Aanmelding bij gemeente als onderaannemer of zzp'er (indien vereist)", wie: "Directie" },
    ],
  },
  {
    slug: "dag-1",
    titel: "Eerste dag",
    wanneer: "Dag 1",
    punten: [
      { id: "d1", actie: "Welkom en kennismaking met het team", wie: "Manager Zorg" },
      { id: "d2", actie: "Rondleiding locatie, nooduitgangen, BHV en ontruimingsplan", wie: "Buddy" },
      { id: "d3", actie: "Google Workspace geactiveerd, e-mailhandtekening ingesteld", wie: "Jij" },
      { id: "d4", actie: "Zilliz geactiveerd, tweestapsverificatie met Google Authenticator ingesteld", wie: "Jij" },
      { id: "d5", actie: "Toegang tot de kennisbank gekregen en START HIER gelezen", wie: "Jij" },
      { id: "d6", actie: "Escalatiekaart doorgenomen en opgeslagen", wie: "Buddy" },
      { id: "d7", actie: "Gedragscode gelezen en besproken", wie: "Jij" },
    ],
  },
  {
    slug: "week-1",
    titel: "Week 1",
    wanneer: "De eerste vijf werkdagen",
    punten: [
      { id: "w1", actie: "Inwerkboek gelezen", wie: "Jij" },
      { id: "w2", actie: "Meldcode doorgenomen, weet wie de aandachtsfunctionaris is", wie: "Buddy" },
      { id: "w3", actie: "Suïcideprotocol doorgenomen", wie: "Buddy" },
      { id: "w4", actie: "Privacyreglement en datalekprocedure doorgenomen", wie: "Buddy" },
      { id: "w5", actie: "Uitleg dossieropbouw in Zilliz en de vaste sjablonen", wie: "Zorgcoördinator" },
      { id: "w6", actie: "Uitleg urenregistratie, productcodes en deadline voor de 1e", wie: "Zorgcoördinator" },
      { id: "w7", actie: "Meegelopen bij minimaal twee cliëntcontacten", wie: "Buddy" },
      { id: "w8", actie: "Eerste cliënten gekoppeld en startafspraken gemaakt", wie: "Zorgcoördinator" },
    ],
  },
  {
    slug: "30-60-90",
    titel: "30, 60 en 90 dagen",
    wanneer: "De eerste drie maanden",
    punten: [
      { id: "m1", actie: "Dag 30 — voortgangsgesprek: hoe gaat het, caseload passend, wat mist er nog", wie: "Manager Zorg" },
      { id: "m2", actie: "Dag 30 — eerste casuïstiekoverleg bijgewoond", wie: "Jij" },
      { id: "m3", actie: "Dag 30 — dossiercheck: zijn de verplichte stukken op orde", wie: "Zorgcoördinator" },
      { id: "m4", actie: "Dag 60 — zelfstandig werkende caseload, eerste evaluatie met een cliënt uitgevoerd", wie: "Jij" },
      { id: "m5", actie: "Dag 60 — feedback opgehaald bij cliënt of ouder", wie: "Zorgcoördinator" },
      { id: "m6", actie: "Dag 90 — evaluatiegesprek: functioneren, ontwikkelpunten, scholing, definitieve caseload", wie: "Manager Zorg en directie" },
      { id: "m7", actie: "Dag 90 — afspraken over proeftijd of contractverlenging vastgelegd", wie: "Directie", alleen: "loondienst" },
      { id: "m8", actie: "Dag 90 — eerste evaluatieformulier zzp'er ingevuld", wie: "Directie", alleen: "zzp" },
    ],
  },
];

export const AFTEKENING =
  "Hierbij verklaart de nieuwe collega het inwerkboek, de gedragscode, de meldcode, het suïcideprotocol en het privacyreglement te hebben gelezen en begrepen, en te weten bij wie te melden bij zorgen over veiligheid.";

export const AFTEKEN_TOELICHTING =
  "Het aftekenschema teken je op papier af met je leidinggevende. Vul de onboardingchecklist in Drive in, sla die op in het personeelsdossier en niet in de kennisbank. Dit scherm is je eigen hulpmiddel: het staat alleen in jouw browser.";

export type FaseDoel = {
  onderwerp: string;
  watJeDoet: string;
  resultaat: string;
};

export type Fase = {
  slug: string;
  titel: string;
  periode: string;
  belofte: string;
  doelen: FaseDoel[];
  gesprek: string;
};

export const FASEN: Fase[] = [
  {
    slug: "fase-1",
    titel: "Leren en meelopen",
    periode: "Dag 1 tot 30",
    belofte: "Je kijkt mee, leest je in en start je eerste cliënten.",
    doelen: [
      {
        onderwerp: "Kennis",
        watJeDoet:
          "Inwerkboek, escalatiekaart, meldcode, suïcideprotocol, gedragscode en privacyreglement lezen",
        resultaat: "Aftekenschema getekend",
      },
      {
        onderwerp: "Systemen",
        watJeDoet:
          "Google Workspace en Zilliz in gebruik, tweestapsverificatie actief, sjablonen gevonden",
        resultaat: "Je kunt zelfstandig een rapportage plaatsen",
      },
      {
        onderwerp: "Praktijk",
        watJeDoet:
          "Meelopen met je buddy bij minimaal vier cliëntcontacten en een groepsactiviteit",
        resultaat: "Je hebt de werkwijze in de praktijk gezien",
      },
      {
        onderwerp: "Caseload",
        watJeDoet: "Eerste cliënten gekoppeld, kennismaking en startafspraken",
        resultaat: "Minimaal twee cliënten gestart",
      },
      {
        onderwerp: "Team",
        watJeDoet: "Eerste casuïstiekoverleg bijgewoond",
        resultaat: "Je weet hoe je een casus inbrengt",
      },
      {
        onderwerp: "Administratie",
        watJeDoet:
          "Eerste maand uren geregistreerd, in minuten en met de juiste productcode",
        resultaat: "Uren vóór de 1e ingeleverd, geen correcties nodig",
      },
    ],
    gesprek:
      "Gesprek dag 30 met de Manager Zorg: hoe gaat het, klopt de caseload, wat mis je nog, welke scholing is nodig. De zorgcoördinator doet een eerste dossiercheck.",
  },
  {
    slug: "fase-2",
    titel: "Zelfstandig werken",
    periode: "Dag 31 tot 60",
    belofte: "Je draait je eigen caseload en brengt zelf een casus in.",
    doelen: [
      {
        onderwerp: "Caseload",
        watJeDoet: "Caseload uitgebreid naar het afgesproken aantal",
        resultaat: "Volledige caseload draaiend",
      },
      {
        onderwerp: "Zorgplan",
        watJeDoet:
          "Zelfstandig een zorgplan opgesteld met doelen die aansluiten op de hulpvraag",
        resultaat: "Zorgplan goedgekeurd door de gedragswetenschapper",
      },
      {
        onderwerp: "Evaluatie",
        watJeDoet: "Eerste evaluatie met een cliënt en ouders uitgevoerd",
        resultaat: "Evaluatieverslag van voldoende kwaliteit",
      },
      {
        onderwerp: "Netwerk",
        watJeDoet:
          "Netwerk van minimaal één cliënt in kaart gebracht; JIM-gedachte toegepast",
        resultaat: "Netwerkbetrokkenheid zichtbaar in het dossier",
      },
      {
        onderwerp: "Samenwerking",
        watJeDoet:
          "Contact gelegd met minimaal één externe partij: school, verwijzer, GGZ",
        resultaat: "Afstemming vastgelegd in het dossier",
      },
      {
        onderwerp: "Casuïstiek",
        watJeDoet: "Zelf een casus ingebracht in het casuïstiekoverleg",
        resultaat: "Besluiten en acties opgevolgd",
      },
    ],
    gesprek:
      "Gesprek dag 60: voortgang, kwaliteit van de dossiers, feedback van cliënten of ouders, knelpunten.",
  },
  {
    slug: "fase-3",
    titel: "Verankeren",
    periode: "Dag 61 tot 90",
    belofte: "Je buddy is nog beschikbaar, maar je hebt hem niet meer nodig.",
    doelen: [
      {
        onderwerp: "Zelfstandigheid",
        watJeDoet: "Volledig zelfstandig, buddy alleen nog op afroep",
        resultaat: "Geen dagelijkse begeleiding meer nodig",
      },
      {
        onderwerp: "Kwaliteit",
        watJeDoet:
          "Dossiercheck door de zorgcoördinator zonder kritische bevindingen",
        resultaat: "Verplichte stukken compleet en actueel",
      },
      {
        onderwerp: "Verlenging",
        watJeDoet:
          "Een verlengingsaanvraag of evaluatie voor een aflopende beschikking voorbereid",
        resultaat: "Tijdig ingediend volgens de route van de verwijzer",
      },
      {
        onderwerp: "Ontwikkeling",
        watJeDoet: "Scholings- en ontwikkelwensen benoemd",
        resultaat: "Ontwikkelafspraken vastgelegd",
      },
      {
        onderwerp: "Reflectie",
        watJeDoet:
          "Reflectie op eigen handelen, aansluitend op pijler 2 van het JIJ-kader",
        resultaat: "Besproken in het evaluatiegesprek",
      },
    ],
    gesprek:
      "Gesprek dag 90 met de Manager Zorg en de directie: functioneren, definitieve caseload, ontwikkelpunten. Loondienst: afspraken over proeftijd of contractverlenging. Zzp: evaluatieformulier zzp'er invullen.",
  },
];

export const UITGANGSPUNTEN_INWERKPLAN = [
  "Elke fase heeft een meetbaar resultaat. Aan het einde van elke fase is er een gesprek van 30 minuten.",
  "Je buddy is je eerste aanspreekpunt voor praktische vragen. Je leidinggevende voor inhoud en caseload.",
  "Veiligheid en dossiervoering gaan vóór snelheid. Liever vier cliënten goed dan acht half.",
];

export const EERDER_OPSCHALEN = {
  inleiding:
    "Wacht niet op het volgende gesprek als een van deze dingen speelt. Meld het direct bij de zorgcoördinator of de Manager Zorg.",
  signalen: [
    "Zorgen over de veiligheid van een cliënt",
    "Twijfel over financiering of indicatie",
    "Een matching die niet werkt",
    "Een caseload die te zwaar is",
    "Achterstand in rapportage of urenregistratie",
  ],
};

export const EERSTE_WEEK = [
  {
    wanneer: "Vóór je start",
    wat: "VOG aanleveren, contract of raamovereenkomst getekend, diploma's en SKJ-registratie aangeleverd, gegevens voor salaris of facturatie doorgegeven",
    waar: "Onboardingchecklist",
  },
  {
    wanneer: "Dag 1",
    wat: "Accounts activeren (Google Workspace, Zilliz met Google Authenticator), kennismaking team, rondleiding locatie, sleutels en apparatuur",
    waar: "Systemen en accounts",
  },
  {
    wanneer: "Dag 1 en 2",
    wat: "Inwerkboek lezen. Meldcode en suïcideprotocol doornemen. Escalatiekaart opslaan of uitprinten.",
    waar: "Inwerken en Veiligheid",
  },
  {
    wanneer: "Week 1",
    wat: "Meelopen met je buddy, eerste cliënten gekoppeld, uitleg rapporteren in Zilliz en urenregistratie",
    waar: "Rollen en Werkprocessen",
  },
  {
    wanneer: "Week 2 tot 4",
    wat: "Zelfstandig werken met wekelijkse check-in. Eerste casuïstiekoverleg bijwonen (verplicht, ook voor zzp'ers).",
    waar: "Inwerkplan 30-60-90",
  },
];

/** Paragraaf 13 van het inwerkboek. */
export const EERSTE_WEEK_LEESLIJST = [
  "Het inwerkboek",
  "De escalatiekaart",
  "De meldcode en het suïcideprotocol",
  "De gedragscode",
  "Het privacyreglement en de datalekprocedure",
];

export const INWERK_DOCUMENTEN = [
  {
    titel: "VOG-beleid",
    url: "https://drive.google.com/file/d/1FYd7vP4Px1c_-CTzIoDA8-E2quVIdYaB/view",
  },
  {
    titel: "Vergewisbeleid",
    url: "https://drive.google.com/file/d/1WsfCfwUHl3R-SLs_y33Yg1NfdvXXamUd/view",
  },
  {
    titel: "F 4.4.1.4 Referentiecheck",
    url: "https://drive.google.com/file/d/1Sp7A10zhgZrFq1EZJzn8fTPwBLanzb2Y/view",
  },
  {
    titel: "Gedragscode",
    url: "https://drive.google.com/file/d/1v7tTwJlrgfULmwxxAaDauPeNpVNq957t/view",
  },
  {
    titel: "P 4.2.2 Inhuur van zzp'ers",
    url: "https://drive.google.com/file/d/1zgJ_hSFomrqKsoXbrlO33ma_8qip-EQu/view",
  },
  {
    titel: "Evaluatieformulier zzp'er",
    url: "https://drive.google.com/file/d/1n7073GRcBXuqR5vZB3ArbrcgowezW7-i/view",
  },
  {
    titel: "P 3.4.1 Management van medewerkers",
    url: "https://drive.google.com/file/d/1D9MUF7Ig1fRPj_1FR083IDxrF1rt6wI2/view",
  },
];

/** Paragraaf 14 van het inwerkboek: wat bewust nog openstaat. */
export const NOG_NIET_VASTGELEGD = [
  "Welke cao van toepassing is bij loondienst",
  "De exacte regeling voor reiskosten en onkosten",
  "De vaste dag van het casuïstiekoverleg",
  "De namen van de vijf verplichte dossiersjablonen in Zilliz",
];
