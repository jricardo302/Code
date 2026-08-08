# SEO-plan

## Uitgangspunt

Dit is een nichemarkt. Er zijn geen honderdduizenden zoekopdrachten per maand en
die hoeven er ook niet te zijn: een jeugdzorgwerker die zoekt op *intervisie
vragen* is precies de bezoeker die we willen, en er zijn er maar een paar
duizend nodig.

**Geen zoekvolumes in dit document.** De omgeving waarin dit is opgesteld had
geen toegang tot een keyword-tool en zoekvolumes uit het hoofd verzinnen is
erger dan ze weglaten. Draai de termen hieronder door de Google Keyword Planner
(gratis bij een Ads-account) vóór je budget verdeelt.

---

## 1. Zoektermen

### Kern — hier moeten we op ranken

| Term | Intentie | Waar |
| --- | --- | --- |
| intervisie kaartspel | koop | `/intervisie` |
| intervisie kaarten | koop | `/intervisie` |
| intervisie vragen | informatie → koop | `/blog/25-intervisievragen-jeugdhulp` |
| vragen voor intervisie | informatie | zelfde artikel |
| werkvorm intervisie | informatie | `/hoe-het-werkt` |
| intervisiemethode zorg | informatie | `/blog/hoe-organiseer-je-goede-intervisie` |

### Sector

| Term | Waar |
| --- | --- |
| intervisie jeugdzorg | `/blog/van-advies-geven-naar-reflecteren` |
| intervisie jeugdhulp | zelfde artikel |
| intervisie GGZ | `/veelgestelde-vragen`, `/intervisie` |
| team intervisie | `/teams` |

### Reflectie

| Term | Waar |
| --- | --- |
| reflectievragen zorg | `/blog/10-reflectievragen-vastgelopen-casus` |
| reflectievragen begeleiders | zelfde artikel |
| reflectievragen jeugdzorg | zelfde artikel |
| casuïstiek bespreken | `/blog/casuistiek-bespreken-zonder-privacy-te-schenden` |

### Long tail — makkelijkst te winnen, hoogste intentie

- goede vragen voor intervisie jeugdzorg
- intervisie werkvormen jeugdhulp
- reflectievragen vastgelopen casus
- casuïstiekbespreking anonimiseren
- gespreksstarters teamdag zorg
- intervisie spel professionals

### Waar we bewust níet op mikken

- `SKJ intervisie` en `SKJ herregistratie` — hoge intentie, maar dat is
  informatie die SKJ zelf hoort te geven. Erop ranken zou de suggestie wekken
  dat wij daarover gaan. De FAQ beantwoordt de vraag eerlijk en verwijst door.
- Alles met *cursus*, *training*, *accreditatie* of *punten*. Dat verkopen we
  niet.

---

## 2. Wat er technisch al staat

| | |
| --- | --- |
| Metadata per pagina | Ja, eigen `title` en `description` op elke route |
| Canonical | Ja, `alternates.canonical` op elke pagina |
| OpenGraph + Twitter | Ja, plus een gegenereerde OG-afbeelding (`app/opengraph-image.tsx`) |
| `sitemap.xml` | Ja, opgebouwd uit de echte routes, producten en artikelen |
| `robots.txt` | Ja; `/beheer`, `/bestellen` en `/api` uitgesloten |
| Structured data | `Organization` (layout), `Product` + `Offer` (home en product), `FAQPage` (FAQ), `Article` (artikelen) |
| Taal | `<html lang="nl">` |
| Koppenstructuur | Eén `h1` per pagina, gecontroleerd in de QA-run |
| Mobiel | Mobile-first, geen horizontale scroll (gecontroleerd op 390 px) |
| Snelheid | Geen afbeeldingen, geen animatiebibliotheek, geen UI-framework; fonts via `next/font` dus geen extern verzoek |

De FAQ-structured data wordt uit dezelfde lijst opgebouwd als de zichtbare
pagina (`lib/faq.ts`). Twee lijsten die uit elkaar lopen is precies het soort
fout dat Google wél ziet en jij niet.

---

## 3. Contentplan

### Al gepubliceerd (5 artikelen)

