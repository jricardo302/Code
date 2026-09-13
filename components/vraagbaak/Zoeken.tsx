"use client";

import { useRouter } from "next/navigation";
import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";

import { zoek, type Treffer } from "@/lib/vraagbaak/zoek";

const SUGGESTIES = [
  "uren",
  "datalek",
  "beschikking verlengen",
  "no-show",
  "Veilig Thuis",
  "productcode",
  "Zilliz",
];

/**
 * Er zijn meerdere aanleidingen om te zoeken — de knop in de header, het grote
 * veld op de startpagina, ⌘K — maar er is maar één zoekvenster. Die staat dus
 * buiten de componenten, in een kleine store: anders opent ⌘K op de
 * startpagina er twee tegelijk.
 */
let vensterOpen = false;
const luisteraars = new Set<() => void>();

function zetVensterOpen(open: boolean) {
  if (vensterOpen === open) return;
  vensterOpen = open;
  for (const herteken of luisteraars) herteken();
}

function abonneer(herteken: () => void) {
  luisteraars.add(herteken);
  return () => {
    luisteraars.delete(herteken);
  };
}

function useVensterOpen() {
  return useSyncExternalStore(
    abonneer,
    () => vensterOpen,
    () => false,
  );
}

/** De knop die het zoekvenster opent. Mag meerdere keren op een pagina staan. */
export function Zoeken({ variant = "knop" }: { variant?: "knop" | "groot" }) {
  return (
    <>
      {variant === "knop" ? (
        <button
          type="button"
          onClick={() => zetVensterOpen(true)}
          className="flex items-center gap-2 rounded-full border border-rj-lijn bg-white px-3.5 py-2 text-sm text-rj-grijs transition-colors hover:border-rj-blauw/40 hover:text-rj-blauw sm:px-4"
        >
          <Vergrootglas className="h-4 w-4" />
          <span className="hidden sm:inline">Zoeken</span>
          <kbd className="ml-1 hidden rounded border border-rj-lijn bg-rj-mist px-1.5 py-0.5 font-sans text-[0.65rem] font-bold text-rj-grijs md:inline">
            ⌘K
          </kbd>
          <span className="sr-only sm:hidden">Zoeken in de vraagbaak</span>
        </button>
      ) : (
        <button
          type="button"
          onClick={() => zetVensterOpen(true)}
          className="group flex w-full items-center gap-3 rounded-2xl border-2 border-rj-lijn bg-white px-5 py-4 text-left transition-colors hover:border-rj-groen"
        >
          <Vergrootglas className="h-5 w-5 shrink-0 text-rj-blauw" />
          <span className="text-rj-grijs">
            Zoek in de hele vraagbaak — bijvoorbeeld{" "}
            <span className="font-semibold text-rj-blauw">uren</span> of{" "}
            <span className="font-semibold text-rj-blauw">datalek</span>
          </span>
          <kbd className="ml-auto hidden rounded border border-rj-lijn bg-rj-mist px-2 py-1 font-sans text-xs font-bold text-rj-grijs sm:block">
            ⌘K
          </kbd>
        </button>
      )}
    </>
  );
}

/**
 * Hangt het zoekvenster en de sneltoets op. Staat één keer in de header, zodat
 * ⌘K precies één venster opent — waar je ook bent in de app.
 */
export function ZoekVensterHouder() {
  const open = useVensterOpen();

  useEffect(() => {
    function opToets(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        zetVensterOpen(!vensterOpen);
      }
    }
    window.addEventListener("keydown", opToets);
    return () => window.removeEventListener("keydown", opToets);
  }, []);

  if (!open) return null;
  return <ZoekVenster sluit={() => zetVensterOpen(false)} />;
}

