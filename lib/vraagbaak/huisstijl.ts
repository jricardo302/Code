/**
 * Map 07 — Huisstijl en communicatie.
 * Bron: "Huisstijl en communicatie", versie 1.1 (5 september 2026).
 */

export const MERKKLEUREN = [
  {
    naam: "Donkerblauw",
    hex: "#171C33",
    gebruik:
      "Titels, koppen, tabelkoppen, hoofdlijnen. Koppen zijn donkerblauw, niet zwart.",
  },
  {
    naam: "Groen",
    hex: "#B6CD57",
    gebruik:
      "Accent: highlights, call-outs, balkjes. Spaarzaam gebruiken. Tekst op groen is donkerblauw.",
  },
  {
    naam: "Wit",
    hex: "#FFFFFF",
    gebruik: "Achtergrond, en tekst op donkerblauw.",
  },
];

export const LETTERTYPE = {
  kop: "Mont, terugval Montserrat",
  tekst:
    "Mont Heavy voor koppen, Mont of Montserrat regular voor lopende tekst. Heb je Mont niet geïnstalleerd, gebruik dan Montserrat: dat is gratis en vrijwel identiek.",
};

export const LOGOREGELS = [
  "Het logo staat rechtsboven op de eerste pagina of in de header.",
  "Schaal altijd proportioneel, houd witruimte eromheen en vervorm of herkleur het nooit.",
  "Gebruik altijd de actuele logoversie. Vraag die op bij de directie; gebruik geen versie die je zelf van de website of uit een oud document hebt gehaald.",
  "Gebruik voor nieuwe interne documenten het documentsjabloon met documentcode, versienummer en datum.",
  "Bestandsnamen zijn professioneel en herkenbaar: onderwerp, organisatie, datum. Geen “def2 echt final”.",
];

export const HANDTEKENING_VELDEN = {
  organisatie: "Ricardo Jeugdhulp",
  adres: "Randstad 20-27, 1314 BC Almere",
  telefoon: "T 085 250 2096",
  website: "www.ricardojeugdhulp.nl",
  vertrouwelijkheid:
    "Voeg een korte vertrouwelijkheidsregel toe bij mail met persoonsgegevens en verstuur die mail via ZIVVER.",
};

export const SCHRIJFREGELS = [
  "Professioneel Nederlands. Concreet, zakelijk duidelijk en compact.",
  "Geen wollige of onnodig juridische taal. Schrijf wat je bedoelt.",
  "Benoem data, bedragen, rollen, uren en acties specifiek.",
  "Is iets onzeker? Benoem dat, doe niet alsof het vaststaat.",
  "Externe formele communicatie: “u”. Interne mail mag informeler.",
  "Gebruik tabellen bij tarieven, codes en overzichten. Sorteer chronologisch van oud naar nieuw, tenzij je begint met een samenvatting van de actuele stand.",
  "Houd witruimte functioneel; maak teksten scanbaar met duidelijke koppen.",
];

export const COMMUNICATIE_GEMEENTEN = [
  "Neutraal en zorgvuldig formuleren. Zet de gemeente nooit weg als tegenpartij of boosdoener.",
  "Geen beschuldigende of defensieve toon, ook niet als je het inhoudelijk oneens bent.",
  "Onderbouw met feiten, data en documenten. Verwijs naar het dossier of het contract.",
  "Cc bij verlengingsverzoeken altijd aanmelden@ricardojeugdhulp.nl, zodat het intern zichtbaar blijft.",
  "Persoonsgegevens uitsluitend beveiligd versturen.",
];

export const COMMUNICATIE_CLIENTEN = [
  "Schrijf begrijpelijk, zonder jargon. Leg vaktermen uit.",
  "Rapportage schrijf je alsof de cliënt meeleest, want dat mag hij.",
  "Houd feit, observatie, interpretatie en conclusie uit elkaar. Voeg geen diagnoses of conclusies toe die je niet kunt onderbouwen.",
  "Suggereer geen overleg dat niet heeft plaatsgevonden.",
  "Bij een vertrouwensbreuk: voer een herstelgesprek, zo nodig met de zorgcoördinator erbij.",
];

export const AI_REGELS = [
  "Gebruik geen cliëntnamen of andere direct herleidbare gegevens in AI-tools. Werk met initialen of cliëntnummers.",
  "AI mag helpen bij formuleren en structureren. De inhoudelijke verantwoordelijkheid blijft bij jou.",
  "Controleer altijd of wat er staat feitelijk klopt voordat je het in een dossier of naar buiten gebruikt.",
];

export const HUISSTIJL_DOCUMENTEN = [
  {
    titel: "D 1.2.1.1 Documentsjabloon",
    url: "https://drive.google.com/file/d/1T7GQxmkoeODbAdsHdWBgBATmQnrcpQ3O/view",
  },
  {
    titel: "P 1.2.1 Documentbeheersing",
    url: "https://drive.google.com/file/d/1nGnZWJ6A4oZWbKn-uc6wATBk6PJeEU3m/view",
  },
];