1. **25 goede intervisievragen voor jeugdhulpprofessionals** → *intervisie vragen*
2. **Hoe organiseer je een goede intervisie?** → *intervisie organiseren*
3. **Intervisie in de jeugdhulp: van advies geven naar reflecteren** → *intervisie jeugdhulp*
4. **10 reflectievragen voor een vastgelopen casus** → *reflectievragen zorg*
5. **Hoe bespreek je casuïstiek zonder cliëntprivacy te schenden?** → *casuïstiek bespreken*

Elk artikel verwijst naar `/intervisie` en naar minstens één ander artikel. Het
eerste artikel is bewust het langste en het meest concreet: dat is de pagina die
het meeste verkeer moet trekken en die het meest gedeeld wordt in
vakgroepen-appjes.

### Volgende ronde (in volgorde van prioriteit)

6. *Intervisie in de GGZ: wat werkt anders dan in de jeugdhulp* — opent de
   tweede doelgroep
7. *Vijf intervisiemethodes vergeleken* (incidentmethode, vijfstappen, roddel,
   Balint, socratisch) — hoge informatiewaarde, positioneert ons netjes als
   "hulpmiddel binnen een methode"
8. *Wat doe je als niemand een casus wil inbrengen?* — herkenbaar probleem,
   lage concurrentie
9. *Intervisie op de teamdag: drie werkvormen van een kwartier*
10. *Reflecteren op je eigen aandeel zonder dat het therapie wordt*

Eén artikel per maand is genoeg. Liever vijf goede dan twintig middelmatige —
in een nichemarkt met weinig volume wint diepgang het van frequentie.

---

## 4. Linkbuilding

Realistisch en zonder trucs:

- **Vakverenigingen en kennisplatforms.** NJi, beroepsverenigingen en regionale
  samenwerkingsverbanden hebben vaak een pagina met werkvormen of hulpmiddelen.
  Vraag of het spel daarin past. Geen betaalde plaatsing.
- **Opleidingen.** Docenten van hbo-opleidingen Social Work, Pedagogiek en
  toegepaste psychologie. Als een docent het in een module gebruikt, volgt de
  link vanzelf — en de studenten worden over vijf jaar de kopers.
- **LinkedIn.** Geen backlinkwaarde, wel de belangrijkste ontdekkingsroute voor
  deze doelgroep.
- **Vakbladen.** Een ingezonden artikel over intervisie die oppervlakkig blijft,
  met het spel in de auteursregel.

Wat we niet doen: gastblogs op linkfarms, gekochte links, en
directory-inschrijvingen. De doelgroep is te klein en te professioneel om daar
iets aan te hebben.

---

## 5. Meten

Zodra `NEXT_PUBLIC_GA_ID` gezet is verschijnt de toestemmingsbalk en meet GA4 na
een expliciete "ja". Zonder key wordt er niets geladen. Zie
`docs/juridisch-onderzoek.md`.

Verder in te richten:

- Google Search Console — property toevoegen, sitemap indienen
- Bing Webmaster Tools — kost vijf minuten, levert bij een niche soms
  verrassend veel op

Wat je wilt zien:

| Wat | Waarom |
| --- | --- |
| Vertoningen en klikken per zoekterm (Search Console) | Hier zie je of het contentplan werkt, niet in GA |
| Verkeer artikel → `/intervisie` | Als artikelen wel verkeer trekken maar niet doorleiden, is de CTA te zwak |
| Wachtlijstaanmeldingen per bron | Bepaalt of je 250 of 500 laat drukken |
| Offerteaanvragen | De meest waardevolle conversie |

---

## 6. Eerste 30 dagen na livegang

- [ ] Search Console koppelen en sitemap indienen
- [ ] Alle vijf artikelen laten indexeren (URL-inspectie)
- [ ] Zoekvolumes ophalen in Keyword Planner en dit document bijwerken
- [ ] Controleren of de OG-afbeelding goed rendert (LinkedIn Post Inspector)
- [ ] Structured data testen in de Rich Results Test
- [ ] Core Web Vitals meten met PageSpeed Insights op `/` en `/intervisie`
- [ ] Titel en beschrijving van `/intervisie` herschrijven op basis van de eerste
      CTR-cijfers
