import type { Metadata } from "next";

import { DoosPerspectief } from "@/components/Kaartendoos";
import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Sectie } from "@/components/ui";
import {
  HOOFDEDITIE,
  OFFERTE_DREMPEL,
  STAFFELS,
  euro,
  exclBtwCenten,
} from "@/lib/product";
import { CONTACT_MAIL, ZAKELIJK_MAIL } from "@/lib/site";

import { OfferteFormulier } from "./OfferteFormulier";

export const metadata: Metadata = {
  title: "Voor je hele team",
  description:
    "Intervisie voor je hele team: staffelkorting vanaf 5 spellen, offerte en levering op factuur vanaf 25. Voor jeugdhulporganisaties, GGZ-praktijken, wijkteams, gemeenten en opleidingen.",
  alternates: { canonical: "/teams" },
  openGraph: {
    title: "Intervisie voor je hele team",
    description:
      "Staffelkorting vanaf 5 spellen, offerte en levering op factuur vanaf 25.",
    url: "/teams",
  },
};

const voorWie = [
  "Jeugdhulporganisaties met meerdere teams",
  "GGZ-praktijken en vrijgevestigde psychologen",
  "Wijkteams en lokale jeugdteams",
  "Gecertificeerde instellingen en jeugdbescherming",
  "Gemeenten en samenwerkingsverbanden",
  "Hogescholen en opleidingsinstituten",
];

const watJeKrijgt = [
  {
    kop: "Eén factuur",
    tekst:
      "Levering op factuur met een betaaltermijn van 30 dagen. Inkoopordernummer op de factuur kan.",
  },
  {
    kop: "Eén of meerdere adressen",
    tekst:
      "In één keer naar het hoofdkantoor, of verdeeld over locaties. Je geeft de verdeling door, wij regelen de verzending.",
  },
  {
    kop: "Prijs op maat",
    tekst: `Vanaf ${OFFERTE_DREMPEL} spellen rekenen we een staffel door die verder gaat dan de webshopkorting.`,
  },
  {
    kop: "Advies over inzet",
    tekst:
      "Kort meedenken over hoe je het spel in je intervisiestructuur zet, zonder dat daar een trainingsofferte achteraan komt.",
  },
];

