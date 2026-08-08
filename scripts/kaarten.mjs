/**
 * Bron van waarheid voor de honderd vraagkaarten.
 *
 * Dit bestand bevat de vragen én genereert daaruit:
 *   content/cards.json     — voor de website en print-generator
 *   content/cards.csv      — voor drukker, vertaler en Excel
 *   content/100-vragen.md  — leesbare versie voor mensen
 *
 * Draaien:  node scripts/kaarten.mjs           (schrijft de bestanden)
 *           node scripts/kaarten.mjs --check   (alleen controleren, schrijft niets)
 *
 * De controle draait altijd, ook bij schrijven. Een set die niet klopt komt
 * er niet doorheen: liever een rode build dan honderd verkeerde kaarten bij
 * de drukker.
 */

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const HIER = dirname(fileURLToPath(import.meta.url));
const PROJECT = join(HIER, "..");
const CONTENT = join(PROJECT, "content");

// ---------------------------------------------------------------------------
// Niveaus
// ---------------------------------------------------------------------------

export const NIVEAUS = {
  1: {
    naam: "Licht",
    ondertitel: "Begin bij verbinding",
    kleur: "#C9A8E0",
    tekstkleur: "#3B1E4A",
    doel: "Veiligheid maken, elkaar als vakmens leren kennen, ontspannen beginnen.",
  },
  2: {
    naam: "Casus",
    ondertitel: "Kijk vanuit een andere hoek",
    kleur: "#8B5FBF",
    tekstkleur: "#F7F2E7",
    doel: "Een concrete situatie anders bekijken: perspectief, systeem, hypothese, doel.",
  },
  3: {
    naam: "Spiegel",
    ondertitel: "Kijk naar jezelf als professional",
    kleur: "#3B1E4A",
    tekstkleur: "#F7F2E7",
    doel: "Onderzoeken wat de casus met jóu doet: triggers, grenzen, oordeel, twijfel.",
  },
};

// ---------------------------------------------------------------------------
// De vragen. Volgorde bepaalt het kaartnummer.
// ---------------------------------------------------------------------------

