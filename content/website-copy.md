# Websitecopy

De teksten staan in de code, want een tekstbestand naast de code loopt binnen
twee weken achter. Dit document legt uit **waarom** de copy is zoals hij is, en
waar hij staat als je hem wilt wijzigen.

---

## Waar wat staat

| Pagina | Bestand |
| --- | --- |
| Homepage | `app/page.tsx` |
| Productpagina | `app/intervisie/page.tsx` |
| Hoe het werkt | `app/hoe-het-werkt/page.tsx` |
| Spelregels | `app/spelregels/page.tsx` + `lib/spelregels.ts` |
| Voor teams | `app/teams/page.tsx` |
| Veelgestelde vragen | `lib/faq.ts` (één bron voor pagina én structured data) |
| Over dit spel | `app/over/page.tsx` |
| Contact | `app/contact/page.tsx` |
| Wachtlijst | `app/wachtlijst/page.tsx` |
| Artikelen | `content/artikelen.tsx` |
| Juridisch | `app/juridisch/*/page.tsx` |
| Doostekst | `design/box-copy.md` → `scripts/printbestanden.mjs` |
| Handleiding | `design/handleiding.md` → `lib/spelregels.ts` |

---

## De opbouw van de homepage

De volgorde is niet willekeurig. Elke sectie beantwoordt de volgende vraag die
een bezoeker stelt.

| # | Sectie | Beantwoordt |
| --- | --- | --- |
| A | Announcement bar | *Wat is dit?* — 100 vragen, 3 niveaus, één gesprek |
| B | Hero | *Waarom zou ik verder lezen?* |
| C | Probleem | *Herken ik dit?* |
| D | Drie niveaus | *Wat zit erin?* |
| E | Hoe het werkt | *Kan ik dit zonder training?* |
| F | In de doos | *Wat krijg ik fysiek?* |
| G | Voor wie | *Is dit voor mij?* |
| H | Gebruiksmomenten | *Wanneer pak ik het?* |
| I | Teams | *Kan mijn organisatie dit bestellen?* |
| J | Reviews | *Vindt iemand anders dit goed?* — eerlijk beantwoord: nog niet |
| K | FAQ | *Waar twijfel ik nog over?* |
| L | Slot-CTA | *Waar klik ik?* |

### De vijf-secondentest

Binnen ongeveer vijf seconden moet duidelijk zijn:

1. **Dit is een kaartspel** → de doos staat direct rechts in de hero
2. **Voor zorgprofessionals** → "voor intervisie in jeugdhulp, jeugd-GGZ en GGZ"
   in de eerste alinea
3. **100 vragen** → in de announcement bar én onder de knoppen
4. **Drie niveaus** → zelfde plek
5. **Ik kan het bestellen** → "Bestel het spel" in de balk én in de hero

Alle vijf staan boven de vouw, ook op 390 px.

---

## De hero-kop

> **Je kijkt de hele dag naar een ander.**
> **Hoe vaak kijk je naar jezelf?**

Waarom deze en geen andere: hij doet in twee regels het werk van drie alinea's.
Hij benoemt het beroep zonder het te benoemen, hij stelt de vraag die het hele
product is, en hij is niet verwijtend — "hoe vaak" is een echte vraag, geen
beschuldiging.

Afgevallen:

- *Intervisie die niet blijft hangen in adviezen geven* — te lang, en negatief
  beginnen werkt bij deze doelgroep averechts.
- *100 vragen voor betere intervisie* — informatief maar zonder spanning; dat is
  wat de subkop doet.
- *De vragen die je collega niet durft te stellen* — te dramatisch en het klopt
  niet.

---

## Regels die de hele site door gelden

- **Korte zinnen.** Waar een zin over twee regels loopt, kijk of er twee zinnen
  in zitten.
- **Geen managementtaal.** Geen *handvatten*, geen *dialoog faciliteren*, geen
  *meenemen in het proces*.
- **Geen Amerikaanse marketingtaal.** Zie `design/brand-guide.md` §4.
- **Geen uitroeptekens.**
- **Concrete getallen boven bijvoeglijke naamwoorden.** Niet "veel vragen" maar
  "100 vragen". Niet "een premium doos" maar "132 × 80 × 42 mm, mat".
- **Nooit iets beweren wat niet klopt.** Geen accreditatie, geen effectclaim,
  geen reviews die er niet zijn, geen KvK-nummer dat we niet hebben.

### De reviewsectie

De homepage heeft een sectie *Nog geen reviews — en die verzinnen we niet*, met
een uitnodiging om mee te testen. Dat is geen verlegenheidsoplossing maar een
positionering: in een markt waar veel aanbieders claims doen die ze niet kunnen
onderbouwen, is expliciet niets claimen onderscheidend. Vervang deze sectie
zodra er echte reacties zijn — en geen dag eerder.

### De plaatshouders

Bedrijfsnaam, adres, KvK en btw staan in `lib/site.ts` op `null` tot ze via
omgevingsvariabelen gezet zijn, en worden op de juridische pagina's als
zichtbare gemarkeerde plaatshouder getoond. Dat is opzettelijk lelijk: een
verzonnen KvK-nummer op je algemene voorwaarden is erger dan een lege plek, en
een lelijke plek wordt sneller ingevuld.

---

## De merkzinnen op de site

| Zin | Waar |
| --- | --- |
| Geen perfecte antwoorden. Wel betere vragen. | Slot homepage |
| Soms verandert niet de casus. Maar wel hoe je ernaar kijkt. | Slot productpagina |
| Een casus kent meer dan één perspectief. | Slot hoe-het-werkt |
| Mooi genoeg om te laten liggen. Simpel genoeg om direct te gebruiken. | Slot over-pagina |
| Spreek vrij. Deel zorgvuldig. | Veiligheidsblok, spelregels |
| 100 vragen · 3 niveaus · één gesprek dat verder kijkt | Announcement bar |

---

## Toon per pagina

| Pagina | Register |
| --- | --- |
| Homepage | Warm en overtuigend. Mag het meest "verkopen". |
| Productpagina | Feitelijk. Wie hier is, is al geïnteresseerd; die wil weten wat hij krijgt. |
| Hoe het werkt | Instruerend, maar niet betuttelend. |
| Spelregels | Rustig en zorgvuldig. Dit is de pagina waar de veiligheid staat. |
| Teams | Zakelijk zonder inkooptaal. "Er komt geen verkoper langs" is hier de belangrijkste zin. |
| FAQ | Recht voor zijn raap. Hier staan de eerlijke nee's. |
| Artikelen | Vakinhoudelijk. De lezer is een collega, geen prospect. |
| Juridisch | Formeel, maar leesbaar. Geen juridisch behang. |
