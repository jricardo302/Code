import type { Metadata } from "next";
import Link from "next/link";

import { Prozablok } from "@/components/ui";
import { VERZENDING, euro } from "@/lib/product";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Verzending",
  description:
    "Verzendkosten en levertijden van IK ZIE, IK ZIE…: Nederland en België, gratis verzending vanaf een drempelbedrag, levering binnen twee tot vijf werkdagen.",
  alternates: { canonical: "/juridisch/verzending" },
};

export default function VerzendingPagina() {
  return (
    <article>
      <h1 className="text-4xl sm:text-5xl">Verzending</h1>

      <Prozablok>
        <h2>Waar we naartoe verzenden</h2>
        <p>
          Naar adressen in Nederland en België. Zit je elders in de EU? Mail{" "}
          <a href={`mailto:${CONTACT_MAIL}`}>{CONTACT_MAIL}</a>, dan zoeken we
          uit wat verzending naar jouw land kost.
        </p>

        <h2>Wat het kost</h2>
        <div className="overflow-x-auto">
          <table className="mt-2 w-full min-w-[26rem] border-collapse text-left text-sm">
            <thead>
              <tr className="border-b-2 border-paars-diep/20">
                <th className="py-3 pr-4 font-semibold text-paars-diep">Land</th>
                <th className="py-3 pr-4 font-semibold text-paars-diep">
                  Verzendkosten
                </th>
                <th className="py-3 font-semibold text-paars-diep">Gratis vanaf</th>
              </tr>
            </thead>
            <tbody>
              {[VERZENDING.nl, VERZENDING.be].map((regel) => (
                <tr key={regel.naam} className="border-b border-paars-diep/10">
                  <td className="py-3.5 pr-4">{regel.naam}</td>
                  <td className="py-3.5 pr-4">{euro(regel.kostenCenten)}</td>
                  <td className="py-3.5">{euro(regel.gratisVanafCenten)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p>
          De verzendkosten zie je in de checkout voordat je betaalt. Bij
          bestellingen op offerte zit de verzending in de offerteprijs.
        </p>

        <h2>Levertijd</h2>
        <p>
          Zodra er voorraad is verzenden we binnen twee werkdagen na ontvangst
          van de betaling. Bezorging duurt daarna doorgaans twee tot vijf
          werkdagen.
        </p>
        <p>
          <strong className="font-semibold text-paars-diep">
            Zolang de eerste oplage nog in productie is
          </strong>{" "}
          geldt dat niet: dan krijg je eerst per mail bericht met de verwachte
          leverdatum, en verzenden we pas als de dozen er zijn. Kunnen we niet
          binnen 30 dagen leveren, dan mag je de bestelling kosteloos ontbinden en
          betalen we binnen 14 dagen terug.
        </p>

        <h2>Beschadigd aangekomen?</h2>
        <p>
          Meld het binnen een redelijke termijn na ontvangst met een foto erbij.
          We sturen een nieuw exemplaar of betalen terug — dat kies je zelf. De
          kosten daarvan zijn voor ons.
        </p>

        <h2>Iets anders geregeld willen hebben?</h2>
        <p>
          Verdeling over meerdere locaties, levering vóór een specifieke teamdag,
          of afhalen: vraag het gewoon. Zie ook{" "}
          <Link href="/teams">zakelijk bestellen</Link>.
        </p>
      </Prozablok>
    </article>
  );
}
