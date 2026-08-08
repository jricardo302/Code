import type { Metadata } from "next";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje } from "@/components/ui";
import { CONTACT_MAIL, PRODUCT_NAAM } from "@/lib/site";

import { WachtlijstFormulier } from "./WachtlijstFormulier";

export const metadata: Metadata = {
  title: "Op de wachtlijst",
  description:
    "Zet jezelf op de wachtlijst voor IK ZIE, IK ZIE… INTERVISIE. Je krijgt als eerste bericht zodra de eerste oplage klaarligt. Je betaalt nu niets.",
  alternates: { canonical: "/wachtlijst" },
  openGraph: {
    title: "Op de wachtlijst",
    description:
      "Als eerste bericht zodra de eerste oplage van IK ZIE, IK ZIE… INTERVISIE klaarligt.",
    url: "/wachtlijst",
  },
};

export default function WachtlijstPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-2xl">
          <header className="mb-10">
            <Kopje>Nog niet gedrukt</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Zet mij op de <span className="merk-streep">wachtlijst</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              {PRODUCT_NAAM} is nog in productie. Zeg hier hoeveel exemplaren je
              zou willen, dan leggen we ze voor je opzij. Je betaalt nu niets:
              zodra de dozen er zijn krijg je bericht met de leverdatum, en pas
              daarna bestel je.
            </p>
            <p className="mt-4 text-sm text-inkt/60">
              We gebruiken je gegevens alleen om je over dit spel te berichten.
              Niet voor advertenties, en we geven ze niet door.
            </p>
          </header>

          <WachtlijstFormulier contactMail={CONTACT_MAIL} />
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
