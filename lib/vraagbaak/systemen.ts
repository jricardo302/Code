/**
 * Map 06 — Systemen en accounts.
 * Bron: "Systemen en accounts — Zilliz, Google Workspace, ZIVVER, MijnVOS",
 * versie 1.1 (5 september 2026). In dit document staan geen wachtwoorden.
 */

export type Systeem = {
  slug: string;
  naam: string;
  waarvoor: string;
  toegang: string;
  activatie?: string[];
};

export const SYSTEMEN: Systeem[] = [
  {
    slug: "google-workspace",
    naam: "Google Workspace",
    waarvoor: "Mail, agenda, Drive en deze kennisbank — op @ricardojeugdhulp.nl",
    toegang: "Directie",
    activatie: [
      "Je krijgt een activatielink.",
      "Stel een sterk, uniek wachtwoord in en zet tweestapsverificatie aan.",
      "Stel je e-mailhandtekening in volgens de huisstijl.",
    ],
  },
  {
    slug: "zilliz",
    naam: "Zilliz (ECD)",
    waarvoor:
      "Alle cliëntinformatie: dossier, rapportage, zorgplan en urenregistratie",
    toegang: "Zorgcoördinator",
    activatie: [
      "Je krijgt een activatiecode.",
      "Tweestapsverificatie met Google Authenticator is verplicht.",
      "Installeer de app eerst op je telefoon, scan de QR-code en bewaar de herstelcodes op een veilige plek.",
    ],
  },
  {
    slug: "zivver",
    naam: "ZIVVER",
    waarvoor:
      "Beveiligd mailen van gevoelige informatie naar verwijzers, gemeenten en ketenpartners",
    toegang: "Directie",
    activatie: [
      "Wordt gekoppeld aan je werkmail.",
      "Je gebruikt het zodra je persoonsgegevens buiten de organisatie verstuurt.",
    ],
  },
  {
    slug: "mijnvos",
    naam: "MijnVOS",
    waarvoor:
      "Backoffice: beschikkingen en berichtenverkeer, declaraties, salaris en pensioen. Jij werkt hier meestal niet zelf in.",
    toegang: "Directie en zorgcoördinator",
  },
];

export const ACCOUNT_REGEL =
  "Kom je er niet in? Meld dat bij de zorgcoördinator of de directie. Los het niet op door het account van een collega te gebruiken. Accounts zijn persoonlijk en worden nooit gedeeld.";

export const ZILLIZ_WERKEN = [
  "Cliëntdossiers, rapportages en zorgplannen maak je via Cliënt > Dossier > Nieuw > Sjabloon. Er zijn vaste sjablonen; vraag de zorgcoördinator welke voor jouw rol verplicht zijn.",
  "Urenregistratie doe je in Zilliz, in minuten en met de juiste productcode, vóór de 1e van de nieuwe maand.",
  "Raamovereenkomsten kunnen in de Zilliz-inbox digitaal worden ondertekend.",
  "Zilliz en je werkmail zijn gescheiden systemen met eigen inloggegevens.",
];

export type VeiligRegel = { regel: string; waarom?: string };

export const VEILIG_WERKEN: VeiligRegel[] = [
  {
    regel: "Cliëntgegevens staan uitsluitend in Zilliz.",
    waarom: "Niet in je mail, niet in Drive, niet op je bureaublad.",
  },
  {
    regel:
      "Verstuur persoonsgegevens buiten de organisatie alleen beveiligd via ZIVVER.",
  },
  { regel: "Geen dossierinformatie via WhatsApp of privémail." },
  {
    regel: "Vergrendel je laptop als je wegloopt.",
    waarom:
      "Werk niet met dossiers in openbare ruimtes waar anderen kunnen meekijken.",
  },
  {
    regel:
      "Gebruik voor elk systeem een uniek wachtwoord en zet tweestapsverificatie aan waar dat kan.",
  },
  {
    regel: "Gebruik geen cliëntnamen in AI-tools.",
    waarom: "Werk met initialen of cliëntnummers.",
  },
  {
    regel:
      "Verkeerde mail verstuurd, laptop kwijt of dossier open laten staan? Meld het direct bij de directie.",
    waarom: "Ook bij twijfel. Zie de datalekprocedure.",
  },
];

export const UITDIENST = [
  "Je levert laptop, telefoon, sleutel en toegangspas in.",
  "Je accounts worden gedeactiveerd; je toegang tot deze kennisbank en tot Zilliz vervalt.",
  "Openstaande rapportages en urenregistraties rond je af vóór je laatste werkdag.",
  "Lopende cliënten draag je warm over aan de zorgcoördinator en je opvolger.",
];

export const SYSTEEM_DOCUMENTEN = [
  {
    titel: "Privacyreglement",
    url: "https://drive.google.com/file/d/1ItHh_0b7aJytu6xrE56BFW9qdf1TNekN/view",
  },
  {
    titel: "P 4.3.1 Veilige gegevensverwerking",
    url: "https://drive.google.com/file/d/1W4EAHi0vNuHu181yMhBWfeqXzBP3dqv-/view",
  },
  {
    titel: "P 4.3.3 Melden datalek",
    url: "https://drive.google.com/file/d/1m6-0We53aVKPcOlJOD9LAtIl7VqaDYl0/view",
  },
];
