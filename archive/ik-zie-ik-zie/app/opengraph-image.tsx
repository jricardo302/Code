import { ImageResponse } from "next/og";

export const alt =
  "Ik zie ik zie… — het intervisiespel voor de jeugdzorg";
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
            marginTop: 30,
            fontSize: 116,
            fontWeight: 700,
            color: "#3B1E4A",
            letterSpacing: -3,
          }}
        >
          ik zie&nbsp;
          <span style={{ color: "#8B5FBF" }}>ik zie</span>
          <span style={{ color: "#C9A227" }}>…</span>
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 22,
            fontSize: 34,
            letterSpacing: 10,
            fontWeight: 600,
            color: "#3B1E4A",
            opacity: 0.75,
          }}
        >
          HET INTERVISIESPEL
        </div>

        <div style={{ display: "flex", gap: 14, marginTop: 44 }}>
          {["#C9A8E0", "#8B5FBF", "#3B1E4A"].map((kleur, index) => (
            <div
              key={kleur}
              style={{
                display: "flex",
                width: 180 + index * 60,
                height: 20,
                borderRadius: 10,
                background: kleur,
              }}
            />
          ))}
        </div>

        <div
          style={{
            display: "flex",
            marginTop: 38,
            fontSize: 26,
            color: "#3B1E4A",
            opacity: 0.6,
          }}
        >
          Voor behandelaren en begeleiders in de jeugdzorg
        </div>
      </div>
    ),
    size,
  );
}
