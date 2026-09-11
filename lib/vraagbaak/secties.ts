/**
 * Map 00 — Start hier. De indeling van de kennisbank, vertaald naar de app.
 * Bron: "START HIER — Wegwijzer kennisbank", versie 1.3 (5 september 2026).
 */

export type IconNaam =
  | "hand"
  | "koffer"
  | "personen"
  | "schild"
  | "route"
  | "sleutel"
  | "penseel"
  | "vraag"
  | "vonk";

export type Sectie = {
  /** Het mapnummer uit Drive — dat herkennen mensen terug. */
  nummer: string;
  slug: string;
  titel: string;
  /** Korte variant voor de navigatiebalk, waar de ruimte krap is. */
  navTitel: string;
  /** Wat je er vindt, in één regel. */
  kop: string;
  href: string;
  icoon: IconNaam;
};

export const SECTIES: Sectie[] = [
  {
    nummer: "01",
    slug: "over",
    titel: "Over Ricardo Jeugdhulp",
    navTitel: "Over ons",
    kop: "Wie we zijn, missie en visie, doelgroepen, methodieken, weekrooster, gemeenten",
    href: "/vraagbaak/over",
    icoon: "hand",
  },
  {
    nummer: "02",
    slug: "inwerken",
    titel: "Inwerken en onboarding",
    navTitel: "Inwerken",
    kop: "Inwerkboek, onboardingchecklist met aftekenschema, inwerkplan 30-60-90 dagen",
    href: "/vraagbaak/inwerken",
    icoon: "koffer",
  },
  {
    nummer: "03",
    slug: "rollen",
    titel: "Rollen en taken",
    navTitel: "Rollen",
    kop: "Wat er van je verwacht wordt per rol",
    href: "/vraagbaak/rollen",
    icoon: "personen",
  },
  {
    nummer: "04",
    slug: "nood",
    titel: "Protocollen en veiligheid",
    navTitel: "Veiligheid",
    kop: "Escalatiekaart, meldcode, suïcideprotocol, incidenten, datalek, privacy, klachten, BHV",
    href: "/vraagbaak/nood",
    icoon: "schild",
  },
  {
    nummer: "05",
    slug: "werk",
    titel: "Werkprocessen en formats",
    navTitel: "Werkprocessen",
    kop: "Aanmelding, matching, zorgplan, evaluatie, verlenging, uren en declaratie, lege formulieren",
    href: "/vraagbaak/werk",
    icoon: "route",
  },
  {
    nummer: "06",
    slug: "systemen",
    titel: "Systemen en accounts",
    navTitel: "Systemen",
    kop: "Zilliz, Google Workspace, ZIVVER, MijnVOS en veilig werken",
    href: "/vraagbaak/systemen",
    icoon: "sleutel",
  },
  {
    nummer: "07",
    slug: "huisstijl",
    titel: "Huisstijl en communicatie",
    navTitel: "Huisstijl",
    kop: "Logo, kleuren, e-mailhandtekening, schrijfregels, communicatie met gemeenten en cliënten",
    href: "/vraagbaak/huisstijl",
    icoon: "penseel",
  },
  {
    nummer: "08",
    slug: "vragen",
    titel: "Vraagbaak",
    navTitel: "Vragen",
    kop: "Veelgestelde vragen en de begrippenlijst",
    href: "/vraagbaak/vragen",
    icoon: "vraag",
  },
];

/** Losstaand van de mapnummering: de quiz is van deze app, niet van Drive. */
export const QUIZ_SECTIE: Sectie = {
  nummer: "★",
  slug: "quiz",
  titel: "Ken jij de vraagbaak?",
  navTitel: "Quiz",
  kop: "Tien vragen over de dingen waar je in de praktijk over struikelt",
  href: "/vraagbaak/quiz",
  icoon: "vonk",
};

/** Paragraaf 4 uit START HIER. Dit is wat iedereen moet weten, dag één. */
export const DRIE_DINGEN = [
  {
    kop: "Veiligheid gaat altijd voor",
    tekst:
      "Bij acuut gevaar bel je 112. Bij zorgen over de veiligheid van een kind schakel je dezelfde dag de aandachtsfunctionaris in: Joël Ricardo. Twijfel je? Dan overleg je. Niet melden is nooit de veilige keuze.",
    href: "/vraagbaak/nood",
    actie: "Naar de escalatiekaart",
  },
  {
    kop: "Wat niet in het dossier staat, is niet gebeurd",
    tekst:
      "Rapporteer in Zilliz, feitelijk en op tijd. Houd feit, observatie, interpretatie en conclusie uit elkaar.",
    href: "/vraagbaak/werk#dossier",
    actie: "Regels voor rapporteren",
  },
  {
    kop: "Uren vóór de 1e van de maand",
    tekst:
      "Je uren van de vorige maand staan vóór de 1e ingevuld, in minuten en onder de juiste productcode. Zonder jouw registratie kan er niet gedeclareerd worden.",
    href: "/vraagbaak/werk#uren",
    actie: "Alles over uren",
  },
];

/** Paragraaf 2 en 6 uit START HIER. */
export const SPELREGELS = [
  "De protocollen zelf staan in de kwaliteitsmap. Deze app verwijst per protocol naar het originele bestand, zodat er altijd maar één geldige versie is en het auditspoor klopt.",
  "Toegang wordt per document verleend. Krijg je de melding dat je geen toegang hebt, vraag die dan aan bij de directie.",
  "Maak geen eigen kopieën van protocollen op je laptop of in je eigen Drive. Werk altijd via de link.",
  "Geen cliëntgegevens hier. Cliëntinformatie hoort uitsluitend in Zilliz.",
  "Deel deze kennisbank niet met mensen buiten de organisatie, en niet met collega's zonder toegang.",
  "Zie je iets dat niet klopt of ontbreekt? Meld het bij de directie. Alleen de beheerder past documenten aan.",
];

export const KENNISBANK = {
  versie: "1.3",
  datum: "5 september 2026",
  beheerder: "Joël Ricardo (directie)",
  drive:
    "https://drive.google.com/drive/folders/1GpvewtzUKUO6EBeJVZ94M7EIXOch7oZC",
} as const;
