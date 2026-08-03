import { ImageResponse } from "next/og";

/**
 * Icono de marca de NovaCore, compartido entre los distintos tamaños que
 * necesita manifest.ts (192, 512 y 512 "maskable"). La versión maskable dej
 * un margen de seguridad mayor porque Android/iOS pueden recortarla a un
 * círculo o una forma redondeada al añadirla a la pantalla de inicio.
 */
export function renderAppIcon({ size, maskable = false }: { size: number; maskable?: boolean }) {
  const fontSize = maskable ? size * 0.28 : size * 0.62;

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
          fontSize,
          fontWeight: 700,
          fontFamily: "system-ui, sans-serif",
        }}
      >
        N
      </div>
    ),
    { width: size, height: size },
  );
}
