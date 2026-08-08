# IK ZIE, IK ZIE…

Merk, webshop en productieproces voor **IK ZIE, IK ZIE… INTERVISIE** — een
intervisiekaartspel met 100 vraagkaarten in drie niveaus, voor professionals in
jeugdhulp, jeugd-GGZ en GGZ.

Domein: **ikzieikzie.eu**

---

## Wat er in deze repository zit

| Map | Wat |
| --- | --- |
| `app/` | De website: homepage, productpagina, checkout, B2B, artikelen, juridisch, beheer |
| `components/` | Merk, kaart, doos, formuliervelden, UI-bouwstenen |
| `lib/` | Producten en prijzen, kaarten, schema's, opslag, mail, Stripe |
| `content/` | De 100 kaarten (csv/json/md), artikelen, e-mails, socialcontent |
| `design/` | Merkgids, typografie, printspecificaties, dooscopy, handleiding |
| `docs/` | Onderzoek, leveranciers, prijsmodel, marketing, juridisch, besluitenlogboek |
| `scripts/` | Generator en controle van de kaarten, en van de printbestanden |

Begin bij **`docs/decision-log.md`** als je wilt weten waarom iets is zoals het
is, en bij **`docs/launch-checklist.md`** als je wilt weten wat er nog moet
gebeuren.

---

## Stand van zaken

| | |
| --- | --- |
| 100 vraagkaarten | ✔ geschreven en programmatisch gecontroleerd |
| Website en webshop | ✔ gebouwd, build en QA schoon |
| Stripe-checkout | ✔ geïmplementeerd, **sleutels ontbreken nog** |
| Printbestanden | ✔ generator werkt, **nog niet naar drukkersformaat** |
| Leveranciers | ✔ 10 onderzocht, 3 op shortlist — **geen enkele mail verstuurd** |
| Prijs | ✔ € 39,95 vastgesteld en onderbouwd |
| Inkoopprijs | ✘ onbekend, geen offertes binnen |
| Bedrijfsgegevens | ✘ plaatshouders, nog invullen |
| Merkregistratie | ✘ niet onderzocht |

De verkoop staat standaard **uit** (`NEXT_PUBLIC_VERKOOP_OPEN`). Zolang er geen
voorraad is toont de productpagina de wachtlijst in plaats van een afrekenknop.

---

## Techniek

- **Next.js 16** (App Router, Turbopack) + **TypeScript** + **Tailwind CSS v4**
- **Zod** voor validatie — hetzelfde schema op client en server
- **Server Actions** voor formulieren, geen aparte API-laag
- **Stripe Checkout** voor betalingen, met webhook
- Opslag via twee drivers achter één interface (`lib/store/`): JSON-bestand
  lokaal, Postgres in productie
- Geen animatiebibliotheek, geen UI-framework, geen afbeeldingen — de doos en de
  kaarten zijn met de hand in SVG getekend
- Fonts via `next/font`, dus geen extern verzoek bij het laden

---

## Lokaal draaien

Node.js 20.9 of nieuwer.

```bash
npm install
cp .env.example .env.local   # en vul in wat je nodig hebt
npm run dev
```

De site draait op http://localhost:3000. Zonder één env-variabele werkt alles
behalve `/beheer`, de checkout en de mail. Inzendingen komen dan in
`data/inzendingen.json` (die map staat in `.gitignore`).

### Scripts

```bash
npm run dev              # ontwikkelserver
npm run build            # productiebuild
npm run start            # productiebuild draaien
npm run lint             # ESLint
npm run typecheck        # tsc --noEmit
npm run kaarten          # genereert content/cards.{json,csv} en 100-vragen.md
npm run kaarten:check    # controleert de kaartenset zonder te schrijven
npm run printbestanden   # genereert print/ (SVG op ware grootte)
npm run check            # kaarten + lint + typecheck + build
```

---

## De 100 kaarten

De vragen staan in **`scripts/kaarten.mjs`** — dat is de bron. Daaruit worden
gegenereerd:

- `content/cards.json` — leest de website in via `lib/kaarten.ts`
- `content/cards.csv` — puntkomma's en BOM, opent goed in een Nederlandse Excel
- `content/100-vragen.md` — leesbare versie

Wijzig de vragen in het script en draai `npm run kaarten`. Nooit de gegenereerde
bestanden met de hand aanpassen.

Bij elke run wordt gecontroleerd:

- exact 100 kaarten, verdeeld 33 / 34 / 33 over de drie niveaus;
- nummering 1–100 aaneengesloten, niveaus in drie aaneengesloten blokken;
- geen doublures (exact én bijna — er is een woordoverlap-check);
- elke vraag eindigt op precies één vraagteken;
- maximaal 105 tekens, zodat de vraag binnen de safe zone past;
- geen aanhalingstekens, geen woorden die om een diagnose vragen;
- de juiste niveaukleur per kaart.

De set klopt niet? Dan draaien de printbestanden niet. Liever een rode build dan
honderd verkeerde kaarten bij de drukker.

---

## Env-variabelen

Zie `.env.example` voor de volledige lijst met uitleg. De belangrijkste:

