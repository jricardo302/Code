/**
 * Map 04 — Escalatiekaart en protocollenoverzicht.
 * Bron: "Escalatiekaart — wat doe je bij …", versie 1.1 (5 september 2026) en
 * "Protocollen en veiligheid — overzicht met links", versie 1.3.
 *
 * Uitgangspunt uit de bron: bij twijfel opschalen. Niet melden is nooit de
 * veilige keuze.
 */

export type Noodnummer = {
  situatie: string;
  wie: string;
  /** Zonder spaties, voor tel:-links. Leeg als er geen vast nummer is. */
  nummer?: string;
  toelichting?: string;
  /** Het allerbelangrijkste nummer krijgt visueel voorrang. */
  eerst?: boolean;
};

export const NOODNUMMERS: Noodnummer[] = [
  {
    situatie: "Acuut levensgevaar, geweld, ernstig letsel",
    wie: "Alarmnummer",
    nummer: "112",
    eerst: true,
  },
  {
    situatie: "Advies of melding huiselijk geweld en kindermishandeling",
    wie: "Veilig Thuis",
    nummer: "0800-2000",
    toelichting: "24/7 bereikbaar, ook voor anoniem advies",
  },
  {
    situatie: "Recent seksueel misdrijf",
    wie: "Centrum Seksueel Geweld",
    nummer: "0800-0188",
  },
  {
    situatie: "Acuut suïciderisico, geen direct levensgevaar",
    wie: "Crisisdienst GGZ van de regio",
    toelichting: "Nummer van de regio waar de cliënt woont",
  },
  {
    situatie: "Intern, altijd bereikbaar bij veiligheidsvragen",
    wie: "Joël Ricardo — directie en aandachtsfunctionaris meldcode",
    nummer: "085 250 2096",
  },
];

export type Situatie = {
  slug: string;
  titel: string;
  /** Korte omschrijving voor de kiezer op de noodpagina. */
  vraag: string;
  /** Trefwoorden waarop de kiezer filtert. */
  trefwoorden: string[];
  /** Eerste regel, dikgedrukt boven de stappen. */
  eersteZet?: string;
  stappen: string[];
  /** Verwijzing naar het volledige protocol. */
  verder?: string;
};

