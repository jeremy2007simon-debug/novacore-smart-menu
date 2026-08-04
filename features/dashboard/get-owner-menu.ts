import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoCategory, DemoDish } from "@/lib/demo/types";
import type { Allergen, Restaurant } from "@/lib/types/database";

export type OwnerMenu = {
  restaurant: Restaurant;
  categories: DemoCategory[];
  dishes: DemoDish[];
  allergens: Allergen[];
};

/**
 * Datos del panel del propietario para un restaurante ya autorizado (el
 * layout ya comprobó `has_restaurant_role`). RLS deja ver TODOS los
 * estados de plato a owner/staff, a diferencia de la carta pública. Misma
 * estrategia que features/menu/get-public-menu.ts: consultas planas +
 * unión en JS, sin `select` anidado, porque el `Database` no declara
 * `Relationships`.
 */
export const getOwnerMenu = cache(async (restaurantId: string): Promise<OwnerMenu | null> => {
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase.from("restaurants").select("*").eq("id", restaurantId).maybeSingle();
  if (!restaurant) return null;

  const [{ data: categoriesRaw }, { data: dishesRaw }, { data: allergens }] = await Promise.all([
    supabase.from("categories").select("*").eq("restaurant_id", restaurantId).order("sort_order"),
    supabase.from("dishes").select("*").eq("restaurant_id", restaurantId).order("sort_order"),
    supabase.from("allergens").select("*").order("name_es"),
  ]);

  const categories = categoriesRaw ?? [];
  const dishes = dishesRaw ?? [];
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

  return { restaurant, categories: shapedCategories, dishes: shapedDishes, allergens: allergens ?? [] };
});