const VRAGEN = [
  // === NIVEAU 1 — LICHT (33 kaarten) ==================================
  { n: 1, c: "Kennismaking", v: "Waarom ben je ooit in dit vak terechtgekomen?" },
  { n: 1, c: "Kennismaking", v: "Welke eigenschap helpt jou het meest in je werk?" },
  { n: 1, c: "Kennismaking", v: "Wat zou een collega zeggen dat typisch iets van jou is?" },
  { n: 1, c: "Kennismaking", v: "Wat wist je op je eerste werkdag nog niet?" },
  { n: 1, c: "Kennismaking", v: "Welk deel van je werk zou je nooit willen inleveren?" },
  { n: 1, c: "Kennismaking", v: "Waar in je werk voel je je het meest op je plek?" },
  { n: 1, c: "Kennismaking", v: "Welke vaardigheid heb je in dit vak per ongeluk geleerd?" },
  { n: 1, c: "Kennismaking", v: "Welke ervaring van buiten dit vak gebruik je hier nog dagelijks?" },
  { n: 1, c: "Kennismaking", v: "Wat zou je jezelf aanraden als je vandaag opnieuw zou beginnen?" },
  { n: 1, c: "Kennismaking", v: "Wat doe je in je werk waar je stiekem trots op bent?" },

  { n: 1, c: "Werkplezier", v: "Wanneer heb je voor het laatst hard gelachen op je werk?" },
  { n: 1, c: "Werkplezier", v: "Wat maakt een werkdag voor jou geslaagd?" },
  { n: 1, c: "Werkplezier", v: "Welk moment van deze week wil je onthouden?" },
  { n: 1, c: "Werkplezier", v: "Waar krijg je energie van, ook als het druk is?" },
  { n: 1, c: "Werkplezier", v: "Welke gewoonte helpt jou de werkdag door?" },
  { n: 1, c: "Werkplezier", v: "Wat is het mooiste compliment dat je ooit van een jongere kreeg?" },
  { n: 1, c: "Werkplezier", v: "Welke uitspraak van een jongere heeft je positief verrast?" },
  { n: 1, c: "Werkplezier", v: "Wat is een klein succes van deze maand dat niemand heeft gezien?" },
  { n: 1, c: "Werkplezier", v: "Waar kijk je in je werkweek het meest naar uit?" },
  { n: 1, c: "Werkplezier", v: "Wat zou je vandaag doen als je een uur cadeau kreeg?" },

  { n: 1, c: "Vakmanschap", v: "Welk advies uit je opleiding blijkt in de praktijk het meest waar?" },
  { n: 1, c: "Vakmanschap", v: "Welk advies uit je opleiding gebruik je eigenlijk nooit?" },
  { n: 1, c: "Vakmanschap", v: "Welke werkvorm werkt bij jou bijna altijd?" },
  { n: 1, c: "Vakmanschap", v: "Wat doe je als een gesprek niet op gang komt?" },
  { n: 1, c: "Vakmanschap", v: "Hoe bereid je je voor op een gesprek waar je tegenop ziet?" },
  { n: 1, c: "Vakmanschap", v: "Wat neem je altijd mee naar een huisbezoek?" },
  { n: 1, c: "Vakmanschap", v: "Waar merk je aan dat je een goede klik hebt met iemand?" },
  { n: 1, c: "Vakmanschap", v: "Wat zeg jij meestal als eerste als je ergens binnenkomt?" },

  { n: 1, c: "Collega's", v: "Van welke collega heb je het meeste geleerd?" },
  { n: 1, c: "Collega's", v: "Welke collega zou jou het beste kunnen nadoen?" },
  { n: 1, c: "Collega's", v: "Wat vraag je aan een collega als je even vastzit?" },
  { n: 1, c: "Collega's", v: "Waar in dit team zou je vaker om hulp mogen vragen?" },
  { n: 1, c: "Collega's", v: "Wat waardeer je in dit team dat je nooit hardop zegt?" },

  // === NIVEAU 2 — CASUS (34 kaarten) =================================
  { n: 2, c: "Perspectief", v: "Wat zou de jongere zeggen dat het doel van deze hulp moet zijn?" },
  { n: 2, c: "Perspectief", v: "Wat zou de ouder daarop antwoorden?" },
  { n: 2, c: "Perspectief", v: "Wat zou een leerkracht hier zien wat jij niet ziet?" },
  { n: 2, c: "Perspectief", v: "Wat zie jij dat een andere professional mogelijk anders weegt?" },
  { n: 2, c: "Perspectief", v: "Hoe zou deze situatie klinken als de jongere hem zelf vertelde?" },
  { n: 2, c: "Perspectief", v: "Wie zou het meest verbaasd zijn over jouw beeld van deze situatie?" },
  { n: 2, c: "Perspectief", v: "Welk woord gebruik jij hier dat het gezin zelf nooit zou gebruiken?" },

  { n: 2, c: "Systeem", v: "Van wie is dit probleem eigenlijk?" },
  { n: 2, c: "Systeem", v: "Wie wordt op dit moment onvoldoende gehoord?" },
  { n: 2, c: "Systeem", v: "Wie draagt hier het meeste zonder dat iemand het benoemt?" },
  { n: 2, c: "Systeem", v: "Wat verandert er voor de anderen als het beter gaat met de jongere?" },
  { n: 2, c: "Systeem", v: "Welke functie heeft dit gedrag in dit gezin?" },
  { n: 2, c: "Systeem", v: "Welke afwezige persoon speelt hier toch een grote rol?" },
  { n: 2, c: "Systeem", v: "Wat is hier al eerder geprobeerd, en wat leverde dat op?" },

  { n: 2, c: "Hypothese", v: "Welke aanname maak jij over dit gezin?" },
  { n: 2, c: "Hypothese", v: "Wat zou waar moeten zijn om jouw verklaring te laten kloppen?" },
  { n: 2, c: "Hypothese", v: "Welke verklaring heb je te snel weggelegd?" },
  { n: 2, c: "Hypothese", v: "Wat zou je denken als je dit dossier vandaag voor het eerst las?" },
  { n: 2, c: "Hypothese", v: "Wat is de vraag achter de vraag die is uitgesproken?" },
  { n: 2, c: "Hypothese", v: "Welke informatie ontbreekt om een betere afweging te maken?" },
  { n: 2, c: "Hypothese", v: "Wie zou je nog kunnen spreken om je beeld te toetsen?" },

  { n: 2, c: "Doelen", v: "Wat gebeurt er als jij niets verandert aan je aanpak?" },
  { n: 2, c: "Doelen", v: "Waar ben jij harder aan het werk dan het gezin?" },
  { n: 2, c: "Doelen", v: "Voor wie is dit doel eigenlijk opgeschreven?" },
  { n: 2, c: "Doelen", v: "Wat is op dit moment goed genoeg?" },
  { n: 2, c: "Doelen", v: "Welke kleinste stap zou hier al verschil maken?" },
  { n: 2, c: "Doelen", v: "Welke kracht wordt hier nu onvoldoende gebruikt?" },
  { n: 2, c: "Doelen", v: "Wat zou je doen als je nog maar drie gesprekken had?" },
  { n: 2, c: "Doelen", v: "Welk doel zou je durven schrappen?" },

  { n: 2, c: "Samenwerking", v: "Wie is hier betrokken zonder dat iemand nog weet waarom?" },
  { n: 2, c: "Samenwerking", v: "Waar in de samenwerking loopt informatie vast?" },
  { n: 2, c: "Samenwerking", v: "Wat verwacht jij van een ketenpartner dat je nooit hebt uitgesproken?" },
  { n: 2, c: "Samenwerking", v: "Wie neemt hier eigenlijk de beslissing?" },
  { n: 2, c: "Samenwerking", v: "Wat zou je willen vragen aan de professional die vóór jou betrokken was?" },

  // === NIVEAU 3 — SPIEGEL (33 kaarten) ===============================
  { n: 3, c: "Triggers", v: "Wie roept iets in jou op dat meer over jou zegt dan over die ander?" },
  { n: 3, c: "Triggers", v: "Bij welk gedrag word jij ongeduldig?" },
  { n: 3, c: "Triggers", v: "Wanneer voelde je je voor het laatst machteloos?" },
  { n: 3, c: "Triggers", v: "Welke situatie neem je mee naar huis?" },
  { n: 3, c: "Triggers", v: "Waar voel je je onzeker terwijl je dat niet laat zien?" },
  { n: 3, c: "Triggers", v: "Wat doet het met je als een ouder jou niet vertrouwt?" },

  { n: 3, c: "Grenzen", v: "Wanneer voel jij de neiging om een gezin te redden?" },
  { n: 3, c: "Grenzen", v: "Wanneer wordt betrokkenheid voor jou te veel verantwoordelijkheid?" },
  { n: 3, c: "Grenzen", v: "Welke grens heb je deze maand niet bewaakt?" },
  { n: 3, c: "Grenzen", v: "Wat neem jij op je wat eigenlijk niet van jou is?" },
  { n: 3, c: "Grenzen", v: "Waar zeg je te snel ja?" },
  { n: 3, c: "Grenzen", v: "Wat gebeurt er met jou als je een casus moet loslaten?" },

  { n: 3, c: "Oordeel", v: "Bij welk type ouder merk je dat je sneller oordeelt?" },
  { n: 3, c: "Oordeel", v: "Welke overtuiging uit je eigen opvoeding neem je mee in je werk?" },
  { n: 3, c: "Oordeel", v: "Welke aanname bleek achteraf helemaal niet te kloppen?" },
  { n: 3, c: "Oordeel", v: "Waar zoek je vooral bevestiging van je eigen beeld?" },
  { n: 3, c: "Oordeel", v: "Welk verschil in taal of cultuur maakt jou onzeker?" },
  { n: 3, c: "Oordeel", v: "Wie in dit vak begrijp je moeilijk, en wat zegt dat over jou?" },

  { n: 3, c: "Positie", v: "Hoeveel invloed heb jij eigenlijk op het leven van dit gezin?" },
  { n: 3, c: "Positie", v: "Wanneer gebruikte je voor het laatst je positie om iets voor elkaar te krijgen?" },
  { n: 3, c: "Positie", v: "Wat zou een gezin niet tegen jou durven zeggen?" },
  { n: 3, c: "Positie", v: "Waar in dit team heb jij meer invloed dan je gebruikt?" },
  { n: 3, c: "Positie", v: "Wanneer zwijg jij in een overleg terwijl je wel iets vindt?" },

  { n: 3, c: "Twijfel", v: "Welke professionele fout heeft jou het meest geleerd?" },
  { n: 3, c: "Twijfel", v: "Wanneer vind je het moeilijk om toe te geven dat je iets niet weet?" },
  { n: 3, c: "Twijfel", v: "Waarover twijfel je nu, zonder dat iemand dat weet?" },
  { n: 3, c: "Twijfel", v: "Welke beslissing zou je overdoen?" },
  { n: 3, c: "Twijfel", v: "Waar schaam je je wel eens voor in dit werk?" },

  { n: 3, c: "Identiteit", v: "Welke feedback over jouw manier van werken zou je het moeilijkst vinden om te horen?" },
  { n: 3, c: "Identiteit", v: "Wie zou een heel ander verhaal over jou vertellen dan jij over jezelf?" },
  { n: 3, c: "Identiteit", v: "Wat voor professional wilde je worden, en hoe ver zit je daarvandaan?" },
  { n: 3, c: "Identiteit", v: "Wat houdt jou in dit vak, ook op de slechte dagen?" },
  { n: 3, c: "Identiteit", v: "Waar wil jij over een jaar beter in zijn?" },
];

