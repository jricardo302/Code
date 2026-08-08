import type { Metadata } from "next";
import Link from "next/link";

import { Prozablok } from "@/components/ui";
import { CONTACT_MAIL, MERK } from "@/lib/site";

export const metadata: Metadata = {
  title: "Disclaimer professioneel gebruik",
  description:
    "Wat IK ZIE, IK ZIE… wel en niet is: een hulpmiddel voor reflectie en intervisie, geen scholing, geen behandelmethode en geen vervanging van supervisie of veiligheidsprocedures.",
  alternates: { canonical: "/juridisch/disclaimer" },
};

export default function DisclaimerPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">
        Disclaimer professioneel gebruik
      </h1>

      <Prozablok>
        <h2>Wat dit product is</h2>
        <p>
          {MERK} is een set gespreksvragen op kaarten. Het is bedoeld als
          hulpmiddel om reflectie, intervisie en casuïstiekbespreking makkelijker
          op gang te brengen tussen professionals.
        </p>

        <h2>Wat het niet is</h2>
        <p>Het is uitdrukkelijk géén vervanging van:</p>
        <ul>
          <li>formele supervisie of leertherapie;</li>
          <li>diagnostiek of behandeling;</li>
          <li>klinische besluitvorming;</li>
          <li>
            veiligheidsprocedures, risicotaxatie of de Meldcode huiselijk geweld
            en kindermishandeling;
          </li>
          <li>de richtlijnen en protocollen van je eigen organisatie;</li>
          <li>je eigen professionele oordeel.</li>
        </ul>
        <p>
          Bestaat er zorg over de veiligheid van een kind, een cliënt of jezelf,
          dan gelden altijd de geldende protocollen — niet een kaart uit een
          doos.
        </p>

        <h2>Geen keurmerk, geen accreditatie, geen effectclaim</h2>
        <ul>
          <li>
            Dit product is <strong>niet SKJ-geaccrediteerd</strong>. Er is geen
            accreditatie voor aangevraagd of verleend.
          </li>
          <li>
            Het is <strong>geen erkende of geregistreerde methodiek</strong> en
            staat in geen enkele databank van interventies.
          </li>
          <li>
            De werking is <strong>niet in onderzoek aangetoond</strong>. We
            beweren niet dat het spel bewezen effectief is.
          </li>
          <li>
            Of jouw intervisie meetelt voor herregistratie bepaalt je
            beroepsregister, aan de hand van diens eigen eisen — bijvoorbeeld
            over groepsgrootte, structuur en het indienen van een leerverslag.
            Kijk voor de actuele voorwaarden bij je eigen register.
          </li>
        </ul>

        <h2>Privacy in de intervisie zelf</h2>
        <p>
          Bespreek casuïstiek uitsluitend geanonimiseerd. Deel geen namen,
          geboortedata, adressen of andere gegevens waarmee iemand herleidbaar
          is. De verwerkingsgrondslag en de geheimhoudingsplicht die voor jou
          gelden, gelden ook aan de intervisietafel. Zie ook onze{" "}
          <Link href="/juridisch/privacy">privacyverklaring</Link> — wij vragen
          nooit om cliëntgegevens en willen die ook niet ontvangen.
        </p>

        <h2>Zorg voor de deelnemers</h2>
        <p>
          De vragen op niveau 3 raken aan het eigen handelen van professionals.
          Dat kan iets losmaken. Niemand is verplicht te antwoorden, iedereen mag
          passen, en het spel is niet bedoeld om persoonlijke of privétrauma&apos;s
          uit te diepen. Merk je dat een gesprek daar toch naartoe gaat, stop dan
          en verwijs naar de juiste plek: een leidinggevende, een supervisor, de
          bedrijfsarts of professionele hulp.
        </p>

        <h2>Aansprakelijkheid</h2>
        <p>
          Het gebruik van dit spel en de gesprekken die eruit voortkomen zijn de
          verantwoordelijkheid van de gebruikers en hun organisatie. Vragen
          hierover? Mail{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
        </p>
      </Prozablok>
    </article>
  );
}
