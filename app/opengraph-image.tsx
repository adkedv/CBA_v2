import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Coffee Brewing Assistant — perfect coffee, every time.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#1C0F07",
          color: "#FAF3E8",
          fontFamily: "Georgia, 'Times New Roman', Times, serif",
          textAlign: "center",
          padding: "48px",
          gap: "24px",
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 120 120"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="54" cy="66" r="28" fill="#C5A882" />
          <circle cx="86" cy="66" r="14" stroke="#C5A882" strokeWidth="8" />
        </svg>
        <div
          style={{
            fontSize: 82,
            fontWeight: 700,
            lineHeight: 1.1,
          }}
        >
          Coffee Brewing Assistant
        </div>
        <div
          style={{
            fontSize: 38,
            lineHeight: 1.2,
            color: "#D47C2A",
          }}
        >
          Perfect coffee, every time.
        </div>
      </div>
    ),
    size
  )
}
