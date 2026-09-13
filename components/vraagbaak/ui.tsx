import Link from "next/link";

import type { IconNaam } from "@/lib/vraagbaak/secties";

/* -------------------------------------------------------------------------
   Iconen. Met de hand getekend in SVG, één lijnstijl, zodat ze als set
   werken en niemand een iconenbibliotheek hoeft te laden.
   ---------------------------------------------------------------------- */

const PADEN: Record<IconNaam, React.ReactNode> = {
  // Open hand — het merkteken van Ricardo Jeugdhulp.
  hand: (
    <path d="M8 13V5.5a1.5 1.5 0 0 1 3 0V12m0-.5V4a1.5 1.5 0 0 1 3 0v7.5m0-1V6a1.5 1.5 0 0 1 3 0v7m0-3.5a1.5 1.5 0 0 1 3 0v5a7 7 0 0 1-7 7h-1a7 7 0 0 1-7-7v-2.5a1.5 1.5 0 0 1 2.56-1.06L8 13" />
  ),
  koffer: (
    <>
      <rect x="3" y="7.5" width="18" height="13" rx="2" />
      <path d="M9 7.5V5.5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2M3 13h18" />
    </>
  ),
  personen: (
    <>
      <circle cx="9" cy="8" r="3.2" />
      <path d="M3 20a6 6 0 0 1 12 0M16.5 5.2a3.2 3.2 0 0 1 0 6.1M18 14.2a6 6 0 0 1 3 5.8" />
    </>
  ),
  schild: (
    <>
      <path d="M12 3 4.5 6v6.2c0 4.3 3 8.1 7.5 8.8 4.5-.7 7.5-4.5 7.5-8.8V6L12 3Z" />
      <path d="M9 12.2 11.2 14.5 15.2 10" />
    </>
  ),
  route: (
    <>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="18" cy="18" r="2.5" />
      <path d="M8.5 6H14a3.5 3.5 0 0 1 0 7h-4a3.5 3.5 0 0 0 0 7h5.5" />
    </>
  ),
  sleutel: (
    <>
      <circle cx="8" cy="8" r="4" />
      <path d="m11 11 8.5 8.5M16 16l2-2M18.5 18.5l2-2" />
    </>
  ),
  penseel: (
    <path d="M15 4.5 19.5 9 9.8 18.7a3 3 0 0 1-1.5.8l-4 .8.8-4a3 3 0 0 1 .8-1.5L15 4.5Zm-2 2.2 4.3 4.3" />
  ),
  vraag: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.4 9.2a2.7 2.7 0 0 1 5.2.9c0 1.8-2.6 2.3-2.6 4" />
      <path d="M12 17.4h.01" />
    </>
  ),
  vonk: (
    <path d="M12 3.5 13.9 9l5.6 1.9-5.6 1.9L12 18.4 10.1 12.8 4.5 10.9 10.1 9 12 3.5Z" />
  ),
};

export function Icoon({
  naam,
  className = "h-6 w-6",
}: {
  naam: IconNaam;
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.7}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
      className={className}
    >
      {PADEN[naam]}
    </svg>
  );
}

/* -------------------------------------------------------------------------
   Tekstbouwstenen
   ---------------------------------------------------------------------- */

/** Paginakop met het groene balkje eronder — het vaste huisstijl-motief. */
export function PaginaKop({
  bovenkop,
  titel,
  intro,
  children,
}: {
  bovenkop?: string;
  titel: string;
  intro?: string;
  children?: React.ReactNode;
}) {
  return (
    <header className="mb-10">
      {bovenkop && (
        <p className="mb-2 text-xs font-extrabold tracking-[0.18em] text-rj-grijs uppercase">
          {bovenkop}
        </p>
      )}
      <h1 className="text-3xl font-extrabold tracking-tight text-balance text-rj-blauw sm:text-4xl">
        {titel}
      </h1>
      <div className="mt-4 h-1.5 w-20 rounded-full bg-rj-groen" />
      {intro && (
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-rj-grijs">
          {intro}
        </p>
      )}
      {children}
    </header>
  );
}

export function Sectie({
  id,
  titel,
  intro,
  children,
}: {
  id?: string;
  titel: string;
  intro?: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-28 py-8">
      <h2 className="flex items-center gap-3 text-xl font-extrabold text-rj-blauw sm:text-2xl">
        <span aria-hidden className="h-5 w-1.5 shrink-0 rounded-full bg-rj-groen" />
        {titel}
      </h2>
      {intro && (
        <p className="mt-3 max-w-2xl leading-relaxed text-rj-grijs">{intro}</p>
      )}
      <div className="mt-5">{children}</div>
    </section>
  );
}

export function Kaart({
  className = "",
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`rounded-2xl border border-rj-lijn bg-white p-5 sm:p-6 ${className}`}
    >
      {children}
    </div>
  );
}

