import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { CONTACT_MAIL } from "@/lib/site";

export default function NietGevonden() {
  return (
    <>
      <SiteHeader />

      <main className="flex flex-1 items-center px-5 py-24">
        <div className="mx-auto max-w-lg text-center">
          <p aria-hidden className="font-serif text-6xl font-bold text-goud">
            404
          </p>
          <h1 className="mt-5 font-serif text-3xl tracking-tight sm:text-4xl">
            Deze kaart zit niet in de doos
          </h1>
          <p className="mt-4 leading-relaxed text-paars-diep/75">
            De pagina die je zoekt bestaat niet (meer). Geen ramp — de andere
            honderd liggen er nog wel.
          </p>
          <Link
            href="/"
            className="mt-8 inline-block rounded-full bg-paars-diep px-7 py-3 font-semibold text-creme transition-colors hover:bg-paars"
          >
            Terug naar de homepage
          </Link>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
