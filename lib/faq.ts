/**
 * De veelgestelde vragen op één plek: de FAQ-pagina toont ze, en de
 * FAQPage-structured data wordt eruit opgebouwd. Twee lijsten die uit elkaar
 * lopen is precies het soort fout dat Google wél ziet en jij niet.
 *
 * Antwoorden zijn platte tekst — dat is wat schema.org verwacht en het houdt
 * de twee weergaven identiek.
 */

export type Vraag = {
  vraag: string;
  antwoord: string;
  groep: string;
};

export const FAQ: Vraag[] = [
  // --- Het spel -----------------------------------------------------------
  {
    groep: "Het spel",
    vraag: "Voor hoeveel personen is het spel?",
    antwoord:
      "Vanaf 2 personen. Het werkt het prettigst met 3 tot 8 en is bruikbaar tot ongeveer 10. Boven de 10 wordt de wachttijd per persoon te lang; splits dan in twee groepen die apart spelen.",
  },
  {
    groep: "Het spel",
    vraag: "Hoe lang duurt een sessie?",
    antwoord:
      "Dat kies je zelf. De handleiding beschrijft drie vormen: een check-in van 15 minuten voor in het teamoverleg, een verdiepend gesprek van 30 tot 45 minuten voor reguliere intervisie, en een volledige sessie van 60 tot 90 minuten rond één casus met meerdere niveaus.",
  },
  {
    groep: "Het spel",
    vraag: "Is het alleen voor jeugdhulp?",
    antwoord:
      "Nee. De kaarten zijn geschreven met jeugdhulp en jeugd-GGZ als vertrekpunt, maar het grootste deel gaat over reflecteren op je eigen professionele handelen. Dat werkt net zo goed in de GGZ, in een wijkteam, in de gehandicaptenzorg, bij jeugdbescherming of in een opleiding.",
  },
  {
    groep: "Het spel",
    vraag: "Kunnen GGZ-professionals het gebruiken?",
    antwoord:
      "Ja. Behandelaren, psychologen, GZ-psychologen, systeemtherapeuten en vaktherapeuten gebruiken dezelfde reflectievragen. Waar een kaart over een gezin spreekt, lees je die in de GGZ als het systeem rond de cliënt.",
  },
  {
    groep: "Het spel",
    vraag: "Kan ik een kaart overslaan?",
    antwoord:
      "Altijd, zonder uitleg. Dat is een spelregel en geen uitzondering: een gesprek waarin je niet mag passen is geen veilig gesprek. Wie past legt de kaart onderop en trekt een nieuwe.",
  },
  {
    groep: "Het spel",
    vraag: "Heb je een gespreksleider nodig?",
    antwoord:
      "Nee, het spel werkt zonder begeleider. In een groep is het wel prettig als iemand op de tijd let en de afsluiting inleidt. Werk je met een vaste intervisiemethode, dan kan de kaartenset daarbinnen als vragenbron dienen.",
  },

  // --- Zorgvuldigheid -----------------------------------------------------
  {
    groep: "Zorgvuldig gebruik",
    vraag: "Mag ik cliëntcasussen bespreken?",
    antwoord:
      "Ja, mits geanonimiseerd. In de doos zit een veiligheidskaart met die afspraak: geen namen, geen geboortedata, geen adressen en geen andere gegevens waarmee iemand herleidbaar is. Het privacybeleid en de verwerkersafspraken van je eigen organisatie gaan daarbij altijd voor.",
  },
  {
    groep: "Zorgvuldig gebruik",
    vraag: "Moet ik persoonlijke dingen over mezelf delen?",
    antwoord:
      "Nee. De vragen op niveau 3 gaan over jouw professionele handelen — je triggers, je grenzen, je oordelen in het werk. Ze zijn niet bedoeld om persoonlijke of privétrauma's op tafel te leggen, en je bepaalt zelf hoe ver je gaat.",
  },
  {
    groep: "Zorgvuldig gebruik",
    vraag: "Vervangt dit supervisie of casuïstiekbespreking?",
    antwoord:
      "Nee. Het is een hulpmiddel dat reflectie en intervisie ondersteunt. Het vervangt geen formele supervisie, geen diagnostiek, geen behandeling, geen klinische besluitvorming en geen veiligheidsprocedures. Bij acute zorgen over de veiligheid gelden altijd de protocollen van je organisatie en de Meldcode.",
  },

  // --- Erkenning ----------------------------------------------------------
  {
    groep: "Erkenning en registratie",
    vraag: "Is het SKJ-geaccrediteerd?",
    antwoord:
      "Nee. IK ZIE, IK ZIE… is een hulpmiddel en geen scholing, en er is geen accreditatie voor aangevraagd of verleend. Of jouw intervisie meetelt voor herregistratie bepaalt SKJ, aan de hand van de eisen die daarvoor gelden — bijvoorbeeld dat intervisie in een vaste kleine groep plaatsvindt en dat je een leerverslag indient. Raadpleeg skjeugd.nl voor de actuele voorwaarden.",
  },
  {
    groep: "Erkenning en registratie",
    vraag: "Is het een officiële intervisiemethode?",
    antwoord:
      "Nee. Het is geen geregistreerde of erkende methodiek. Gebruik je een vaste gestructureerde methode zoals de incidentmethode of de vijfstappenmethode, dan kun je deze kaarten daarbinnen inzetten als vragenbron.",
  },
  {
    groep: "Erkenning en registratie",
    vraag: "Is de werking van dit spel wetenschappelijk aangetoond?",
    antwoord:
      "Nee, en dat beweren we ook niet. Er is geen effectonderzoek naar dit spel gedaan. Wat we wel doen is de vragen baseren op wat er over reflectief en systemisch werken bekend is, en ze laten meelezen door professionals uit het veld.",
  },

  // --- Bestellen ----------------------------------------------------------
  {
    groep: "Bestellen en levering",
    vraag: "Kunnen organisaties grotere aantallen bestellen?",
    antwoord:
      "Ja. Tot 24 spellen bestel je direct in de webshop, met staffelkorting vanaf 5 en vanaf 10 exemplaren. Vanaf 25 spellen maken we een offerte, met levering op factuur en desgewenst verdeling over meerdere locaties.",
  },
  {
    groep: "Bestellen en levering",
    vraag: "Kan ik op factuur betalen?",
    antwoord:
      "Bij offertes vanaf 25 spellen wel. In de webshop reken je direct af met iDEAL, creditcard, Apple Pay of Google Pay. Heb je voor een kleiner aantal toch een factuur nodig, mail ons dan even.",
  },
  {
    groep: "Bestellen en levering",
    vraag: "Wanneer wordt mijn bestelling verzonden?",
    antwoord:
      "De eerste oplage is nog in productie. Zodra er voorraad is versturen we bestellingen binnen twee werkdagen; bezorging in Nederland en België duurt daarna doorgaans 2 tot 5 werkdagen. Bestel je vóór er voorraad is, dan krijg je eerst bericht met de verwachte leverdatum.",
  },
  {
    groep: "Bestellen en levering",
    vraag: "Kan ik retourneren?",
    antwoord:
      "Ja. Als consument heb je 14 dagen bedenktijd na ontvangst, zonder opgaaf van reden. Je meldt de herroeping en stuurt het spel binnen 14 dagen daarna terug; wij betalen binnen 14 dagen na je melding terug. De retourkosten zijn voor jou, tenzij er iets mis was met het product.",
  },
  {
    groep: "Bestellen en levering",
    vraag: "Verzenden jullie ook buiten Nederland en België?",
    antwoord:
      "Op dit moment niet. De webshop verzendt naar Nederland en België. Zit je elders in de EU en wil je bestellen, mail ons dan — dan kijken we wat de verzending kost.",
  },
];

export const FAQ_GROEPEN = [...new Set(FAQ.map((vraag) => vraag.groep))];

/** FAQPage-structured data, opgebouwd uit dezelfde lijst. */
export function faqSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ.map((item) => ({
      "@type": "Question",
      name: item.vraag,
      acceptedAnswer: { "@type": "Answer", text: item.antwoord },
    })),
  };
}