export default function TeamsPagina() {
  const btw = HOOFDEDITIE.btwTarief;

  return (
    <>
      <SiteHeader />

      <main id="inhoud">
        <section className="px-5 pt-14 pb-10 sm:pt-20">
          <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div>
              <Kopje>Voor organisaties</Kopje>
              <h1 className="mt-4 text-4xl sm:text-5xl">
                Intervisie voor je <span className="merk-streep">hele team</span>
              </h1>
              <p className="mt-6 max-w-xl text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
                Eén spel per intervisiegroep, of één per team. Vanaf 5 spellen
                loopt de prijs terug; vanaf {OFFERTE_DREMPEL} maken we een
                offerte met levering op factuur en, als je dat wilt, verdeling
                over meerdere locaties.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <KnopLink href="#offerte">Vraag een offerte aan</KnopLink>
                <KnopLink href="/intervisie#bestellen" variant="rand">
                  Direct bestellen tot {OFFERTE_DREMPEL - 1} stuks
                </KnopLink>
              </div>
            </div>
            <DoosPerspectief className="w-full" />
          </div>
        </section>

        {/* Prijzen */}
        <Sectie toon="kraft">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-4xl">Wat het kost</h2>
            <p className="mt-4 text-base leading-relaxed text-inkt/80 tekst-mooi">
              Alle bedragen per spel. Voor organisaties is het bedrag exclusief
              btw meestal het relevante getal, dus dat staat er los bij.
            </p>
          </div>

          <div className="mt-9 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <thead>
                <tr className="border-b-2 border-paars-diep/20">
                  <th className="py-3 pr-4 font-merk text-sm font-black tracking-wide text-paars-diep uppercase">
                    Aantal
                  </th>
                  <th className="py-3 pr-4 font-merk text-sm font-black tracking-wide text-paars-diep uppercase">
                    Per spel incl. btw
                  </th>
                  <th className="py-3 pr-4 font-merk text-sm font-black tracking-wide text-paars-diep uppercase">
                    Per spel excl. btw
                  </th>
                  <th className="py-3 font-merk text-sm font-black tracking-wide text-paars-diep uppercase">
                    Hoe
                  </th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {STAFFELS.map((staffel) => (
                  <tr
                    key={staffel.vanaf}
                    className="border-b border-paars-diep/10"
                  >
                    <td className="py-4 pr-4 font-semibold text-paars-diep">
                      {staffel.label}
                    </td>
                    <td className="py-4 pr-4 text-inkt/85">
                      {euro(staffel.prijsCenten)}
                    </td>
                    <td className="py-4 pr-4 text-inkt/85">
                      {euro(exclBtwCenten(staffel.prijsCenten, btw))}
                    </td>
                    <td className="py-4 text-inkt/70">In de webshop</td>
                  </tr>
                ))}
                <tr className="border-b border-paars-diep/10">
                  <td className="py-4 pr-4 font-semibold text-paars-diep">
                    Vanaf {OFFERTE_DREMPEL} spellen
                  </td>
                  <td className="py-4 pr-4 text-inkt/85" colSpan={2}>
                    Prijs op aanvraag
                  </td>
                  <td className="py-4 text-paars">
                    <a href="#offerte" className="underline underline-offset-2">
                      Offerte
                    </a>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <p className="mt-5 text-sm text-inkt/60">
            Btw-tarief 21%. Verzending binnen Nederland is gratis vanaf{" "}
            {euro(7500)}; bij offertes zit verzending in de prijs.
          </p>
        </Sectie>

        {/* Wat je krijgt */}
        <Sectie>
          <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
            <div>
              <Kopje>Zakelijk bestellen</Kopje>
              <h2 className="mt-4 text-3xl sm:text-4xl">
                Zonder inkoopgedoe
              </h2>
              <p className="mt-5 text-base leading-relaxed text-inkt/80 tekst-mooi">
                We zijn een klein merk, geen leverancier met een accountmanager.
                Dat scheelt jou een traject: je mailt wat je nodig hebt en je
                krijgt een offerte terug.
              </p>
              <p className="mt-4 text-base leading-relaxed text-inkt/80 tekst-mooi">
                Liever direct contact?{" "}
                <a
                  href={`mailto:${ZAKELIJK_MAIL}`}
                  className="font-semibold text-paars underline underline-offset-2"
                >
                  {ZAKELIJK_MAIL}
                </a>
              </p>
            </div>

            <dl className="grid gap-5 sm:grid-cols-2">
              {watJeKrijgt.map((item) => (
                <div
                  key={item.kop}
                  className="rounded-2xl border border-paars-diep/12 bg-kraft/50 p-6"
                >
                  <dt className="font-merk font-black text-paars-diep">
                    {item.kop}
                  </dt>
                  <dd className="mt-2 text-sm leading-relaxed text-inkt/75 tekst-mooi">
                    {item.tekst}
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </Sectie>

        {/* Voor wie */}
        <Sectie toon="donker">
          <div className="grid gap-10 lg:grid-cols-2">
            <div>
              <Kopje toon="licht">Voor wie</Kopje>
              <h2 className="mt-4 text-3xl text-creme sm:text-4xl">
                Wie er tot nu toe naar vraagt
              </h2>
              <p className="mt-5 text-base leading-relaxed text-creme/70 tekst-mooi">
                Sta je er niet tussen maar werk je wel met intervisiegroepen? Dan
                past het waarschijnlijk gewoon. Vraag het even.
              </p>
            </div>
            <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-1">
              {voorWie.map((groep) => (
                <li
                  key={groep}
                  className="rounded-2xl border border-creme/15 px-5 py-3.5 text-sm text-creme/85"
                >
                  {groep}
                </li>
              ))}
            </ul>
          </div>
        </Sectie>

        {/* Offerteformulier */}
        <Sectie id="offerte" toon="kraft">
          <div className="mx-auto max-w-3xl">
            <Kopje>Offerte</Kopje>
            <h2 className="mt-4 text-3xl sm:text-4xl">
              Vertel wat je nodig hebt
            </h2>
            <p className="mt-5 text-base leading-relaxed text-inkt/80 tekst-mooi">
              Je krijgt binnen twee werkdagen een offerte terug. Vrijblijvend, en
              er komt geen belletje achteraan.
            </p>

            <div className="mt-9">
              <OfferteFormulier contactMail={ZAKELIJK_MAIL} />
            </div>
          </div>
        </Sectie>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
