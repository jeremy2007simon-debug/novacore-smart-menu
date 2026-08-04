"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Server Action en vez de una llamada directa desde el cliente: así el
 * insert corre en el servidor (misma anon key, RLS sigue siendo la
 * frontera de seguridad real — la política `reviews_public_insert` es la
 * que de verdad decide si esto puede escribir, no este archivo).
 */
export async function submitDishReview(input: {
  restaurantId: string;
  dishId: string;
  rating: number;
  authorName: string | null;
  comment: string | null;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.from("reviews").insert({
    restaurant_id: input.restaurantId,
    target_type: "dish",
    dish_id: input.dishId,
    author_name: input.authorName,
    rating: input.rating,
    comment: input.comment,
    status: "pending",
  });

  if (error) {
    return { ok: false, message: error.message };
  }
  return { ok: true };
}
