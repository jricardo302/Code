# IK ZIE, IK ZIE… — merkgids

Eén bron voor kleur, typografie en toon. De hexwaarden hieronder staan
letterlijk in `app/globals.css`, `scripts/kaarten.mjs` en
`scripts/printbestanden.mjs`. Wijzig je er één, wijzig ze dan alle vier.

---

## 1. Naam en schrijfwijze

| | |
| --- | --- |
| Hoofdmerk | `IK ZIE, IK ZIE…` |
| Eerste editie | `INTERVISIE` |
| Samen | `IK ZIE, IK ZIE… INTERVISIE` |
| Visueel accent | `inter`**`VISIE`** — VISIE in mid-purple of lila |
| Domein | ikzieikzie.eu |

Regels:

- Het hoofdmerk staat in kapitalen, met komma en beletselteken (`…`, één teken —
  geen drie punten).
- Het hoofdmerk gaat nooit onder de editienaam staan. De editie is de ondertitel,
  altijd kleiner en altijd eronder.
- `interVISIE` is een visuele knipoog, geen tweede naam. In lopende tekst,
  metadata en juridische documenten schrijf je gewoon `INTERVISIE`.
- Bij volgende edities blijft het patroon gelijk: `IK ZIE, IK ZIE… CASUÏSTIEK`,
  `IK ZIE, IK ZIE… TEAM`. Het merk staat nooit vast aan één product.

---

## 2. Kleur

```
--deep-purple:      #3B1E4A   tekst, niveau 3, donkere vlakken
--deep-purple-soft: #4E2B60   hover op diep paars
--box-gradient-dark:#2E1738   doosverloop donker
--box-gradient-light:#4A2A5C  doosverloop licht
--mid-purple:       #8B5FBF   links, accenten, niveau 2
--lilac:            #C9A8E0   niveau 1, accent op donker
--lilac-pale:       #E9DCF3   zachte vlakken
--cream:            #F7F2E7   achtergrond én kaartfront
--kraft:            #EFE3CC   secties, kaders, losse kaarten
--ink:              #2B1733   bodytekst
```

### Verboden

- **Geen goud of geel.** Niet `#C9A227`, niet `#F3D889`, niet `#B8901E`. Een
  eerdere versie van deze site gebruikte goud als accent; dat is er volledig
  uit. Grep op `goud` en `C9A227` als je twijfelt.
- **Geen puur wit als kaartfront.** Niet `#FFFFFF`, niet `#FBF8F2`. Kaartfronten
  zijn `#F7F2E7`.

### Contrast

Gemeten met de WCAG-formule voor de combinaties die in de interface voorkomen:

| Voorgrond | Achtergrond | Ratio | Oordeel |
| --- | --- | --- | --- |
| `#2B1733` inkt | `#F7F2E7` crème | 15,3 : 1 | AAA, alle tekstgroottes |
| `#3B1E4A` diep paars | `#F7F2E7` crème | 12,4 : 1 | AAA |
| `#8B5FBF` mid-purple | `#F7F2E7` crème | 4,6 : 1 | AA vanaf 16 px normale tekst |
| `#F7F2E7` crème | `#3B1E4A` diep paars | 12,4 : 1 | AAA |
| `#C9A8E0` lila | `#3B1E4A` diep paars | 6,9 : 1 | AA, ook voor kleine tekst |
| `#C9A8E0` lila | `#F7F2E7` crème | 1,8 : 1 | **alleen als vlak, nooit als tekst** |

Praktische regel: lila is op crème een *vorm*, geen letter. Wil je iets in lila
schrijven, doe dat op diep paars.

---

## 3. Typografie

Zie `design/typografie.md` voor het volledige verhaal over Mont Heavy en de
licentie. Kort:

| Rol | Font | Gewicht |
| --- | --- | --- |
| Merk, koppen, kaarten, knoppen | Mont Heavy (gewenst) → **Figtree Black** (nu) | 900 |
| Lopende tekst | Figtree | 400–600 |

Regels die de zware typografie leesbaar houden:

