import { Kaart, KaartAchterkant } from "@/components/Kaart";
import { voorbeelden } from "@/lib/kaarten";

/**
 * Productbeeld zonder fotografie.
 *
 * Er zijn nog geen foto's — de eerste oplage is niet gedrukt. In plaats van
 * een stockfoto of een gerenderde nepfoto tekenen we de doos in SVG: dezelfde
 * maten, dezelfde kleuren en dezelfde typografie als het printbestand. Zodra
 * er echte fotografie is vervang je deze component en verder niets.
 *
 * De doos is een magnetische klapdoos van 132 × 80 × 42 mm (zie
 * design/print-specs.md). De verhoudingen hieronder komen daarvandaan.
 */

const VERLOOP = (
  <>
    <linearGradient id="doosverloop" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stopColor="#4A2A5C" />
      <stop offset="62%" stopColor="#2E1738" />
      <stop offset="100%" stopColor="#24122C" />
    </linearGradient>
    <linearGradient id="zijverloop" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0%" stopColor="#24122C" />
      <stop offset="100%" stopColor="#3B1E4A" />
    </linearGradient>
    <linearGradient id="glans" x1="0" y1="0" x2="0.7" y2="1">
      <stop offset="0%" stopColor="#C9A8E0" stopOpacity="0.22" />
      <stop offset="55%" stopColor="#C9A8E0" stopOpacity="0" />
    </linearGradient>
  </>
);

/** De gesloten doos, recht van voren. Dit is het hoofd-productbeeld. */
export function DoosVoorkant({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 330 200"
      role="img"
      aria-label="De doos van IK ZIE, IK ZIE… INTERVISIE: een matte, diep paarse magneetdoos met crème belettering."
      className={className}
    >
      <defs>{VERLOOP}</defs>

      <rect
        x="1"
        y="1"
        width="328"
        height="198"
        rx="8"
        fill="url(#doosverloop)"
      />
      <rect
        x="1"
        y="1"
        width="328"
        height="198"
        rx="8"
        fill="url(#glans)"
      />
      {/* Crème keylijn, ruim binnen de snijlijn zodat hij het stansen overleeft. */}
      <rect
        x="14"
        y="14"
        width="302"
        height="172"
        rx="4"
        fill="none"
        stroke="#F7F2E7"
        strokeOpacity="0.28"
      />

      <text
        x="165"
        y="82"
        textAnchor="middle"
        fill="#F7F2E7"
        fontFamily="var(--font-merk)"
        fontWeight="900"
        fontSize="30"
        letterSpacing="-0.6"
      >
        IK ZIE, IK ZIE…
      </text>

      <text
        x="165"
        y="112"
        textAnchor="middle"
        fontFamily="var(--font-merk)"
        fontWeight="900"
        fontSize="17"
        letterSpacing="5"
      >
        <tspan fill="#F7F2E7">INTER</tspan>
        <tspan fill="#C9A8E0">VISIE</tspan>
      </text>

      <line
        x1="128"
        y1="128"
        x2="202"
        y2="128"
        stroke="#C9A8E0"
        strokeOpacity="0.55"
      />

      <text
        x="165"
        y="152"
        textAnchor="middle"
        fill="#F7F2E7"
        fillOpacity="0.72"
        fontFamily="var(--font-sans)"
        fontWeight="600"
        fontSize="9.5"
        letterSpacing="1.4"
      >
        100 VRAGEN VOOR GESPREKKEN DIE VERDER KIJKEN
      </text>
    </svg>
  );
}

/**
 * De doos in perspectief met de zijkant erbij, zoals hij op tafel ligt.
 * Twee vlakken, handmatig geplaatst — geen 3D-bibliotheek voor één beeld.
 */