function ZoekVenster({ sluit }: { sluit: () => void }) {
  const router = useRouter();
  const [vraag, zetVraag] = useState("");
  const [actief, zetActief] = useState(0);
  const lijstId = useId();
  const invoer = useRef<HTMLInputElement>(null);

  const treffers = useMemo(() => zoek(vraag), [vraag]);

  /** Een nieuwe vraag betekent een nieuwe lijst, dus terug naar de eerste. */
  function wijzigVraag(nieuw: string) {
    zetVraag(nieuw);
    zetActief(0);
  }

  useEffect(() => {
    invoer.current?.focus();
    const vorigeOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = vorigeOverflow;
    };
  }, []);

  const ga = useCallback(
    (treffer: Treffer) => {
      sluit();
      router.push(treffer.href);
    },
    [router, sluit],
  );

  function opToets(e: React.KeyboardEvent) {
    if (e.key === "Escape") {
      e.preventDefault();
      sluit();
      return;
    }
    if (!treffers.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      zetActief((i) => (i + 1) % treffers.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      zetActief((i) => (i - 1 + treffers.length) % treffers.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      ga(treffers[actief]);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-start justify-center bg-rj-blauw/50 px-4 pt-[8vh] pb-8 backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) sluit();
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label="Zoeken in de vraagbaak"
        className="flex max-h-[80vh] w-full max-w-xl flex-col overflow-hidden rounded-2xl border border-rj-lijn bg-white shadow-2xl"
        onKeyDown={opToets}
      >
        <div className="flex items-center gap-3 border-b border-rj-lijn px-5 py-4">
          <Vergrootglas className="h-5 w-5 shrink-0 text-rj-blauw" />
          <input
            ref={invoer}
            value={vraag}
            onChange={(e) => wijzigVraag(e.target.value)}
            type="search"
            placeholder="Waar zoek je naar?"
            aria-label="Zoekterm"
            aria-controls={lijstId}
            autoComplete="off"
            className="w-full bg-transparent text-lg text-rj-blauw outline-none placeholder:text-rj-grijs/60"
          />
          <button
            type="button"
            onClick={sluit}
            className="shrink-0 rounded-lg px-2 py-1 text-sm font-semibold text-rj-grijs hover:bg-rj-mist hover:text-rj-blauw"
          >
            Esc
          </button>
        </div>

        <div id={lijstId} className="overflow-y-auto">
          {vraag.trim().length < 2 ? (
            <div className="p-5">
              <p className="mb-3 text-sm font-extrabold tracking-wide text-rj-grijs uppercase">
                Veelgezocht
              </p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => wijzigVraag(s)}
                    className="rounded-full border border-rj-lijn bg-rj-mist px-3 py-1.5 text-sm font-semibold text-rj-blauw hover:border-rj-groen hover:bg-rj-groen-licht"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          ) : treffers.length === 0 ? (
            <p className="p-6 text-rj-grijs">
              Niets gevonden voor “{vraag}”. Staat je vraag niet in de
              vraagbaak? Stel hem aan de zorgcoördinator of je leidinggevende,
              en meld hem bij de directie zodat hij toegevoegd kan worden.
            </p>
          ) : (
            <ul className="p-2">
              {treffers.map((treffer, i) => (
                <li key={treffer.id}>
                  <button
                    type="button"
                    onMouseEnter={() => zetActief(i)}
                    onClick={() => ga(treffer)}
                    className={`flex w-full flex-col items-start gap-1 rounded-xl px-3 py-2.5 text-left ${
                      i === actief ? "bg-rj-groen-licht" : ""
                    }`}
                  >
                    <span className="flex w-full items-baseline gap-2">
                      <span className="font-semibold text-rj-blauw">
                        {treffer.titel}
                      </span>
                      <span className="ml-auto shrink-0 text-[0.7rem] font-extrabold tracking-wide text-rj-grijs uppercase">
                        {treffer.sectie}
                      </span>
                    </span>
                    <span className="line-clamp-2 text-sm text-rj-grijs">
                      {treffer.tekst}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <p className="border-t border-rj-lijn bg-rj-mist px-5 py-2.5 text-xs text-rj-grijs">
          ↑ ↓ om te kiezen · Enter om te openen · Esc om te sluiten
        </p>
      </div>
    </div>
  );
}

function Vergrootglas({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      aria-hidden
      className={className}
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </svg>
  );
}
