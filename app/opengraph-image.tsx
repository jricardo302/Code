import { ImageResponse } from "next/og";

export const alt =
  "InterVISIE — het kaartspel voor wie ándere mensen begeleidt";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

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
          padding: "72px 88px",
          background: "#F5F0E4",
          borderBottom: "18px solid #3B1E4A",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 26,
            letterSpacing: 6,
            color: "#C9A227",
            fontWeight: 700,
          }}
        >
          100 VRAGEN · 3 NIVEAUS
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 26,
            fontSize: 128,
            fontWeight: 700,
            color: "#3B1E4A",
            letterSpacing: -4,
          }}
        >
          inter
          <span style={{ color: "#8B5FBF" }}>VISIE</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 18,
            fontSize: 40,
            color: "#3B1E4A",
            opacity: 0.85,
          }}
        >
          het kaartspel voor wie ándere mensen begeleidt
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 48 }}>
          {["#C9A8E0", "#8B5FBF", "#3B1E4A"].map((kleur, index) => (
            <div
              key={kleur}
              style={{
                display: "flex",
                width: 200 + index * 60,
                height: 22,
                borderRadius: 11,
                background: kleur,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 40,
            fontSize: 26,
            color: "#3B1E4A",
            opacity: 0.6,
          }}
        >
          Voor intervisie in de jeugdzorg
        </div>
      </div>
    ),
    size,
  );
}
