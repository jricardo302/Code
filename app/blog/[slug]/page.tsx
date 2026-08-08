import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { Kopje, KnopLink, Prozablok } from "@/components/ui";
import { ARTIKELEN, artikelBijSlug } from "@/content/artikelen";
import { CONTACT_MAIL, MERK, SITE_URL } from "@/lib/site";

/** Alle artikelen zijn bekend bij de build, dus prerenderen we ze allemaal. */
export function generateStaticParams() {
  return ARTIKELEN.map((artikel) => ({ slug: artikel.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const artikel = artikelBijSlug(slug);
  if (!artikel) return {};

  return {
    title: artikel.metaTitel,
    description: artikel.beschrijving,
    alternates: { canonical: `/blog/${artikel.slug}` },
    openGraph: {
      type: "article",
      title: artikel.metaTitel,
      description: artikel.beschrijving,
      url: `/blog/${artikel.slug}`,
      publishedTime: artikel.datum,
    },
  };
}

const datumOpmaak = new Intl.DateTimeFormat("nl-NL", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

export default async function ArtikelPagina({
  params,
}: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const artikel = artikelBijSlug(slug);
  if (!artikel) notFound();

  const verder = ARTIKELEN.filter((ander) => ander.slug !== artikel.slug).slice(
    0,
    2,
  );

  const schema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: artikel.titel,
    description: artikel.beschrijving,
    datePublished: artikel.datum,
    dateModified: artikel.datum,
    inLanguage: "nl",
    author: { "@type": "Organization", name: MERK },
    publisher: { "@type": "Organization", name: MERK },
    mainEntityOfPage: `${SITE_URL}/blog/${artikel.slug}`,
  };

  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <article className="mx-auto max-w-2xl">
          <nav aria-label="Kruimelpad" className="text-sm text-inkt/55">
            <Link href="/blog" className="hover:text-paars">
              Artikelen
            </Link>{" "}
            / <span className="text-inkt/75">{artikel.onderwerp}</span>
          </nav>

          <header className="mt-5 mb-10">
            <h1 className="text-4xl sm:text-5xl">{artikel.titel}</h1>
            <p className="mt-5 text-base text-inkt/60">
              <time dateTime={artikel.datum}>
                {datumOpmaak.format(new Date(artikel.datum))}
              </time>{" "}
              · {artikel.leestijd} lezen
            </p>
          </header>

          <Prozablok>{artikel.inhoud()}</Prozablok>
        </article>

        <aside className="mx-auto mt-16 max-w-2xl">
          <div className="rounded-3xl border-2 border-paars-diep/15 bg-kraft/60 p-7 sm:p-9">
            <Kopje>Het spel</Kopje>
            <h2 className="mt-3 text-2xl">Honderd vragen, drie niveaus</h2>
            <p className="mt-3 text-base leading-relaxed text-inkt/80 tekst-mooi">
              IK ZIE, IK ZIE… INTERVISIE is een kaartspel voor professionals in
              jeugdhulp, jeugd-GGZ en GGZ. Voor 2 tot 10 personen.
            </p>
            <KnopLink href="/intervisie" className="mt-6">
              Bekijk het spel
            </KnopLink>
          </div>

          {verder.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl">Verder lezen</h2>
              <ul className="mt-5 space-y-3">
                {verder.map((ander) => (
                  <li key={ander.slug}>
                    <Link
                      href={`/blog/${ander.slug}`}
                      className="block rounded-2xl border border-paars-diep/12 p-5 transition-colors hover:border-paars/45 hover:bg-lila-bleek/40"
                    >
                      <p className="font-merk font-black text-paars-diep">
                        {ander.titel}
                      </p>
                      <p className="mt-1.5 text-sm text-inkt/70">
                        {ander.beschrijving}
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </aside>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </>
  );
}
