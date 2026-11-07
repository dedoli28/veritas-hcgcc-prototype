import { ImageResponse } from "next/og";

export const alt = "Veritas Prototype | HCGCC 2026";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: 80,
          background: "#0f3d22",
          color: "#ffffff",
        }}
      >
        <div style={{ fontSize: 34, color: "#fcd34d", fontWeight: 700 }}>Veritas Prototype · HCGCC 2026</div>
        <div style={{ fontSize: 76, fontWeight: 800, marginTop: 24, lineHeight: 1.1 }}>
          Turning daily habits into durable revenue
        </div>
        <div style={{ fontSize: 32, marginTop: 36, color: "#bbf7d0" }}>
          Earn the upgrade, don’t gate the lesson. Concept demo by Team Veritas. Not affiliated with Duolingo.
        </div>
      </div>
    ),
    size,
  );
}