export const SITUATIES: Situatie[] = [
  {
    slug: "huiselijk-geweld",
    titel: "Signalen van huiselijk geweld of kindermishandeling",
    vraag: "Ik zie signalen van geweld of mishandeling",
    trefwoorden: [
      "meldcode",
      "kindermishandeling",
      "huiselijk geweld",
      "veilig thuis",
      "kindcheck",
      "onveilig",
      "mishandeling",
    ],
    stappen: [
      "Leg de signalen feitelijk vast in het dossier en maak een MIC-registratie.",
      "Bespreek met je leidinggevende. Zorgen over kinderen van een volwassen cliënt? Doe de kindcheck.",
      "Vertelt een cliënt het je rechtstreeks? Ga direct naar de aandachtsfunctionaris (Joël Ricardo). Gaat het om een strafbaar feit: niet doorvragen, wel direct melden.",
      "Vraag zo nodig anoniem advies bij Veilig Thuis (0800-2000).",
      "Vermoeden van eergerelateerd geweld? Stop de meldcode en ga direct naar het expertteam van Veilig Thuis.",
    ],
    verder: "Volledige stappen: Meldcode, map 04.",
  },
  {
    slug: "suicidaliteit",
    titel: "Suïcidale uitingen of automutilatie",
    vraag: "Een jongere uit dat hij niet meer wil leven, of verwondt zichzelf",
    trefwoorden: [
      "suïcide",
      "suicide",
      "zelfmoord",
      "automutilatie",
      "crisisdienst",
      "snijden",
      "niet meer leven",
    ],
    eersteZet: "Direct gevaar: bel 112. Anders: crisisdienst GGZ.",
    stappen: [
      "Direct gevaar: 112. Anders: crisisdienst GGZ.",
      "Neem elke uiting serieus: gedachten, concrete plannen, een gedane poging, automutilatie. Altijd signaleren en rapporteren.",
      "Meld via Veilig incidenten en calamiteiten melden (P 2.3.1).",
      "Betrek naasten: onder 12 jaar altijd de ouders; 12 tot 16 jaar gedeeld recht; vanaf 16 jaar zijn ouders wettelijk niet nodig, maar maak een klinische afweging.",
      "Leg veiligheidsafspraken vast in het dossier en bespreek in het multidisciplinair overleg.",
    ],
    verder: "Zie het suïcideprotocol (P 3.4.1) in map 04.",
  },
  {
    slug: "incident",
    titel: "Incident of calamiteit",
    vraag: "Er is een incident of calamiteit geweest",
    trefwoorden: [
      "incident",
      "calamiteit",
      "mic",
      "melding",
      "ongeval",
      "geweld in de zorgrelatie",
      "igj",
    ],
    eersteZet: "Eerst veiligheid, dan melden — dezelfde dag.",
    stappen: [
      "Zorg eerst voor de veiligheid van de cliënt en jezelf.",
      "Meld dezelfde dag bij je leidinggevende en de directie.",
      "Maak een MIC-melding volgens P 2.3.1.",
      "Calamiteiten, geweld in de zorgrelatie en toezichtmaatregelen worden door de directie gemeld bij IGJ en de gemeente. Voor Lelystad geldt: binnen 24 uur.",
    ],
  },
  {
    slug: "datalek",
    titel: "Datalek",
    vraag:
      "Verkeerde mail verstuurd, laptop kwijt, of een dossier open laten staan",
    trefwoorden: [
      "datalek",
      "avg",
      "privacy",
      "verkeerde mail",
      "laptop kwijt",
      "gegevens",
      "autoriteit persoonsgegevens",
    ],
    eersteZet: "Meteen melden bij de directie. Niet eerst zelf uitzoeken.",
    stappen: [
      "Meld het meteen bij de directie, ook als je denkt dat het meevalt. Niet eerst zelf uitzoeken.",
      "Leg vast: wat is er gebeurd, welke gegevens, van wie, wanneer, wie heeft het kunnen zien.",
      "De directie beoordeelt de melding aan de Autoriteit Persoonsgegevens en de gemeente. Termijn: binnen 24 uur intern, wettelijk 72 uur extern.",
    ],
    verder: "Zie P 4.3.3 Melden datalek, map 04.",
  },
  {
    slug: "grensoverschrijdend",
    titel: "Grensoverschrijdend gedrag",
    vraag:
      "Grensoverschrijdend gedrag door een collega, of door jezelf ervaren",
    trefwoorden: [
      "grensoverschrijdend",
      "collega",
      "intimidatie",
      "ongewenst gedrag",
      "vertrouwenspersoon",
    ],
    stappen: [
      "Bespreek het met de directie of de Manager Zorg.",
      "Wil je het niet intern bespreken, gebruik dan de klachtenprocedure of de externe klachtenregeling.",
    ],
    verder: "Zie D 4.4.1.2 Grensoverschrijdend gedrag, map 04.",
  },
  {
    slug: "klacht",
    titel: "Klacht van een cliënt of ouder",
    vraag: "Een cliënt of ouder heeft een klacht",
    trefwoorden: [
      "klacht",
      "ouder",
      "ontevreden",
      "klachtenregeling",
      "herstelgesprek",
      "vertrouwensbreuk",
    ],
    stappen: [
      "Neem de klacht serieus, luister en probeer eerst samen tot een oplossing te komen.",
      "Meld de klacht altijd bij je leidinggevende, ook als je hem zelf oplost. Klachten gaan in het verbeterregister.",
      "Komen jullie er samen niet uit, wijs dan op de klachtenprocedure en de externe klachtenregeling.",
      "Bij vertrouwensbreuk met een ouder of cliënt: voer een herstelgesprek, zo nodig met de zorgcoördinator erbij.",
    ],
  },
  {
    slug: "no-show",
    titel: "Cliënt komt niet opdagen (no-show)",
    vraag: "Mijn cliënt is er niet op een geplande afspraak",
    trefwoorden: [
      "no-show",
      "niet opgedaagd",
      "afspraak gemist",
      "reistijd",
      "declareren",
    ],
    stappen: [
      "Probeer contact te krijgen met cliënt en ouders, leg vast wat je hebt gedaan.",
      "Meld herhaalde no-shows bij de zorgcoördinator.",
      "Almere: declareer bij no-show alleen de reistijd, niet de volledige geplande tijd. Dus 3 uur gepland en niemand thuis: 1 uur reistijd declareren.",
    ],
  },
  {
    slug: "wachttijd",
    titel: "Zorgen over capaciteit of wachttijd",
    vraag: "De wachttijd loopt op of de caseload wordt te zwaar",
    trefwoorden: [
      "wachttijd",
      "wachtlijst",
      "capaciteit",
      "caseload",
      "cliëntenstop",
      "vier weken",
    ],
    stappen: [
      "Wachttijd loopt op boven vier weken? Meld dit bij de zorgcoördinator, die schaalt op naar de Manager Zorg of directie.",
      "Een cliëntenstop mag alleen na overleg met en schriftelijke melding aan de gemeente, minimaal 14 dagen vooraf.",
    ],
  },
  {
    slug: "past-dit",
    titel: "Twijfel of een aanmelding bij ons past",
    vraag: "Ik twijfel of deze casus bij ons past",
    trefwoorden: [
      "aanmelding",
      "past",
      "twijfel",
      "verwijzer",
      "match",
      "intern overleg",
    ],
    stappen: [
      "Vraag de verwijzer de casus op de mail te zetten.",
      "Breng het in in het interne overleg.",
      "Besluit gezamenlijk. Uitgangspunt: pas starten bij een passende hulpvraag en een goede match.",
    ],
  },
];

