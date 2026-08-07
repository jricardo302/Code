# InterVISIE — kleuren

Het palet zoals het nu in de site zit, waar elke kleur wordt gebruikt, en wat
het contrast doet. Dit bestand is de referentie; de kleuren zelf staan in
`app/globals.css` onder `@theme inline`.

## Het palet

| Naam         | Hex       | Tailwind-token | Waar het voor is                                     |
| ------------ | --------- | -------------- | ---------------------------------------------------- |
| Diep paars   | `#3B1E4A` | `paars-diep`   | Titels, bodytekst, niveau 3, knoppen, CTA-blok       |
| Medium paars | `#8B5FBF` | `paars`        | Links, hover-status van knoppen, niveau 2, "VISIE"   |
| Licht lila   | `#C9A8E0` | `lila`         | Niveau 1, zachte vlakken, gloed achter de hero       |
| Goud         | `#C9A227` | `goud`         | Fijne lijnen, cijfers, kaders — spaarzaam            |
| Crème        | `#F5F0E4` | `creme`        | Achtergrond van de pagina, tekst op donkere vlakken  |
| Kraft        | `#EFE3CC` | `kraft`        | Secties, kaders, formuliervlak                       |

De drie paarse tinten zijn niet inwisselbaar: ze dragen de oplopende diepte van
de niveaus. Lila = niveau 1, medium = niveau 2, diep = niveau 3. Wie er één
verandert, verandert de betekenis.

Goud is een accentkleur, geen tekstkleur — zie de waarschuwing hieronder.

## Contrast (WCAG 2.1)

Gemeten met de standaard luminantieformule. AA vraagt 4.5:1 voor gewone tekst
en 3:1 voor grote tekst (vanaf 24px, of 18.66px vet).

| Combinatie                | Ratio     | Oordeel      | Waar                                       |
| ------------------------- | --------- | ------------ | ------------------------------------------ |
| diep paars op crème       | 12,56:1   | AAA          | alle bodytekst en koppen                   |
| diep paars op kraft       | 11,24:1   | AAA          | tekst in de kraft-secties                  |
| crème op diep paars       | 12,56:1   | AAA          | knoppen, CTA-blok, niveau 3, bevestiging   |
| diep paars op lila        | 6,91:1    | AA           | niveau 1                                   |
| goud op diep paars        | 5,90:1    | AA           | gouden kaderlijnen en cijfers op paars     |
| diep paars op goud        | 5,90:1    | AA           | tekst op de gouden knop                    |
| medium paars op crème     | 4,12:1    | AA groot     | links, accenttekst                         |
| crème op medium paars     | 4,12:1    | AA groot     | tekst op de niveau 2-kaart                 |
| **goud op crème**         | **2,13:1**| onvoldoende  | alleen decoratief gebruiken                |

### Twee dingen om rekening mee te houden

**Goud op crème haalt niets.** 2,13:1 is te weinig, ook voor grote tekst. In de
site staat goud op een lichte achtergrond daarom uitsluitend op plekken die
`aria-hidden` zijn en die niets dragen wat je moet kunnen lezen: het "404",
het sterretje op de bevestiging, de nummers 01/02/03 bij "Voor wie", het
scheidingsteken in de footer en de krijtstreep onder accentwoorden. Zolang dat
zo blijft is er niets aan de hand. Zodra goud écht informatie moet dragen op
crème, is er een donkerder variant nodig — rond `#8A6E15` haal je AA.

**Medium paars zit precies op de grens.** 4,12:1 is genoeg voor grote tekst,
maar niet voor de 14px-tekst op de niveau 2-kaart en niet voor gewone links.
Drie manieren om dat op te lossen, elk met een prijs:

1. De kaartvulling van niveau 2 iets donkerder maken (rond `#7A4FAE` → 5,3:1).
   De oplopende reeks blijft zichtbaar; het merkpaars zelf blijft `#8B5FBF`
   voor links en knoppen.
2. De tekst op die kaart in diep paars zetten in plaats van crème. Dat breekt
   wel het ritme van "hoe dieper het niveau, hoe lichter de tekst".
3. Laten staan en accepteren dat één kaart op AA-groot zit.

Nu staat optie 3 in de code — bewust, omdat de opdracht deze zes hexwaarden
noemde. Zeg het als je 1 of 2 liever hebt; het is een regel of drie.

## De doos: belichting

De kaartendoos is een isometrische SVG-constructie, en daar horen tinten bij
die géén merkkleuren zijn — ze bestaan alleen om licht te suggereren. Ze zijn
allemaal afgeleid van `#3B1E4A`.

| Vlak                 | Hex                     | Waarom                              |
| -------------------- | ----------------------- | ----------------------------------- |
| Deksel (bovenvlak)   | `#4E2964` → `#3D1F4E`   | vangt het meeste licht              |
| Lange voorkant       | `#3A1E49` → `#2C1637`   | staat schuin op de lichtbron        |
| Kopse kant rechts    | `#241130`               | ligt het verst van het licht af     |
| Bak onder het deksel | zwart op 16% dekking    | maakt de naad van de magneetsluiting|
| Slagschaduw          | `#150919`               | onder de doos en onder de kaarten   |
| Goudfolie            | `#F4E09B` → `#A8831A`   | verloop, geen vlakke kleur          |
| Kaartkarton          | `#FCF9F0` → `#EFE7D3`   | warm wit voor de vraagkaarten       |

Het goud is bewust een verloop van licht naar donker: één vlakke gouden kleur
ziet er op een scherm uit als gele inkt, een verloop leest als folie.

Deze tinten horen bij de illustratie, niet bij het merk. Wie de merkkleuren
aanpast, moet ze opnieuw afleiden — ze staan in `components/Kaartendoos.tsx`.

## Typografie

| Rol       | Font        | Fallback                        |
| --------- | ----------- | ------------------------------- |
| Koppen    | Fraunces    | Georgia, Times New Roman, serif |
| Bodytekst | Nunito Sans | system-ui, sans-serif           |

Beide via `next/font`, dus ze worden mee gebundeld — er gaat bij het laden van
de pagina geen verzoek naar Google.

## Waar de kleuren in de code staan

```
app/globals.css              de zes tokens + de kraft-korrel en de krijtstreep
app/page.tsx                 de niveau-kaarten (vulling, tekst, cijfer, rand)
components/Kaartendoos.tsx   hexwaarden staan hier hard in de SVG
app/opengraph-image.tsx      idem, voor de social preview
```

Verander je een kleur, dan moet je die op drie plekken langs: `globals.css`
voor de site, en de twee bestanden hierboven waar de hexwaarden in SVG en in de
gegenereerde afbeelding staan. SVG en `next/og` kunnen geen Tailwind-tokens
lezen, vandaar de duplicatie.
