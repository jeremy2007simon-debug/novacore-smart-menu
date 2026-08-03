import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
import { demoDishes, demoRestaurant } from "@/lib/demo/note-di-caffe-demo";

/**
 * Solo la carta pública tiene sentido en un sitemap (login/dashboard/
 * novacore ya llevan noindex). Por ahora solo existe note-di-caffe, pero
 * lee de la misma fuente que el resto del panel — cuando haya varios
 * restaurantes reales en Supabase, esto se sustituye por una consulta que
 * itere todos los restaurantes activos en vez de uno solo hardcodeado.
 */
export default function sitemap(): MetadataRoute.Sitemap {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const restaurantUrl = `${base}/r/${demoRestaurant.slug}`;
  // "hidden"/"archived" nunca son visibles públicamente — no pertenecen al sitemap.
  const publicDishes = demoDishes.filter((d) => d.status === "available" || d.status === "sold_out");

  return [
    { url: restaurantUrl, changeFrequency: "daily", priority: 1 },
    ...publicDishes.map((dish) => ({
      url: `${restaurantUrl}/platos/${dish.id}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];
}
