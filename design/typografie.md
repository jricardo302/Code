# Typografie en de Mont Heavy-licentie

## De situatie

Het merk vraagt om **Mont Heavy**, specifiek het bestand `Mont-HeavyDEMO.otf`.
Dat lettertype zit **niet** in deze repository en is er ook niet aan toegevoegd.
Daar zijn twee redenen voor.

### 1. Het bestand was er niet en kon hier niet opgehaald worden

De omgeving waarin dit project is gebouwd heeft beperkte netwerktoegang: alleen
zoeken werkt, het rechtstreeks ophalen van bestanden en pagina's is geblokkeerd.
Het fontbestand kon dus niet worden gedownload en niet worden gecontroleerd.

### 2. De licentie moet je zelf verifiëren, niet ik

Wat het zoeken opleverde: Mont is een geometrische schreefloze van **Fontfabric**
(ontworpen door Radomir Tinkov), met tien gewichten plus cursieven. Van die
familie worden **Mont Extra Light en Mont Heavy als gratis demo verspreid**, en
volgens meerdere bronnen staat die demolicentie commercieel gebruik toe — wat
voor demofonts ongebruikelijk is. De overige stijlen zijn betaald via Fontfabric
en MyFonts.

**Behandel dat als een aanwijzing, niet als bewijs.** Het is samengevat uit
zoekresultaten en niet uit de licentietekst zelf, en "gratis fonts"-sites
verspreiden commerciële fonts routineus met een verzonnen licentie. Voordat het
font op de commerciële site komt:

1. Haal Mont Heavy op bij **fontfabric.com** zelf, niet bij een
   downloadverzamelsite.
2. Lees het meegeleverde licentiebestand (EULA). Let specifiek op: commercieel
   gebruik, **webfont-embedding** (dat is een aparte toestemming naast desktop),
   en gebruik in **drukwerk dat je verkoopt**.
3. Bewaar de licentie in je administratie.

Blijkt de demo alleen desktop of alleen niet-commercieel te dekken: koop de
volledige licentie of gebruik de vervanger hieronder. Zet het bestand niet
alsnog online omdat het ergens "gratis" heette.

---

## Wat er nu draait

**Figtree Black (900)**, via `next/font/google` in `app/layout.tsx`.

Waarom Figtree:

- **Licentie is geen discussie.** SIL Open Font License — commercieel gebruik,
  webembedding en drukwerk zijn expliciet toegestaan.
- **Zelfde register.** Geometrisch-humanistische schreefloze met een gesloten
  vorm en een echte 900. Niet identiek aan Mont, wel dezelfde moderne,
  zelfverzekerde uitstraling zonder dat het speels wordt.
- **Geen extern verzoek.** `next/font` bundelt het lettertype mee, dus er gaat
  bij het laden van de pagina niets naar Google.

---

## Wisselen naar Mont Heavy

Als de licentie klopt, kost het één bestand en één blok code.

1. Zet het fontbestand in `public/fonts/Mont-Heavy.otf` (of `.woff2`, dat laadt
   sneller — converteren kan met `fonttools`).

2. In `app/layout.tsx`, vervang de Figtree-import door:

   ```ts
   import localFont from "next/font/local";

   const mont = localFont({
     src: "../public/fonts/Mont-Heavy.woff2",
     variable: "--font-figtree", // naam laten staan, dan hoeft de CSS niet mee
     display: "swap",
     weight: "900",
   });
   ```

   en gebruik `mont.variable` in plaats van `figtree.variable`.

3. Mont Heavy heeft maar één gewicht. De lopende tekst staat nu op 400–600 en
   die kun je niet in Heavy zetten — dat wordt onleesbaar. Houd voor bodytekst
   dus Figtree aan en gebruik Mont alleen voor `--font-merk`. Splits daarvoor de
   twee variabelen in `globals.css`:

   ```css
   --font-merk: var(--font-mont), "Figtree", sans-serif;
   --font-sans: var(--font-figtree), ui-sans-serif, system-ui, sans-serif;
   ```

4. Draai `npm run build` en kijk de koppen na. Mont is smaller dan Figtree, dus
   koppen die nu net over twee regels lopen passen er mogelijk op één — controleer
   in ieder geval de hero, de kaarten en de doosmockups.

De printbestanden roepen het font al aan als `Mont Heavy, Figtree, sans-serif`
(zie `scripts/printbestanden.mjs`). Voor de drukker moeten de letters uiteindelijk
tot contouren worden omgezet of ingesloten in de PDF; welke van de twee hangt af
van wat de leverancier vraagt.

---

## Leesbaarheidsregels bij gewicht 900

Zware typografie is niet vanzelf leesbare typografie. Wat er in `globals.css`
voor is geregeld:

- `line-height: 1.05` voor koppen, `1.65` voor bodytekst.
- `letter-spacing: -0.02em` voor koppen — een 900 heeft van zichzelf al te veel
  ruimte tussen de letters op grote maten.
- `hyphens: auto` plus `overflow-wrap: break-word` op koppen. Zonder dat past
  *jeugdhulpprofessionals* op een telefoon van 390 px niet in een kop van 36 px
  en krijg je horizontale scroll over de hele pagina.
- Kop- en bodytekst nooit in dezelfde kolombreedte laten uitlopen: koppen
  krijgen `text-wrap: balance`, lopende tekst `text-wrap: pretty`.
