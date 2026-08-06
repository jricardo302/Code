/**
 * De kaartendoos, nagebouwd in SVG: een voorkant en een achterkant die met
 * een lichte perspectief-tilt naast elkaar staan. Bij hover komen ze iets
 * rechter te staan — alsof je ze oppakt.
 */

const B = 320; // breedte van het doosvlak
const H = 440; // hoogte

function Korrel({ id }: { id: string }) {
  return (
    <filter id={id}>
      <feTurbulence
        type="fractalNoise"
        baseFrequency="0.9"
        numOctaves="3"
        stitchTiles="stitch"
      />
      <feColorMatrix type="saturate" values="0" />
      <feComponentTransfer>
        <feFuncA type="linear" slope="0.16" />
      </feComponentTransfer>
    </filter>
  );
}

function Voorkant() {
  return (
    <svg
      viewBox={`0 0 ${B} ${H}`}
      role="img"
      aria-label="Voorkant van de kaartendoos: interVISIE, 100 vragen, 3 niveaus."
      className="h-auto w-full drop-shadow-[0_28px_40px_rgba(59,30,74,0.28)]"
    >
      <defs>
        <Korrel id="korrel-voor" />
        <linearGradient id="kraft-voor" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#F7F2E7" />
          <stop offset="100%" stopColor="#E9DCC2" />
        </linearGradient>
      </defs>

      <rect width={B} height={H} rx="14" fill="url(#kraft-voor)" />
      <rect width={B} height={H} rx="14" filter="url(#korrel-voor)" />

      {/* Dubbele gouden kaderlijn */}
      <rect
        x="16"
        y="16"
        width={B - 32}
        height={H - 32}
        rx="8"
        fill="none"
        stroke="#C9A227"
        strokeWidth="1.5"
      />
      <rect
        x="22"
        y="22"
        width={B - 44}
        height={H - 44}
        rx="5"
        fill="none"
        stroke="#C9A227"
        strokeWidth="0.6"
        opacity="0.65"
      />

      {/* Titel */}
      <text
        x={B / 2}
        y="118"
        textAnchor="middle"
        className="font-serif"
        fontSize="40"
        fill="#3B1E4A"
        letterSpacing="-1"
      >
        <tspan fontWeight="400">inter</tspan>
        <tspan fontWeight="700" fill="#8B5FBF">
          VISIE
        </tspan>
      </text>

      {/* Handgetekend krulletje onder de titel */}
      <path
        d="M92 134c26-6 48-7 72-5s44 2 66-3"
        stroke="#C9A227"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />

      <text
        x={B / 2}
        y="164"
        textAnchor="middle"
        fontSize="11.5"
        fill="#3B1E4A"
        opacity="0.8"
      >
        het kaartspel voor wie
      </text>
      <text
        x={B / 2}
        y="181"
        textAnchor="middle"
        fontSize="11.5"
        fill="#3B1E4A"
        opacity="0.8"
      >
        ándere mensen begeleidt
      </text>

      {/* Drie niveaubalken, oplopend in verzadiging */}
      {[
        { kleur: "#C9A8E0", y: 218, label: "licht" },
        { kleur: "#8B5FBF", y: 264, label: "casus" },
        { kleur: "#3B1E4A", y: 310, label: "jij" },
      ].map((niveau, index) => (
        <g key={niveau.label}>
          <rect
            x="46"
            y={niveau.y}
            width={B - 92}
            height="34"
            rx="17"
            fill={niveau.kleur}
          />
          <text
            x="70"
            y={niveau.y + 23}
            className="font-serif"
            fontSize="17"
            fontWeight="700"
            fill={index === 0 ? "#3B1E4A" : "#F5F0E4"}
          >
            {index + 1}
          </text>
          <text
            x={B - 70}
            y={niveau.y + 22}
            textAnchor="end"
            fontSize="11"
            letterSpacing="2.5"
            fill={index === 0 ? "#3B1E4A" : "#F5F0E4"}
            opacity="0.9"
          >
            NIVEAU {index + 1}
          </text>
        </g>
      ))}

      <text
        x={B / 2}
        y="382"
        textAnchor="middle"
        fontSize="12"
        letterSpacing="3"
        fill="#C9A227"
        fontWeight="600"
      >
        100 VRAGEN · 3 NIVEAUS
      </text>

      <text
        x={B / 2}
        y="406"
        textAnchor="middle"
        fontSize="10"
        fill="#3B1E4A"
        opacity="0.55"
      >
        voor de jeugdzorg
      </text>
    </svg>
  );
}

