import type { Metadata } from "next";
import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink } from "@/components/ui";
import { ARTIKELEN } from "@/content/artikelen";
import { CONTACT_MAIL } from "@/lib/site";

export const metadata: Metadata = {
  title: "Artikelen over intervisie en reflectie",
  description:
    "Praktische artikelen over intervisie, reflectie en casuïstiekbespreking in jeugdhulp, jeugd-GGZ en GGZ. Met concrete vragen die je meteen kunt gebruiken.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Artikelen over intervisie en reflectie",
    description:
      "Praktische artikelen over intervisie en reflectie in jeugdhulp en GGZ.",
    url: "/blog",
  },
};

const datumOpmaak = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default function BlogPagina() {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <div className="mx-auto max-w-4xl">
          <header className="mb-12 max-w-2xl">
            <Kopje>Artikelen</Kopje>
            <h1 className="mt-4 text-4xl sm:text-5xl">
              Over intervisie, reflectie en{" "}
              <span className="merk-streep">goede vragen</span>
            </h1>
            <p className="mt-6 text-base leading-relaxed text-inkt/80 tekst-mooi sm:text-lg">
              Geen theoriestukken. Wel dingen die je maandagochtend kunt
              gebruiken.
            </p>
          </header>

          <ul className="space-y-3">
            {ARTIKELEN.map((artikel) => (
              <li key={artikel.slug}>
                <Link
                  href={`/blog/${artikel.slug}`}
                  className="group block rounded-3xl border border-paars-diep/12 bg-kraft/50 p-6 transition-colors hover:border-paars/45 hover:bg-lila-bleek/50 sm:p-8"
                >
                  <p className="font-merk text-[0.68rem] font-black tracking-[0.16em] text-paars uppercase">
                    {artikel.onderwerp}
                  </p>
                  <h2 className="mt-3 text-2xl transition-colors group-hover:text-paars">
                    {artikel.titel}
                  </h2>
                  <p className="mt-3 text-base leading-relaxed text-inkt/75 tekst-mooi">
                    {artikel.beschrijving}
                  </p>
                  <p className="mt-4 text-sm text-inkt/55">
                    <time dateTime={artikel.datum}>
                      {datumOpmaak.format(new Date(artikel.datum))}
                    </time>{" "}
                    · {artikel.leestijd} lezen
                  </p>
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-14 rounded-3xl border-2 border-paars-diep/15 bg-creme p-7 text-center sm:p-10">
            <h2 className="text-2xl sm:text-3xl">
              Honderd van deze vragen op kaart
            </h2>
            <p className="mx-auto mt-4 max-w-lg text-base leading-relaxed text-inkt/75 tekst-mooi">
              IK ZIE, IK ZIE… INTERVISIE is de volledige set: 100 vraagkaarten,
              3 niveaus, voor 2 tot 10 professionals.
            </p>
            <KnopLink href="/intervisie" className="mt-7">
              Bekijk het spel
            </KnopLink>
          </div>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
