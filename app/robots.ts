import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";

/**
 * La carta pública de cada restaurante (/r/*) es lo único pensado para
 * buscadores — el resto (login, panel del propietario, panel NovaCore) ya
 * lleva `robots: noindex` en su metadata (ver app/layout.tsx), pero además
 * se bloquea aquí explícitamente para no gastar presupuesto de rastreo en
 * páginas privadas.
 */
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/dashboard", "/login", "/novacore", "/auth"],
    },
    sitemap: `${publicEnv.NEXT_PUBLIC_SITE_URL}/sitemap.xml`,
  };
}