/** Opvallend kader voor iets dat je écht moet weten. */
export function LetOp({
  titel,
  children,
  toon = "groen",
}: {
  titel?: string;
  children: React.ReactNode;
  toon?: "groen" | "blauw";
}) {
  const stijl =
    toon === "groen"
      ? "border-rj-groen bg-rj-groen-licht"
      : "border-rj-blauw/20 bg-rj-blauw-licht";
  return (
    <div className={`rounded-2xl border-l-4 ${stijl} p-5`}>
      {titel && (
        <p className="mb-1.5 font-extrabold text-rj-blauw">{titel}</p>
      )}
      <div className="leading-relaxed text-rj-blauw/85">{children}</div>
    </div>
  );
}

/** Lijst met groene vinkjes — voor regels en afspraken. */
export function Vinklijst({ punten }: { punten: readonly string[] }) {
  return (
    <ul className="space-y-3">
      {punten.map((punt) => (
        <li key={punt} className="flex gap-3 leading-relaxed text-rj-grijs">
          <svg
            viewBox="0 0 20 20"
            aria-hidden
            className="mt-1 h-4 w-4 shrink-0 text-rj-blauw"
          >
            <circle cx="10" cy="10" r="9" className="fill-rj-groen" />
            <path
              d="m6 10.4 2.7 2.6L14 7.6"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span>{punt}</span>
        </li>
      ))}
    </ul>
  );
}

/** Genummerde stappen — voor protocollen en processen. */
export function Stappen({ stappen }: { stappen: readonly string[] }) {
  return (
    <ol className="space-y-4">
      {stappen.map((stap, i) => (
        <li key={stap} className="flex gap-4">
          <span
            aria-hidden
            className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-rj-blauw text-sm font-extrabold text-white"
          >
            {i + 1}
          </span>
          <span className="leading-relaxed text-rj-grijs">{stap}</span>
        </li>
      ))}
    </ol>
  );
}

/** Link naar een origineel document in de kwaliteitsmap. */
export function DocumentLink({
  titel,
  waarvoor,
  url,
}: {
  titel: string;
  waarvoor?: string;
  url: string;
}) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noreferrer noopener"
      className="group flex items-start gap-3 rounded-xl border border-rj-lijn bg-white p-4 transition-colors hover:border-rj-blauw/40 hover:bg-rj-mist"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={1.7}
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden
        className="mt-0.5 h-5 w-5 shrink-0 text-rj-blauw"
      >
        <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" />
        <path d="M14 3v5h5" />
      </svg>
      <span className="min-w-0">
        <span className="block font-semibold text-rj-blauw group-hover:underline">
          {titel}
        </span>
        {waarvoor && (
          <span className="mt-0.5 block text-sm text-rj-grijs">{waarvoor}</span>
        )}
      </span>
      <span
        aria-hidden
        className="ml-auto pl-2 text-rj-grijs transition-transform group-hover:translate-x-0.5"
      >
        ↗
      </span>
    </a>
  );
}

export function DocumentenBlok({
  titel = "De originele documenten",
  toelichting = "Deze stukken staan in de kwaliteitsmap en openen in een nieuw tabblad. Geen toegang? Vraag die aan bij de directie. Maak geen eigen kopieën — werk altijd via de link.",
  documenten,
}: {
  titel?: string;
  toelichting?: string;
  documenten: readonly { titel: string; waarvoor?: string; url: string }[];
}) {
  return (
    <Sectie id="documenten" titel={titel} intro={toelichting}>
      <div className="grid gap-3 sm:grid-cols-2">
        {documenten.map((doc) => (
          <DocumentLink key={doc.url + doc.titel} {...doc} />
        ))}
      </div>
    </Sectie>
  );
}

/** Verwijzing naar een andere pagina in de app. */
export function VerderLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 font-semibold text-rj-blauw underline decoration-rj-groen decoration-2 underline-offset-4 hover:decoration-rj-blauw"
    >
      {children}
      <span aria-hidden>→</span>
    </Link>
  );
}

/** Tabel die op een telefoon niet breekt maar horizontaal scrollt. */
export function Tabel({
  koppen,
  rijen,
}: {
  koppen: readonly string[];
  rijen: readonly (readonly React.ReactNode[])[];
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-rj-lijn">
      <table className="w-full min-w-[34rem] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-rj-blauw text-white">
            {koppen.map((kop) => (
              <th key={kop} className="px-4 py-3 font-extrabold">
                {kop}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rijen.map((rij, i) => (
            <tr
              key={i}
              className={i % 2 === 1 ? "bg-rj-mist" : "bg-white"}
            >
              {rij.map((cel, j) => (
                <td
                  key={j}
                  className={`px-4 py-3 align-top text-rj-grijs ${
                    j === 0 ? "font-semibold text-rj-blauw" : ""
                  }`}
                >
                  {cel}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Klein label, bijvoorbeeld "vastgelegde eis" of "interne werknorm". */
export function Label({
  children,
  toon = "blauw",
}: {
  children: React.ReactNode;
  toon?: "blauw" | "groen" | "stil";
}) {
  const stijl = {
    blauw: "bg-rj-blauw text-white",
    groen: "bg-rj-groen text-rj-blauw",
    stil: "bg-rj-blauw-licht text-rj-blauw",
  }[toon];
  return (
    <span
      className={`inline-block rounded-full px-2.5 py-1 text-xs font-extrabold tracking-wide ${stijl}`}
    >
      {children}
    </span>
  );
}
