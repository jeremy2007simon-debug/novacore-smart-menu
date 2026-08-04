import type { MetadataRoute } from "next";
import { publicEnv } from "@/lib/env";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Solo la carta pública tiene sentido en un sitemap (login/dashboard/
 * novacore ya llevan noindex). Itera todos los restaurantes activos —
 * hoy solo hay uno real, pero ya no está hardcodeado. RLS solo deja ver
 * (sin sesión) los restaurantes activos y los platos "available"/
 * "sold_out", así que no hace falta filtrar el estado a mano.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = publicEnv.NEXT_PUBLIC_SITE_URL;
  const supabase = await createSupabaseServerClient();

  const { data: restaurants } = await supabase.from("restaurants").select("id, slug").eq("status", "active");
  if (!restaurants || restaurants.length === 0) return [];

  const entries: MetadataRoute.Sitemap = [];
  for (const restaurant of restaurants) {
    const restaurantUrl = `${base}/r/${restaurant.slug}`;
    entries.push({ url: restaurantUrl, changeFrequency: "daily", priority: 1 });

    const { data: dishes } = await supabase.from("dishes").select("id").eq("restaurant_id", restaurant.id);
    for (const dish of dishes ?? []) {
      entries.push({ url: `${restaurantUrl}/platos/${dish.id}`, changeFrequency: "weekly", priority: 0.6 });
    }
  }

  return entries;
}