/**
 * De afsluitkaart hoort bij het spel maar telt niet mee bij de honderd.
 * Nummer 0 zodat sorteren op nummer 'm vooraan zet en niets verschuift.
 */
export const AFSLUITKAART = {
  card_number: 0,
  level: 0,
  category: "Afsluiting",
  question: "Wat zie je nu dat je aan het begin nog niet zag?",
  color: "#EFE3CC",
  print_front: "Wat zie je nu dat je aan het begin nog niet zag?",
  notes:
    "Aparte afsluitkaart, geen onderdeel van de honderd. Altijd als laatste, ongeacht het niveau.",
};

// ---------------------------------------------------------------------------
// Opbouwen
// ---------------------------------------------------------------------------

/** Korte facilitator-hint per categorie. Staat op de handleiding, niet op de kaart. */
const HINTS = {
  Kennismaking: "Open zonder inhoudelijke lading. Kort antwoord mag.",
  Werkplezier: "Bedoeld om te lachen. Nooit ten koste van cliënten of gezinnen.",
  Vakmanschap: "Over het ambacht, niet over een specifieke casus.",
  "Collega's": "Richt op waardering en samenwerking, niet op beoordeling.",
  Perspectief: "Laat de inbrenger eerst raden, vraag daarna pas door.",
  Systeem: "Zoek naar wie er nog meer in beeld hoort, niet naar een schuldige.",
  Hypothese: "Meerdere verklaringen naast elkaar mogen blijven staan.",
  Doelen: "Toets of het doel van het gezin is of van de organisatie.",
  Samenwerking: "Over de keten en het team, niet over één persoon.",
  Triggers: "Alleen delen wat je zelf wilt delen. Overslaan mag altijd.",
  Grenzen: "Blijf bij het werk. Dit is geen therapie.",
  Oordeel: "Onderzoekend, niet beschuldigend. Iedereen heeft blinde vlekken.",
  Positie: "Gaat over rol en macht, niet over karakter.",
  Twijfel: "Fouten mogen benoemd worden zonder dat iemand ze oplost.",
  Identiteit: "Rond af met wat de deelnemer meeneemt.",
};

