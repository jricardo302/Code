/**
 * Map 03 — Rolbeschrijvingen.
 * Bron: "Rolbeschrijvingen — wat wordt er van je verwacht", versie 1.1
 * (5 september 2026). Functioneel, niet arbeidsrechtelijk: wat contractueel
 * voor je geldt staat in je eigen contract of raamovereenkomst.
 */

export type Ritme = { kop: string; punten: string[] };

export type Rol = {
  slug: string;
  naam: string;
  /** Korte naam voor de rolkiezer. */
  kort: string;
  kern: string;
  watJeDoet?: string[];
  ritme?: Ritme[];
  aangesprokenOp?: string;
  opschalen?: string;
  eisen?: string;
  extra?: { kop: string; punten: string[] };
};

export const ROLLEN: Rol[] = [
  {
    slug: "begeleider",
    naam: "Ambulant begeleider / jeugdhulpverlener",
    kort: "Ambulant begeleider",
    kern: "Je begeleidt jongeren en gezinnen in hun eigen omgeving, praktisch en outreachend, gericht op doelen die samen met de jongere zijn opgesteld en op versterking van het netwerk.",
    watJeDoet: [
      "Kennismaking, intake en het opstellen van het zorgplan met doelen",
      "Individuele begeleiding en, waar van toepassing, groepsbegeleiding en dagbesteding",
      "Samenwerking met ouders, school, verwijzer en andere hulpverleners",
      "Rapporteren in Zilliz: feitelijk, tijdig en leesbaar voor de cliënt",
      "Evalueren met cliënt en ouders, minimaal elke zes maanden",
      "Tijdig signaleren dat een beschikking afloopt en de evaluatie voorbereiden",
      "Uren registreren in minuten, onder de juiste productcode, vóór de 1e van de maand",
      "Deelnemen aan het maandelijkse casuïstiekoverleg (verplicht, ook als zzp'er)",
    ],
    aangesprokenOp:
      "Veiligheid van de cliënt, kwaliteit en tijdigheid van je dossier, nakomen van afspraken met cliënten en verwijzers, en juiste urenregistratie.",
    opschalen:
      "Bij zorgen over veiligheid (direct, naar de aandachtsfunctionaris), bij twijfel over indicatie of financiering, bij een matching die niet werkt, en bij een caseload die te zwaar wordt.",
    eisen:
      "Relevante opleiding, SKJ-registratie voor specialistische jeugdhulp, geldige VOG, en voor zzp'ers een eigen beroepsaansprakelijkheidsverzekering en KvK-inschrijving.",
  },
  {
    slug: "coordinerend-begeleider",
    naam: "Coördinerend begeleider",
    kort: "Coördinerend begeleider",
    kern: "Je bewaakt de instroom: van binnenkomende mail tot een cliënt die daadwerkelijk gekoppeld is en gestart. Doorgaans ongeveer 8 uur per week naast je begeleidingstaken.",
    watJeDoet: [
      "Mailstroom afhandelen: binnengekomen aanmeldingen naar aanmelden@ricardojeugdhulp.nl leiden",
      "Doorzetten naar de backoffice (MijnVOS) en bewaken dat de aanmelding in het ECD komt",
      "Eerste contact leggen met cliënt of verwijzer en de intake plannen",
      "De wachtrij bijhouden met vaste statuslabels",
      "Matching afstemmen met de zorgcoördinator en de startafspraak borgen",
    ],
    extra: {
      kop: "Vaste statuslabels in de wachtrij",
      punten: [
        "Nieuw",
        "Doorgezet naar aanmelden@",
        "In verwerking backoffice",
        "In ECD",
        "Contact gelegd",
        "Intake gepland",
        "Gekoppeld",
        "Gestart",
      ],
    },
    opschalen:
      "Bij spoed of veiligheid, bij onzekerheid over financiering of indicatie, en bij complexe matchingsvraagstukken. Naar de zorgcoördinator of de Manager Zorg.",
  },
  {
    slug: "zorgcoordinator",
    naam: "Zorgcoördinator",
    kort: "Zorgcoördinator",
    kern: "Je bent de spil tussen aanmelding, begeleider en administratie. Je zorgt dat cliënten niet blijven hangen en dat dossiers en declaraties kloppen.",
    ritme: [
      {
        kop: "Dagelijks",
        punten: [
          "Mailboxen info@ en aanmelden@ controleren; verwijzers die naar info@ mailen doorverwijzen naar aanmelden@",
          "Overzicht houden op openstaande aanvragen en doorzetten naar de backoffice voor de beschikkingsaanvraag (JW315)",
          "Bewaken dat cliënten niet blijven steken in de intakefase",
          "Matching van cliënt en begeleider; wachtlijstnorm maximaal vier weken, daarboven melden bij Manager Zorg of directie",
        ],
      },
      {
        kop: "Wekelijks",
        punten: [
          "Contact met alle begeleiders",
          "Bijhouden welke cliënt bij welke begeleider hoort",
          "Aflopende beschikkingen signaleren",
        ],
      },
      {
        kop: "Maandelijks",
        punten: [
          "Voorzitten van het casuïstiekoverleg (2 uur, verplicht voor alle begeleiders inclusief zzp'ers), agenda een half jaar vooruit, inhoudelijk afgestemd met de gedragswetenschapper",
          "Dossierkwaliteit controleren en tekortkomingen bespreken met begeleider en gedragswetenschapper",
          "Declaratie voorbereiden in de eerste week van de maand; erop toezien dat alle begeleiders hun uren vóór de 1e hebben ingevuld",
          "Maandcheck met de coördinerend begeleider: dossiercheck en benutting van resterende minuten",
        ],
      },
    ],
    extra: {
      kop: "Matchingsproces in zes stappen",
      punten: [
        "Aanmelding lezen",
        "Beoordelen of de hulpvraag passend is",
        "Begeleider bepalen",
        "Afstemmen met de backoffice",
        "Koppelen",
        "Begeleider informeren",
      ],
    },
  },
  {
    slug: "gedragswetenschapper",
    naam: "Gedragswetenschapper / orthopedagoog",
    kort: "Gedragswetenschapper",
    kern: "Je bewaakt de inhoudelijke kwaliteit van de hulpverlening en denkt mee bij complexe casuïstiek.",
    watJeDoet: [
      "Meedenken en adviseren bij complexe casussen en bij vastgelopen trajecten",
      "Meekijken op zorgplannen en evaluatieverslagen",
      "Inhoudelijke inbreng in het casuïstiekoverleg",
      "Ondersteunen bij risicotaxatie en veiligheidsafwegingen",
      "Bijdragen aan methodiekontwikkeling en scholing van het team",
    ],
  },
  {
    slug: "manager-zorg",
    naam: "Manager Zorg",
    kort: "Manager Zorg",
    kern: "Je stuurt de zorgverlening aan en bewaakt capaciteit, kwaliteit en continuïteit.",
    watJeDoet: [
      "Aansturen van begeleiders en zorgcoördinator",
      "Voortgangsgesprekken en jaargesprekken voeren; APK-gesprekken bewaken",
      "Capaciteit en caseload bewaken, signalen over wachtlijst opvolgen",
      "Knelpunten met de directie bespreken en escalaties opvolgen",
      "Bijdragen aan audits, verbeterregister en kwaliteitscyclus",
    ],
  },
  {
    slug: "directie",
    naam: "Directie",
    kort: "Directie",
    kern: "Eindverantwoordelijk voor kwaliteit, veiligheid, financiën en naleving van contracten en wetgeving.",
    extra: {
      kop: "Wat je bij de directie neerlegt",
      punten: [
        "Meldingen in het kader van de meldcode (aandachtsfunctionaris)",
        "Calamiteiten, geweld in de zorgrelatie, datalekken",
        "Klachten, contractkwesties, vragen van gemeenten en de inspectie",
        "Alles wat de continuïteit van zorg of de organisatie raakt",
      ],
    },
  },
];

export const ROL_DOCUMENTEN = [
  {
    titel: "Organogram",
    url: "https://drive.google.com/file/d/1tga_jCz5xx960htCf0KEMJ9nb4W4e1SR/view",
  },
  {
    titel: "Overlegstructuur",
    url: "https://drive.google.com/file/d/1g_6NrjTM86R7r0-MxCwvQk1-qQxAVgMz/view",
  },
  {
    titel: "P 3.4.1 Management van medewerkers",
    url: "https://drive.google.com/file/d/1D9MUF7Ig1fRPj_1FR083IDxrF1rt6wI2/view",
  },
  {
    titel: "Voorbeeld jaargesprek ambulant begeleider",
    url: "https://drive.google.com/file/d/1XaTl2iQKWP3rN0TDv0kCzTGGDOlsLZde/view",
  },
];
