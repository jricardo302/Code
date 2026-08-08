# Juridisch onderzoek — webshop, privacy en tracking

## Verantwoording

Gedaan met websearch; de bronpagina's zelf konden in deze omgeving niet worden
geopend. **Dit is geen juridisch advies.** Laat de teksten op `/juridisch/*`
nakijken door een jurist voordat de webshop opengaat, en trek de punten
hieronder na bij de bron.

---

## 1. De herroepingsknop — dit is nieuw en het is nu al van kracht

Uit het onderzoek kwam één punt naar voren dat direct actie vraagt.

**Sinds 19 juni 2026** moet vrijwel elke webshop die op afstand aan consumenten
verkoopt een **duidelijk zichtbare en eenvoudig te gebruiken herroepingsfunctie**
aanbieden. Grondslag: EU-richtlijn 2023/2673, in Nederland artikel 6:230oa BW.

- Het herroepingsrecht zélf verandert niet: 14 dagen bedenktijd, dezelfde
  voorwaarden en uitzonderingen.
- Wat er bij komt is de **functie**: een knop of formulier waarmee de consument
  de herroeping kan doorgeven, zonder eerst een mailadres te moeten opzoeken.
- Informeer je consumenten hier niet over, dan kan de bedenktermijn oplopen tot
  maximaal twaalf maanden.
- De ACM kan hierop handhaven, met waarschuwingen of boetes.

**Status in dit project:** de webshop is nog niet open (`NEXT_PUBLIC_VERKOOP_OPEN`
staat uit), dus de verplichting speelt nu nog niet. De pagina
`/juridisch/retourneren` legt uit dat je per mail herroept en noemt de
verplichting expliciet.

**Actiepunt vóór de webshop opengaat:** bouw een echte herroepingsfunctie. De
eenvoudigste vorm die aan de eis voldoet: een formulier op `/herroepen` waar de
klant zijn ordernummer en mailadres invult, gekoppeld aan de bestaande
`maakVerwerker`-laag in `lib/formulier.ts` met een nieuwe soort `herroeping`.
Dat is ongeveer een uur werk en het staat op de launch checklist.

---

## 2. Cookies en toestemming

### Wat er geldt

- Analytische en tracking-cookies vallen onder artikel 11.7a Telecommunicatiewet
  en vereisen **voorafgaande toestemming**.
- Impliciete toestemming — "door verder te surfen gaat u akkoord" — is **geen
  geldige toestemming**.
- De Autoriteit Persoonsgegevens publiceerde een handleiding voor een
  privacyvriendelijke inrichting van Google Analytics. Bij een zorgvuldige
  configuratie zonder delen met Google of derden zou volgens de AP geen
  toestemming nodig zijn — maar dat hangt volledig af van die configuratie.
- De **ePrivacy-verordening** wordt eind 2026 verwacht en stelt strengere eisen
  aan toestemming, ook voor server-side analytics.

### Wat we doen

Toestemming vóór meten, in alle gevallen. Ook als de AP-lijn een uitzondering
zou toestaan: die uitzondering hangt aan een configuratie die je moet blijven
bewaken, en de ePrivacy-verordening komt eraan.

Concreet, in `components/Cookiebanner.tsx`:

- Zonder `NEXT_PUBLIC_GA_ID` verschijnt er **geen balk** en wordt er **niets
  geladen**. Dat is de huidige stand.
- Is de key wel gezet, dan verschijnt een balk onderaan met twee even grote
  knoppen. Weigeren is precies zo makkelijk als accepteren.
- Pas na een expliciete "ja" wordt het meetscript geladen. Bij "nee" of bij geen
  keuze gebeurt er niets.
- De keuze staat in `localStorage`, niet in een cookie, en gaat niet naar de
  server.
- De site zet uit zichzelf verder geen enkele cookie. De enige andere cookie is
  de sessiecookie van `/beheer`, die bezoekers nooit krijgen.

**Actiepunt vóór livegang van analytics:** GA4 privacyvriendelijk inrichten
(IP-anonimisering staat al aan in de code; zet ook de bewaartermijn zo kort
mogelijk en schakel Google-signalen en advertentiepersonalisatie uit), en een
verwerkersovereenkomst met Google regelen.

---

## 3. Verplichte informatie op de site

Wat een Nederlandse webshop moet tonen:

