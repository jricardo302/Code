# Ik zie ik zie…

Landingspagina en aanvraagformulier voor **Ik zie ik zie…**, het intervisiespel
voor behandelaren en begeleiders in de jeugdzorg. Een gesprekskaartspel met
100 vragen en drie niveaus.

Drie routes:

| Route        | Wat het is                                                              |
| ------------ | ----------------------------------------------------------------------- |
| `/`          | Landingspagina: waarom het spel bestaat, de drie niveaus, voor wie       |
| `/aanvragen` | Aanvraagformulier (interesse-registratie, geen betaling)                |
| `/beheer`    | Overzicht van binnengekomen aanvragen + CSV-export, achter een wachtwoord |

## Techniek

- **Next.js 16** (App Router) + **TypeScript** + **Tailwind CSS v4**
- **Zod** voor validatie — hetzelfde schema draait op de server, de HTML-attributen
  in het formulier zijn alleen een service voor de bezoeker
- **Server Actions** voor het versturen; geen aparte API-laag
- Opslag met twee drivers achter één interface (`lib/store/`):
  - **JSON-bestand** (`data/aanvragen.json`) — standaard, nul configuratie
  - **Postgres** (`pg`) — zodra `DATABASE_URL` gezet is
- Geen animatiebibliotheken, geen UI-framework, geen afbeeldingen: de kaartendoos
  is met de hand in SVG getekend (`components/Kaartendoos.tsx`)

## Lokaal draaien

Je hebt Node.js 20.9 of nieuwer nodig.

```bash
npm install
cp .env.example .env.local   # en vul in wat je nodig hebt
npm run dev
```

De site draait op http://localhost:3000.

Zonder ook maar één env-variabele werkt alles behalve `/beheer`: aanvragen komen
dan in `data/aanvragen.json` te staan (die map staat in `.gitignore`).

### Env-variabelen

| Variabele                  | Verplicht        | Waarvoor                                                          |
| -------------------------- | ---------------- | ----------------------------------------------------------------- |
| `BEHEER_WACHTWOORD`        | voor `/beheer`   | Wachtwoord van het beheeroverzicht                                 |
| `DATABASE_URL`             | in productie     | Postgres-verbinding. Leeg = JSON-bestand                           |
| `AANVRAGEN_BESTAND`        | nee              | Ander pad voor het JSON-bestand                                    |
| `NEXT_PUBLIC_SITE_URL`     | aanbevolen       | Volledige URL, voor canonical-links, sitemap en Open Graph-tags    |
| `NEXT_PUBLIC_CONTACT_MAIL` | nee              | Adres in de footer (standaard `hallo@ikzieikzie.nl`)               |
| `RESEND_API_KEY`           | nee              | Zet de bevestigingsmail aan                                        |
| `MAIL_AFZENDER`            | bij mail         | Afzender, bijv. `"Ik zie ik zie... <hallo@jouwdomein.nl>"`          |
| `MAIL_KOPIE_NAAR`          | nee              | Krijgt een seintje bij elke nieuwe aanvraag                        |

`POSTGRES_URL` werkt ook — handig als je de Vercel Postgres-integratie gebruikt,
die zet die variabele zelf.

`NEXT_PUBLIC_SITE_URL` wordt tijdens de **build** vastgelegd: `robots.txt` en
`sitemap.xml` zijn statische bestanden. Zet 'm dus bij je host en niet pas op de
draaiende server, anders staat er `localhost` in. Vergeet je 'm op Vercel, dan
valt de app terug op het productiedomein van het project.

## De database opzetten

### Lokaal: niets doen

Laat `DATABASE_URL` leeg. Bij de eerste aanvraag maakt de app
`data/aanvragen.json` aan. Schrijven gebeurt via een wachtrij en een atomaire
rename, dus twee gelijktijdige aanvragen overschrijven elkaar niet.

Alles wissen? `rm data/aanvragen.json`.

### Productie: Postgres

Een serverless host heeft geen blijvend bestandssysteem — wat je naar schijf
schrijft is bij de volgende deploy weg. Zet daarom `DATABASE_URL`. Elke
Postgres werkt: Vercel Postgres, Neon, Supabase, of je eigen server.

```bash
DATABASE_URL="postgres://gebruiker:wachtwoord@host/database?sslmode=require"
```

De tabel wordt bij het eerste gebruik automatisch aangemaakt:

```sql
CREATE TABLE IF NOT EXISTS aanvragen (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  naam          text NOT NULL,
  email         text NOT NULL,
  organisatie   text,
  functie       text,
  aantal        integer NOT NULL DEFAULT 1,
  doelen        text[] NOT NULL DEFAULT '{}',
  opmerking     text,
  aangemaakt_op timestamptz NOT NULL DEFAULT now()
);
```

Je hoeft dus geen migratie te draaien. Draait je database in Docker op
`localhost`, dan slaat de app TLS automatisch over.

