/**
 * Genereert productieklare SVG's voor de drukker.
 *
 * Waarom SVG en niet meteen PDF: elke drukker vraagt om een eigen PDF-standaard
 * (PDF/X-1a, PDF/X-4), een eigen kleurprofiel en soms een eigen dieline. Die
 * laatste stap kan pas als de leverancier gekozen is. Wat hier uit komt is
 * vector, op ware grootte, met de juiste afloop en veiligheidsmarge — klaar om
 * in Illustrator of via een converteerstap naar de gevraagde PDF te gaan.
 *
 * Draaien:  node scripts/printbestanden.mjs
 * Uitvoer:  print/ (staat in .gitignore; het zijn afgeleide bestanden)
 *
 * De controle uit scripts/kaarten.mjs draait eerst. Een set die niet klopt
 * levert geen printbestanden op.
 */

import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

import { AFSLUITKAART, KAARTEN, NIVEAUS, controleer } from "./kaarten.mjs";

const HIER = dirname(fileURLToPath(import.meta.url));
const UIT = join(HIER, "..", "print");

// ---------------------------------------------------------------------------
// Maatvoering. Alles in millimeters — zie design/print-specs.md.
// Pas dit aan op de dieline van de gekozen drukker vóór je bestelt.
// ---------------------------------------------------------------------------

const KAART = {
  breedte: 70,
  hoogte: 120,
  afloop: 3, // bleed rondom
  veilig: 5, // safe zone vanaf de snijlijn
  hoekradius: 4,
};

const DOOS = {
  breedte: 132,
  hoogte: 80,
  diepte: 42,
  afloop: 3,
  veilig: 6,
};

const KLEUR = {
  creme: "#F7F2E7",
  diepPaars: "#3B1E4A",
  paars: "#8B5FBF",
  lila: "#C9A8E0",
  inkt: "#2B1733",
  doosDonker: "#2E1738",
  doosLicht: "#4A2A5C",
};

/** Het lettertype dat in de printbestanden wordt aangeroepen. Zie design/typografie.md. */
const FONT = "Mont Heavy, Figtree, sans-serif";

// ---------------------------------------------------------------------------

const totaleBreedte = KAART.breedte + KAART.afloop * 2;
const totaleHoogte = KAART.hoogte + KAART.afloop * 2;

/** Tekst afbreken op woordgrens, want SVG doet dat zelf niet. */
function breekAf(tekst, maxTekensPerRegel) {
  const woorden = tekst.split(" ");
  const regels = [];
  let huidig = "";
  for (const woord of woorden) {
    const kandidaat = huidig ? `${huidig} ${woord}` : woord;
    if (kandidaat.length > maxTekensPerRegel && huidig) {
      regels.push(huidig);
      huidig = woord;
    } else {
      huidig = kandidaat;
    }
  }
  if (huidig) regels.push(huidig);
  return regels;
}

