import type { Metadata, Viewport } from "next";
import { Figtree } from "next/font/google";

import { Cookiebanner } from "@/components/Cookiebanner";
import { MERK, PRODUCT_NAAM, SITE_URL, TAGLINE } from "@/lib/site";
import "./globals.css";

/**
 * Typografie.
 *
 * Het merk vraagt om Mont Heavy. Dat lettertype zit niet in deze repository
 * en mocht er ook niet zomaar in: het bestand `Mont-HeavyDEMO.otf` is een
 * demo van Fontfabric en de licentie daarvan moet je zelf nalezen vóór je
 * 'm commercieel gebruikt. Zie design/typografie.md.
 *
 * Tot die tijd draait de site op Figtree Black — een geometrische sans onder
 * de SIL Open Font License, met dezelfde zware, moderne uitstraling. Wisselen
 * kost één bestand: zie design/typografie.md voor de exacte stappen.
 */
const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700", "900"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${MERK} — intervisiekaartspel voor jeugdhulp en GGZ`,
    template: `%s · ${MERK}`,
  },
  description:
    "IK ZIE, IK ZIE… INTERVISIE is een intervisiekaartspel voor professionals in jeugdhulp, jeugd-GGZ en GGZ. 100 vraagkaarten in drie niveaus, van luchtige opening tot echte zelfreflectie. Voor 2 tot 10 professionals.",
  applicationName: MERK,
  keywords: [
    "intervisie kaartspel",
    "intervisie vragen",
    "intervisie jeugdhulp",
    "intervisie jeugdzorg",
    "intervisie GGZ",
    "reflectievragen zorg",
    "casuïstiek bespreken",
    "werkvorm intervisie",
    "team intervisie",
    "intervisiemethode zorg",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: MERK,
    title: `${PRODUCT_NAAM} — ${TAGLINE}`,
    description:
      "100 vraagkaarten, 3 niveaus. Het intervisiekaartspel voor professionals in jeugdhulp, jeugd-GGZ en GGZ.",
  },
  twitter: {
    card: "summary_large_image",
    title: `${PRODUCT_NAAM} — ${TAGLINE}`,
    description:
      "100 vraagkaarten, 3 niveaus. Voor intervisie in jeugdhulp, jeugd-GGZ en GGZ.",
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false, address: false, email: false },
};

export const viewport: Viewport = {
  themeColor: "#3B1E4A",
  colorScheme: "light",
};

const organisatieSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: MERK,
  url: SITE_URL,
  description:
    "Uitgever van IK ZIE, IK ZIE… — intervisiekaartspellen voor professionals in jeugdhulp, jeugd-GGZ en GGZ.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="nl" className={`${figtree.variable} h-full antialiased`}>
      <body className="relative flex min-h-full flex-col">
        <a
          href="#inhoud"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-paars-diep focus:px-5 focus:py-2.5 focus:font-bold focus:text-creme"
        >
          Naar de inhoud
        </a>
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
        <Cookiebanner />
        <script
          type="application/ld+json"
          // Vaste, door onszelf opgebouwde JSON — geen invoer van buiten.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organisatieSchema) }}
        />
      </body>
    </html>
  );
}
