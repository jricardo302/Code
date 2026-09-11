import type { Metadata } from "next";

import {
  DocumentenBlok,
  Kaart,
  LetOp,
  PaginaKop,
  Sectie,
  Stappen,
  Vinklijst,
} from "@/components/vraagbaak/ui";
import {
  ACCOUNT_REGEL,
  SYSTEMEN,
  SYSTEEM_DOCUMENTEN,
  UITDIENST,
  VEILIG_WERKEN,
  ZILLIZ_WERKEN,
} from "@/lib/vraagbaak/systemen";

export const metadata: Metadata = {
  title: "Systemen en accounts",
  description:
    "Zilliz, Google Workspace, ZIVVER en MijnVOS: waarvoor ze zijn, hoe je ze activeert en de regels voor veilig werken.",
};

export default function Systemen() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="06 · Systemen en accounts"
        titel="Waar je in werkt"
        intro="Vier systemen, elk met een eigen doel. Wachtwoorden staan hier niet en worden nooit per mail of app gedeeld."
      />

      <Sectie id="overzicht" titel="Welk systeem waarvoor">
        <div className="grid gap-4 sm:grid-cols-2">
          {SYSTEMEN.map((systeem) => (
            <section
              key={systeem.slug}
              id={systeem.slug}
              className="flex scroll-mt-28 flex-col rounded-2xl border border-rj-lijn bg-white p-5 sm:p-6"
            >
              <h3 className="text-lg font-extrabold text-rj-blauw">
                {systeem.naam}
              </h3>
              <p className="mt-2 flex-1 leading-relaxed text-rj-grijs">
                {systeem.waarvoor}
              </p>
              <p className="mt-4 text-xs font-extrabold tracking-wide text-rj-grijs uppercase">
                Toegang via {systeem.toegang}
              </p>
              {systeem.activatie && (
                <ol className="mt-4 space-y-2 border-t border-rj-lijn pt-4">
                  {systeem.activatie.map((stap) => (
                    <li
                      key={stap}
                      className="flex gap-2 text-sm leading-relaxed text-rj-grijs"
                    >
                      <span
                        aria-hidden
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-rj-groen"
                      />
                      <span>{stap}</span>
                    </li>
                  ))}
                </ol>
              )}
            </section>
          ))}
        </div>

        <div className="mt-5">
          <LetOp titel="Accounts zijn persoonlijk">{ACCOUNT_REGEL}</LetOp>
        </div>
      </Sectie>

      <Sectie id="zilliz-werken" titel="Werken in Zilliz">
        <Kaart>
          <Vinklijst punten={ZILLIZ_WERKEN} />
        </Kaart>
      </Sectie>

      <Sectie
        id="veilig"
        titel="Veilig werken — regels die altijd gelden"
        intro="Geen uitzonderingen, ook niet als het even sneller zou zijn."
      >
        <ul className="space-y-3">
          {VEILIG_WERKEN.map((v) => (
            <li
              key={v.regel}
              className="flex gap-4 rounded-2xl border border-rj-lijn bg-white p-5"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden
                className="mt-0.5 h-5 w-5 shrink-0 text-rj-blauw"
              >
                <rect x="4" y="10" width="16" height="10" rx="2" />
                <path d="M8 10V7a4 4 0 0 1 8 0v3" />
              </svg>
              <div>
                <p className="font-semibold text-rj-blauw">{v.regel}</p>
                {v.waarom && (
                  <p className="mt-1 text-sm text-rj-grijs">{v.waarom}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </Sectie>

      <Sectie
        id="uitdienst"
        titel="Bij uitdiensttreding of einde opdracht"
        intro="Regel dit vóór je laatste werkdag, niet erna."
      >
        <Kaart>
          <Stappen stappen={UITDIENST} />
        </Kaart>
      </Sectie>

      <DocumentenBlok documenten={SYSTEEM_DOCUMENTEN} />
    </div>
  );
}