function kaartVoorkant(kaart) {
  const niveau = NIVEAUS[kaart.level];
  const donker = kaart.level === 3;
  const vlak = donker ? KLEUR.diepPaars : KLEUR.creme;
  const tekstkleur = donker ? KLEUR.creme : KLEUR.inkt;
  const accent = kaart.level === 1 ? KLEUR.lila : kaart.level === 2 ? KLEUR.paars : KLEUR.lila;

  const regels = breekAf(kaart.print_front, 26);
  const regelhoogte = 7.4;
  const start = totaleHoogte / 2 - ((regels.length - 1) * regelhoogte) / 2;

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${totaleBreedte}mm" height="${totaleHoogte}mm"
     viewBox="0 0 ${totaleBreedte} ${totaleHoogte}">
  <title>Kaart ${String(kaart.card_number).padStart(3, "0")} — niveau ${kaart.level}</title>

  <!-- Aflopend vlak: loopt tot in de bleed -->
  <rect width="${totaleBreedte}" height="${totaleHoogte}" fill="${vlak}"/>

  <!-- Accentrand net binnen de snijlijn -->
  <rect x="${KAART.afloop + 1.6}" y="${KAART.afloop + 1.6}"
        width="${KAART.breedte - 3.2}" height="${KAART.hoogte - 3.2}"
        rx="${KAART.hoekradius - 1}" fill="none"
        stroke="${accent}" stroke-width="0.6"/>

  <!-- Niveau-indicator -->
  <circle cx="${KAART.afloop + KAART.veilig + 1}" cy="${KAART.afloop + KAART.veilig + 2}" r="1.1" fill="${accent}"/>
  <text x="${KAART.afloop + KAART.veilig + 4}" y="${KAART.afloop + KAART.veilig + 3}"
        font-family="${FONT}" font-weight="900" font-size="3.1"
        letter-spacing="0.55" fill="${donker ? KLEUR.lila : KLEUR.paars}">
    N${kaart.level} · ${niveau.naam.toUpperCase()}
  </text>

  <!-- De vraag, gecentreerd, rechtop, zonder aanhalingstekens -->
  <text text-anchor="middle" font-family="${FONT}" font-weight="900"
        font-size="5.6" fill="${tekstkleur}">
${regels
  .map(
    (regel, i) =>
      `    <tspan x="${totaleBreedte / 2}" y="${(start + i * regelhoogte).toFixed(2)}">${escape(regel)}</tspan>`,
  )
  .join("\n")}
  </text>

  <!-- Voetlijn en kaartnummer -->
  <line x1="${KAART.afloop + KAART.veilig}" y1="${totaleHoogte - KAART.afloop - KAART.veilig - 1}"
        x2="${totaleBreedte - KAART.afloop - KAART.veilig - 9}" y2="${totaleHoogte - KAART.afloop - KAART.veilig - 1}"
        stroke="${accent}" stroke-width="0.3" opacity="0.5"/>
  <text x="${totaleBreedte - KAART.afloop - KAART.veilig}" y="${totaleHoogte - KAART.afloop - KAART.veilig}"
        text-anchor="end" font-family="${FONT}" font-weight="900" font-size="3.1"
        letter-spacing="0.4" fill="${donker ? KLEUR.lila : KLEUR.paars}">
    ${String(kaart.card_number).padStart(3, "0")}
  </text>
</svg>
`;
}

function kaartAchterkant() {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${totaleBreedte}mm" height="${totaleHoogte}mm"
     viewBox="0 0 ${totaleBreedte} ${totaleHoogte}">
  <title>Kaartachterkant — één ontwerp voor alle 100 kaarten</title>
  <defs>
    <linearGradient id="v" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${KLEUR.doosLicht}"/>
      <stop offset="70%" stop-color="${KLEUR.doosDonker}"/>
    </linearGradient>
  </defs>
  <rect width="${totaleBreedte}" height="${totaleHoogte}" fill="url(#v)"/>
  <rect x="${KAART.afloop + 3}" y="${KAART.afloop + 3}"
        width="${KAART.breedte - 6}" height="${KAART.hoogte - 6}"
        rx="${KAART.hoekradius - 1}" fill="none"
        stroke="${KLEUR.lila}" stroke-width="0.4" opacity="0.35"/>
  <text text-anchor="middle" font-family="${FONT}" font-weight="900"
        font-size="7" fill="${KLEUR.creme}">
    <tspan x="${totaleBreedte / 2}" y="${totaleHoogte / 2 - 2}">IK ZIE,</tspan>
    <tspan x="${totaleBreedte / 2}" y="${totaleHoogte / 2 + 6}">IK ZIE…</tspan>
  </text>
  <line x1="${totaleBreedte / 2 - 6}" y1="${totaleHoogte / 2 + 11}"
        x2="${totaleBreedte / 2 + 6}" y2="${totaleHoogte / 2 + 11}"
        stroke="${KLEUR.lila}" stroke-width="0.4" opacity="0.6"/>
</svg>
`;
}

