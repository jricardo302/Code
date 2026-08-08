import type { Metadata } from "next";
import Link from "next/link";

import { Plaatshouder, Prozablok } from "@/components/ui";
import { HOOFDEDITIE, OFFERTE_DREMPEL, euro } from "@/lib/product";
import { BEDRIJF, CONTACT_MAIL, MERK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Algemene voorwaarden",
  description:
    "De algemene voorwaarden voor bestellingen in de webshop van IK ZIE, IK ZIE…: prijzen, betaling, levering, herroepingsrecht, garantie en klachten.",
  alternates: { canonical: "/juridisch/algemene-voorwaarden" },
};

/** Zichtbaar maken wat nog niet is ingevuld, in plaats van het te verzinnen. */
function Gegeven({ waarde, wat }: { waarde: string | null; wat: string }) {
  if (waarde) return <>{waarde}</>;
  return <Plaatshouder>{wat} — nog invullen</Plaatshouder>;
}

export default function VoorwaardenPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">Algemene voorwaarden</h1>
      <p className="mt-4 text-sm text-inkt/55">
        Versie 1.0 · laatst gewijzigd augustus 2026
      </p>

      <div className="mt-6 rounded-2xl border-2 border-paars/30 bg-lila-bleek/50 p-5 text-sm leading-relaxed text-inkt/80">
        <strong className="font-semibold text-paars-diep">
          Let op: dit is een concept.
        </strong>{" "}
        Deze voorwaarden zijn opgesteld naar de hoofdlijnen van het Nederlandse
        consumentenrecht, maar zijn niet juridisch getoetst. Laat ze nakijken
        door een jurist vóór de webshop opengaat, en vul de bedrijfsgegevens in.
      </div>

      <Prozablok>
        <h2>Artikel 1 — Wie wij zijn</h2>
        <p>
          Deze voorwaarden zijn van toepassing op alle bestellingen via
          ikzieikzie.eu. De verkoper is{" "}
          <Gegeven waarde={BEDRIJF.naam} wat="bedrijfsnaam" />, handelend onder
          de naam {MERK}, gevestigd te{" "}
          <Gegeven waarde={BEDRIJF.adres} wat="adres" />, ingeschreven bij de
          Kamer van Koophandel onder nummer{" "}
          <Gegeven waarde={BEDRIJF.kvk} wat="KvK-nummer" />, btw-identificatie&shy;nummer{" "}
          <Gegeven waarde={BEDRIJF.btw} wat="btw-nummer" />. Je bereikt ons via{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
        </p>

        <h2>Artikel 2 — Toepasselijkheid</h2>
        <p>
          Deze voorwaarden gelden voor elk aanbod en elke overeenkomst op afstand
          tussen ons en jou. Voordat je bestelt kun je de voorwaarden lezen en
          opslaan; ze zijn hier permanent beschikbaar. Wijken we in een offerte
          af van deze voorwaarden, dan gaat wat in die offerte staat voor.
        </p>

        <h2>Artikel 3 — Het aanbod</h2>
        <p>
          Alle aanbiedingen zijn vrijblijvend en gelden zolang de voorraad
          strekt. Productomschrijvingen zijn zo nauwkeurig mogelijk. Afbeeldingen
          op deze site zijn illustraties van het ontwerp; kleine afwijkingen in
          kleur of afwerking ten opzichte van het gedrukte product zijn mogelijk
          en geven geen recht op ontbinding buiten het herroepingsrecht om.
        </p>

        <h2>Artikel 4 — De overeenkomst</h2>
        <p>
          De overeenkomst komt tot stand op het moment dat je de bestelling
          afrondt en de betaling is geaccepteerd. Je ontvangt daarna langs
          elektronische weg een bevestiging.
        </p>

        <h2>Artikel 5 — Prijzen en betaling</h2>
        <ul>
          <li>
            Alle prijzen op de site zijn in euro&apos;s en inclusief 21% btw.
            Verzendkosten worden apart getoond vóór je afrekent.
          </li>
          <li>
            De prijs van {HOOFDEDITIE.naam} is{" "}
            {euro(HOOFDEDITIE.prijsCenten)} per exemplaar. Vanaf 5 en vanaf 10
            exemplaren geldt een staffelprijs.
          </li>
          <li>
            Betalen kan met iDEAL, creditcard, Apple Pay en Google Pay via onze
            betaaldienstverlener. Wij ontvangen of bewaren geen kaartgegevens.
          </li>
          <li>
            Bestellingen vanaf {OFFERTE_DREMPEL} exemplaren lopen via een
            offerte. Daarbij is betaling op factuur mogelijk met een
            betaaltermijn van 30 dagen na factuurdatum.
          </li>
          <li>
            Kennelijke vergissingen of typefouten in de prijs binden ons niet.
          </li>
        </ul>

        <h2>Artikel 6 — Levering</h2>
        <p>
          We leveren aan adressen in Nederland en België. Zodra er voorraad is
          verzenden we binnen twee werkdagen na ontvangst van de betaling; de
          bezorging duurt daarna doorgaans twee tot vijf werkdagen. Zolang de
          eerste oplage nog in productie is, informeren we je vóór verzending
          over de verwachte leverdatum.
        </p>
        <p>
          Kunnen we niet binnen 30 dagen leveren, dan laten we dat weten en mag
          je de overeenkomst kosteloos ontbinden. We betalen dan binnen 14 dagen
          terug. Zie verder{" "}
          <Link href="/juridisch/verzending">verzending</Link>.
        </p>

        <h2>Artikel 7 — Herroepingsrecht</h2>
        <p>
          Als consument mag je de overeenkomst binnen 14 dagen na ontvangst
          zonder opgaaf van reden ontbinden. Hoe dat werkt, welke termijnen
          gelden en hoe de terugbetaling loopt, staat op{" "}
          <Link href="/juridisch/retourneren">retourneren</Link>. Die pagina
          maakt onderdeel uit van deze voorwaarden.
        </p>
        <p>
          Zakelijke afnemers hebben geen wettelijk herroepingsrecht. Bij
          bestellingen op offerte maken we daar per geval afspraken over.
        </p>

        <h2>Artikel 8 — Conformiteit en garantie</h2>
        <p>
          Wat je krijgt moet doen wat je er redelijkerwijs van mag verwachten. Is
          een product beschadigd, incompleet of anders dan omschreven, meld dat
          dan binnen een redelijke termijn na ontdekking. We herstellen,
          vervangen of betalen terug. Je wettelijke rechten worden hierdoor niet
          beperkt.
        </p>

        <h2>Artikel 9 — Aansprakelijkheid en gebruik</h2>
        <p>
          {MERK} is een hulpmiddel dat reflectie en intervisie ondersteunt. Het
          is geen scholing, geen behandelmethode en geen vervanging van
          supervisie, diagnostiek, klinische besluitvorming, veiligheidsprocedures
          of de Meldcode. Zie de{" "}
          <Link href="/juridisch/disclaimer">disclaimer</Link>. Onze
          aansprakelijkheid is beperkt tot het factuurbedrag van de betreffende
          bestelling, behalve bij opzet of bewuste roekeloosheid.
        </p>

        <h2>Artikel 10 — Intellectueel eigendom</h2>
        <p>
          De vragen, teksten, vormgeving en het merk {MERK} zijn ons eigendom. Je
          mag het spel vrij gebruiken binnen je organisatie, inclusief in
          betaalde intervisie- en opleidingssituaties. Je mag de kaarten niet
          kopiëren, digitaliseren, verveelvoudigen of als eigen product
          verspreiden zonder onze schriftelijke toestemming.
        </p>

        <h2>Artikel 11 — Persoonsgegevens</h2>
        <p>
          We gaan met je gegevens om zoals beschreven in de{" "}
          <Link href="/juridisch/privacy">privacyverklaring</Link>.
        </p>

        <h2>Artikel 12 — Klachten en geschillen</h2>
        <p>
          Heb je een klacht, mail dan{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>. We reageren
          binnen 14 dagen inhoudelijk. Komen we er samen niet uit, dan kun je je
          geschil voorleggen via het Europese ODR-platform op{" "}
          <a href="https://ec.europa.eu/consumers/odr">
            ec.europa.eu/consumers/odr
          </a>
          . Op alle overeenkomsten is Nederlands recht van toepassing.
        </p>
      </Prozablok>
    </article>
  );
}
