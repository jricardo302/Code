import type { Metadata } from "next";
import { fontClasses } from "@/lib/fonts";
import "../globals.css";

export const metadata: Metadata = {
  title: "Beheer — Lighthouse Curaçao",
  robots: { index: false, follow: false },
};

/** Root layout for the /admin tree. Dutch-only: it is the owner's cockpit. */
export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={fontClasses}>
      <body className="bg-sand">{children}</body>
    </html>
  );
}