/** De veiligheidskaart en de afsluitkaart: kraft, geen niveau. */
function losseKaart(kop, regels) {
  const regelhoogte = 6.2;
  const start = 34;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${totaleBreedte}mm" height="${totaleHoogte}mm"
     viewBox="0 0 ${totaleBreedte} ${totaleHoogte}">
  <title>${escape(kop)}</title>
  <rect width="${totaleBreedte}" height="${totaleHoogte}" fill="#EFE3CC"/>
  <rect x="${KAART.afloop + 1.6}" y="${KAART.afloop + 1.6}"
        width="${KAART.breedte - 3.2}" height="${KAART.hoogte - 3.2}"
        rx="${KAART.hoekradius - 1}" fill="none"
        stroke="${KLEUR.diepPaars}" stroke-width="0.6" opacity="0.4"/>
  <text x="${totaleBreedte / 2}" y="24" text-anchor="middle"
        font-family="${FONT}" font-weight="900" font-size="5.4" fill="${KLEUR.diepPaars}">
    ${escape(kop)}
  </text>
  <text font-family="${FONT}" font-size="3.3" fill="${KLEUR.inkt}">
${regels
  .flatMap((regel, i) =>
    breekAf(regel, 38).map(
      (deel, j) =>
        `    <tspan x="${KAART.afloop + KAART.veilig}" y="${(start + (i * 2 + j) * regelhoogte * 0.62).toFixed(2)}">${escape(deel)}</tspan>`,
    ),
  )
  .join("\n")}
  </text>
</svg>
`;
}

function doosVoorkant() {
  const b = DOOS.breedte + DOOS.afloop * 2;
  const h = DOOS.hoogte + DOOS.afloop * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${b}mm" height="${h}mm" viewBox="0 0 ${b} ${h}">
  <title>Doos — voorkant (${DOOS.breedte} × ${DOOS.hoogte} mm + ${DOOS.afloop} mm afloop)</title>
  <defs>
    <linearGradient id="d" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${KLEUR.doosLicht}"/>
      <stop offset="62%" stop-color="${KLEUR.doosDonker}"/>
      <stop offset="100%" stop-color="#24122C"/>
    </linearGradient>
  </defs>
  <rect width="${b}" height="${h}" fill="url(#d)"/>
  <rect x="${DOOS.afloop + 5}" y="${DOOS.afloop + 5}"
        width="${DOOS.breedte - 10}" height="${DOOS.hoogte - 10}"
        fill="none" stroke="${KLEUR.creme}" stroke-width="0.4" opacity="0.28"/>
  <text x="${b / 2}" y="${h / 2 - 6}" text-anchor="middle"
        font-family="${FONT}" font-weight="900" font-size="13" fill="${KLEUR.creme}">
    IK ZIE, IK ZIE…
  </text>
  <text x="${b / 2}" y="${h / 2 + 6}" text-anchor="middle"
        font-family="${FONT}" font-weight="900" font-size="7" letter-spacing="2.4">
    <tspan fill="${KLEUR.creme}">INTER</tspan><tspan fill="${KLEUR.lila}">VISIE</tspan>
  </text>
  <line x1="${b / 2 - 16}" y1="${h / 2 + 12}" x2="${b / 2 + 16}" y2="${h / 2 + 12}"
        stroke="${KLEUR.lila}" stroke-width="0.4" opacity="0.6"/>
  <text x="${b / 2}" y="${h / 2 + 20}" text-anchor="middle"
        font-family="${FONT}" font-size="3.6" letter-spacing="0.7"
        fill="${KLEUR.creme}" opacity="0.75">
    100 VRAGEN VOOR GESPREKKEN DIE VERDER KIJKEN
  </text>
</svg>
`;
}

