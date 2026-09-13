/**
 * Map 01 — Over Ricardo Jeugdhulp.
 * Bron: "Over Ricardo Jeugdhulp — organisatie, missie en werkwijze", versie 1.1
 * (5 september 2026) en het Inwerkboek, versie 1.1.
 */

export const ORGANISATIE = {
  naam: "Ricardo Jeugdhulp B.V.",
  kvk: "98367080",
  agb: "41549979",
  sbi: "88991 — ondersteuning en begeleiding van jeugdigen zonder verblijf, inclusief dagactiviteiten",
  adres: "Randstad 20-27, 1314 BC Almere",
  telefoon: "085 250 2096",
  telefoonLink: "+31852502096",
  website: "www.ricardojeugdhulp.nl",
  keurmerk: "HKZ Kleine Organisaties, externe audit door Buro Klix (per kwartaal)",
  opgericht:
    "In 2019 gestart als eenmanszaak, op 22 september 2025 omgezet naar een besloten vennootschap.",
} as const;

export const MAILADRESSEN = [
  { adres: "info@ricardojeugdhulp.nl", waarvoor: "Algemeen" },
  { adres: "aanmelden@ricardojeugdhulp.nl", waarvoor: "Aanmeldingen" },
  { adres: "finance@ricardojeugdhulp.nl", waarvoor: "Facturen en financiën" },
  { adres: "lelystad@ricardojeugdhulp.nl", waarvoor: "Lelystad" },
] as const;

export type Teamlid = {
  naam: string;
  rol: string;
  waarvoor: string;
  /** Slug van de rolbeschrijving in map 03, als die er is. */
  rolSlug?: string;
};

export const TEAM: Teamlid[] = [
  {
    naam: "Joël Ricardo",
    rol: "Directie · aandachtsfunctionaris meldcode",
    waarvoor:
      "Veiligheid, calamiteiten, datalekken, contracten, klachten, toegang tot documenten",
    rolSlug: "directie",
  },
  {
    naam: "Jan Fahner",
    rol: "Manager Zorg",
    waarvoor: "Aansturing, caseload, voortgangsgesprekken, knelpunten",
    rolSlug: "manager-zorg",
  },
  {
    naam: "Jiska Koopman",
    rol: "Zorgcoördinator",
    waarvoor:
      "Aanmeldingen, matching, wachtlijst, dossierkwaliteit, uren, casuïstiekoverleg",
    rolSlug: "zorgcoordinator",
  },
  {
    naam: "Grachelle Elskamp",
    rol: "Coördinerend begeleider",
    waarvoor: "Instroom, mailstroom, startafspraken",
    rolSlug: "coordinerend-begeleider",
  },
  {
    naam: "Chehenaz Jahangier",
    rol: "Gedragswetenschapper",
    waarvoor: "Inhoudelijke afstemming, complexe casuïstiek",
    rolSlug: "gedragswetenschapper",
  },
  {
    naam: "MijnVOS",
    rol: "Backoffice, salaris en pensioen",
    waarvoor:
      "Beschikkingen en berichtenverkeer, declaraties, salarisadministratie",
  },
];

export const MISSIE = {
  kern: "Passende zorg begint met de juiste match.",
  uitleg:
    "Wij werken menselijk, laagdrempelig en praktisch. Ondersteuning moet niet alleen op korte termijn resultaat geven, maar duurzaam effect hebben. Daarom zoeken we altijd eerst naar de juiste match tussen jongere en professional, en sluiten we aan bij wat een jongere zelf interessant vindt: sport, muziek, activiteiten.",
  circulair:
    "Professionele hulp zetten we zo kort in als verantwoord is, terwijl we tegelijk duurzame steun in het eigen netwerk opbouwen. Hulp staat nooit los van het gezin en het netwerk eromheen. Dit sluit aan bij de JIM-methodiek (Jouw Ingebrachte Mentor), die binnen de organisatie wordt geïmplementeerd.",
} as const;

export const DOELGROEPEN = [
  "Thuiszitters en jongeren met (dreigende) schooluitval",
  "Jongeren met forensische problematiek of risico's daarop",
  "Jongeren en gezinnen met complexe problematiek",
  "Gezinnen waarbij meerdere leefgebieden tegelijk onder druk staan",
];

export const METHODIEKEN = [
  { naam: "Rots & Water", uitleg: "Weerbaarheid, grenzen stellen, sociale vaardigheden" },
  { naam: "RET", uitleg: "Rationeel-emotieve training: denkpatronen en gedrag" },
  { naam: "Traumasensitief werken", uitleg: "Rekening houden met wat trauma doet met gedrag en ontwikkeling" },
  { naam: "Systeemgericht werken", uitleg: "Met het hele gezin en netwerk, niet alleen met de jongere" },
  { naam: "Praktisch en outreachend", uitleg: "Begeleiding in de eigen omgeving van de jongere" },
  { naam: "JIM-methodiek", uitleg: "Een mentor uit het eigen netwerk formeel betrekken" },
  { naam: "Aansluiten via interesses", uitleg: "Boksen, muziek, groepsactiviteiten, PMT" },
];

export type Regio = {
  naam: string;
  wat: string;
  letop: string[];
};