| Verplicht | Waar het staat | Status |
| --- | --- | --- |
| Bedrijfsnaam en rechtsvorm | `/contact`, `/juridisch/algemene-voorwaarden` | **plaatshouder — invullen** |
| Vestigingsadres | idem | **plaatshouder — invullen** |
| KvK-nummer | idem | **plaatshouder — invullen** |
| Btw-identificatienummer | idem | **plaatshouder — invullen** |
| Contactgegevens (e-mail) | footer, `/contact` | ✔ |
| Prijzen inclusief btw | productpagina, teams | ✔ |
| Verzendkosten vóór bestelling | `/juridisch/verzending` + in de checkout | ✔ |
| Levertijd | `/juridisch/verzending` | ✔ |
| Herroepingsrecht en -termijn | `/juridisch/retourneren` | ✔ |
| Modelformulier herroeping | genoemd, formulier zelf nog niet | **openstaand** |
| Herroepingsfunctie (knop) | — | **openstaand, zie §1** |
| Algemene voorwaarden vóór aankoop beschikbaar | `/juridisch/algemene-voorwaarden`, in de footer | ✔ |
| Klachtenprocedure en ODR-verwijzing | `/juridisch/algemene-voorwaarden` art. 12 | ✔ |
| Privacyverklaring | `/juridisch/privacy` | ✔ |
| Cookiebeleid | `/juridisch/cookies` | ✔ |

De bedrijfsgegevens zijn in de code opzettelijk `null` zolang ze niet bekend
zijn, en worden dan als zichtbare plaatshouder getoond. Er staat nergens een
verzonnen KvK- of btw-nummer. Zie `lib/site.ts` en `.env.example`.

---

## 4. Privacy en de aard van dit product

Dit product wordt gebruikt bij het bespreken van cliëntcasuïstiek. Dat legt een
extra verantwoordelijkheid op die verder gaat dan de webshop.

Wat er is gedaan:

- **Wij vragen nooit om cliëntgegevens** en willen ze niet ontvangen. Dat staat
  expliciet in de privacyverklaring en in de disclaimer.
- De veiligheidskaart in de doos maakt anonimiseren tot spelregel.
- Geen enkele van de honderd vragen vraagt om herleidbare gegevens; dat is
  bewust zo geschreven en het is een van de criteria in `docs/research-intervisie.md`.
- Er staat een artikel op de site over anonimiseren in casuïstiekbespreking, met
  een expliciete disclaimer dat het organisatiebeleid voorgaat.

Wat we niet doen: beweren dat het gebruik van dit spel AVG-conform is. Dat hangt
af van wat de gebruikers zeggen, niet van wat wij drukken.

---

## 5. Claims die we niet maken

Dit hoort in het juridische dossier omdat onterechte claims onder oneerlijke
handelspraktijken vallen.

| Niet beweren | Waarom |
| --- | --- |
| SKJ-geaccrediteerd | Er is geen accreditatie aangevraagd of verleend |
| Bewezen effectief | Er is geen effectonderzoek gedaan |
| Erkende methodiek | Staat in geen enkele interventiedatabank |
| Telt mee voor herregistratie | Dat bepaalt het register, niet wij |
| Ontwikkeld door experts / in samenwerking met X | Zolang dat niet zo is |
| Reviews, sterren, klantaantallen | Er zijn er nog geen |
| Schaarste, timers, "bijna uitverkocht" | Onwaar en bij de ACM een bekend handhavingsonderwerp |

De site controleert dit ook technisch: de reviewsectie op de homepage is een
lege, zichtbaar gemarkeerde plaatshouder in plaats van verzonnen testimonials.

---

## 6. Openstaande punten

- [ ] **Herroepingsfunctie bouwen** vóór de webshop opengaat (§1) — hard vereist
- [ ] Modelformulier herroeping als downloadbare tekst toevoegen
- [ ] Bedrijfsgegevens invullen via omgevingsvariabelen
- [ ] Algemene voorwaarden, privacyverklaring en disclaimer door een jurist laten
      nakijken
- [ ] Verwerkersovereenkomsten: hosting, database, betaaldienst, maildienst
- [ ] Btw-tarief 21% laten bevestigen door de boekhouder
- [ ] Merkonderzoek BOIP/EUIPO — zie `docs/pricing-model.md` §5
- [ ] Bij aansluiting op een keurmerk (Thuiswinkel, WebwinkelKeur): hun
      voorwaardenset overnemen