function doosAchterkant() {
  const b = DOOS.breedte + DOOS.afloop * 2;
  const h = DOOS.hoogte + DOOS.afloop * 2;
  const regels = [
    "Een kaartspel voor intervisie, casuïstiekbespreking en",
    "teamreflectie. Honderd vragen in drie niveaus: van een",
    "luchtige opening tot de vraag die je liever overslaat.",
    "",
    "Voor professionals in jeugdhulp, jeugd-GGZ en GGZ.",
  ];
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${b}mm" height="${h}mm" viewBox="0 0 ${b} ${h}">
  <title>Doos — achterkant</title>
  <rect width="${b}" height="${h}" fill="${KLEUR.doosDonker}"/>
  <text font-family="${FONT}" font-size="3.4" fill="${KLEUR.creme}" opacity="0.85">
${regels
  .map(
    (regel, i) =>
      `    <tspan x="${DOOS.afloop + DOOS.veilig}" y="${22 + i * 5.2}">${escape(regel)}</tspan>`,
  )
  .join("\n")}
  </text>
  <text font-family="${FONT}" font-weight="900" font-size="3.6"
        fill="${KLEUR.lila}" letter-spacing="1.2">
    <tspan x="${DOOS.afloop + DOOS.veilig}" y="${h - DOOS.afloop - DOOS.veilig - 6}">100 VRAAGKAARTEN · 3 NIVEAUS · 2–10 PROFESSIONALS</tspan>
    <tspan x="${DOOS.afloop + DOOS.veilig}" y="${h - DOOS.afloop - DOOS.veilig}">NEDERLANDSTALIG · IKZIEIKZIE.EU</tspan>
  </text>
</svg>
`;
}

function doosZijkant() {
  const b = DOOS.breedte + DOOS.afloop * 2;
  const h = DOOS.diepte + DOOS.afloop * 2;
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     width="${b}mm" height="${h}mm" viewBox="0 0 ${b} ${h}">
  <title>Doos — zijkant (${DOOS.breedte} × ${DOOS.diepte} mm + afloop)</title>
  <rect width="${b}" height="${h}" fill="${KLEUR.doosDonker}"/>
  <text x="${b / 2}" y="${h / 2 + 1.4}" text-anchor="middle"
        font-family="${FONT}" font-weight="900" font-size="5"
        letter-spacing="2.6" fill="${KLEUR.creme}" opacity="0.85">
    KIJK. VRAAG. REFLECTEER.
  </text>
</svg>
`;
}

function escape(tekst) {
  return String(tekst)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

// ---------------------------------------------------------------------------

function main() {
  const { fouten } = controleer();
  if (fouten.length > 0) {
    console.error("De kaartenset klopt niet; er worden geen printbestanden gemaakt.\n");
    for (const fout of fouten) console.error(`  ✗ ${fout}`);
    process.exit(1);
  }

  mkdirSync(join(UIT, "kaarten"), { recursive: true });
  mkdirSync(join(UIT, "doos"), { recursive: true });

  let geschreven = 0;

  for (const kaart of KAARTEN) {
    const naam = `kaart-${String(kaart.card_number).padStart(3, "0")}-n${kaart.level}.svg`;
    writeFileSync(join(UIT, "kaarten", naam), kaartVoorkant(kaart));
    geschreven++;
  }

  writeFileSync(join(UIT, "kaarten", "achterkant.svg"), kaartAchterkant());
  writeFileSync(
    join(UIT, "kaarten", "kaart-afsluiting.svg"),
    losseKaart("Tot slot", [AFSLUITKAART.question]),
  );
  writeFileSync(
    join(UIT, "kaarten", "kaart-veiligheid.svg"),
    losseKaart("Spreek vrij. Deel zorgvuldig.", [
      "Anonimiseer je casuïstiek.",
      "Deel geen namen of herleidbare gegevens.",
      "Iedereen mag een kaart overslaan.",
      "Luister voordat je adviseert.",
      "Onderzoek eerst, los niet direct op.",
      "Verschillen in perspectief mogen bestaan.",
      "Bij acute zorgen gelden de protocollen van je organisatie.",
    ]),
  );

  writeFileSync(join(UIT, "doos", "doos-voorkant.svg"), doosVoorkant());
  writeFileSync(join(UIT, "doos", "doos-achterkant.svg"), doosAchterkant());
  writeFileSync(join(UIT, "doos", "doos-zijkant.svg"), doosZijkant());

  console.log(`✓ ${geschreven} kaartvoorkanten + achterkant + 2 losse kaarten`);
  console.log("✓ 3 doosvlakken");
  console.log(`  → print/  (${KAART.breedte}×${KAART.hoogte} mm, ${KAART.afloop} mm afloop, ${KAART.veilig} mm safe zone)`);
  console.log(
    "\nLet op: dit is vector op ware grootte in RGB. Converteer naar de\n" +
      "PDF-standaard en het kleurprofiel van de gekozen drukker, en leg de\n" +
      "maten naast diens dieline vóór je bestelt. Zie design/print-specs.md.",
  );
}

main();