export const MELDCODE_STAPPEN = [
  {
    stap: "Signalen in kaart brengen",
    tekst:
      "Vastleggen in het dossier, MIC-registratie, bespreken met je leidinggevende. Bij zorgen over kinderen van een volwassen cliënt: kindcheck.",
  },
  {
    stap: "Collegiale consultatie",
    tekst: "Zo nodig anoniem advies bij Veilig Thuis (0800-2000, 24/7).",
  },
  {
    stap: "Gesprek met kind en ouders",
    tekst: "Eerst feiten zonder oordeel, daarna pas interpretatie.",
  },
  {
    stap: "Wegen van de informatie",
    tekst: "Met de richtlijn Kindermishandeling en LIRIK.",
  },
  {
    stap: "Beslissen",
    tekst: "In overleg met Veilig Thuis bepalen of melden nodig is.",
  },
];

export type ProtocolGroep = {
  titel: string;
  toelichting?: string;
  documenten: { titel: string; waarvoor: string; url: string }[];
};

export const PROTOCOLLEN: ProtocolGroep[] = [
  {
    titel: "Veiligheid van cliënten",
    documenten: [
      {
        titel: "Meldcode huiselijk geweld en kindermishandeling v2.0",
        waarvoor: "Vijf stappen bij signalen van geweld of mishandeling",
        url: "https://drive.google.com/file/d/1Ae4woiBUNbEejiFkkUsoHffRismPxB0l/view",
      },
      {
        titel: "Meldcode 18+",
        waarvoor: "Zelfde stappen bij volwassen cliënten, inclusief kindcheck",
        url: "https://drive.google.com/file/d/1MAqcimaecHVNahVB-v2nWr6l7BtJY0sc/view",
      },
      {
        titel: "P 3.4.1 Suïcideprotocol",
        waarvoor: "Signaleren, risicoanalyse, veiligheidsafspraken, melden",
        url: "https://drive.google.com/file/d/1FtLzOJZRa46ywfpLPib4B0jdlSpTze44/view",
      },
      {
        titel: "MDR Richtlijn suïcidaal gedrag",
        waarvoor: "Onderliggende landelijke richtlijn",
        url: "https://drive.google.com/file/d/1mYKXywyiRnyPMfbJxD_63fRlWcgPXxs2/view",
      },
      {
        titel: "P 2.3.1 Veilig incidenten en calamiteiten melden",
        waarvoor: "MIC-melding, calamiteiten, meldplicht",
        url: "https://drive.google.com/file/d/1hd3ODjS5Eut6Yqk137YNPJhEJyd9kl3v/view",
      },
      {
        titel: "F 3.1.2 Risicosignalering (invulbaar)",
        waarvoor: "Formulier risicosignalering",
        url: "https://drive.google.com/file/d/1Yd5wuz4JSb5buvTjV6FLZWpVwSu578WU/view",
      },
      {
        titel: "Leidraad Veilige zorgrelatie",
        waarvoor: "Grenzen in de relatie tussen hulpverlener en cliënt",
        url: "https://drive.google.com/file/d/1-R0kczljXgTLh67nryNa5un6TPNdMjdD/view",
      },
    ],
  },
  {
    titel: "Gedrag en integriteit",
    documenten: [
      {
        titel: "D 4.4.1.1 Gedragscode",
        waarvoor: "Wat wij van elkaar verwachten in houding en gedrag",
        url: "https://drive.google.com/file/d/1v7tTwJlrgfULmwxxAaDauPeNpVNq957t/view",
      },
      {
        titel: "D 4.4.1.2 Grensoverschrijdend gedrag",
        waarvoor: "Herkennen, bespreken en melden",
        url: "https://drive.google.com/file/d/1m9x6NwwAVw4nYEUflx5pwPriSiHLsQm6/view",
      },
      {
        titel: "D 4.4.1.1 VOG-beleid",
        waarvoor: "Eisen aan de Verklaring Omtrent Gedrag",
        url: "https://drive.google.com/file/d/1FYd7vP4Px1c_-CTzIoDA8-E2quVIdYaB/view",
      },
      {
        titel: "D 3.4.1.1 Vergewisbeleid",
        waarvoor: "Controle op verleden en geschiktheid van nieuwe professionals",
        url: "https://drive.google.com/file/d/1WsfCfwUHl3R-SLs_y33Yg1NfdvXXamUd/view",
      },
    ],
  },
  {
    titel: "Privacy en gegevens",
    toelichting:
      "Het register van verwerkingsactiviteiten en de verwerkersovereenkomsten zijn beheersdocumenten. Die zijn op te vragen bij de directie en staan bewust niet in dit overzicht.",
    documenten: [
      {
        titel: "D 4.3.2 Privacyreglement",
        waarvoor: "Hoe wij met persoonsgegevens omgaan",
        url: "https://drive.google.com/file/d/1ItHh_0b7aJytu6xrE56BFW9qdf1TNekN/view",
      },
      {
        titel: "P 4.3.1 Veilige gegevensverwerking",
        waarvoor: "Werkafspraken rond veilig werken met gegevens",
        url: "https://drive.google.com/file/d/1W4EAHi0vNuHu181yMhBWfeqXzBP3dqv-/view",
      },
      {
        titel: "P 4.3.3 Melden datalek",
        waarvoor: "Wat te doen bij een datalek. Binnen 24 uur melden.",
        url: "https://drive.google.com/file/d/1m6-0We53aVKPcOlJOD9LAtIl7VqaDYl0/view",
      },
    ],
  },
  {
    titel: "Klachten en verbeteren",
    toelichting:
      "Wij zijn aangesloten bij een externe klachtenregeling. De contactgegevens daarvan staan in de klachtenprocedure.",
    documenten: [
      {
        titel: "D 4.2.1.1 Klachtenprocedure",
        waarvoor:
          "Hoe een cliënt of ouder een klacht indient en hoe wij die behandelen",
        url: "https://drive.google.com/file/d/1agOUWOS0y6bogdTQQ7hsv98cy7Pl6GH9/view",
      },
      {
        titel: "P 4.3.1 Verbetermanagement",
        waarvoor: "Verbeterregister en opvolging van meldingen",
        url: "https://drive.google.com/file/d/11CgjFblwBETi1MXOS-Bvy6Q-KIFkqa-s/view",
      },
      {
        titel: "P 5.1.1 Cliënttevredenheid",
        waarvoor: "Hoe en wanneer wij tevredenheid meten",
        url: "https://drive.google.com/file/d/1dAVkUkM1myzUex9ERMWEFvxa5E3mEHHs/view",
      },
    ],
  },
  {
    titel: "Arbo, veiligheid op locatie en verzuim",
    documenten: [
      {
        titel: "D 4.2.1 BHV-plan",
        waarvoor: "Bedrijfshulpverlening",
        url: "https://drive.google.com/file/d/15yuf0HSHXhkYX2Tkgqk2ab5lJW4Op-O-/view",
      },
      {
        titel: "Ontruimingsplan Randstad 20-27",
        waarvoor: "Wat te doen bij ontruiming op locatie",
        url: "https://drive.google.com/file/d/1Rf6KSswJtCw1DV5LQP19GhBY4A6Lkv_N/view",
      },
      {
        titel: "D 4.2.1.2 Arbobeleid",
        waarvoor: "Arbeidsomstandigheden",
        url: "https://drive.google.com/file/d/1YEOBX0vYqp5Vx-BObMKn1SM5UBcAXQEU/view",
      },
      {
        titel: "D 4.2.1.3 Verzuimprotocol",
        waarvoor: "Ziekmelden en verzuimbegeleiding (loondienst)",
        url: "https://drive.google.com/file/d/1sfoVtErKmCdrsCQtu833LqwA4HIC8NE9/view",
      },
    ],
  },
];
