import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoReview } from "@/lib/demo/types";

export const getOwnerReviews = cache(async (restaurantId: string): Promise<DemoReview[]> => {
  const supabase = await createSupabaseServerClient();

  const [{ data: reviews }, { data: dishes }] = await Promise.all([
    supabase.from("reviews").select("*").eq("restaurant_id", restaurantId).order("created_at", { ascending: false }),
    supabase.from("dishes").select("id, name").eq("restaurant_id", restaurantId),
  ]);

  const dishNameById = new Map((dishes ?? []).map((d) => [d.id, d.name]));

  return (reviews ?? []).map((review) => ({
    ...review,
    dish_name: review.dish_id ? (dishNameById.get(review.dish_id) ?? null) : null,
  }));
});
