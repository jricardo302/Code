/**
 * "Ken jij de vraagbaak?" — tien vragen over de dingen waar mensen in de
 * praktijk over struikelen. Elk antwoord verwijst terug naar de plek in de
 * kennisbank waar het staat, zodat een fout antwoord meteen iets oplevert.
 *
 * Geen onderdeel van de Drive-mappen: dit is van deze app.
 */

export type QuizVraag = {
  id: string;
  vraag: string;
  opties: string[];
  /** Index in `opties`. */
  goed: number;
  uitleg: string;
  bron: { tekst: string; href: string };
};

export const QUIZVRAGEN: QuizVraag[] = [
  {
    id: "uren",
    vraag: "Wanneer moeten je uren van de vorige maand ingevuld zijn?",
    opties: [
      "Vóór de 1e van de nieuwe maand",
      "Binnen twee weken",
      "Vóór de 15e van de nieuwe maand",
      "Aan het einde van het kwartaal",
    ],
    goed: 0,
    uitleg:
      "Vóór de 1e, in minuten en onder de juiste productcode. In de eerste week declareert de organisatie bij de gemeente; te laat invullen betekent te laat of geen declaratie.",
    bron: { tekst: "Werkprocessen — uren", href: "/vraagbaak/werk#uren" },
  },
  {
    id: "jgz-termijn",
    vraag:
      "Een beschikking van JGZ Almere loopt af. Wanneer moet het evaluatieformulier binnen zijn?",
    opties: [
      "Twee weken vóór de einddatum",
      "Eén maand vóór de einddatum",
      "Twee maanden vóór de einddatum",
      "Op de einddatum zelf",
    ],
    goed: 2,
    uitleg:
      "Twee maanden vóór de einddatum, naar aanmelden@jgzalmere.nl met aanmelden@ricardojeugdhulp.nl in cc. Dit is de enige vastgelegde eis; de andere verlengingstermijnen zijn interne werknormen.",
    bron: { tekst: "Verlengwijzer", href: "/vraagbaak/werk#verlengen" },
  },
  {
    id: "jgz-jgo",
    vraag: "Wat is JGO?",
    opties: [
      "De gemeentelijke toegang in Almere",
      "Het jeugdhulpteam op scholen voor speciaal onderwijs",
      "Een landelijk berichtenverkeerstandaard",
      "De externe auditor van ons kwaliteitssysteem",
    ],
    goed: 1,
    uitleg:
      "JGO is het jeugdhulpteam op scholen voor (voortgezet) speciaal onderwijs. JGZ is de gemeentelijke jeugdgezondheidszorg en toegang in Almere. Andere route, andere contactpersoon.",
    bron: { tekst: "Begrippenlijst", href: "/vraagbaak/vragen#begrippen" },
  },
  {
    id: "datalek",
    vraag:
      "Je hebt per ongeluk een mail met cliëntgegevens naar de verkeerde persoon gestuurd. Wat doe je eerst?",
    opties: [
      "Eerst uitzoeken hoe erg het is",
      "De ontvanger vragen de mail te verwijderen en het daarbij laten",
      "Direct melden bij de directie",
      "Het noteren in het dossier en bij de volgende evaluatie bespreken",
    ],
    goed: 2,
    uitleg:
      "Direct melden bij de directie, ook als je denkt dat het meevalt. Niet eerst zelf uitzoeken: intern geldt 24 uur, wettelijk 72 uur extern.",
    bron: { tekst: "Stappen bij een datalek", href: "/vraagbaak/nood#datalek" },
  },
  {
    id: "aandachtsfunctionaris",
    vraag: "Wie is de aandachtsfunctionaris meldcode?",
    opties: ["Jan Fahner", "Jiska Koopman", "Chehenaz Jahangier", "Joël Ricardo"],
    goed: 3,
    uitleg:
      "Joël Ricardo, vanuit de directie. Bij zorgen over de veiligheid van een kind schakel je hem dezelfde dag in.",
    bron: { tekst: "Wie is wie", href: "/vraagbaak#team" },
  },
  {
    id: "veilig-thuis",
    vraag: "Wat is het nummer van Veilig Thuis?",
    opties: ["0800-2000", "0800-0188", "112", "085 250 2096"],
    goed: 0,
    uitleg:
      "0800-2000, 24 uur per dag, ook voor anoniem advies. 0800-0188 is het Centrum Seksueel Geweld.",
    bron: { tekst: "Escalatiekaart", href: "/vraagbaak/nood" },
  },
  {
    id: "no-show",
    vraag:
      "In Almere sta je voor een dichte deur: drie uur gepland, niemand thuis. Wat declareer je?",
    opties: [
      "De volledige drie uur",
      "Niets",
      "Alleen de reistijd",
      "De helft van de geplande tijd",
    ],
    goed: 2,
    uitleg:
      "Alleen de reistijd. Leg ook vast wat je hebt gedaan om contact te krijgen, en meld herhaalde no-shows bij de zorgcoördinator.",
    bron: { tekst: "No-show", href: "/vraagbaak/nood#no-show" },
  },
  {
    id: "casuistiek",
    vraag: "Je werkt als zzp'er. Moet je naar het casuïstiekoverleg?",
    opties: [
      "Nee, dat is voor medewerkers in loondienst",
      "Ja, het is verplicht voor alle begeleiders",
      "Alleen als je zelf een casus inbrengt",
      "Alleen bij complexe casuïstiek",
    ],
    goed: 1,
    uitleg:
      "Ja. Het maandelijkse overleg van twee uur is verplicht voor alle begeleiders, ook zzp'ers. De zorgcoördinator zit voor.",
    bron: { tekst: "Casuïstiekoverleg", href: "/vraagbaak/werk#casuistiek" },
  },
  {
    id: "wachttijd",
    vraag: "Wat is de wachttijdnorm tussen aanmelding en start?",
    opties: ["Twee weken", "Vier weken", "Zes weken", "Drie maanden"],
    goed: 1,
    uitleg:
      "Maximaal vier weken. Loopt het op, dan meldt de zorgcoördinator dat bij de Manager Zorg of de directie.",
    bron: { tekst: "Van aanmelding tot start", href: "/vraagbaak/werk" },
  },
  {
    id: "ai",
    vraag: "Mag je een AI-tool gebruiken bij het formuleren van een rapportage?",
    opties: [
      "Nee, nooit",
      "Ja, en je mag ook gewoon de cliëntnaam invullen",
      "Ja, maar zonder cliëntnamen — werk met initialen of cliëntnummers",
      "Alleen met toestemming van de ouders",
    ],
    goed: 2,
    uitleg:
      "AI mag helpen bij formuleren en structureren, maar zonder direct herleidbare gegevens. De inhoudelijke verantwoordelijkheid blijft bij jou, dus controleer altijd of het feitelijk klopt.",
    bron: { tekst: "Gebruik van AI", href: "/vraagbaak/huisstijl#ai" },
  },
];

export function quizOordeel(goed: number, totaal: number): string {
  const deel = goed / totaal;
  if (deel === 1) return "Alles goed. Jij hebt de vraagbaak echt gelezen.";
  if (deel >= 0.8) return "Sterk. Je kent de kennisbank goed.";
  if (deel >= 0.5)
    return "Prima basis. Neem de gemiste vragen nog even door bij de bron.";
  return "Nog even doorlezen. Begin bij de escalatiekaart en de uren-deadline.";
}
