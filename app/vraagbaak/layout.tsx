import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import { redirect } from "next/navigation";

import { Footer, Header } from "@/components/vraagbaak/Schil";
import { huidigeGebruiker } from "@/lib/vraagbaak/toegang";

/**
 * Mont is het huisstijl-lettertype maar commercieel; Montserrat is de vrije
 * terugval die er vrijwel identiek uitziet. De stack in `--font-rj` zet Mont
 * vooraan, zodat het native rendert bij wie het geïnstalleerd heeft.
 */
const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Vraagbaak — de kennisbank van Ricardo Jeugdhulp",
    template: "%s · Vraagbaak",
  },
  description:
    "De interne vraagbaak van Ricardo Jeugdhulp: escalatiekaart, inwerken, rollen, werkprocessen, systemen, huisstijl en begrippen — doorzoekbaar op één plek.",
  // Interne app: niet indexeren, ook niet als de site publiek staat.
  robots: { index: false, follow: false },
};

/**
 * Nooit voorrenderen: de poortwachter hieronder moet bij élk bezoek de
 * cookie lezen. Zonder dit hangt het van de build-omgeving af of dat gebeurt.
 */
export const dynamic = "force-dynamic";

export default async function VraagbaakLayout({
  children,
}: LayoutProps<"/vraagbaak">) {
  // Eén poort voor de hele sectie: wie niet is ingelogd, ziet geen enkele
  // pagina eronder — ook niet als hij een diepe link heeft.
  const gebruiker = await huidigeGebruiker();
  if (!gebruiker) redirect("/inloggen");

  return (
    <div
      className={`${montserrat.variable} flex min-h-full flex-1 flex-col bg-rj-mist font-rj text-rj-blauw`}
    >
      <Header />
      <main className="flex-1">{children}</main>
      <Footer gebruiker={gebruiker} />
    </div>
  );
}
