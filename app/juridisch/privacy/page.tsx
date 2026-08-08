import type { Metadata } from "next";
import Link from "next/link";

import { Plaatshouder, Prozablok } from "@/components/ui";
import { BEDRIJF, CONTACT_MAIL, MERK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacyverklaring",
  description:
    "Welke persoonsgegevens IK ZIE, IK ZIE… verwerkt, waarom, hoe lang ze bewaard worden en welke rechten je hebt.",
  alternates: { canonical: "/juridisch/privacy" },
};

export default function PrivacyPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">Privacyverklaring</h1>
      <p className="mt-4 text-sm text-inkt/55">
        Versie 1.0 · laatst gewijzigd augustus 2026
      </p>

      <div className="mt-6 rounded-2xl border-2 border-paars/30 bg-lila-bleek/50 p-5 text-sm leading-relaxed text-inkt/80">
        <strong className="font-semibold text-paars-diep">Concept.</strong> Vul
        de bedrijfsgegevens in en laat deze verklaring nakijken voordat de site
        live gaat. De beschrijving van wat er technisch gebeurt klopt met de
        code; de juridische formulering is niet getoetst.
      </div>

      <Prozablok>
        <h2>Wie verwerkt je gegevens</h2>
        <p>
          Verwerkingsverantwoordelijke is{" "}
          {BEDRIJF.naam ?? (
            <Plaatshouder>bedrijfsnaam — nog invullen</Plaatshouder>
          )}
          , handelend onder de naam {MERK}, gevestigd te{" "}
          {BEDRIJF.adres ?? <Plaatshouder>adres — nog invullen</Plaatshouder>}.
          Vragen over privacy? Mail{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
        </p>

        <h2>Welke gegevens, waarvoor en op welke grondslag</h2>

        <h3>Bestellingen</h3>
        <p>
          Bij een bestelling verwerken we je naam, e-mailadres, factuur- en
          verzendadres en de details van je bestelling. Grondslag: uitvoering van
          de overeenkomst. De betaling zelf loopt via onze betaaldienstverlener;
          wij ontvangen of bewaren geen betaalkaartgegevens. Bewaartermijn: zeven
          jaar, omdat de Belastingdienst dat voor de administratie voorschrijft.
        </p>

        <h3>Wachtlijst</h3>
        <p>
          Meld je je aan voor de wachtlijst, dan bewaren we je naam,
          e-mailadres en — als je die invult — je organisatie, functie, het
          gewenste aantal en je opmerking. Grondslag: toestemming. We gebruiken
          die gegevens alleen om je te berichten over dit spel. Je aanmelding
          intrekken kan altijd door te mailen; dan verwijderen we je gegevens.
        </p>

        <h3>Offerteaanvragen en contactberichten</h3>
        <p>
          We bewaren wat je in het formulier invult, om je vraag te kunnen
          beantwoorden en een offerte te kunnen maken. Grondslag: uitvoering van
          of voorbereiding op een overeenkomst, dan wel gerechtvaardigd belang bij
          het afhandelen van je bericht. Bewaartermijn: twee jaar na het laatste
          contact, tenzij er een overeenkomst uit voortkomt.
        </p>

        <h3>Statistieken</h3>
        <p>
          Alleen als je daar op de site expliciet toestemming voor geeft, meten
          we bezoekcijfers. Geef je geen toestemming, of vraagt de site je er
          niets over, dan wordt er niets gemeten. Zie het{" "}
          <Link href="/juridisch/cookies">cookiebeleid</Link>.
        </p>

        <h2>Wat we níet doen</h2>
        <ul>
          <li>We verkopen je gegevens niet en verhuren ze niet.</li>
          <li>
            We gebruiken je gegevens niet voor advertentieprofielen of
            geautomatiseerde besluitvorming.
          </li>
          <li>
            We sturen je geen commerciële e-mail zonder dat je daar zelf om hebt
            gevraagd.
          </li>
          <li>
            We vragen nooit om cliëntgegevens en willen die ook niet ontvangen.
            Stuur ons geen casuïstiek die tot een persoon herleidbaar is.
          </li>
        </ul>

        <h2>Met wie we gegevens delen</h2>
        <p>
          Alleen met partijen die nodig zijn om de site en de webshop te laten
          werken, en alleen voor dat doel. Concreet gaat het om onze hostingpartij,
          onze databasepartij, onze betaaldienstverlener en — als die is
          ingesteld — de dienst die onze transactiemails verstuurt. Met elk van
          hen sluiten we een verwerkersovereenkomst. Verwerking vindt bij voorkeur
          binnen de EU plaats; waar dat niet zo is, gebeurt de doorgifte op basis
          van een geldig doorgiftemechanisme.
        </p>

        <h2>Beveiliging</h2>
        <p>
          De site draait volledig over https. Het beheeroverzicht is afgeschermd
          met een wachtwoord en een ondertekende sessiecookie. Inzendingen worden
          opgeslagen in een database die alleen vanaf de server bereikbaar is.
        </p>

        <h2>Je rechten</h2>
        <p>
          Je hebt recht op inzage, correctie, verwijdering, beperking, bezwaar en
          overdraagbaarheid van je gegevens, en je mag gegeven toestemming altijd
          intrekken. Mail{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a> en we regelen het
          binnen 30 dagen. Kom je er met ons niet uit, dan kun je een klacht
          indienen bij de Autoriteit Persoonsgegevens via{" "}
          <a href="https://autoriteitpersoonsgegevens.nl">
            autoriteitpersoonsgegevens.nl
          </a>
          .
        </p>
      </Prozablok>
    </article>
  );
}