Heb je al aanvragen in `data/aanvragen.json` staan en wil je die meenemen?
Download eerst de CSV via `/beheer` — dat is de makkelijkste weg naar `COPY`.

## Deployen naar Vercel

1. Push deze repo naar GitHub.
2. Ga naar [vercel.com/new](https://vercel.com/new), importeer de repo. Vercel
   herkent Next.js zelf; er is niets in te stellen aan build-commando's.
3. Voeg een Postgres toe — **Storage → Create Database → Postgres** — of plak de
   `DATABASE_URL` van Neon of Supabase erin.
4. Zet onder **Settings → Environment Variables** minimaal:
   - `BEHEER_WACHTWOORD` — verzin iets langs
   - `DATABASE_URL` (of laat de Vercel-integratie `POSTGRES_URL` zetten)
   - `NEXT_PUBLIC_SITE_URL` — bijv. `https://ikzieikzie.nl`
   - `NEXT_PUBLIC_CONTACT_MAIL` — het adres dat in de footer moet staan
5. Deploy. Klaar.

Vergeet `DATABASE_URL` niet: zonder die variabele start de site wel, maar
verdwijnen aanvragen bij elke deploy. De server logt daar een waarschuwing over.

## De bevestigingsmail (optioneel)

Standaard wordt er **geen** mail verstuurd — de aanvraag wordt alleen opgeslagen
en je ziet 'm op `/beheer`. Wil je wel bevestigen, dan zit er een implementatie
klaar voor [Resend](https://resend.com):

1. Maak een account, verifieer je domein en maak een API-key aan.
2. Zet `RESEND_API_KEY` en `MAIL_AFZENDER` (dat adres moet op het geverifieerde
   domein zitten). Optioneel `MAIL_KOPIE_NAAR` voor een seintje aan jezelf.
3. Klaar — de volgende aanvraag krijgt een bevestiging.

Andere provider (Postmark, SendGrid, eigen SMTP)? Vervang alleen de functie
`verstuur()` in `lib/mail.ts`; de rest kan blijven staan.

Mislukt het versturen, dan wordt dat gelogd maar loopt de aanvraag niet stuk.
Een opgeslagen aanvraag mag nooit sneuvelen op een mailserver.

## Het beheeroverzicht

`/beheer` vraagt om `BEHEER_WACHTWOORD`. Bij een juiste invoer krijg je een
`httpOnly`-cookie die 8 uur geldig is: een vervaltijd plus een HMAC daarover,
ondertekend met het wachtwoord zelf. Het wachtwoord staat dus niet in de cookie
en een geknutselde cookie komt er niet doorheen. Wachtwoorden vergelijken we met
`timingSafeEqual`.

Zonder `BEHEER_WACHTWOORD` blijft de pagina dicht en krijg je een uitleg te zien.

De **Download CSV**-knop levert een puntkomma-gescheiden bestand met BOM, zodat
het in een Nederlandse Excel meteen goed opent. Cellen die met `=`, `+`, `-` of
`@` beginnen krijgen een apostrof, zodat Excel ze niet als formule uitvoert.

## Scripts

```bash
npm run dev     # ontwikkelserver
npm run build   # productiebuild
npm run start   # productiebuild draaien
npm run lint    # ESLint
```

## Structuur

```
app/
  page.tsx                    landingspagina
  layout.tsx                  fonts, SEO-metadata
  globals.css                 kleuren, kraft-textuur, typografie
  opengraph-image.tsx         social-preview (gegenereerd, geen bestand)
  aanvragen/
    page.tsx                  aanvraagpagina
    AanvraagFormulier.tsx     formulier (client)
    actions.ts                server action: valideren, opslaan, mailen
  beheer/
    page.tsx                  login of overzicht
    LoginFormulier.tsx
    actions.ts                in- en uitloggen
    export/route.ts           CSV-download
components/
  Kaartendoos.tsx             voor- en achterkant van de doos in SVG
  Merk.tsx                    woordmerk + ondertekst, header, footer
lib/
  schema.ts                   zod-schema, gedeeld door client en server
  store/                      json- en postgres-driver achter één interface
  csv.ts                      CSV-export
  mail.ts                     optionele bevestigingsmail
  beheer-auth.ts              wachtwoord en sessiecookie
```

## Kleuren

| Naam        | Hex       | Waar                                    |
| ----------- | --------- | --------------------------------------- |
| Diep paars  | `#3B1E4A` | tekst, titels, niveau 3                 |
| Medium paars| `#8B5FBF` | links, knoppen, niveau 2                |
| Licht lila  | `#C9A8E0` | niveau 1, zachte vlakken                |
| Goud        | `#C9A227` | lijnen, cijfers, accenten — spaarzaam   |
| Crème       | `#F5F0E4` | achtergrond                             |
| Kraft       | `#EFE3CC` | secties, kaders                         |

Koppen staan in Fraunces, bodytekst in Nunito Sans; beide via `next/font`, dus ze
worden mee gebundeld en er gaat geen verzoek naar Google bij het laden.