export const REGIOS: Regio[] = [
  {
    naam: "Almere",
    wat: "Begeleiding individueel en groep (basis en specialistisch), dagbesteding, Behandeling Jeugd LVB, Jeugd-GGZ",
    letop: [
      "Eigen productcodes.",
      "No-showregeling: bij no-show alleen reistijd declareren.",
    ],
  },
  {
    naam: "Lelystad",
    wat: "Perceel 3A (vrijgevestigden, generalistische basis-GGZ) en 3B (instellingen: psychodiagnostiek, basis- en specialistische GGZ, systeemgericht)",
    letop: [
      "Eigen, uitgebreidere productcodes.",
      "Meldplicht: calamiteiten, geweld en datalekken binnen 24 uur melden.",
      "Vanaf 16,5 jaar een plan maken op wonen, school of werk, inkomen, welzijn en netwerk.",
    ],
  },
];

export const WEEKROOSTER = [
  { dag: "Maandag", aanbod: "Boksen 13:00–17:00 en muziekgerichte begeleiding" },
  { dag: "Dinsdag", aanbod: "PMT vanaf 14:00" },
  { dag: "Woensdag", aanbod: "Boksen 12:00–17:00" },
  { dag: "Donderdag", aanbod: "Boksen 13:00–17:00" },
  { dag: "Vrijdag", aanbod: "Boksen 09:00–14:00, groepssessie 15:00" },
];

export const OVERLEGGEN = [
  {
    naam: "Casuïstiekoverleg",
    frequentie: "Maandelijks, 2 uur",
    voorWie:
      "Verplicht voor alle begeleiders, ook zzp'ers. Voorgezeten door de zorgcoördinator.",
  },
  {
    naam: "Groepsactiviteit team",
    frequentie: "Minimaal 1× per week",
    voorWie: "Begeleiders op locatie",
  },
  {
    naam: "Voortgangsgesprek (APK-gesprek)",
    frequentie: "Periodiek",
    voorWie:
      "Zorgcoördinator met begeleider, vooral zzp'ers. Bewaakt door de Manager Zorg.",
  },
  { naam: "Jaargesprek", frequentie: "Jaarlijks", voorWie: "Medewerkers in loondienst" },
  { naam: "Evaluatie zzp'er", frequentie: "Jaarlijks", voorWie: "Zzp'ers" },
];

export const KWALITEIT = [
  {
    naam: "HKZ Kleine Organisaties",
    tekst:
      "Ons kwaliteitsmanagementsysteem. Externe audit door Buro Klix, één keer per kwartaal.",
  },
  {
    naam: "IGJ en het JIJ-kader",
    tekst:
      "Het toetsingskader van de Inspectie Gezondheidszorg en Jeugd. Geen behandelmethode, maar waar de inspectie op doorvraagt.",
  },
  {
    naam: "Cliënttevredenheidsonderzoek",
    tekst: "Één keer per zes maanden en aan het einde van elk traject.",
  },
  { naam: "Medewerkertevredenheidsonderzoek", tekst: "Periodiek." },
  {
    naam: "Verbeterregister",
    tekst:
      "Meldingen, klachten en auditbevindingen komen samen in het verbeterregister en worden opgevolgd volgens PDCA.",
  },
];

export const JIJ_KADER = [
  {
    pijler: "Ontwikkelingsgerichte hulp",
    tekst:
      "Je kent de wensen en de context van de jeugdige, je versterkt het netwerk, de hulp is zo thuis mogelijk en je vermijdt vrijheidsbeperking.",
  },
  {
    pijler: "De kundige hulpverlener",
    tekst:
      "Je maakt veiligheidsafwegingen, werkt methodisch met heldere doelen, stemt af met andere hulpverleners en reflecteert op je eigen handelen.",
  },
  {
    pijler: "Goed bestuur",
    tekst:
      "Belang van de jeugdige centraal, voldoende deskundig personeel, lerend klimaat met incidentmeldingen en PDCA, en een toegankelijke klachtenregeling.",
  },
];

/** Map 01, paragraaf 9 — originele stukken in de kwaliteitsmap. */
export const ORGANISATIE_DOCUMENTEN = [
  {
    titel: "D 1.1 Organisatiebeschrijving",
    url: "https://drive.google.com/file/d/1x3AmF65qRcBuQOfOB395RqPHULpExpoQ/view",
  },
  {
    titel: "D 4.1.1.1 Organogram",
    url: "https://drive.google.com/file/d/1tga_jCz5xx960htCf0KEMJ9nb4W4e1SR/view",
  },
  {
    titel: "D 4.1.2.1 Overlegstructuur",
    url: "https://drive.google.com/file/d/1g_6NrjTM86R7r0-MxCwvQk1-qQxAVgMz/view",
  },
  {
    titel: "Casuïstiekoverleg — programma",
    url: "https://drive.google.com/file/d/1tzyyz3ZdwQh1h0i4qoOsPNpP2feJ1562/view",
  },
  {
    titel: "Het JIJ-kader (IGJ, januari 2021)",
    url: "https://drive.google.com/file/d/1Lhwg2iDqonHvjmxMzmp6iaO6SOSXiaoH/view",
  },
];
