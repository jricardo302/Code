/**
 * De kaartendoos als productshot: een breed, plat geschenkdoosje met
 * magneetsluiting in isometrisch perspectief, met twee kaarten ervoor.
 *
 * Alles is met de hand in SVG geconstrueerd. De drie zichtbare vlakken worden
 * opgespannen door twee vectoren, en tekst en kaders krijgen diezelfde matrix
 * mee — zo liggen ze écht in het vlak in plaats van er los overheen te zweven.
 */

type Punt = [number, number];

// --- vectorrekenwerk ---------------------------------------------------------

const plus = (...punten: Punt[]): Punt =>
  punten.reduce<Punt>((a, b) => [a[0] + b[0], a[1] + b[1]], [0, 0]);

const maal = (p: Punt, k: number): Punt => [p[0] * k, p[1] * k];

const eenheid = (p: Punt): Punt => {
  const l = Math.hypot(p[0], p[1]);
  return [p[0] / l, p[1] / l];
};

const vorm = (punten: Punt[]) =>
  punten.map(([x, y]) => `${x.toFixed(2)},${y.toFixed(2)}`).join(" ");

/**
 * Bouwt de transform waarmee je "plat" kunt tekenen in een gekanteld vlak.
 * Lokale x loopt langs `u`, lokale y langs `v`, in dezelfde eenheden.
 */
const vlak = (oorsprong: Punt, u: Punt, v: Punt) =>
  `matrix(${[...eenheid(u), ...eenheid(v), ...oorsprong]
    .map((n) => n.toFixed(4))
    .join(" ")})`;

// --- afmetingen van de doos --------------------------------------------------

const LENGTE: Punt = [300, 100]; // lange as, naar rechtsonder
const DIEPTE: Punt = [128, -66]; // korte as, naar rechtsboven
const HOOGTE = 50;
const DEKSELRAND = 19; // hoogte van het deksel; daaronder zit de bak

const A: Punt = [96, 150]; // voorste linkerhoek van het deksel
const B = plus(A, LENGTE);
const C = plus(B, DIEPTE);
const D = plus(A, DIEPTE);
const Ah = plus(A, [0, HOOGTE]);
const Bh = plus(B, [0, HOOGTE]);
const Ch = plus(C, [0, HOOGTE]);
const Dh = plus(D, [0, HOOGTE]);

const LENGTE_MM = Math.hypot(...LENGTE); // 316 lokale eenheden
const DIEPTE_MM = Math.hypot(...DIEPTE); // 144 lokale eenheden

// Bij het deksel loopt lokale y naar de kijker toe, zodat regels naar voren
// stapelen — net als de opdruk op de foto.
const DEKSEL = vlak(D, LENGTE, maal(DIEPTE, -1));
const VOORKANT = vlak(A, LENGTE, [0, 1]);
const ZIJKANT = vlak(B, DIEPTE, [0, 1]);

// --- kaarten -----------------------------------------------------------------

const KAART_L = 158;
const KAART_B = 106;

const kaartVlak = (achterhoek: Punt) =>
  vlak(achterhoek, LENGTE, maal(DIEPTE, -1));

const RUG_KAART = kaartVlak([150, 300]);
const VRAAG_KAART = kaartVlak([348, 336]);

// --- onderdelen --------------------------------------------------------------

/** Drie oplopende streepjes in goudfolie: het merkteken voor de drie niveaus. */
function Merkteken({
  x,
  y,
  schaal = 1,
}: {
  x: number;
  y: number;
  schaal?: number;
}) {
  return (
    <g transform={`translate(${x} ${y}) scale(${schaal})`}>
      {[8, 13, 18].map((breedte, index) => (
        <rect
          key={breedte}
          x={-breedte / 2}
          y={index * 4.6}
          width={breedte}
          height={1.7}
          rx={0.85}
          fill="url(#folie)"
        />
      ))}
    </g>
  );
}

/** Het woordmerk in bladgoud: twee regels naam, daaronder het onderschrift. */
function Woordmerk({
  x,
  y,
  grootte,
  regelhoogte,
}: {
  x: number;
  y: number;
  grootte: number;
  regelhoogte: number;
}) {
  return (
    <g className="font-serif" fill="url(#folie)" textAnchor="middle">
      <text x={x} y={y} fontSize={grootte}>
        ik zie
      </text>
      <text x={x} y={y + regelhoogte} fontSize={grootte}>
        ik zie…
      </text>
      <text
        x={x}
        y={y + regelhoogte * 1.68}
        className="font-sans"
        fontSize={grootte * 0.26}
        fontWeight="600"
        letterSpacing={grootte * 0.055}
      >
        HET INTERVISIESPEL
      </text>
    </g>
  );
}

