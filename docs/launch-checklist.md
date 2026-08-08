# Launch checklist

Drie fasen. Fase A kan nu. Fase B pas als de offertes binnen zijn. Fase C pas
als de dozen er fysiek zijn.

Wat er in de code al staat is aangevinkt. Alles wat openstaat vraagt om een
beslissing, een account, een betaling of gegevens die er nog niet zijn.

---

## Fase A — De site live met de wachtlijst

Doel: verkeer verzamelen en meten of er vraag is, vóór er voorraad wordt
ingekocht.

### Techniek

- [x] Build slaagt, lint schoon, typecheck schoon
- [x] Alle routes geven de juiste status (gecontroleerd met een browser-QA-run)
- [x] Eén `h1` per pagina, geen console-fouten, geen gebroken afbeeldingen
- [x] Geen horizontale scroll op 390 px en 1440 px
- [x] Formulieren valideren client- en serverzijde en behouden ingevulde waarden
- [x] Checkout faalt netjes zonder Stripe-sleutel (503 met uitleg)
- [x] `robots.txt` en `sitemap.xml` kloppen
- [x] Structured data: Organization, Product, FAQPage, Article
- [x] Toegankelijkheid: skiplink, focus states, semantische koppen, `lang="nl"`
- [ ] Domein `ikzieikzie.eu` registreren — **niet gecontroleerd, de omgeving kon
      geen whois raadplegen. Ga uit van niets.**
- [ ] Hosting aanmaken en repo koppelen
- [ ] Postgres aanmaken en `DATABASE_URL` zetten (zonder database verdwijnen
      inzendingen bij elke deploy)
- [ ] `NEXT_PUBLIC_SITE_URL` zetten op het echte domein — wordt tijdens de
      **build** vastgelegd, dus vóór de eerste deploy
- [ ] `BEHEER_WACHTWOORD` zetten
- [ ] `NEXT_PUBLIC_CONTACT_MAIL` en `NEXT_PUBLIC_ZAKELIJK_MAIL` zetten
- [ ] Mailadressen aanmaken op het domein
- [ ] Resend-account, domein verifiëren, `RESEND_API_KEY` en `MAIL_AFZENDER`
      zetten
- [ ] `MAIL_KOPIE_NAAR` zetten zodat je een seintje krijgt bij elke inzending
- [ ] Testinzending doen op elk formulier en controleren of de mail aankomt

### Juridisch en gegevens

- [ ] Bedrijfsgegevens invullen: `NEXT_PUBLIC_BEDRIJFSNAAM`, `_BEDRIJFSADRES`,
      `_KVK`, `_BTW` — zolang die leeg zijn tonen de juridische pagina's
      zichtbare plaatshouders
- [ ] Algemene voorwaarden, privacyverklaring en disclaimer door een jurist laten
      nakijken
- [ ] Btw-tarief 21% laten bevestigen door de boekhouder
- [ ] Verwerkersovereenkomsten: hosting, database, Resend

### Vindbaarheid

- [ ] Google Search Console koppelen, sitemap indienen
- [ ] Bing Webmaster Tools koppelen
- [ ] Zoekvolumes ophalen in Keyword Planner, `docs/seo-plan.md` bijwerken
- [ ] OG-afbeelding controleren met de LinkedIn Post Inspector
- [ ] Structured data testen in de Rich Results Test
- [ ] PageSpeed Insights draaien op `/` en `/intervisie`

### Merk

- [ ] Merkonderzoek BOIP en EUIPO op `ik zie ik zie` in klasse 28 en 41
- [ ] Handelsnaam checken in het KvK-handelsregister
- [ ] Mont Heavy-licentie bij Fontfabric nalezen — zie `design/typografie.md`

### Marketing

- [ ] LinkedIn-bedrijfspagina aanmaken
- [ ] Instagram-account aanmaken
- [ ] Eerste vier organische LinkedIn-posts inplannen
- [ ] Vijf artikelen delen in relevante vakgroepen

---

## Fase B — Productie

Doel: een fysiek product dat klopt.

- [ ] Offertes versturen — de conceptmails staan klaar in
      `docs/vendor-emails.md`. **Er is er nog geen één verstuurd.**
