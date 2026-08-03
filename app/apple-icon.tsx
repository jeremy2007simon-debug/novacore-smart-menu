import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS aplica su propio recorte de esquinas redondeadas — el icono debe ir
 * a bordes vivos y sin transparencia, nunca redondeado a mano.
 */
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#3652e0",
          color: "#ffffff",
          fontSize: 108,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        N
      </div>
    ),
    { ...size },
  );
}
