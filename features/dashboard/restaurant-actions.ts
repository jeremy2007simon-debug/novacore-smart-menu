"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { Restaurant } from "@/lib/types/database";

type RestaurantPatch = Partial<
  Pick<
    Restaurant,
    | "name"
    | "logo_url"
    | "cover_url"
    | "theme"
    | "description"
    | "phone"
    | "whatsapp"
    | "address"
    | "social_links"
    | "schedule"
    | "currency"
    | "operating_status"
    | "operating_status_message"
    | "operating_status_until"
    | "seo_title"
    | "seo_description"
  >
>;

export async function updateRestaurant(restaurantId: string, patch: RestaurantPatch): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("restaurants").update(patch).eq("id", restaurantId);
  if (error) {
    console.error("updateRestaurant", error.message);
    return { ok: false };
  }
  return { ok: true };
}
