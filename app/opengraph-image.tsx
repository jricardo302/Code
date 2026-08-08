import { ImageResponse } from "next/og";

export const alt =
  "IK ZIE, IK ZIE… INTERVISIE — 100 vraagkaarten voor intervisie in jeugdhulp en GGZ";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * De social-preview, gegenereerd in plaats van als bestand meegeleverd. Zo
 * loopt hij nooit uit de pas met het merk.
 *
 * Let op: hier draait geen Tailwind en geen CSS-variabele, dus de kleuren
 * staan letterlijk in de stijl. Ze komen uit design/brand-guide.md.
 */
export default function OgAfbeelding() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "76px 88px",
          background: "linear-gradient(160deg, #4A2A5C 0%, #2E1738 62%, #24122C 100%)",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            letterSpacing: 8,
            color: "#C9A8E0",
            fontWeight: 700,
          }}
        >
          100 VRAGEN · 3 NIVEAUS · 2–10 PROFESSIONALS
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 34,
            fontSize: 104,
            fontWeight: 900,
            color: "#F7F2E7",
            letterSpacing: -4,
          }}
        >
          IK ZIE, IK ZIE…
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 12,
            fontSize: 56,
            letterSpacing: 14,
            fontWeight: 900,
          }}
        >
          <span style={{ color: "#F7F2E7" }}>INTER</span>
          <span style={{ color: "#C9A8E0" }}>VISIE</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 46,
            width: 120,
            height: 4,
            background: "#C9A8E0",
          }}
        />

        <div
          style={{
            display: "flex",
            marginTop: 32,
            fontSize: 30,
            color: "#F7F2E7",
            opacity: 0.78,
          }}
        >
          Het intervisiekaartspel voor jeugdhulp, jeugd-GGZ en GGZ
        </div>
      </div>
    ),
    size,
  );
}