function Achterkant() {
  const regels = [
    "Speel het met z'n tweeën, met je team,",
    "of als vaste vorm voor je intervisie.",
    "Je hoeft niets te zeggen wat je niet",
    "wilt zeggen. Meestal wil je wel.",
  ];

  return (
    <svg
      viewBox={`0 0 ${B} ${H}`}
      role="img"
      aria-label="Achterkant van de kaartendoos met uitleg over de drie niveaus."
      className="h-auto w-full drop-shadow-[0_28px_40px_rgba(59,30,74,0.3)]"
    >
      <defs>
        <Korrel id="korrel-achter" />
        <linearGradient id="paars-achter" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#472459" />
          <stop offset="100%" stopColor="#31183E" />
        </linearGradient>
      </defs>

      <rect width={B} height={H} rx="14" fill="url(#paars-achter)" />
      <rect width={B} height={H} rx="14" filter="url(#korrel-achter)" />

      <rect
        x="16"
        y="16"
        width={B - 32}
        height={H - 32}
        rx="8"
        fill="none"
        stroke="#C9A227"
        strokeWidth="1.2"
        opacity="0.85"
      />

      <text
        x={B / 2}
        y="70"
        textAnchor="middle"
        className="font-serif"
        fontSize="19"
        fill="#F5F0E4"
      >
        Drie niveaus, drie lagen dieper
      </text>

      {[
        {
          nummer: "1",
          kleur: "#C9A8E0",
          tekst: "Licht. Om elkaar als mens te leren kennen.",
        },
        {
          nummer: "2",
          kleur: "#8B5FBF",
          tekst: "Casus. Reflectie op je eigen praktijk.",
        },
        {
          nummer: "3",
          kleur: "#EFE3CC",
          tekst: "Jij. Reflectie op jou, de begeleider.",
        },
      ].map((niveau, index) => (
        <g key={niveau.nummer} transform={`translate(44 ${112 + index * 56})`}>
          <circle cx="12" cy="12" r="12" fill="none" stroke={niveau.kleur} />
          <text
            x="12"
            y="17"
            textAnchor="middle"
            className="font-serif"
            fontSize="13"
            fontWeight="700"
            fill={niveau.kleur}
          >
            {niveau.nummer}
          </text>
          <text x="34" y="17" fontSize="11.5" fill="#EFE3CC" opacity="0.92">
            {niveau.tekst}
          </text>
        </g>
      ))}

      <line
        x1="44"
        y1="302"
        x2={B - 44}
        y2="302"
        stroke="#C9A227"
        strokeWidth="0.8"
        opacity="0.6"
      />

      {regels.map((regel, index) => (
        <text
          key={regel}
          x={B / 2}
          y={330 + index * 17}
          textAnchor="middle"
          fontSize="10.5"
          fill="#EFE3CC"
          opacity="0.8"
        >
          {regel}
        </text>
      ))}

      <text
        x={B / 2}
        y="412"
        textAnchor="middle"
        fontSize="10"
        letterSpacing="2.5"
        fill="#C9A227"
      >
        2–8 SPELERS · 100 KAARTEN
      </text>
    </svg>
  );
}

export function Kaartendoos() {
  return (
    <div
      className="group mx-auto flex max-w-2xl flex-col items-center justify-center gap-10 sm:flex-row sm:items-center sm:gap-8"
      style={{ perspective: "1400px" }}
    >
      {/* Op mobiel onder elkaar en groot genoeg om te lezen; vanaf sm naast
          elkaar, met een lichte tilt naar het midden toe. */}
      <div className="w-[min(78vw,320px)] transition-transform duration-500 ease-out [transform:rotateZ(-2deg)] group-hover:[transform:rotateZ(-1deg)_translateY(-6px)] sm:w-1/2 sm:origin-right sm:[transform:rotateY(16deg)_rotateZ(-3deg)_translateZ(-10px)] sm:group-hover:[transform:rotateY(8deg)_rotateZ(-1.5deg)_translateY(-8px)]">
        <Voorkant />
      </div>
      <div className="w-[min(78vw,320px)] transition-transform duration-500 ease-out [transform:rotateZ(2deg)] group-hover:[transform:rotateZ(1deg)_translateY(6px)] sm:w-1/2 sm:origin-left sm:[transform:rotateY(-16deg)_rotateZ(3deg)_translateZ(-10px)] sm:group-hover:[transform:rotateY(-8deg)_rotateZ(1.5deg)_translateY(8px)]">
        <Achterkant />
      </div>
    </div>
  );
}