export function DoosPerspectief({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 260"
      role="img"
      aria-label="De doos van IK ZIE, IK ZIE… INTERVISIE schuin van voren, met de zijkant waarop KIJK. VRAAG. REFLECTEER. staat."
      className={className}
    >
      <defs>
        {VERLOOP}
        <filter id="schaduw" x="-20%" y="-20%" width="140%" height="150%">
          <feDropShadow
            dx="0"
            dy="16"
            stdDeviation="18"
            floodColor="#2B1733"
            floodOpacity="0.45"
          />
        </filter>
      </defs>

      <g filter="url(#schaduw)">
        {/* Zijkant (de dikte van de doos) */}
        <path
          d="M40 62 L40 214 L84 236 L84 84 Z"
          fill="url(#zijverloop)"
        />
        {/* Voorvlak */}
        <path
          d="M84 84 L84 236 L392 194 L392 42 Z"
          fill="url(#doosverloop)"
        />
        <path d="M84 84 L84 236 L392 194 L392 42 Z" fill="url(#glans)" />
        {/* Bovenkant (het klapdeksel) */}
        <path d="M40 62 L84 84 L392 42 L349 22 Z" fill="#4A2A5C" />
      </g>

      {/* Belettering op het voorvlak, met dezelfde helling als het vlak. */}
      <g transform="translate(238 139) skewY(-7.8)">
        <text
          textAnchor="middle"
          fill="#F7F2E7"
          fontFamily="var(--font-merk)"
          fontWeight="900"
          fontSize="28"
          letterSpacing="-0.5"
          y="-14"
        >
          IK ZIE, IK ZIE…
        </text>
        <text
          textAnchor="middle"
          fontFamily="var(--font-merk)"
          fontWeight="900"
          fontSize="15"
          letterSpacing="4.5"
          y="14"
        >
          <tspan fill="#F7F2E7">INTER</tspan>
          <tspan fill="#C9A8E0">VISIE</tspan>
        </text>
        <line
          x1="-40"
          y1="30"
          x2="40"
          y2="30"
          stroke="#C9A8E0"
          strokeOpacity="0.5"
        />
        <text
          textAnchor="middle"
          fill="#F7F2E7"
          fillOpacity="0.7"
          fontFamily="var(--font-sans)"
          fontWeight="600"
          fontSize="8.5"
          letterSpacing="1.2"
          y="48"
        >
          100 VRAGEN · 3 NIVEAUS · 2–10 PROFESSIONALS
        </text>
      </g>

      {/* Zijkant-tekst, staand */}
      <text
        transform="translate(66 208) rotate(-90) skewX(-8)"
        fill="#F7F2E7"
        fillOpacity="0.75"
        fontFamily="var(--font-merk)"
        fontWeight="900"
        fontSize="10"
        letterSpacing="2.6"
      >
        KIJK. VRAAG. REFLECTEER.
      </text>
    </svg>
  );
}

/**
 * De open doos met de drie niveaus zichtbaar. Gebruikt de echte kaarten uit
 * cards.json, dus wat hier staat staat straks ook op karton.
 */
export function DoosOpen({ className = "" }: { className?: string }) {
  const kaarten = [
    voorbeelden(1, 1)[0],
    voorbeelden(2, 1)[0],
    voorbeelden(3, 1)[0],
  ];

  return (
    <div className={`grid grid-cols-3 gap-3 sm:gap-5 ${className}`}>
      {kaarten.map((kaart) => (
        <Kaart key={kaart.card_number} kaart={kaart} />
      ))}
    </div>
  );
}

/**
 * Een losse stapel: drie achterkanten die achter elkaar wegvallen. Bewust
 * subtiel geroteerd, zodat het een stapel is en geen keurige grid.
 *
 * De twee achterste kaarten liggen absoluut over de voorste heen. De voorste
 * staat in de normale flow en bepaalt dus de hoogte van de stapel — zet je ze
 * alle drie absoluut, dan klapt de container dicht.
 */
export function KaartStapel({ className = "" }: { className?: string }) {
  return (
    <div className={`relative ${className}`}>
      <KaartAchterkant className="absolute inset-0 translate-x-3 translate-y-2 rotate-6 opacity-45" />
      <KaartAchterkant className="absolute inset-0 translate-x-1.5 translate-y-1 rotate-3 opacity-70" />
      <KaartAchterkant className="relative" />
    </div>
  );
}
