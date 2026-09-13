/**
 * Map 08 — Begrippenlijst.
 * Bron: "Begrippenlijst Ricardo Jeugdhulp", versie 1.1 (5 september 2026).
 */

export type Begrip = {
  term: string;
  uitleg: string;
  /** Begrippen die je in je eerste week sowieso tegenkomt. */
  eersteWeek?: boolean;
};

export const BEGRIPPEN: Begrip[] = [
  {
    term: "Aandachtsfunctionaris",
    uitleg:
      "Degene die binnen de organisatie de meldcode bewaakt en bij wie je meldt. Bij Ricardo Jeugdhulp: Joël Ricardo.",
    eersteWeek: true,
  },
  {
    term: "AGB-code",
    uitleg: "Landelijke identificatiecode voor zorgaanbieders. Die van ons is 41549979.",
  },
  {
    term: "APK-gesprek",
    uitleg:
      "Periodiek voortgangsgesprek tussen zorgcoördinator en begeleider, vooral bij zzp'ers.",
  },
  { term: "AVG", uitleg: "Algemene verordening gegevensbescherming: de privacywet." },
  {
    term: "Backoffice",
    uitleg:
      "De partij die beschikkingen, berichtenverkeer en declaraties administratief afhandelt. Bij ons: MijnVOS.",
  },
  {
    term: "Beschikking",
    uitleg:
      "Besluit van de gemeente waarmee zorg aan een cliënt wordt toegekend, met omvang en einddatum. Niet hetzelfde als jouw contract.",
    eersteWeek: true,
  },
  {
    term: "BHV",
    uitleg: "Bedrijfshulpverlening: eerste hulp, ontruiming en veiligheid op locatie.",
  },
  {
    term: "Buro Klix",
    uitleg: "Externe auditor die ons HKZ-kwaliteitssysteem elk kwartaal toetst.",
  },
  {
    term: "Casuïstiekoverleg",
    uitleg:
      "Maandelijks overleg van twee uur waarin casussen inhoudelijk worden besproken. Verplicht voor alle begeleiders, ook zzp'ers.",
  },
  {
    term: "Circulaire hulpverlening",
    uitleg:
      "Onze werkwijze: professionele hulp zo kort als verantwoord, terwijl duurzame steun in het eigen netwerk wordt opgebouwd.",
  },
  {
    term: "Dagbesteding",
    uitleg:
      "Gestructureerde activiteiten overdag, gericht op ritme, ontwikkeling en participatie.",
  },
  {
    term: "Datalek",
    uitleg:
      "Inbreuk waarbij persoonsgegevens verloren gaan of bij de verkeerde persoon terechtkomen. Direct melden bij de directie.",
  },
  { term: "ECD", uitleg: "Elektronisch cliëntdossier. Ons ECD is Zilliz.", eersteWeek: true },
  {
    term: "Gedragswetenschapper",
    uitleg:
      "Orthopedagoog of psycholoog die inhoudelijk meedenkt en de kwaliteit van de hulpverlening bewaakt.",
  },
  {
    term: "HKZ",
    uitleg:
      "Harmonisatie Kwaliteitsbeoordeling in de Zorgsector. Ons keurmerk is HKZ Kleine Organisaties.",
    eersteWeek: true,
  },
  {
    term: "IAG",
    uitleg:
      "Intensieve Ambulante Gezinsbehandeling. In Lelystad een aparte productgroep.",
  },
  { term: "IGJ", uitleg: "Inspectie Gezondheidszorg en Jeugd: de toezichthouder.", eersteWeek: true },
  {
    term: "iJw",
    uitleg:
      "Landelijke standaard voor administratief berichtenverkeer in de jeugdwet.",
    eersteWeek: true,
  },
  {
    term: "Jeugd-GGZ",
    uitleg: "Geestelijke gezondheidszorg voor jeugd: diagnostiek en behandeling.",
  },
  {
    term: "JGO",
    uitleg:
      "Jeugdhulp Gespecialiseerd Onderwijs: vast jeugdhulpteam op scholen voor (voortgezet) speciaal onderwijs, gericht op een ononderbroken schoolloopbaan. Geen behandeling, geen diagnostiek, geen crisiszorg.",
    eersteWeek: true,
  },
  {
    term: "JGZ",
    uitleg:
      "Jeugdgezondheidszorg: de gemeentelijke toegang in Almere. Niet hetzelfde als JGO.",
    eersteWeek: true,
  },
  {
    term: "JIJ-kader",
    uitleg:
      "Toetsingskader van de IGJ, waarbij de jeugdige centraal staat. Drie pijlers: ontwikkelingsgerichte hulp, de kundige hulpverlener, goed bestuur.",
    eersteWeek: true,
  },
  {
    term: "JIM",
    uitleg:
      "Jouw Ingebrachte Mentor: methodiek waarbij een vertrouwenspersoon uit het eigen netwerk van de jongere formeel wordt betrokken.",
  },
  {
    term: "JW315",
    uitleg:
      "Berichttype in het berichtenverkeer waarmee zorgtoewijzing wordt aangevraagd.",
    eersteWeek: true,
  },
  {
    term: "Kindcheck",
    uitleg:
      "Controle of er kinderen in het gezin van een volwassen cliënt zijn en of zij veilig zijn.",
  },
  {
    term: "LIRIK",
    uitleg:
      "Licht Instrument Risicotaxatie Kindveiligheid, hulpmiddel bij het wegen van signalen.",
  },
  {
    term: "LVB",
    uitleg: "Licht verstandelijke beperking. Behandeling LVB is een apart zorgproduct.",
  },
  {
    term: "Meldcode",
    uitleg:
      "Verplicht vijfstappenplan bij signalen van huiselijk geweld en kindermishandeling.",
  },
  { term: "MIC", uitleg: "Melding Incident Cliënt: interne registratie van incidenten.", eersteWeek: true },
  {
    term: "MijnVOS",
    uitleg:
      "Onze backofficepartner voor beschikkingen, declaraties en salarisadministratie.",
  },
  { term: "MTO", uitleg: "Medewerkertevredenheidsonderzoek." },
  {
    term: "No-show",
    uitleg:
      "Cliënt is er niet op een geplande afspraak. In Almere declareer je dan alleen reistijd.",
  },
  {
    term: "Onderaannemer",
    uitleg:
      "Partij of zzp'er die zorg levert onder onze verantwoordelijkheid. Wordt altijd bij de gemeente gemeld; de gemeente betaalt uitsluitend aan Ricardo Jeugdhulp.",
  },
  {
    term: "PDCA",
    uitleg: "Plan-Do-Check-Act: de verbetercyclus van ons kwaliteitssysteem.",
  },
  {
    term: "Perceel 3A / 3B",
    uitleg:
      "Contractonderdelen in Lelystad. 3A: GGZ vrijgevestigden. 3B: GGZ instellingen, inclusief psychodiagnostiek en specialistische behandeling.",
    eersteWeek: true,
  },
  {
    term: "PFZW",
    uitleg: "Pensioenfonds Zorg en Welzijn, voor medewerkers in loondienst.",
  },
  {
    term: "PMT",
    uitleg:
      "Psychomotorische therapie: behandeling via beweging en lichaamsgerichte oefening.",
  },
  {
    term: "POH-GGZ",
    uitleg: "Praktijkondersteuner huisarts GGZ; veelvoorkomende verwijzer.",
  },
  {
    term: "Presentiebenadering",
    uitleg:
      "Werkwijze waarbij aanwezig zijn en aansluiten bij de leefwereld van de jongere voorop staat.",
  },
  {
    term: "Productcode",
    uitleg:
      "Declaratiecode die de gemeente aan een zorgproduct koppelt. Verschilt per gemeente en is niet uitwisselbaar.",
    eersteWeek: true,
  },
  {
    term: "RET",
    uitleg: "Rationeel-emotieve training: methodiek gericht op denkpatronen en gedrag.",
  },
  {
    term: "RI&E",
    uitleg:
      "Risico-inventarisatie en -evaluatie: verplichte analyse van arbeidsrisico's.",
  },
  {
    term: "Rots & Water",
    uitleg:
      "Weerbaarheidsmethodiek gericht op grenzen stellen en sociale vaardigheden.",
  },
  {
    term: "SAVE",
    uitleg: "Samenwerken aan Veiligheid: jeugdbescherming en jeugdreclassering.",
  },
  {
    term: "SKJ",
    uitleg: "Stichting Kwaliteitsregister Jeugd: beroepsregistratie voor jeugdprofessionals.",
    eersteWeek: true,
  },
  {
    term: "Social Return",
    uitleg:
      "Contracteis om een deel van de opdrachtwaarde in te zetten voor werk en participatie in de regio.",
  },
  {
    term: "Systeemgericht werken",
    uitleg: "Werken met het hele gezin en netwerk in plaats van alleen met de jongere.",
  },
  {
    term: "Traumasensitief werken",
    uitleg:
      "Werkwijze die rekening houdt met de effecten van trauma op gedrag en ontwikkeling.",
  },
  {
    term: "Veilig Thuis",
    uitleg:
      "Advies- en meldpunt huiselijk geweld en kindermishandeling: 0800-2000, 24 uur per dag.",
  },
  {
    term: "Verbeterregister",
    uitleg:
      "Register waarin meldingen, klachten en auditbevindingen worden bijgehouden en opgevolgd.",
  },
  {
    term: "Vergewisplicht",
    uitleg:
      "Plicht om je bij aanname te vergewissen van het arbeidsverleden en de geschiktheid van een professional.",
  },
  {
    term: "VOG",
    uitleg:
      "Verklaring Omtrent het Gedrag. Verplicht voor iedereen die met jeugd werkt.",
  },
  {
    term: "Wet DBA",
    uitleg:
      "Wetgeving over de beoordeling van arbeidsrelaties, relevant voor de inzet van zzp'ers.",
  },
  { term: "Wlz", uitleg: "Wet langdurige zorg. Valt buiten ons aanbod." },
  {
    term: "WSG",
    uitleg:
      "William Schrikker Groep: jeugdbescherming voor kinderen met een beperking; verwijzer.",
  },
  {
    term: "Zilliz",
    uitleg:
      "Ons elektronisch cliëntdossier. Tweestapsverificatie met Google Authenticator is verplicht.",
  },
  { term: "ZIVVER", uitleg: "Systeem voor beveiligd mailen van gevoelige informatie." },
  {
    term: "Zorgplan",
    uitleg:
      "Plan met doelen en afspraken, opgesteld samen met cliënt en ouders, vastgelegd in het dossier.",
  },
  {
    term: "ZorgDomein",
    uitleg:
      "Digitaal verwijssysteem waarmee verwijzers een formele verwijzing versturen.",
  },
];