export function Kaartendoos() {
  return (
    <svg
      viewBox="36 66 508 392"
      role="img"
      aria-label="De kaartendoos van Ik zie ik zie…, het intervisiespel: een diep paars geschenkdoosje met het woordmerk in goudfolie, met daarvoor een kaartrug en een vraagkaart."
      className="-mx-[8%] h-auto w-[116%] max-w-none transition-transform duration-700 ease-out hover:-translate-y-1.5 sm:mx-auto sm:w-full sm:max-w-3xl"
    >
      <defs>
        {/* Bladgoud: licht aan de bovenkant, dieper naar onderen. */}
        <linearGradient id="folie" x1="0" y1="0" x2="0.3" y2="1">
          <stop offset="0%" stopColor="#F4E09B" />
          <stop offset="34%" stopColor="#DDBB4E" />
          <stop offset="70%" stopColor="#C9A227" />
          <stop offset="100%" stopColor="#A8831A" />
        </linearGradient>

        <linearGradient id="deksel" x1="0.1" y1="0" x2="0.9" y2="1">
          <stop offset="0%" stopColor="#4E2964" />
          <stop offset="100%" stopColor="#3D1F4E" />
        </linearGradient>

        <linearGradient id="voorvlak" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3A1E49" />
          <stop offset="100%" stopColor="#2C1637" />
        </linearGradient>

        <linearGradient id="karton" x1="0" y1="0" x2="0.4" y2="1">
          <stop offset="0%" stopColor="#FCF9F0" />
          <stop offset="100%" stopColor="#EFE7D3" />
        </linearGradient>

        <filter id="slagschaduw" x="-40%" y="-40%" width="190%" height="220%">
          <feGaussianBlur stdDeviation="15" />
        </filter>

        <filter id="kaartschaduw" x="-30%" y="-40%" width="170%" height="200%">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>

      {/* Schaduw van de doos, naar rechtsonder weglopend */}
      <g filter="url(#slagschaduw)" opacity="0.45">
        <polygon
          points={vorm([
            plus(Ah, [20, 12]),
            plus(Bh, [38, 15]),
            plus(Ch, [52, 7]),
            plus(Dh, [34, 5]),
          ])}
          fill="#150919"
        />
      </g>

      {/* --- de doos ---------------------------------------------------- */}

      <polygon points={vorm([A, B, Bh, Ah])} fill="url(#voorvlak)" />
      <polygon points={vorm([B, C, Ch, Bh])} fill="#241130" />
      <polygon points={vorm([D, C, B, A])} fill="url(#deksel)" />

      {/* De naad tussen deksel en bak, plus een fijne gouden randlijn */}
      <g transform={VOORKANT}>
        <rect
          y={DEKSELRAND}
          width={LENGTE_MM}
          height={HOOGTE - DEKSELRAND}
          fill="#000"
          opacity="0.16"
        />
        <line
          x1="0"
          y1={DEKSELRAND}
          x2={LENGTE_MM}
          y2={DEKSELRAND}
          stroke="#150919"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <line
          x1="0"
          y1="0.5"
          x2={LENGTE_MM}
          y2="0.5"
          stroke="url(#folie)"
          strokeWidth="0.7"
          opacity="0.3"
        />
        <Merkteken x={LENGTE_MM / 2} y={DEKSELRAND / 2 - 5} schaal={0.6} />
      </g>

      <g transform={ZIJKANT}>
        <rect
          y={DEKSELRAND}
          width={DIEPTE_MM}
          height={HOOGTE - DEKSELRAND}
          fill="#000"
          opacity="0.16"
        />
        <line
          x1="0"
          y1={DEKSELRAND}
          x2={DIEPTE_MM}
          y2={DEKSELRAND}
          stroke="#150919"
          strokeWidth="0.7"
          opacity="0.7"
        />
        <Merkteken x={DIEPTE_MM / 2} y={DEKSELRAND / 2 - 5} schaal={0.6} />
      </g>

      {/* Opdruk op het deksel */}
      <g transform={DEKSEL}>
        <Woordmerk
          x={LENGTE_MM / 2}
          y={48}
          grootte={26}
          regelhoogte={28}
        />
        <Merkteken x={LENGTE_MM / 2} y={113} schaal={0.9} />
      </g>

      {/* --- de kaartrug -------------------------------------------------- */}

      <g filter="url(#kaartschaduw)" opacity="0.4">
        <g transform={RUG_KAART}>
          <rect
            x="3"
            y="7"
            width={KAART_L}
            height={KAART_B}
            rx="7"
            fill="#150919"
          />
        </g>
      </g>

      <g transform={RUG_KAART}>
        <rect
          width={KAART_L}
          height={KAART_B}
          rx="7"
          fill="url(#deksel)"
          stroke="#241130"
          strokeWidth="0.6"
        />
        {/* De dunne gouden keylijn, een paar millimeter van de rand */}
        <rect
          x="7"
          y="7"
          width={KAART_L - 14}
          height={KAART_B - 14}
          rx="4"
          fill="none"
          stroke="url(#folie)"
          strokeWidth="0.9"
        />
        <Woordmerk x={KAART_L / 2} y={35} grootte={17} regelhoogte={18} />
        {/* Het merkteken staat onderaan, zoals het ornament op de kaartrug */}
        <Merkteken x={KAART_L / 2} y={84} schaal={0.68} />
      </g>

      {/* --- de vraagkaart ------------------------------------------------ */}

      <g filter="url(#kaartschaduw)" opacity="0.34">
        <g transform={VRAAG_KAART}>
          <rect
            x="3"
            y="7"
            width={KAART_L}
            height={KAART_B}
            rx="7"
            fill="#150919"
          />
        </g>
      </g>

      <g transform={VRAAG_KAART}>
        <rect
          width={KAART_L}
          height={KAART_B}
          rx="7"
          fill="url(#karton)"
          stroke="#D9CDB2"
          strokeWidth="0.6"
        />
        <g
          className="font-serif text-[11.5px] sm:text-[10.5px]"
          fill="#3B1E4A"
          textAnchor="middle"
        >
          <text x={KAART_L / 2} y={45}>
            Welk liedje zet je op
          </text>
          <text x={KAART_L / 2} y={60}>
            na een rotdienst?
          </text>
        </g>
        <line
          x1={KAART_L / 2 - 13}
          y1="76"
          x2={KAART_L / 2 + 13}
          y2="76"
          stroke="#C9A227"
          strokeWidth="0.8"
          opacity="0.75"
        />
      </g>
    </svg>
  );
}
