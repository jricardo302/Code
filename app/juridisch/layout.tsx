import Link from "next/link";

import { SiteFooter, SiteHeader } from "@/components/Merk";
import { CONTACT_MAIL } from "@/lib/site";

const paginas = [
  { href: "/juridisch/algemene-voorwaarden", label: "Algemene voorwaarden" },
  { href: "/juridisch/privacy", label: "Privacyverklaring" },
  { href: "/juridisch/cookies", label: "Cookiebeleid" },
  { href: "/juridisch/verzending", label: "Verzending" },
  { href: "/juridisch/retourneren", label: "Retourneren" },
  { href: "/juridisch/disclaimer", label: "Disclaimer" },
] as const;

export default function JuridischLayout({ children }: LayoutProps<"/juridisch">) {
  return (
    <>
      <SiteHeader />

      <main id="inhoud" className="px-5 py-14 sm:py-20">
        <div className="mx-auto grid max-w-5xl gap-12 lg:grid-cols-[14rem_1fr]">
          <nav
            aria-label="Juridische pagina's"
            className="lg:sticky lg:top-24 lg:self-start"
          >
            <h2 className="font-merk text-[0.68rem] font-black tracking-[0.18em] text-paars uppercase">
              Voorwaarden
            </h2>
            <ul className="mt-4 space-y-2 text-sm">
              {paginas.map((pagina) => (
                <li key={pagina.href}>
                  <Link
                    href={pagina.href}
                    className="text-inkt/75 transition-colors hover:text-paars"
                  >
                    {pagina.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="min-w-0">{children}</div>
        </div>
      </main>

      <SiteFooter mail={CONTACT_MAIL} />
    </>
  );
}
