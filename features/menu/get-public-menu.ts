import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoCategory, DemoDish, DemoReview } from "@/lib/demo/types";
import type { Allergen, Restaurant } from "@/lib/types/database";

export type PublicMenu = {
  restaurant: Restaurant;
  categories: DemoCategory[];
  dishes: DemoDish[];
  reviews: DemoReview[];
  allergens: Allergen[];
};

/**
 * Fuente de datos de la carta pública, ahora contra el proyecto Supabase
 * real: RLS decide qué es visible sin que esta función tenga que filtrar
 * nada a mano — un visitante anónimo solo puede leer el restaurante si
 * está activo (política `restaurants_read`), los platos "available"/
 * "sold_out" (`dishes_read`) y las reseñas aprobadas (`reviews_read`). Los
 * tipos `DemoCategory`/`DemoDish`/`DemoReview` (lib/demo/types.ts) se
 * mantienen tal cual pese al nombre — son solo la forma de los datos, no
 * dependen del origen — para no tener que tocar ningún componente que ya
 * los usa.
 *
 * Consultas separadas y sin `select` anidado a propósito: el `Database`
 * de lib/types/database.ts no declara `Relationships`, así que Supabase
 * no podría inferir el tipo de un `select` con joins — se unen los datos
 * a mano en JS, más verboso pero sin pelearse con el tipado.
 */
export const getPublicMenu = cache(async (slug: string): Promise<PublicMenu | null> => {
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("*")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!restaurant) return null;

  const [{ data: categoriesRaw }, { data: dishesRaw }, { data: reviewsRaw }, { data: allergens }] =
    await Promise.all([
      supabase.from("categories").select("*").eq("restaurant_id", restaurant.id).order("sort_order"),
      supabase.from("dishes").select("*").eq("restaurant_id", restaurant.id).order("sort_order"),
      supabase.from("reviews").select("*").eq("restaurant_id", restaurant.id).order("created_at", { ascending: false }),
      supabase.from("allergens").select("*"),
    ]);

  const categories = categoriesRaw ?? [];
  const dishes = dishesRaw ?? [];
  const reviews = reviewsRaw ?? [];
  const dishIds = dishes.map((d) => d.id);

  const [{ data: mediaRaw }, { data: dishAllergensRaw }] = await Promise.all([
    dishIds.length
      ? supabase.from("dish_media").select("*").in("dish_id", dishIds).order("sort_order")
      : Promise.resolve({ data: [] }),
    dishIds.length
      ? supabase.from("dish_allergens").select("*").in("dish_id", dishIds)
      : Promise.resolve({ data: [] }),
  ]);

  const categoryNameById = new Map(categories.map((c) => [c.id, c.name]));
  const allergenCodeById = new Map((allergens ?? []).map((a) => [a.id, a.code]));

  const mediaByDish = new Map<string, string[]>();
  for (const media of mediaRaw ?? []) {
    const list = mediaByDish.get(media.dish_id) ?? [];
    list.push(media.url);
    mediaByDish.set(media.dish_id, list);
  }

  const allergenCodesByDish = new Map<string, string[]>();
  for (const link of dishAllergensRaw ?? []) {
    const code = allergenCodeById.get(link.allergen_id);
    if (!code) continue;
    const list = allergenCodesByDish.get(link.dish_id) ?? [];
    list.push(code);
    allergenCodesByDish.set(link.dish_id, list);
  }

  const dishNameById = new Map(dishes.map((d) => [d.id, d.name]));

  const shapedDishes: DemoDish[] = dishes.map((dish) => {
    const gallery = mediaByDish.get(dish.id) ?? [];
    return {
      ...dish,
      category_name: dish.category_id ? (categoryNameById.get(dish.category_id) ?? "") : "",
      image_url: gallery[0] ?? null,
      gallery_urls: gallery,
      allergen_codes: allergenCodesByDish.get(dish.id) ?? [],
    };
  });

  const shapedCategories: DemoCategory[] = categories.map((category) => ({
    ...category,
    dish_count: shapedDishes.filter((d) => d.category_id === category.id).length,
  }));

  const shapedReviews: DemoReview[] = reviews.map((review) => ({
    ...review,
    dish_name: review.dish_id ? (dishNameById.get(review.dish_id) ?? null) : null,
  }));

  return {
    restaurant,
    categories: shapedCategories,
    dishes: shapedDishes,
    reviews: shapedReviews,
    allergens: allergens ?? [],
  };
});