export const KAARTEN = VRAGEN.map((vraag, index) => {
  const niveau = NIVEAUS[vraag.n];
  return {
    card_number: index + 1,
    level: vraag.n,
    level_naam: niveau.naam,
    category: vraag.c,
    question: vraag.v,
    color: niveau.kleur,
    text_color: niveau.tekstkleur,
    // Wat er letterlijk op de voorkant komt te staan. Geen aanhalingstekens,
    // geen cursief — zo staat het in het printbestand.
    print_front: vraag.v,
    notes: HINTS[vraag.c] ?? "",
  };
});

// ---------------------------------------------------------------------------
// Controle
// ---------------------------------------------------------------------------

/** Woorden die op een kaart niet thuishoren: te klinisch, of vragen om een diagnose. */
const VERBODEN_WOORDEN = [
  "diagnose",
  "stoornis",
  "gestoord",
  "patiënt",
  "cliëntnaam",
  "achternaam",
];

export function controleer(kaarten = KAARTEN) {
  const fouten = [];
  const waarschuwingen = [];

  if (kaarten.length !== 100) {
    fouten.push(`Er zijn ${kaarten.length} kaarten, dat moeten er exact 100 zijn.`);
  }

  // Nummering moet 1..100 zijn, aaneengesloten.
  kaarten.forEach((kaart, index) => {
    if (kaart.card_number !== index + 1) {
      fouten.push(
        `Kaart op positie ${index + 1} heeft nummer ${kaart.card_number}.`,
      );
    }
  });

  // Verdeling per niveau: elk niveau 30–35 kaarten.
  for (const niveau of [1, 2, 3]) {
    const aantal = kaarten.filter((k) => k.level === niveau).length;
    if (aantal < 30 || aantal > 35) {
      fouten.push(`Niveau ${niveau} heeft ${aantal} kaarten, verwacht 30–35.`);
    }
  }

  // Niveaus moeten aaneengesloten blokken zijn — anders klopt de stapel niet.
  const volgorde = kaarten.map((k) => k.level);
  const blokken = volgorde.filter((niveau, i) => niveau !== volgorde[i - 1]);
  if (blokken.join(",") !== "1,2,3") {
    fouten.push(
      `Niveaus staan niet in drie aaneengesloten blokken (${blokken.join(",")}).`,
    );
  }

  const gezien = new Map();
  for (const kaart of kaarten) {
    const vraag = kaart.question;

    // Exacte doublures.
    const sleutel = normaliseer(vraag);
    if (gezien.has(sleutel)) {
      fouten.push(
        `Kaart ${kaart.card_number} is een doublure van ${gezien.get(sleutel)}: "${vraag}"`,
      );
    } else {
      gezien.set(sleutel, kaart.card_number);
    }

    if (!vraag.endsWith("?")) {
      fouten.push(`Kaart ${kaart.card_number} eindigt niet op een vraagteken.`);
    }

    // Eén centrale vraag: meer dan één vraagteken betekent twee vragen.
    const vraagtekens = (vraag.match(/\?/g) ?? []).length;
    if (vraagtekens > 1) {
      fouten.push(`Kaart ${kaart.card_number} bevat ${vraagtekens} vragen.`);
    }

    if (vraag.length > 105) {
      fouten.push(
        `Kaart ${kaart.card_number} is ${vraag.length} tekens; maximaal 105 voor de safe zone.`,
      );
    }
    if (vraag.length < 20) {
      waarschuwingen.push(
        `Kaart ${kaart.card_number} is wel erg kort (${vraag.length} tekens).`,
      );
    }

    if (vraag.includes('"') || vraag.includes("“") || vraag.includes("”")) {
      fouten.push(`Kaart ${kaart.card_number} bevat aanhalingstekens.`);
    }

    for (const woord of VERBODEN_WOORDEN) {
      if (vraag.toLowerCase().includes(woord)) {
        fouten.push(
          `Kaart ${kaart.card_number} bevat het woord "${woord}": ${vraag}`,
        );
      }
    }

    const niveau = NIVEAUS[kaart.level];
    if (kaart.color !== niveau.kleur) {
      fouten.push(`Kaart ${kaart.card_number} heeft de verkeerde kleur.`);
    }
  }

  // Bijna-doublures: dezelfde vraag met een ander woord ertussen.
  const woordenPerKaart = kaarten.map((k) => ({
    nummer: k.card_number,
    woorden: new Set(normaliseer(k.question).split(" ").filter((w) => w.length > 3)),
  }));
  for (let i = 0; i < woordenPerKaart.length; i++) {
    for (let j = i + 1; j < woordenPerKaart.length; j++) {
      const a = woordenPerKaart[i];
      const b = woordenPerKaart[j];
      const gedeeld = [...a.woorden].filter((w) => b.woorden.has(w)).length;
      const kleinste = Math.min(a.woorden.size, b.woorden.size);
      if (kleinste >= 3 && gedeeld / kleinste > 0.85) {
        waarschuwingen.push(
          `Kaart ${a.nummer} en ${b.nummer} lijken sterk op elkaar.`,
        );
      }
    }
  }

  return { fouten, waarschuwingen };
}

