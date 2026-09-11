"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { QUIZ_SECTIE, SECTIES } from "@/lib/vraagbaak/secties";

const ITEMS = [
  { href: "/vraagbaak", titel: "Start", volledig: "Start" },
  ...SECTIES.map((s) => ({
    href: s.href,
    titel: s.navTitel,
    volledig: s.titel,
  })),
  {
    href: QUIZ_SECTIE.href,
    titel: QUIZ_SECTIE.navTitel,
    volledig: QUIZ_SECTIE.titel,
  },
];

export function Nav() {
  const pad = usePathname();

  return (
    <nav
      aria-label="Onderdelen van de vraagbaak"
      className="-mx-5 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      <ul className="flex w-max gap-1 pb-px">
        {ITEMS.map((item) => {
          const hier =
            item.href === "/vraagbaak" ? pad === item.href : pad.startsWith(item.href);
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                aria-label={item.volledig}
                aria-current={hier ? "page" : undefined}
                className={`block border-b-[3px] px-3 py-2.5 text-sm font-semibold whitespace-nowrap transition-colors ${
                  hier
                    ? "border-rj-groen text-rj-blauw"
                    : "border-transparent text-rj-grijs hover:border-rj-lijn hover:text-rj-blauw"
                }`}
              >
                {item.titel}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
