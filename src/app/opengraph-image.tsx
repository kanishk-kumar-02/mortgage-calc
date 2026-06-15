import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "#15192b",
          color: "#fbf7f0",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: 96,
            height: 96,
            borderRadius: 24,
            background: "#2541b2",
            fontSize: 48,
            fontWeight: 700,
            color: "#d4a537",
            marginBottom: 32,
          }}
        >
          ₹
        </div>
        <div style={{ fontSize: 80, fontWeight: 800, letterSpacing: "-0.02em" }}>
          Nivaas
        </div>
        <div
          style={{
            marginTop: 16,
            height: 4,
            width: 120,
            borderRadius: 999,
            background: "#d4a537",
          }}
        />
        <div
          style={{
            marginTop: 28,
            fontSize: 32,
            color: "rgba(251, 247, 240, 0.7)",
          }}
        >
          Home Loan EMI Calculator for India
        </div>
      </div>
    ),
    { ...size }
  );
}
