import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { KnopLink } from "@/components/ui";
import { CONTACT_MAIL } from "@/lib/site";

export default function NietGevonden() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="flex flex-1 items-center px-5 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p aria-hidden className="font-merk text-6xl font-black text-lila">
            404
          </p>
          <h1 className="mt-5 text-3xl sm:text-4xl">
            Deze kaart zit niet in de doos
          </h1>
          <p className="mt-4 leading-relaxed text-inkt/75 tekst-mooi">
            De pagina die je zoekt bestaat niet, of niet meer. De andere honderd
            liggen er nog wel.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <KnopLink href="/">Terug naar de homepage</KnopLink>
            <KnopLink href="/intervisie" variant="rand">
              Bekijk het spel
            </KnopLink>
          </div>
          <p className="mt-8 text-sm text-inkt/55">
            Denk je dat hier wél iets hoort te staan? Mail{" "}
            <Link
              href="/contact"
              className="font-semibold text-paars underline underline-offset-2"
            >
              via de contactpagina
            </Link>
            .
          </p>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