- [ ] Eén prototype bestellen bij een online configurator om de honderd vragen
      fysiek te lezen
- [ ] Twee tot drie professionals uit het veld de vragen laten doorlezen
- [ ] Dielines opvragen bij de shortlist
- [ ] `design/print-specs.md` aanpassen op de dieline van de gekozen leverancier
- [ ] `npm run printbestanden` draaien en omzetten naar de gevraagde
      PDF-standaard en het gevraagde kleurprofiel
- [ ] Kleurproef van `#3B1E4A` in mat CMYK opvragen — diepe paarsen slaan snel
      dof of blauwig uit
- [ ] Stapelhoogte van 102 kaarten meten, doosdiepte bijstellen
- [ ] Fysiek proefexemplaar goedkeuren **vóór** de oplage
- [ ] Oplage bepalen op basis van het aantal wachtlijstaanmeldingen: >150 → 500,
      anders 250
- [ ] Werkelijke inkoopprijzen invullen in `docs/pricing-model.md` en de
      break-even herberekenen
- [ ] Oplage bestellen

---

## Fase C — De webshop open

Doel: daadwerkelijk verkopen.

### Betalen

- [ ] Stripe-account aanmaken en accountverificatie afronden
- [ ] In het dashboard iDEAL, kaart, Apple Pay en Google Pay aanzetten
- [ ] `STRIPE_SECRET_KEY` zetten
- [ ] Webhook-endpoint aanmaken op `/api/stripe/webhook`, alleen
      `checkout.session.completed`, en `STRIPE_WEBHOOK_SECRET` zetten
- [ ] Btw-tarief van 21% "inclusive" aanmaken en `STRIPE_BTW_TARIEF_ID` zetten
- [ ] **Testbestelling in testmodus** doen en controleren of hij op `/beheer`
      verschijnt en of de mail aankomt
- [ ] Testbestelling in productie doen met een echte betaling, en die daarna
      terugboeken

### Wettelijk vereist vóór opening

- [ ] **Herroepingsfunctie bouwen.** Sinds 19 juni 2026 verplicht: een duidelijk
      zichtbare, eenvoudig te gebruiken knop of formulier. Zie
      `docs/juridisch-onderzoek.md` §1. Eén formulier op `/herroepen` met
      ordernummer en mailadres, via de bestaande `maakVerwerker`-laag.
- [ ] Modelformulier herroeping als downloadbare tekst toevoegen
- [ ] Retouradres vaststellen en in de bestelbevestiging opnemen

### Logistiek

- [ ] Voorraad ontvangen en tellen
- [ ] Verzenddozen, tape en retourlabels inkopen
- [ ] Verzendtarieven bij de vervoerder controleren tegen `lib/product.ts`
- [ ] Verzendproces één keer helemaal doorlopen met een testpakket

### Aanzetten

- [ ] `NEXT_PUBLIC_VERKOOP_OPEN=1` zetten — dit is de schakelaar die de
      afrekenknop laat verschijnen
- [ ] Productfotografie maken van het echte product en de SVG-mockups vervangen
- [ ] Wachtlijst mailen (mail 5 uit `content/emails.md`)
- [ ] Google Ads aanzetten, campagne 1, € 10–15 per dag
- [ ] Conversietracking inrichten: aankoop, offerteaanvraag, wachtlijst
- [ ] "De doos is er"-post op LinkedIn en Instagram
- [ ] B2B-outreach starten: maximaal tien gepersonaliseerde mails per week

### Eerste week na opening

- [ ] Dagelijks `/beheer` controleren op bestellingen en offerteaanvragen
- [ ] Eerste kopers persoonlijk vragen om een review — die sectie staat leeg te
      wachten
- [ ] Search Console controleren op indexatie
- [ ] Ads-cijfers bekijken en negatieve zoekwoorden aanvullen

---

## Wat er beslist níet gebeurt vóór de opening

- Geen reviews plaatsen die er niet zijn
- Geen klantaantallen, keurmerken of accreditaties noemen
- Geen "bijna uitverkocht", timers of nepkortingen
- Geen SKJ-claims
- Geen tracking laden vóór toestemming
- Geen verzonnen KvK- of btw-nummer op de juridische pagina's