- Regelafstand minimaal 1,05 voor koppen en 1,65 voor bodytekst.
- Koppen krijgen `text-wrap: balance`, lopende tekst `text-wrap: pretty`.
- Koppen krijgen `hyphens: auto`. Het Nederlands zit vol samenstellingen —
  *jeugdhulpprofessionals* past in 900 op 36 px niet op een telefoon van 390 px.
  Zonder afbreken krijg je horizontale scroll; dat is één keer gebeurd en is nu
  in `globals.css` structureel opgelost.
- Blokken tekst kort houden. Maximaal ongeveer 65 tekens per regel.

---

## 4. Toon

Warm, scherp, professioneel, menselijk, rustig, zelfverzekerd. Korte zinnen.

**Wel:**

- "Geen perfecte antwoorden. Wel betere vragen."
- "Een casus kent meer dan één perspectief."
- "Soms verandert niet de casus. Maar wel hoe je ernaar kijkt."
- "Mooi genoeg om te laten liggen. Simpel genoeg om direct te gebruiken."

**Niet:**

- Amerikaanse marketingtaal: *unlock your potential*, *transformeer jouw journey*,
  *gamechanger*, *revolutionair*.
- Managementtaal: *handvatten aanreiken*, *de dialoog faciliteren*,
  *stakeholders meenemen*.
- Overdreven hip. Dit is een product voor mensen die de hele dag zware gesprekken
  voeren; die hebben geen behoefte aan uitroeptekens.

**Nooit:**

- Claims die niet kloppen. Geen SKJ-accreditatie, geen bewezen effectiviteit,
  geen erkende methodiek, geen verzonnen reviews, keurmerken of klantaantallen.
  Als iets nog niet waar is, staat het er niet — of er staat een zichtbare
  plaatshouder.

---

## 5. Woordmerk in gebruik

- **Op crème:** merk in `#3B1E4A`, VISIE-accent in `#8B5FBF`.
- **Op diep paars:** merk in `#F7F2E7`, VISIE-accent in `#C9A8E0`.
- Minimale vrije ruimte rondom: de hoogte van de letter I van het merk.
- Nooit uitrekken, kantelen, van een schaduw voorzien of in een outline zetten.
- Nooit op een foto zonder egaal vlak eronder.

De component `components/Merk.tsx` doet dit alles al; gebruik die in plaats van
het merk met de hand op te maken.

---

## 6. Kaartontwerp

| | |
| --- | --- |
| Formaat | 70 × 120 mm (verhouding 7:12) |
| Front N1 | crème `#F7F2E7`, accent lila |
| Front N2 | crème `#F7F2E7`, accent mid-purple |
| Front N3 | diep paars `#3B1E4A`, tekst crème `#F7F2E7`, accent lila |
| Vraagtekst | gecentreerd, rechtop, **geen** cursief, **geen** aanhalingstekens |
| Niveau-indicator | linksboven, klein: `N1 · LICHT` |
| Kaartnummer | rechtsonder, `001`–`100` |
| Hoeken | afgerond, radius 4 mm |
| Afwerking | mat |

De randkleur van N3 is lila en niet diep paars: die kaart wordt ook op een diep
paarse ondergrond getoond, en dan zou een rand in de vlakkleur de kaart
onzichtbaar maken.

De webversie in `components/Kaart.tsx` gebruikt container-query-eenheden (`cqi`),
zodat de typografie dezelfde verhouding tot de kaart houdt bij elke weergavemaat
— net als op karton.

---

## 7. Doos

Matte magnetische klapdoos, 132 × 80 × 42 mm.

- Verloop `#4A2A5C` → `#2E1738` → `#24122C`, diagonaal.
- Crème belettering en een crème keylijn op 5 mm van de rand.
- **Geen folie, geen goud, geen spot-UV.** Mat, en verder niets.
- Voorkant: `IK ZIE, IK ZIE…` / `INTERVISIE` / `100 vragen voor gesprekken die
  verder kijken`.
- Zijkant: `KIJK. VRAAG. REFLECTEER.`
- Achterkant: vier korte regels. Zie `design/box-copy.md`.
