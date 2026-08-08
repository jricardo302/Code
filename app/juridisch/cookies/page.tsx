import type { Metadata } from "next";
import Link from "next/link";

import { Prozablok } from "@/components/ui";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Cookiebeleid",
  description:
    "Welke cookies ikzieikzie.eu gebruikt: standaard geen enkele, en statistiek alleen na jouw expliciete toestemming.",
  alternates: { canonical: "/juridisch/cookies" },
};

export default function CookiesPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">Cookiebeleid</h1>
      <p className="mt-4 text-sm text-inkt/55">
        Versie 1.0 · laatst gewijzigd augustus 2026
      </p>

      <Prozablok>
        <h2>Kort antwoord</h2>
        <p>
          Deze site zet uit zichzelf geen enkele cookie. Er wordt geen tracker
          geladen, geen advertentiescript en geen social-plug-in. Wil je de site
          gewoon lezen en iets bestellen, dan hoef je nergens toestemming voor te
          geven.
        </p>

        <h2>Wat we wél gebruiken</h2>

        <h3>Noodzakelijk (geen toestemming vereist)</h3>
        <ul>
          <li>
            <strong>Sessiecookie beheeroverzicht.</strong> Alleen voor ons als we
            inloggen op het besloten deel van de site. Bezoekers krijgen deze
            cookie nooit.
          </li>
          <li>
            <strong>Betaalpagina.</strong> Reken je af, dan ga je naar de
            omgeving van onze betaaldienstverlener. Die zet daar eigen
            noodzakelijke cookies om de betaling en fraudedetectie te laten
            werken. Dat gebeurt op hun domein en valt onder hun beleid.
          </li>
          <li>
            <strong>Lokale opslag van je cookiekeuze.</strong> Kies je iets in de
            toestemmingsbalk, dan onthouden we die keuze in je browser zodat we
            het niet elk bezoek opnieuw vragen. Dat is geen cookie en gaat niet
            naar onze server.
          </li>
        </ul>

        <h3>Statistiek (alleen na jouw toestemming)</h3>
        <p>
          Als we bezoekstatistieken meten, vragen we je daar eerst om via een
          balk onderaan het scherm. Pas als je daar &quot;prima&quot; kiest, wordt
          het meetscript geladen en worden er analytische cookies geplaatst. Zeg
          je nee, of doe je niets, dan gebeurt er niets — en werkt de site
          precies hetzelfde. Zolang de meetdienst niet is geconfigureerd,
          verschijnt die balk helemaal niet.
        </p>
        <p>
          We doen dit zo omdat impliciete toestemming — &quot;door verder te
          surfen gaat u akkoord&quot; — geen geldige toestemming is. Je moet een
          actieve keuze maken, en weigeren moet net zo makkelijk zijn als
          accepteren. Daarom staan beide knoppen er even groot bij.
        </p>

        <h2>Je keuze wijzigen</h2>
        <p>
          Wis de gegevens van deze site in je browser (bij de meeste browsers via
          de instellingen voor privacy en beveiliging). Bij je volgende bezoek
          krijg je de vraag opnieuw.
        </p>

        <h2>Meer weten</h2>
        <p>
          Wat we met je gegevens doen staat in de{" "}
          <Link href="/juridisch/privacy">privacyverklaring</Link>. Vragen? Mail{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>.
        </p>
      </Prozablok>
    </article>
  );
}
