import { NIVEAUS, type Kaart as KaartType } from "@/lib/kaarten";

/**
 * Eén vraagkaart, zoals hij gedrukt wordt.
 *
 * De verhouding is 7:12 — het gekozen kaartformaat van 70 × 120 mm (zie
 * design/print-specs.md). Zo is wat je op de site ziet ook echt wat er in de
 * doos zit, en niet een mooiere webversie ervan.
 *
 * De typografie schaalt mee met de kaart via container-query-eenheden (`cqi`)
 * en niet via breakpoints. Op karton heeft de tekst een vaste verhouding tot
 * het kaartje; hier dus ook. Zonder dat loopt een lange vraag uit een kleine
 * kaart en staat een korte vraag verloren in een grote — en dat is precies wat
 * er gebeurde toen de maten nog in rem stonden.
 *
 * Niveau 1 en 2 hebben een crème front met een gekleurd accent. Niveau 3 is
 * de omkering: diep paars met crème tekst. Dat is geen decoratie — je ziet aan
 * de stapel meteen hoe diep een kaart gaat.
 */

const opmaak = {
  1: {
    vlak: "bg-creme text-inkt",
    rand: "border-lila",
    band: "bg-lila",
    label: "text-paars-diep/60",
    lijn: "bg-lila",
  },
  2: {
    vlak: "bg-creme text-inkt",
    rand: "border-paars",
    band: "bg-paars",
    label: "text-paars",
    lijn: "bg-paars",
  },
  3: {
    vlak: "bg-paars-diep text-creme",
    // Lila en niet diep paars: deze kaart wordt ook op een diep paarse
    // ondergrond getoond, en dan zou een randkleur gelijk aan het vlak de
    // kaart onzichtbaar maken.
    rand: "border-lila/45",
    band: "bg-lila",
    label: "text-lila",
    lijn: "bg-lila/70",
  },
} as const;

export function Kaart({
  kaart,
  className = "",
  toonNummer = true,
}: {
  kaart: KaartType;
  className?: string;
  toonNummer?: boolean;
}) {
  const stijl = opmaak[kaart.level];
  const niveau = NIVEAUS[kaart.level];

  return (
    // Let op de twee lagen. Container-query-eenheden op een element lossen op
    // tegen de dichtstbijzijnde container-*voorouder*, nooit tegen het element
    // zelf — dat zou circulair zijn. De buitenste div is dus de container, de
    // binnenste rekent erin. Zet je `@container` en de cqi-maten op hetzelfde
    // element, dan schaalt de kaart ineens mee met de paginabreedte.
    <article className={`@container aspect-7/12 ${className}`}>
      <div
        className={`flex h-full w-full flex-col justify-between overflow-hidden rounded-[6cqi] border-2 ${stijl.rand} ${stijl.vlak} p-[7cqi] kaartrand`}
      >
        {/* Niveau-indicator: klein, maar op elke kaart op dezelfde plek. */}
        <header className="flex items-center gap-[2.5cqi]">
          <span
            aria-hidden
            className={`h-[3cqi] w-[3cqi] shrink-0 rounded-full ${stijl.band}`}
          />
          <span
            className={`font-merk text-[4.2cqi] font-black tracking-[0.18em] ${stijl.label} uppercase`}
          >
            N{kaart.level} · {niveau.naam}
          </span>
        </header>

        {/* De vraag: gecentreerd, rechtop, zonder aanhalingstekens. */}
        <p className="my-auto py-[4cqi] text-center font-merk text-[8.2cqi] leading-[1.18] font-black hyphens-auto tekst-balans">
          {kaart.print_front}
        </p>

        <footer className="flex items-center justify-between gap-[3cqi]">
          <span aria-hidden className={`h-px flex-1 ${stijl.lijn} opacity-50`} />
          {toonNummer && (
            <span
              className={`shrink-0 font-merk text-[4.2cqi] font-black tracking-[0.12em] ${stijl.label} tabular-nums`}
            >
              {String(kaart.card_number).padStart(3, "0")}
            </span>
          )}
        </footer>
      </div>
    </article>
  );
}

/**
 * De achterkant: één ontwerp voor alle honderd kaarten. Diep paars met het
 * woordmerk klein in het midden, zodat een omgedraaide stapel rustig oogt.
 *
 * Bewust géén `position`-klasse in de basis: die botste met de `absolute` die
 * KaartStapel meegeeft, en welke van de twee wint hangt dan af van de volgorde
 * in de gegenereerde CSS in plaats van van wat je bedoelt.
 */
export function KaartAchterkant({ className = "" }: { className?: string }) {
  return (
    // Buitenste laag draagt alleen de maat en de positionering die de
    // aanroeper meegeeft; de binnenste doet het uiterlijk. Zo kan een stapel
    // deze kaart absoluut positioneren zonder met de opmaak te vechten.
    <div className={`@container aspect-7/12 ${className}`}>
      <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[6cqi] border-2 border-paars-diep doos-verloop kaartrand">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-[4cqi] rounded-[4cqi] border border-creme/15"
        />
        <div className="text-center">
          <span className="block font-merk text-[9cqi] leading-tight font-black tracking-[-0.02em] text-creme">
            IK ZIE,
            <br />
            IK ZIE…
          </span>
          <span
            aria-hidden
            className="mx-auto mt-[4cqi] block h-px w-[18cqi] bg-lila/60"
          />
        </div>
      </div>
    </div>
  );
}
