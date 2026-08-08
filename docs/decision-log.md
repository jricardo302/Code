# Besluitenlogboek

Alleen de keuzes waarvan het later uitmaakt dat je weet waarom ze zo zijn.

---

### Merk staat los van product

`IK ZIE, IK ZIE…` is het merk, `INTERVISIE` de eerste editie. `lib/product.ts`
bevat daarom een **lijst** `EDITIES`, de productpagina zit op `/intervisie` en
niet op `/product`, en de sitemap wordt uit die lijst opgebouwd. Een tweede
editie is één object plus een pagina.

### Goud is volledig verwijderd

De bestaande codebase gebruikte `#C9A227` als accent. De opdracht verbiedt goud
en geel. Alle voorkomens zijn weg: `globals.css`, `Merk.tsx`, `icon.svg`,
`opengraph-image.tsx` en de accentstreep. Lila (`#C9A8E0`) heeft de accentrol
overgenomen.

### Figtree Black in plaats van Mont Heavy

Mont Heavy zat niet in de repo en kon in deze omgeving niet worden opgehaald;
de licentie kon evenmin worden gecontroleerd. Een font waarvan de licentie niet
vaststaat gaat niet op een commerciële site. Figtree (SIL OFL) draait nu, in
hetzelfde register. Wisselen kost één bestand — zie `design/typografie.md`.

### Kaartformaat 70 × 120 mm

Standaard tarotstansvorm, dus geen stanskosten, en ruim genoeg voor een vraag van
maximaal 105 tekens in gewicht 900 mét de crème marge die het ontwerp draagt.
Poker (63,5 × 89) zou goedkoper zijn maar laat te weinig witruimte. Afweging
staat in `design/print-specs.md` §1.

### Verkoopprijs € 39,95

Boven de consumentenmarkt (€ 19–25), onder het punt waarop je een track record
nodig hebt. Onderbouwing in `docs/pricing-model.md` §1. Deze prijs staat vast en
hangt níet aan de inkoopprijs, die nog onbekend is.

### Eén generieke opslaglaag in plaats van drie tabellen

De oorspronkelijke `aanvragen`-tabel had vaste kolommen. Er zijn nu vier soorten
inzending (wachtlijst, offerte, contact, bestelling) met verschillende velden.
In plaats van vier tabellen met vier migratiepaden is er één tabel `inzendingen`
met een `soort` en een `gegevens`-jsonb. De vorm wordt bewaakt door zod vóór het
de opslag in gaat. Een nieuw formulier is nu een schema, geen migratie.

Dit is een breaking change ten opzichte van de oude tabel. Dat kon: de site was
nog niet live en er was geen productiedata.

### Betaalmethoden staan niet in de code

`app/api/checkout/route.ts` geeft geen `payment_method_types` mee. Stripe gebruikt
dan wat er in het dashboard aanstaat, dus iDEAL, kaart, Apple Pay en Google Pay
kun je aan- en uitzetten zonder deploy. Relevant omdat iDEAL vanaf eind 2026
geleidelijk door Wero wordt vervangen; dat vergt zo geen codewijziging.

### Prijs wordt op de server berekend

De client stuurt alleen `slug` en `aantal`. Alles wat de browser meestuurt kun je
aanpassen; een meegestuurd bedrag zou betekenen dat iedereen zijn eigen prijs
bepaalt.

### De webhook is de enige bron van waarheid over betaling

`/bestellen/gelukt` bevestigt niets administratief — die pagina kan iedereen
openen. Alleen `/api/stripe/webhook` legt een bestelling vast, en alleen als de
handtekening klopt. Mislukt het opslaan, dan geeft het endpoint 500 zodat Stripe
het opnieuw aanbiedt.

### Verkoop staat standaard uit

`NEXT_PUBLIC_VERKOOP_OPEN` is leeg tot er voorraad is. De productpagina toont dan
de wachtlijst in plaats van een afrekenknop. Geen knop die op een foutmelding
uitloopt, en de wachtlijst bepaalt of we 250 of 500 laten drukken.

### Bedrijfsgegevens zijn `null`, niet verzonnen

KvK, btw, adres en bedrijfsnaam staan op `null` tot ze via omgevingsvariabelen
gezet zijn, en worden als zichtbare plaatshouder getoond. Een verzonnen
KvK-nummer op je algemene voorwaarden is erger dan een lege plek.

### Geen reviews in plaats van nepreviews

De reviewsectie op de homepage is een zichtbaar gemarkeerde lege plek met een
uitnodiging om mee te testen. De component staat klaar; er wordt niets verzonnen.

### Toestemming vóór meten, altijd

Ook al zou de AP-lijn bij een privacyvriendelijke GA4-inrichting een uitzondering
toestaan. Die uitzondering hangt aan een configuratie die je moet blijven
bewaken, en de ePrivacy-verordening komt eraan. Zonder `NEXT_PUBLIC_GA_ID`
verschijnt er geen balk en laadt er niets.

### Artikelen als TSX, niet als MDX

Vijf artikelen, die zelden veranderen. De compiler controleert zo de links en de
opmaak blijft één stijl, zonder een MDX-pijplijn te onderhouden. Bij vijftig
artikelen is dat een andere afweging.

### FAQ staat één keer in `lib/faq.ts`

De zichtbare pagina en de `FAQPage`-structured data worden uit dezelfde lijst
opgebouwd. Twee lijsten die uit elkaar lopen is precies de fout die Google wél
ziet en jij niet.

### Kaarttypografie in container-query-eenheden

`components/Kaart.tsx` gebruikt `cqi` in plaats van rem of breakpoints, zodat de
tekst dezelfde verhouding tot de kaart houdt bij elke weergavemaat — net als op
karton. Let op de twee lagen in die component: cqi-eenheden lossen op tegen de
container-*voorouder*, nooit tegen het element zelf. `@container` en de cqi-maten
op hetzelfde element zetten liet de kaart meeschalen met de paginabreedte.

### `hyphens: auto` op alle koppen

Nederlands zit vol samenstellingen. *Jeugdhulpprofessionals* past in gewicht 900
op 36 px niet op een telefoon van 390 px, en gaf horizontale scroll over de hele
pagina. Structureel opgelost in `globals.css` in plaats van per kop.

### Statusvorm van formulieren apart van de verwerking

`lib/formulier-status.ts` bevat de types en `LEEG`; `lib/formulier.ts` de
verwerking. Client components importeren alleen het eerste — importeerden ze
`LEEG` uit het tweede, dan trok de hele Postgres-driver het browserbundel in.
Dat brak de build en het is een makkelijke fout om opnieuw te maken.

---

## Nog te beslissen

| Beslissing | Wanneer | Waarvan afhankelijk |
| --- | --- | --- |
| Oplage: 250 of 500 | Na 6 weken wachtlijst | >150 aanmeldingen → 500 |
| Leverancier eerste oplage | Na de offertes | Kwaliteit van het proefexemplaar, niet de laagste prijs |
| Mont Heavy of Figtree definitief | Vóór drukwerk | Uitkomst van de licentiecontrole |
| Merkregistratie BOIP | Vóór de oplage | Uitkomst merkonderzoek |
| Fulfilment zelf of uitbesteed | Bij >50 orders per maand | Ordervolume |
| Tweede editie | Na 6 maanden verkoop | Welke vragen klanten stellen |
