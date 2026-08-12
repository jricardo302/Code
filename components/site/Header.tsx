"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Link, usePathname } from "@/i18n/navigation";
import type { AppPathname } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";

const NAV: {
  href: Exclude<AppPathname, "/boeken/status/[bookingId]">;
  key: "house" | "gallery" | "island" | "rates" | "practical" | "contact";
}[] = [
  { href: "/huis", key: "house" },
  { href: "/galerij", key: "gallery" },
  { href: "/eiland", key: "island" },
  { href: "/tarieven", key: "rates" },
  { href: "/praktisch", key: "practical" },
  { href: "/contact", key: "contact" },
];

export function Header() {
  const t = useTranslations("nav");
  const tc = useTranslations("common");
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy/10 bg-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:px-6">
        <Link
          href="/"
          className="font-[family-name:var(--font-display)] text-lg font-semibold tracking-tight text-navy"
          onClick={() => setOpen(false)}
        >
          Lighthouse Curaçao
        </Link>

        <nav aria-label={t("home")} className="hidden items-center gap-6 lg:flex">
          {NAV.map(({ href, key }) => (
            <Link
              key={href}
              href={href}
              aria-current={pathname === href ? "page" : undefined}
              className={`text-sm font-medium transition-colors hover:text-turquoise-deep ${
                pathname === href ? "text-turquoise-deep" : "text-ink"
              }`}
            >
              {t(key)}
            </Link>
          ))}
          <LocaleSwitcher />
          <Link href="/boeken" className="btn-primary text-sm">
            {tc("bookNow")}
          </Link>
        </nav>

        <div className="flex items-center gap-3 lg:hidden">
          <LocaleSwitcher />
          <button
            type="button"
            aria-expanded={open}
            aria-controls="mobile-nav"
            aria-label={t("home")}
            onClick={() => setOpen((v) => !v)}
            className="rounded-md border border-navy/20 p-2 text-navy"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true" fill="none">
              {open ? (
                <path d="M4 4l12 12M16 4L4 16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              ) : (
                <path d="M3 5h14M3 10h14M3 15h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <nav id="mobile-nav" className="border-t border-navy/10 bg-sand px-4 pb-4 lg:hidden">
          <ul className="flex flex-col gap-1 pt-2">
            {NAV.map(({ href, key }) => (
              <li key={href}>
                <Link
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className="block rounded-md px-2 py-2 font-medium text-ink hover:bg-sand-deep"
                >
                  {t(key)}
                </Link>
              </li>
            ))}
            <li className="pt-2">
              <Link href="/boeken" onClick={() => setOpen(false)} className="btn-primary w-full">
                {tc("bookNow")}
              </Link>
            </li>
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
