import Link from "next/link";

import { EDITIE, MERK } from "@/lib/site";

/**
 * Het woordmerk. IK ZIE, IK ZIE… is het hoofdmerk en blijft in één gewicht
 * staan; de editienaam komt eronder, met VISIE als accent (interVISIE).
 *
 * De maten staan expliciet in de props en worden niet in em's afgeleid: een
 * editieregel die meegroeit met een 7xl-kop schreeuwt net zo hard als het
 * merk zelf, en dan is het geen ondertitel meer.
 */
export function Woordmerk({
  className = "text-xl",
  editieKlasse,
  gecentreerd = false,
  toonEditie = false,
  toon = "donker",
}: {
  className?: string;
  editieKlasse?: string;
  gecentreerd?: boolean;
  toonEditie?: boolean;
  /** `donker` = paarse letters op crème. `licht` = crème letters op paars. */
  toon?: "donker" | "licht";
}) {
  const merkKleur = toon === "licht" ? "text-creme" : "text-paars-diep";
  const accentKleur = toon === "licht" ? "text-lila" : "text-paars";

  return (
    <span
      className={`inline-flex flex-col ${gecentreerd ? "items-center" : "items-start"}`}
    >
      <span
        className={`font-merk font-black tracking-[-0.03em] ${merkKleur} ${className}`}
      >
        {MERK}
      </span>
      {toonEditie && (
        <span
          className={`font-merk font-black tracking-[0.14em] ${merkKleur} ${
            editieKlasse ?? "mt-1 text-[0.62rem]"
          }`}
        >
          inter<span className={accentKleur}>{EDITIE.slice(5)}</span>
        </span>
      )}
    </span>
  );
}

const navigatie = [
  { href: "/intervisie", label: "Het spel" },
  { href: "/hoe-het-werkt", label: "Hoe het werkt" },
  { href: "/teams", label: "Voor teams" },
  { href: "/veelgestelde-vragen", label: "Vragen" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-paars-diep/10 bg-creme/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-3">
        <Link href="/" className="shrink-0 leading-none">
          <Woordmerk className="text-base sm:text-lg" toonEditie />
          <span className="sr-only">— naar de homepage</span>
        </Link>

        <nav aria-label="Hoofdmenu" className="hidden lg:block">
          <ul className="flex items-center gap-7 text-sm font-semibold text-paars-diep/80">
            {navigatie.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="transition-colors hover:text-paars"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <Link
          href="/intervisie#bestellen"
          className="shrink-0 rounded-full bg-paars-diep px-5 py-2.5 text-sm font-bold whitespace-nowrap text-creme transition-colors hover:bg-paars-zacht"
        >
          Bestel het spel
        </Link>
      </div>
    </header>
  );
}

const footerKolommen = [
  {
    kop: "Het spel",
    links: [
      { href: "/intervisie", label: "IK ZIE, IK ZIE… INTERVISIE" },
      { href: "/hoe-het-werkt", label: "Hoe het werkt" },
      { href: "/spelregels", label: "Spelregels" },
      { href: "/veelgestelde-vragen", label: "Veelgestelde vragen" },
    ],
  },
  {
    kop: "Zakelijk",
    links: [
      { href: "/teams", label: "Voor je hele team" },
      { href: "/teams#offerte", label: "Offerte aanvragen" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    kop: "Lezen",
    links: [
      { href: "/blog", label: "Artikelen" },
      { href: "/over", label: "Over dit spel" },
      { href: "/wachtlijst", label: "Op de wachtlijst" },
    ],
  },
  {
    kop: "Voorwaarden",
    links: [
      { href: "/juridisch/algemene-voorwaarden", label: "Algemene voorwaarden" },
      { href: "/juridisch/privacy", label: "Privacyverklaring" },
      { href: "/juridisch/cookies", label: "Cookiebeleid" },
      { href: "/juridisch/verzending", label: "Verzending" },
      { href: "/juridisch/retourneren", label: "Retourneren" },
      { href: "/juridisch/disclaimer", label: "Disclaimer" },
    ],
  },
];

export function SiteFooter({ mail }: { mail: string }) {
  return (
    <footer className="op-donker mt-auto doos-verloop text-creme">
      <div className="mx-auto max-w-6xl px-5 py-14">
        <div className="grid gap-10 md:grid-cols-[1.3fr_repeat(4,1fr)]">
          <div>
            <Woordmerk className="text-lg" toonEditie toon="licht" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-creme/70 tekst-mooi">
              Honderd vragen voor professionals die de hele dag naar een ander
              kijken. Gemaakt voor jeugdhulp, jeugd-GGZ en GGZ.
            </p>
            <a
              href={`mailto:${mail}`}
              className="mt-5 inline-block text-sm font-bold text-lila underline decoration-lila/40 underline-offset-4 transition-colors hover:decoration-lila"
            >
              {mail}
            </a>
          </div>

          {footerKolommen.map((kolom) => (
            <div key={kolom.kop}>
              <h2 className="text-[0.7rem] font-black tracking-[0.16em] text-creme/50 uppercase">
                {kolom.kop}
              </h2>
              <ul className="mt-4 space-y-2.5 text-sm text-creme/80">
                {kolom.links.map((link) => (
                  <li key={link.href + link.label}>
                    <Link
                      href={link.href}
                      className="transition-colors hover:text-lila"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col gap-2 border-t border-creme/15 pt-6 text-xs text-creme/55 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {MERK} · ikzieikzie.eu
          </p>
          <p>
            Dit spel ondersteunt reflectie en intervisie. Het vervangt geen
            supervisie, diagnostiek, behandeling of veiligheidsprocedures.
          </p>
        </div>
      </div>
    </footer>
  );
}
