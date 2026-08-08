# Productiespecificatie

Wat hier staat is het **uitgangspunt** voor de offerteaanvraag, niet het
definitieve drukbestand. Elke drukker heeft eigen stansvormen, eigen
aflopeisen en een eigen PDF-standaard. Leg deze specificatie naast de dieline
van de gekozen leverancier en pas de bestanden daarop aan vóór je bestelt.

---

## 1. Kaartformaat: waarom 70 × 120 mm

Vier formaten zijn tegen elkaar afgewogen:

| Formaat | Maat | Voor | Tegen |
| --- | --- | --- | --- |
| Bridge | 57 × 89 mm | Goedkoopst, overal standaard | Te klein voor een vraag van 60–100 tekens in 900-gewicht |
| Poker | 63,5 × 89 mm | Meest gangbare stansvorm, laagste prijs, elke drukker heeft 'm | Vraag past, maar met weinig crème ruimte eromheen |
| **Tarot** | **70 × 120 mm** | **Ruim genoeg voor de vraag mét witruimte; standaard stansvorm bij vrijwel elke kaartendrukker; ligt goed in de hand; oogt duidelijk niet als speelkaart** | Iets duurder dan poker; doos wordt groter |
| Groot gesprekskaartformaat | 90 × 130 mm en groter | Maximale leesbaarheid | Vaak een custom stans (meerkosten en langere levertijd); doos wordt log; minder premium in de hand |

**Gekozen: 70 × 120 mm.** Doorslaggevend is dat dit een *standaard* formaat is —
het tarotformaat — waardoor er geen custom stansvorm nodig is, terwijl er wel
genoeg ruimte overblijft voor de ruime crème marge die het ontwerp draagt. Een
vraag van maximaal 105 tekens (dat maximum wordt afgedwongen in
`scripts/kaarten.mjs`) past in vier tot vijf regels binnen de veiligheidsmarge.

Poker zou goedkoper zijn, maar bij honderd kaarten met veel witruimte scheelt
dat per spel weinig, terwijl het formaat het product direct minder
onderscheidend maakt.

---

## 2. Kaarten

| | |
| --- | --- |
| Aantal vraagkaarten | 100 |
| Extra kaarten | 1 afsluitkaart + 1 veiligheids-/spelregelkaart |
| Formaat | 70 × 120 mm |
| Karton | 300–350 g/m² speelkaartkarton, bij voorkeur met blauwe of zwarte kern |
| Afwerking | **mat** laminaat of matte vernis, dubbelzijdig |
| Hoeken | afgerond, radius 4 mm |
| Bedrukking | full colour CMYK, voor- en achterzijde |
| Afloop | 3 mm rondom |
| Veiligheidsmarge | 5 mm vanaf de snijlijn |
| Achterzijde | één ontwerp voor alle kaarten |

Geen glans, geen linnenstructuur, geen folie. Het moet aanvoelen als
professioneel materiaal, niet als een gezelschapsspel.

---

## 3. Doos

| | |
| --- | --- |
| Type | rigid box met magneetsluiting (klapdoos) |
| Buitenmaat | 132 × 80 × 42 mm |
| Grijsboard | 1,5–2 mm |
| Wikkel | full colour CMYK op wikkelpapier, **mat** gelamineerd |
| Sluiting | magneet in de klep |
| Insert | uitsparing voor de kaartstapel + ruimte voor het boekje |
| Afloop | 3 mm |
| Veiligheidsmarge | 6 mm |

**Vraag de leverancier expliciet om de dieline van deze doosmaat.** De
binnenmaat moet 100 + 2 kaarten van 300–350 g/m² kwijt kunnen; reken op ongeveer
32–36 mm stapelhoogte, plus het boekje. De opgegeven 42 mm diepte is een
uitgangspunt en moet worden bevestigd aan de hand van de werkelijke
kartondikte.

---

## 4. Handleiding

| | |
| --- | --- |
| Formaat | A6 (105 × 148 mm), gevouwen of geniet |
| Omvang | 8 pagina's |
| Papier | 150 g/m² mat |
| Inhoud | drie speelvormen, de afspraken, de disclaimer |

Tekst staat in `design/handleiding.md` en komt uit `lib/spelregels.ts`, dezelfde
bron als de website.

---

## 5. Bestandslevering

| | |
| --- | --- |
| Kleurmodus | CMYK, tenzij de leverancier RGB vraagt |
| Kleurprofiel | ISO Coated v2 (FOGRA39) of het profiel dat de drukker voorschrijft |
| Resolutie | 300 dpi voor alles wat raster is (dit ontwerp is volledig vector) |
| Fonts | omgezet naar contouren óf ingesloten — vraag wat de drukker wil |
| Formaat | PDF, standaard volgens leverancier (meestal PDF/X-1a of PDF/X-4) |
| Zwart | tekstzwart als 100% K, niet als rich black |

Genereren: `npm run printbestanden` schrijft naar `print/`:

```
print/kaarten/kaart-001-n1.svg … kaart-100-n3.svg
print/kaarten/achterkant.svg
print/kaarten/kaart-afsluiting.svg
print/kaarten/kaart-veiligheid.svg
print/doos/doos-voorkant.svg
print/doos/doos-achterkant.svg
print/doos/doos-zijkant.svg
```

Dat zijn **vectorbestanden op ware grootte in RGB**, met de afloop en de
veiligheidsmarge er al in. De laatste stap — omzetten naar CMYK en naar de
gevraagde PDF-standaard — kan pas als de leverancier bekend is, omdat het
profiel en de standaard van die keuze afhangen.

Het script weigert te draaien als de kaartenset niet klopt. Gecontroleerd wordt:
exact 100 kaarten, nummering 1–100 aaneengesloten, geen doublures, elke vraag
één vraagteken, maximaal 105 tekens, geen aanhalingstekens, en de juiste
niveaukleur. Zo kan er nooit een verkeerde set naar de drukker.

---

## 6. Verpakking per exemplaar

- Elk spel krimp- of cellofaanverpakt (vraag naar een plasticvrij alternatief).
- Verzendklaar in een golfkartonnen omdoos.
- Vraag naar FSC-gecertificeerd materiaal voor kaarten, doos en omdoos.

---

## 7. Wat je nog moet controleren bij de gekozen drukker

- [ ] Dieline van de doos (132 × 80 × 42 mm) opvragen en de bestanden erop leggen
- [ ] Werkelijke stapelhoogte van 102 kaarten meten, doosdiepte daarop bijstellen
- [ ] Aflopeis: is 3 mm genoeg of vraagt men er 5?
- [ ] Gevraagde PDF-standaard en kleurprofiel
- [ ] Fonts: outlinen of embedden?
- [ ] Fysiek proefexemplaar vóór de oplage
- [ ] Kleurproef: hoe komt `#3B1E4A` er in mat CMYK uit? Diepe paarsen slaan
      snel dof of blauwig uit
