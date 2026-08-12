import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { CONTACT_EMAIL } from "@/lib/site-config";

export async function Footer() {
  const t = await getTranslations("footer");
  const tn = await getTranslations("nav");
  const year = new Date().getFullYear();

  return (
    <footer className="bg-navy text-sand">
      {/* The horizon motif: hero and footer only. */}
      <div className="horizon-line" aria-hidden="true" />
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-14 md:grid-cols-3 md:px-6">
        <div>
          <p className="font-[family-name:var(--font-display)] text-xl text-sand">
            Lighthouse Curaçao
          </p>
          <p className="mt-3 max-w-xs text-sm leading-6 text-sand/70">{t("address")}</p>
          <p className="mt-3 text-sm font-medium text-turquoise">{t("directBooking")}</p>
        </div>
        <nav aria-label={tn("home")} className="grid grid-cols-2 gap-2 text-sm">
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/huis">{tn("house")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/galerij">{tn("gallery")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/eiland">{tn("island")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/tarieven">{tn("rates")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/boeken">{tn("book")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/praktisch">{tn("practical")}</Link>
          <Link className="py-1 text-sand/80 hover:text-turquoise" href="/contact">{tn("contact")}</Link>
        </nav>
        <div className="text-sm text-sand/70">
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-turquoise hover:underline">
            {CONTACT_EMAIL}
          </a>
          <p className="mt-4">© {year} Lighthouse Curaçao. {t("rights")}</p>
        </div>
      </div>
    </footer>
  );
}
