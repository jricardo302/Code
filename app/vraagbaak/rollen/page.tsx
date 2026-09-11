import type { Metadata } from "next";

import { JouwRolMarkering, RolKiezer } from "@/components/vraagbaak/RolKiezer";
import {
  DocumentenBlok,
  Kaart,
  LetOp,
  PaginaKop,
  Stappen,
  Vinklijst,
} from "@/components/vraagbaak/ui";
import { ROLLEN, ROL_DOCUMENTEN } from "@/lib/vraagbaak/rollen";

export const metadata: Metadata = {
  title: "Rollen en taken",
  description:
    "Wat er per rol van je verwacht wordt bij Ricardo Jeugdhulp: begeleider, coördinerend begeleider, zorgcoördinator, gedragswetenschapper, Manager Zorg en directie.",
};

export default function Rollen() {
  return (
    <div className="mx-auto max-w-5xl px-5 pt-10 pb-4 sm:pt-14">
      <PaginaKop
        bovenkop="03 · Rollen en taken"
        titel="Wat wordt er van je verwacht?"
        intro="Deze beschrijvingen zijn functioneel, niet arbeidsrechtelijk. Wat contractueel voor jou geldt, staat in je eigen contract of raamovereenkomst."
      />

      <RolKiezer />

      <div className="mt-10 space-y-8">
        {ROLLEN.map((rol) => (
          <section
            key={rol.slug}
            id={rol.slug}
            className="scroll-mt-28 overflow-hidden rounded-2xl border border-rj-lijn bg-white"
          >
            <header className="flex flex-wrap items-center gap-3 border-b border-rj-lijn bg-rj-mist px-5 py-4 sm:px-6">
              <h2 className="text-xl font-extrabold text-rj-blauw">
                {rol.naam}
              </h2>
              <JouwRolMarkering slug={rol.slug} />
            </header>

            <div className="space-y-6 px-5 py-6 sm:px-6">
              <p className="max-w-2xl text-lg leading-relaxed text-rj-blauw">
                {rol.kern}
              </p>

              {rol.watJeDoet && (
                <div>
                  <h3 className="mb-3 text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
                    Wat je doet
                  </h3>
                  <Vinklijst punten={rol.watJeDoet} />
                </div>
              )}

              {rol.ritme?.map((blok) => (
                <div key={blok.kop}>
                  <h3 className="mb-3 text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
                    {blok.kop}
                  </h3>
                  <Vinklijst punten={blok.punten} />
                </div>
              ))}

              {rol.extra && (
                <div className="rounded-2xl bg-rj-mist p-5">
                  <h3 className="mb-3 text-sm font-extrabold tracking-wide text-rj-blauw uppercase">
                    {rol.extra.kop}
                  </h3>
                  {rol.extra.kop.includes("stappen") ? (
                    <Stappen stappen={rol.extra.punten} />
                  ) : rol.extra.kop.includes("statuslabels") ? (
                    <Keten punten={rol.extra.punten} />
                  ) : (
                    <Vinklijst punten={rol.extra.punten} />
                  )}
                </div>
              )}

              {rol.aangesprokenOp && (
                <LetOp toon="blauw" titel="Waar je op wordt aangesproken">
                  {rol.aangesprokenOp}
                </LetOp>
              )}

              {rol.opschalen && (
                <LetOp titel="Wanneer je opschaalt">{rol.opschalen}</LetOp>
              )}

              {rol.eisen && (
                <Kaart className="border-dashed">
                  <p className="text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
                    Eisen
                  </p>
                  <p className="mt-2 leading-relaxed text-rj-grijs">
                    {rol.eisen}
                  </p>
                </Kaart>
              )}
            </div>
          </section>
        ))}
      </div>

      <DocumentenBlok documenten={ROL_DOCUMENTEN} />
    </div>
  );
}

/** De wachtrij-statussen achter elkaar, met pijltjes ertussen. */
function Keten({ punten }: { punten: readonly string[] }) {
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {punten.map((punt, i) => (
        <li key={punt} className="flex items-center gap-2">
          <span className="rounded-full border border-rj-lijn bg-white px-3 py-1.5 text-sm font-semibold text-rj-blauw">
            {punt}
          </span>
          {i < punten.length - 1 && (
            <span aria-hidden className="text-rj-groen">
              →
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}
