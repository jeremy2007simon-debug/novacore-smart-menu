import type { MetadataRoute } from "next";

/**
 * Manifest de la propia identidad NovaCore (login, panel del propietario,
 * panel NovaCore) — instalable como app de escritorio/móvil para gestionar
 * el restaurante. La carta pública de cada restaurante usa su propio
 * manifest (ver app/(public)/r/[slug]/manifest.webmanifest/route.ts), con
 * el nombre y el color de marca de ESE restaurante en vez de los de aquí.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "NovaCore Smart Menu",
    short_name: "NovaCore",
    description: "Panel para gestionar la carta digital de tu restaurante.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#f7f8fa",
    theme_color: "#3652e0",
    icons: [
      { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icon-512-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
  };
}
