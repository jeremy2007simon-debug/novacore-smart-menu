import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

/**
 * Favicon generado (no un .ico estático) para que use el mismo azul índigo
 * de marca que el resto de la identidad NovaCore, sin depender de tener un
 * archivo de imagen en el repositorio.
 */
export default function Icon() {
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
          fontSize: 20,
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