| Variabele | Verplicht | Waarvoor |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | aanbevolen | Canonical, sitemap, Open Graph. **Wordt tijdens de build vastgelegd** — zet 'm bij je host |
| `DATABASE_URL` | in productie | Postgres. Leeg = JSON-bestand, en dat is op een serverless host bij elke deploy weg |
| `BEHEER_WACHTWOORD` | voor `/beheer` | Wachtwoord van het overzicht |
| `STRIPE_SECRET_KEY` | voor de checkout | Zonder deze sleutel geeft de checkout een nette 503 |
| `STRIPE_WEBHOOK_SECRET` | voor de checkout | **Zonder dit wordt een betaalde bestelling niet vastgelegd** |
| `NEXT_PUBLIC_VERKOOP_OPEN` | bij livegang | Zet op `1` zodra er voorraad is |
| `NEXT_PUBLIC_BEDRIJFSNAAM` e.a. | vóór livegang | Anders staan er zichtbare plaatshouders op de juridische pagina's |
| `RESEND_API_KEY` | nee | Zet de transactiemails aan |
| `NEXT_PUBLIC_GA_ID` | nee | Zonder deze key verschijnt er geen cookiebalk en laadt er niets |

`POSTGRES_URL` werkt ook, handig bij de Vercel Postgres-integratie.

---

## Database

Lokaal hoef je niets te doen: bij de eerste inzending wordt
`data/inzendingen.json` aangemaakt. Schrijven gaat via een wachtrij en een
atomaire rename, dus twee gelijktijdige inzendingen overschrijven elkaar niet.

In productie zet je `DATABASE_URL`. De tabel wordt bij het eerste gebruik zelf
aangemaakt:

```sql
CREATE TABLE IF NOT EXISTS inzendingen (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  soort         text NOT NULL,
  gegevens      jsonb NOT NULL DEFAULT '{}'::jsonb,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);
```

Eén tabel voor vier soorten inzending — wachtlijst, offerte, contact en
bestelling. De vorm van `gegevens` wordt bewaakt door zod vóórdat er iets de
opslag in gaat. Een nieuw formulier toevoegen is dus een schema, geen migratie.
Waarom dat zo is: `docs/decision-log.md`.

---

## Stripe

De volledige integratie staat er. Wat jij moet doen:

1. Account aanmaken op stripe.com en de verificatie afronden.
2. Onder **Settings → Payment methods** aanzetten wat je wilt: iDEAL, kaart,
   Apple Pay, Google Pay. De code noemt betaalmethoden bewust **niet**, zodat je
   ze kunt wisselen zonder deploy.
3. `STRIPE_SECRET_KEY` zetten.
4. Een webhook aanmaken op `https://www.ikzieikzie.eu/api/stripe/webhook` met
   alleen de gebeurtenis `checkout.session.completed`, en het signing secret in
   `STRIPE_WEBHOOK_SECRET` zetten.
5. Optioneel een btw-tarief van 21% met gedrag "inclusive" aanmaken en het id in
   `STRIPE_BTW_TARIEF_ID` zetten.
6. `NEXT_PUBLIC_VERKOOP_OPEN=1` zetten.

Twee dingen die opzettelijk zo zijn gebouwd:

- **De prijs wordt op de server berekend.** De client stuurt alleen een slug en
  een aantal; alles wat de browser meestuurt kun je aanpassen.
- **De webhook is de enige bron van waarheid over betaling.** De pagina
  `/bestellen/gelukt` bevestigt niets administratief — die kan iedereen openen.

**Let op:** sinds 19 juni 2026 moet een webshop een duidelijk zichtbare
herroepingsfunctie aanbieden. Die is er nog niet. Zie
`docs/juridisch-onderzoek.md` §1 — dit moet vóór de webshop opengaat.

---

## Deployen

1. Push naar GitHub en importeer de repo bij je host (Vercel herkent Next.js
   zelf; er valt niets in te stellen aan build-commando's).
2. Voeg een Postgres toe of plak een `DATABASE_URL` van Neon of Supabase.
3. Zet minimaal `BEHEER_WACHTWOORD`, `DATABASE_URL`, `NEXT_PUBLIC_SITE_URL` en
   `NEXT_PUBLIC_CONTACT_MAIL`.
4. Deploy.

Vergeet `DATABASE_URL` niet: zonder die variabele start de site wel, maar
verdwijnen inzendingen bij elke deploy. De server logt daar een waarschuwing
over.

---

## Wat er níet op de site staat

Dit is een expliciete keuze en geen omissie:

- Geen reviews, sterren of klantaantallen — er zijn er nog geen
- Geen SKJ-accreditatie, keurmerk of erkende-methodiekclaim — die zijn er niet
- Geen "bewezen effectief" — er is geen effectonderzoek
- Geen schaarste, timers of nepkortingen
- Geen KvK- of btw-nummer tot het echte nummer bekend is
- Geen tracking vóór expliciete toestemming
- Geen getallen over SKJ-eisen — die veranderen, en dan staat de pagina fout

---

## Beperkingen van deze bouwronde

De omgeving waarin dit project is gebouwd had **beperkte netwerktoegang**:
zoeken werkte, maar het rechtstreeks ophalen van webpagina's was geblokkeerd.
Gevolgen, allemaal ook vermeld in het betreffende document:

- **Geen leverancierswebsite bekeken** en dus geen enkele prijs geverifieerd —
  `docs/vendor-shortlist.md`, `docs/pricing-model.md`
- **Geen mail verstuurd.** De conceptmails staan verzendklaar in
  `docs/vendor-emails.md`; het juiste contactadres moet je zelf van hun site halen
- **Geen merkenregisteronderzoek** bij BOIP of EUIPO — `docs/pricing-model.md` §5
- **Geen domeincontrole** op ikzieikzie.eu
- **Mont Heavy niet opgehaald en de licentie niet gecontroleerd** — er draait nu
  Figtree Black; `design/typografie.md`
- **Geen primaire bronnen** van SKJ, wetten.overheid.nl of het Kwaliteitskader
  geraadpleegd; er staat daarom geen enkel getal over registratie-eisen op de
  site — `docs/research-intervisie.md`