function normaliseer(tekst) {
  return tekst
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

// ---------------------------------------------------------------------------
// Uitvoer
// ---------------------------------------------------------------------------

const CSV_KOLOMMEN = [
  "card_number",
  "level",
  "category",
  "question",
  "color",
  "print_front",
  "notes",
];

function naarCsv(kaarten) {
  const cel = (waarde) => {
    const tekst = String(waarde ?? "");
    return /[";\n]/.test(tekst) ? `"${tekst.replace(/"/g, '""')}"` : tekst;
  };
  const regels = [CSV_KOLOMMEN.join(";")];
  for (const kaart of kaarten) {
    regels.push(CSV_KOLOMMEN.map((kolom) => cel(kaart[kolom])).join(";"));
  }
  // BOM zodat een Nederlandse Excel de puntkomma's en accenten meteen goed leest.
  return "﻿" + regels.join("\r\n") + "\r\n";
}

function naarMarkdown(kaarten) {
  const regels = [
    "# IK ZIE, IK ZIE… — INTERVISIE",
    "",
    "De honderd vraagkaarten, op volgorde van kaartnummer.",
    "",
    "Dit bestand wordt gegenereerd door `scripts/kaarten.mjs`. Wijzig de vragen",
    "daar en draai `npm run kaarten` — niet hier.",
    "",
    "| | |",
    "| --- | --- |",
    `| Vraagkaarten | ${kaarten.length} |`,
    "| Niveaus | 3 |",
    "| Afsluitkaart | 1 (telt niet mee) |",
    "",
  ];

  for (const nummer of [1, 2, 3]) {
    const niveau = NIVEAUS[nummer];
    const vanNiveau = kaarten.filter((k) => k.level === nummer);
    regels.push(
      `## Niveau ${nummer} — ${niveau.naam.toUpperCase()}`,
      "",
      `*${niveau.ondertitel}.* ${niveau.doel}`,
      "",
      `Kleur \`${niveau.kleur}\` · tekst \`${niveau.tekstkleur}\` · ${vanNiveau.length} kaarten (${vanNiveau[0].card_number}–${vanNiveau[vanNiveau.length - 1].card_number})`,
      "",
    );

    let vorigeCategorie = null;
    for (const kaart of vanNiveau) {
      if (kaart.category !== vorigeCategorie) {
        regels.push("", `### ${kaart.category}`, "");
        vorigeCategorie = kaart.category;
      }
      regels.push(`${kaart.card_number}. ${kaart.question}`);
    }
    regels.push("");
  }

  regels.push(
    "## Afsluitkaart",
    "",
    "Los van de honderd. Wordt aan het einde van elke sessie getrokken.",
    "",
    `> ${AFSLUITKAART.question}`,
    "",
  );

  return regels.join("\n");
}

// ---------------------------------------------------------------------------
// Draaien
// ---------------------------------------------------------------------------

function main() {
  const alleenControleren = process.argv.includes("--check");
  const { fouten, waarschuwingen } = controleer();

  for (const waarschuwing of waarschuwingen) {
    console.warn(`  let op  ${waarschuwing}`);
  }

  if (fouten.length > 0) {
    console.error(`\n${fouten.length} fout(en) in de kaartenset:\n`);
    for (const fout of fouten) console.error(`  ✗ ${fout}`);
    process.exit(1);
  }

  const perNiveau = [1, 2, 3]
    .map((n) => `N${n}: ${KAARTEN.filter((k) => k.level === n).length}`)
    .join(" · ");
  console.log(`✓ ${KAARTEN.length} kaarten in orde (${perNiveau}) + 1 afsluitkaart`);

  if (alleenControleren) return;

  mkdirSync(CONTENT, { recursive: true });

  const json = {
    merk: "IK ZIE, IK ZIE…",
    editie: "INTERVISIE",
    taal: "nl",
    aantal_vraagkaarten: KAARTEN.length,
    gegenereerd_door: "scripts/kaarten.mjs",
    niveaus: NIVEAUS,
    kaarten: KAARTEN,
    afsluitkaart: AFSLUITKAART,
  };

  schrijfAlsGewijzigd(join(CONTENT, "cards.json"), JSON.stringify(json, null, 2) + "\n");
  schrijfAlsGewijzigd(join(CONTENT, "cards.csv"), naarCsv(KAARTEN));
  schrijfAlsGewijzigd(join(CONTENT, "100-vragen.md"), naarMarkdown(KAARTEN));
}

/** Schrijft alleen bij verschil, zodat een herhaalde run geen ruis in git geeft. */
function schrijfAlsGewijzigd(pad, inhoud) {
  let huidig = null;
  try {
    huidig = readFileSync(pad, "utf8");
  } catch {
    // bestaat nog niet
  }
  if (huidig === inhoud) {
    console.log(`  =  ${pad.replace(PROJECT + "/", "")} (ongewijzigd)`);
    return;
  }
  writeFileSync(pad, inhoud);
  console.log(`  →  ${pad.replace(PROJECT + "/", "")}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
