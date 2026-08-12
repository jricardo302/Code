"use client";

import { useLocale, useTranslations } from "next-intl";
import { useParams } from "next/navigation";
import { routing, type AppLocale } from "@/i18n/routing";
import { usePathname, useRouter } from "@/i18n/navigation";

const LABELS: Record<AppLocale, string> = { nl: "NL", en: "EN" };

export function LocaleSwitcher() {
  const t = useTranslations("nav");
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const params = useParams();

  function switchTo(next: AppLocale) {
    // Re-resolve the current pathname under the new locale, params included.
    router.replace(
      // @ts-expect-error — pathname/params pair is valid by construction
      { pathname, params },
      { locale: next },
    );
  }

  return (
    <div role="group" aria-label={t("languageLabel")} className="flex items-center gap-1">
      {routing.locales.map((candidate) => (
        <button
          key={candidate}
          type="button"
          onClick={() => switchTo(candidate)}
          aria-pressed={candidate === locale}
          className={`rounded px-1.5 py-0.5 text-xs font-semibold transition-colors ${
            candidate === locale
              ? "bg-navy text-sand"
              : "text-navy hover:text-turquoise-deep"
          }`}
        >
          {LABELS[candidate]}
        </button>
      ))}
    </div>
  );
}
