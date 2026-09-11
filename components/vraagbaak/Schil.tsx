import Image from "next/image";
import Link from "next/link";

import { MAILADRESSEN, ORGANISATIE } from "@/lib/vraagbaak/organisatie";
import { KENNISBANK } from "@/lib/vraagbaak/secties";

import { Nav } from "./Nav";
import { Zoeken, ZoekVensterHouder } from "./Zoeken";

/** Het logo staat rechtsboven — vaste plek volgens de huisstijl. */
function Logo({ className = "" }: { className?: string }) {
  return (
    <Image
      src="/vraagbaak/logo.png"
      alt="Ricardo Jeugdhulp"
      width={2291}
      height={675}
      priority
      className={className}
    />
  );
}

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-rj-lijn bg-white/95 backdrop-blur">
      <div className="mx-auto max-w-5xl px-5">
        <div className="flex items-center gap-3 py-3">
          <Link href="/vraagbaak" className="group min-w-0 leading-none">
            <span className="block text-xl font-extrabold tracking-tight text-rj-blauw group-hover:underline sm:text-2xl">
              Vraagbaak
            </span>
            <span className="mt-1 hidden text-[0.68rem] font-bold tracking-[0.14em] text-rj-grijs uppercase sm:block">
              Kennisbank Ricardo Jeugdhulp
            </span>
          </Link>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-3">
            <Zoeken />
            <NoodKnop />
            {/* Het logo staat rechtsboven — vaste plek volgens de huisstijl. */}
            <Link
              href="/vraagbaak/over"
              className="shrink-0"
              aria-label="Over Ricardo Jeugdhulp"
            >
              <Logo className="h-6 w-auto sm:h-9" />
            </Link>
          </div>
        </div>

        <Nav />
      </div>
      <ZoekVensterHouder />
    </header>
  );
}

function NoodKnop() {
  return (
    <Link
      href="/vraagbaak/nood"
      className="flex shrink-0 items-center gap-2 rounded-full bg-rj-blauw px-3.5 py-2 text-sm font-extrabold text-white ring-2 ring-rj-groen transition-colors hover:bg-rj-blauw/85 sm:px-4"
    >
      <span aria-hidden className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-rj-groen opacity-75" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-rj-groen" />
      </span>
      <span className="hidden sm:inline">Wat doe je bij…</span>
      <span className="sm:hidden">Nood</span>
    </Link>
  );
}

export function Footer() {
  return (
    <footer className="mt-16 bg-rj-blauw text-white/80">
      <div className="mx-auto max-w-5xl px-5 py-12">
        <div className="grid gap-10 sm:grid-cols-3">
          <div>
            <p className="text-lg font-extrabold text-white">
              {ORGANISATIE.naam}
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              {ORGANISATIE.adres}
              <br />
              <a
                href={`tel:${ORGANISATIE.telefoonLink}`}
                className="hover:text-rj-groen"
              >
                {ORGANISATIE.telefoon}
              </a>
              <br />
              <a
                href={`https://${ORGANISATIE.website}`}
                target="_blank"
                rel="noreferrer noopener"
                className="hover:text-rj-groen"
              >
                {ORGANISATIE.website}
              </a>
            </p>
          </div>

          <div>
            <p className="text-sm font-extrabold tracking-wide text-rj-groen uppercase">
              Mailadressen
            </p>
            <ul className="mt-3 space-y-1.5 text-sm">
              {MAILADRESSEN.map((m) => (
                <li key={m.adres}>
                  <a href={`mailto:${m.adres}`} className="hover:text-rj-groen">
                    {m.adres}
                  </a>
                  <span className="block text-white/50">{m.waarvoor}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-extrabold tracking-wide text-rj-groen uppercase">
              Over deze vraagbaak
            </p>
            <p className="mt-3 text-sm leading-relaxed">
              Gebaseerd op de kennisbank, versie {KENNISBANK.versie} van{" "}
              {KENNISBANK.datum}. Beheerder: {KENNISBANK.beheerder}. Bij verschil
              met een origineel kwaliteitsdocument geldt het kwaliteitsdocument.
            </p>
            <a
              href={KENNISBANK.drive}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-block text-sm font-semibold text-rj-groen hover:underline"
            >
              De kennisbank in Drive ↗
            </a>
          </div>
        </div>

        <p className="mt-10 border-t border-white/15 pt-6 text-xs text-white/50">
          Geen cliëntgegevens in deze app. Cliëntinformatie hoort uitsluitend in
          Zilliz. Deel deze vraagbaak niet buiten de organisatie.
        </p>
      </div>
    </footer>
  );
}
