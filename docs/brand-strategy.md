# Merkstrategie

## 1. Het merk is niet het product

`IK ZIE, IK ZIE…` is het merk. `INTERVISIE` is de eerste editie. Dat
onderscheid is geen marketingtruc maar een architectuurbeslissing die door de
hele codebase loopt: `lib/product.ts` bevat een **lijst** met edities, de
productpagina zit op `/intervisie` en niet op `/product`, en de sitemap wordt
uit die lijst opgebouwd.

Geplande edities, in volgorde van waarschijnlijkheid:

| Editie | Voor wie | Waarom |
| --- | --- | --- |
| INTERVISIE | breed, alle sectoren | de eerste, het fundament |
| CASUÏSTIEK | teams die casusbesprekingen doen | dichtst bij de eerste, makkelijkst te maken |
| TEAM | teamdagen, samenwerking, teamdynamiek | grootste B2B-potentie |
| JEUGD-GGZ | behandelaren | scherpere positionering, kleinere markt |
| SYSTEMISCH WERKEN | systeemtherapeuten, gezinsbehandelaren | inhoudelijk het meest specialistisch |
| OUDERS | ouders zelf, of hulpverlener met ouders | ander kanaal, andere prijs, later |

Een nieuwe editie toevoegen is één object in `EDITIES` plus een pagina. Er hoeft
niets herbouwd te worden.

---

## 2. Positionering

> Voor professionals in jeugdhulp, jeugd-GGZ en GGZ die intervisie hebben maar er
> weinig aan hebben, is IK ZIE, IK ZIE… INTERVISIE een kaartspel met honderd
> vragen dat het gesprek verschuift van de cliënt naar wat wij zien en missen —
> zonder methodiek, trainer of voorbereiding.

### Het onderscheid

Er zijn meer vragenkaartspellen. Wat dit spel anders maakt:

1. **Niveau 3 bestaat.** Bijna elk vergelijkbaar product blijft bij de casus of
   bij de persoonlijke ontwikkeling in het algemeen. Dit spel vraagt expliciet
   wat de casus met de professional doet — triggers, reddersreflex, oordeel,
   macht, twijfel — en houdt dat binnen het professionele domein.
2. **Sectorspecifiek.** De vragen gaan over gezinnen, jongeren, ketenpartners en
   beschikkingen. Niet over "de klant" of "je team".
3. **Veiligheid is ingebouwd, niet toegevoegd.** Een veiligheidskaart in de doos,
   passen als spelregel nummer één, en geen enkele vraag die om herleidbare
   gegevens vraagt.
4. **Het claimt niets.** Geen accreditatie, geen bewezen effect, geen erkende
   methodiek. In een markt waar veel aanbieders precies dat wél suggereren, is
   niet-claimen een positionering.

### Wat we niet zijn

- Geen trainingsbureau. We verkopen een doos, geen dagdeel.
- Geen methodiek. De kaarten passen binnen jouw methode.
- Geen HR-tool. Dit is vakinhoud, geen teambuilding.
- Geen consumentenproduct. Het ligt niet naast de Vertellis in de boekhandel.

---

## 3. Merkgedachte

Het kinderspelletje *ik zie, ik zie wat jij niet ziet* gaat over precies wat
goede intervisie doet: jij ziet iets, ik nog niet, en samen komen we erachter wat
het is.

Drie vragen dragen het merk:

> Wat zie je in de casus?
> Wat ziet je collega?
> En wat zie je misschien nog niet?

Die drie corresponderen niet toevallig met de drie niveaus.

---

## 4. Merkzinnen

Ontwikkeld en getest tegen elkaar. De gekozen zinnen staan op de site.

| Zin | Waar |
| --- | --- |
| **Geen perfecte antwoorden. Wel betere vragen.** | Slot-CTA homepage. Sterkste zin die we hebben. |
| **Soms verandert niet de casus. Maar wel hoe je ernaar kijkt.** | Slot productpagina |
| **Een casus kent meer dan één perspectief.** | Slot `/hoe-het-werkt` |
| **Mooi genoeg om te laten liggen. Simpel genoeg om direct te gebruiken.** | `/over` |
| **Je kijkt de hele dag naar een ander. Hoe vaak kijk je naar jezelf?** | Hero. Doet het werk van drie alinea's. |
| **Kijk. Vraag. Reflecteer.** | Zijkant van de doos |
| **Spreek vrij. Deel zorgvuldig.** | Veiligheidskaart, binnenkant deksel |
| **100 vragen voor gesprekken die verder kijken.** | Voorkant doos |

Afgevallen, met reden:

- *Het gesprek dat niet over de cliënt gaat* — klopt niet, niveau 2 gaat er wel
  over.
- *Verander je intervisie* — belofte die we niet kunnen waarmaken.
- *De vragen die niemand durft te stellen* — te dramatisch, en het zijn ze niet
  allemaal.

---

## 5. Toon

Zie `design/brand-guide.md` §4 voor de regels. Kort:

Warm, scherp, professioneel, menselijk, rustig, zelfverzekerd. Korte zinnen. Geen
Amerikaanse marketingtaal, geen managementtaal, geen uitroeptekens.

Één regel die boven alle andere gaat: **niets beweren wat niet klopt.** Geen
verzonnen reviews, klantaantallen, keurmerken, schaarste of timers. Als iets nog
niet waar is, staat het er niet — of er staat een zichtbare plaatshouder. Dat is
niet alleen ethiek; bij deze doelgroep is het ook gewoon de enige werkende
strategie. Ze prikken er doorheen.

---

## 6. Doelgroep

**Primair:** ambulant begeleiders, jeugd- en gezinsprofessionals,
jeugdzorgwerkers, behandelaren, gedragswetenschappers, psychologen,
GZ-psychologen, orthopedagogen, systeemtherapeuten, vaktherapeuten,
zorgcoördinatoren.

**Secundair:** GGZ-teams, wijkteams, jeugdbescherming, gecertificeerde
instellingen, praktijkhouders, teammanagers, opleiders, intervisie- en
supervisiegroepen, hogescholen.

**Twee koopgedragingen, twee routes:**

| | Individu | Organisatie |
| --- | --- | --- |
| Koopt | 1 spel | 5, 10, 25 of meer |
| Waarom | eigen intervisiegroep, of cadeau voor een collega | alle teams uitrusten |
| Route | webshop, iDEAL | staffel of offerte, factuur |
| Beslistijd | minuten | weken |
| Pagina | `/intervisie` | `/teams` |

De site bedient beide zonder dat de een de ander in de weg zit: de productpagina
noemt de staffel en verwijst door, de teampagina laat je terug naar de webshop
als je er maar een paar nodig hebt.

---

## 7. Wat het merk over vijf jaar moet zijn

Niet: een uitgeverij met veertig producten.

Wel: de naam die een teammanager noemt als iemand vraagt "hebben we iets voor de
intervisie?" — met drie of vier edities die allemaal even goed zijn, en een
reputatie dat het klopt wat erop staat.
