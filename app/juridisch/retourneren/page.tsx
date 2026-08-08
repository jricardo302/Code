import type { Metadata } from "next";
import Link from "next/link";

import { Prozablok } from "@/components/ui";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Retourneren",
  description:
    "Herroepingsrecht bij IK ZIE, IK ZIE…: 14 dagen bedenktijd, hoe je herroept, wie welke kosten draagt en wanneer je je geld terugkrijgt.",
  alternates: { canonical: "/juridisch/retourneren" },
};

export default function RetournerenPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">Retourneren</h1>

      <Prozablok>
        <h2>Veertien dagen bedenktijd</h2>
        <p>
          Koop je als consument, dan mag je de overeenkomst binnen 14 dagen na
          ontvangst ontbinden, zonder opgaaf van reden. Die termijn begint op de
          dag nadat je het pakket hebt gekregen.
        </p>

        <h2>Hoe je herroept</h2>
        <ol>
          <li>
            Laat het ons binnen die 14 dagen weten via{" "}
            <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>. Eén zin
            volstaat; je hoeft geen reden op te geven. Je mag ook het Europese
            modelformulier voor herroeping gebruiken, maar dat hoeft niet.
          </li>
          <li>
            Stuur het spel binnen 14 dagen na je melding terug naar het adres dat
            we je in de bevestiging noemen.
          </li>
          <li>
            We betalen binnen 14 dagen na je melding het volledige aankoopbedrag
            terug, inclusief de standaardverzendkosten die je bij de bestelling
            hebt betaald. We mogen daarmee wachten tot we het pakket terug
            hebben of tot je hebt aangetoond dat je het verstuurd hebt.
          </li>
          <li>
            Terugbetalen doen we via dezelfde betaalmethode als waarmee je hebt
            betaald, tenzij je iets anders afspreekt. Er zitten geen kosten aan.
          </li>
        </ol>

        <h2>Wie betaalt wat</h2>
        <ul>
          <li>
            De <strong>retourkosten</strong> zijn voor jou, tenzij het product
            beschadigd of verkeerd was.
          </li>
          <li>
            Koos je bij de bestelling voor een duurdere verzendwijze dan de
            standaard, dan vergoeden we de standaardkosten.
          </li>
          <li>
            Is het product minder waard geworden doordat je er meer mee gedaan
            hebt dan nodig was om het te beoordelen, dan mogen we die
            waardevermindering verrekenen. Uitpakken, doorbladeren en de kaarten
            bekijken hoort bij beoordelen — daar rekenen we niets voor.
          </li>
        </ul>

        <h2>De herroepingsknop</h2>
        <p>
          Sinds 19 juni 2026 moet elke webshop een duidelijk zichtbare
          herroepingsfunctie aanbieden. Zolang de webshop nog niet open is
          plaatsen we die functie samen met de bestelbevestiging; tot die tijd
          herroep je per mail en gaat dat precies zo snel. Meld je het niet, dan
          zou je bedenktijd overigens niet verlopen maar oplopen — dat is in jouw
          voordeel, maar we regelen het liever gewoon goed.
        </p>

        <h2>Zakelijke bestellingen</h2>
        <p>
          Het wettelijk herroepingsrecht geldt voor consumenten, niet voor
          zakelijke afnemers. Bestel je op factuur via een offerte, dan maken we
          daar per geval een afspraak over — en die zetten we in de offerte.
        </p>

        <h2>Iets kapot of niet compleet?</h2>
        <p>
          Dat is geen retour maar een klacht, en daar geldt geen termijn van 14
          dagen voor. Zie{" "}
          <Link href="/juridisch/algemene-voorwaarden">
            de algemene voorwaarden
          </Link>{" "}
          en mail ons met een foto.
        </p>
      </Prozablok>
    </article>
  );
}
