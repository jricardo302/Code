import type { Metadata, Viewport } from "next";
import { Fraunces, Nunito_Sans } from "next/font/google";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
  display: "swap",
  axes: ["SOFT", "WONK", "opsz"],
});

const nunito = Nunito_Sans({
  variable: "--font-nunito",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Ik zie ik zie… — het intervisiespel voor de jeugdzorg",
    template: "%s · Ik zie ik zie…",
  },
  description:
    "Ik zie ik zie… is het intervisiespel voor behandelaren en begeleiders in de jeugdzorg. Een gesprekskaartspel met 100 vragen en drie niveaus, van luchtige ijsbreker tot echte reflectie. Bruikbaar voor je verplichte intervisie en je SKJ-herregistratie.",
  keywords: [
    "gesprekskaartspel jeugdzorg",
    "intervisiespel",
    "intervisie jeugdzorg",
    "intervisie kaartspel",
    "SKJ herregistratie intervisie",
    "reflectie behandelaren",
    "gespreksstarters begeleiders",
    "casuïstiekbespreking",
  ],
  authors: [{ name: "Ik zie ik zie…" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: SITE_URL,
    siteName: "Ik zie ik zie…",
    title: "Ik zie ik zie… — het kaartspel voor wie ándere mensen begeleidt",
    description:
      "100 vragen, drie niveaus. Het intervisiespel dat intervisie in de jeugdzorg weer een gesprek maakt in plaats van een verplicht nummer.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ik zie ik zie… — het kaartspel voor wie ándere mensen begeleidt",
    description:
      "100 vragen, drie niveaus. Het intervisiespel voor de jeugdzorg.",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#3B1E4A",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="nl"
      className={`${fraunces.variable} ${nunito.variable} h-full antialiased`}
    >
      <body className="relative flex min-h-full flex-col">
        <div className="relative z-10 flex min-h-full flex-1 flex-col">
          {children}
        </div>
      </body>
    </html>
  );
}
