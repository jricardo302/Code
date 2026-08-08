/**
 * De spelregels en speelvormen. Dezelfde tekst staat op de site, in de
 * handleiding in de doos en in design/handleiding.md — daarom staat hij hier
 * één keer.
 */

export const BASISSPEL = [
  { stap: "01", tekst: "Kies samen een niveau: N1, N2 of N3." },
  { stap: "02", tekst: "Wie aan de beurt is trekt de bovenste kaart." },
  { stap: "03", tekst: "Lees de vraag hardop voor." },
  { stap: "04", tekst: "Eén persoon antwoordt. De rest luistert." },
  { stap: "05", tekst: "Daarna stelt de groep verdiepende vragen." },
  {
    stap: "06",
    tekst: "Geen advies, tenzij de inbrenger er expliciet om vraagt.",
  },
  { stap: "07", tekst: "Sluit af met: wat neem je mee?" },
];

export const AFSPRAKEN = [
  "Anonimiseer je casuïstiek. Geen namen, geen herleidbare gegevens.",
  "Iedereen mag een kaart overslaan, zonder uitleg.",
  "Luister voordat je adviseert.",
  "Onderzoek eerst, los niet meteen op.",
  "Verschillen in perspectief mogen blijven bestaan.",
  "Wat hier gezegd wordt, blijft hier.",
  "Bij acute zorgen over veiligheid gelden altijd de protocollen van je organisatie.",
];

export const SPEELVORMEN = [
  {
    duur: "15 minuten",
    naam: "Snelle check-in",
    voor: "Voor in het teamoverleg of aan het begin van een dienst.",
    stappen: [
      "Trek één kaart uit niveau 1.",
      "Iedereen antwoordt in maximaal één minuut.",
      "Geen doorvragen, geen discussie. Klaar.",
    ],
    niveaus: "N1",
    personen: "2–10",
  },
  {
    duur: "30–45 minuten",
    naam: "Verdiepend gesprek",
    voor: "Voor reguliere intervisie, zonder dat er een casus voorligt.",
    stappen: [
      "Trek één kaart uit niveau 2 of 3.",
      "Eén persoon antwoordt uitgebreid.",
      "De groep stelt tien minuten lang alleen open vragen.",
      "Herhaal met een tweede inbrenger als de tijd het toelaat.",
      "Sluit af met de afsluitkaart.",
    ],
    niveaus: "N2 of N3",
    personen: "3–8",
  },
  {
    duur: "60–90 minuten",
    naam: "Volledige sessie",
    voor: "Voor één concrete, geanonimiseerde casus die je met het team wilt uitdiepen.",
    stappen: [
      "De inbrenger vertelt de casus in maximaal vijf minuten.",
      "Trek twee kaarten uit niveau 1 om te openen.",
      "Trek drie tot vier kaarten uit niveau 2 en bespreek de casus daarlangs.",
      "Trek twee kaarten uit niveau 3: wat doet deze casus met de inbrenger?",
      "De inbrenger formuleert zelf een volgende stap.",
      "Sluit af met de afsluitkaart — iedereen, niet alleen de inbrenger.",
    ],
    niveaus: "N1 → N2 → N3",
    personen: "3–8",
  },
];

export const AFSLUITVRAAG =
  "Wat zie je nu dat je aan het begin nog niet zag?";
