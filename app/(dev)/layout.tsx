import { fontClasses } from "@/lib/fonts";
import "../globals.css";

/** Minimal root layout for the non-localized dev/payment pages. */
export default function DevLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="nl" className={fontClasses}>
      <body>{children}</body>
    </html>
  );
}
