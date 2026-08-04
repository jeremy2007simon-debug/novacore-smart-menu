"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoDish } from "@/lib/demo/types";
import type { Dish } from "@/lib/types/database";

/**
 * Server Actions para Platos: RLS (`dishes_staff_insert`/`_update`) es la
 * frontera de seguridad real, esto solo reparte cada campo del `Partial
 * <DemoDish>` del editor hacia la tabla que le corresponde de verdad —
 * `dishes` para las columnas propias, `dish_media` para las imágenes y
 * `dish_allergens` para los alérgenos, que en la UI viven aplanados en un
 * solo objeto por comodidad pero en la base de datos son tablas aparte.
 */

export async function createDish(input: {
  restaurantId: string;
  categoryId: string | null;
  sortOrder: number;
}): Promise<Dish | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("dishes")
    .insert({
      restaurant_id: input.restaurantId,
      category_id: input.categoryId,
      name: "Nuevo plato",
      price_cents: 0,
      status: "hidden",
      sort_order: input.sortOrder,
    })
    .select()
    .single();

  if (error) {
    console.error("createDish", error.message);
    return null;
  }
  return data;
}

export async function updateDish(dishId: string, patch: Partial<DemoDish>): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();

  const dishPatch: Partial<Dish> = {};
  if ("name" in patch) dishPatch.name = patch.name;
  if ("short_description" in patch) dishPatch.short_description = patch.short_description;
  if ("description" in patch) dishPatch.description = patch.description;
  if ("ingredients" in patch) dishPatch.ingredients = patch.ingredients;
  if ("spice_level" in patch) dishPatch.spice_level = patch.spice_level;
  if ("nutritional_info" in patch) dishPatch.nutritional_info = patch.nutritional_info;
  if ("price_cents" in patch) dishPatch.price_cents = patch.price_cents;
  if ("status" in patch) dishPatch.status = patch.status;
  if ("badges" in patch) dishPatch.badges = patch.badges;
  if ("category_id" in patch) dishPatch.category_id = patch.category_id;
  if ("sort_order" in patch) dishPatch.sort_order = patch.sort_order;

  if (Object.keys(dishPatch).length > 0) {
    const { error } = await supabase.from("dishes").update(dishPatch).eq("id", dishId);
    if (error) {
      console.error("updateDish", error.message);
      return { ok: false };
    }
  }

  if (patch.allergen_codes) {
    const { data: allergens } = await supabase.from("allergens").select("id, code").in("code", patch.allergen_codes);
    await supabase.from("dish_allergens").delete().eq("dish_id", dishId);
    const rows = (allergens ?? []).map((a) => ({ dish_id: dishId, allergen_id: a.id }));
    if (rows.length > 0) {
      const { error } = await supabase.from("dish_allergens").insert(rows);
      if (error) {
        console.error("updateDish allergens", error.message);
        return { ok: false };
      }
    }
  }

  if (patch.gallery_urls) {
    await supabase.from("dish_media").delete().eq("dish_id", dishId);
    const rows = patch.gallery_urls.map((url, sort_order) => ({ dish_id: dishId, url, sort_order }));
    if (rows.length > 0) {
      const { error } = await supabase.from("dish_media").insert(rows);
      if (error) {
        console.error("updateDish media", error.message);
        return { ok: false };
      }
    }
  }

  return { ok: true };
}

export async function reorderDishes(updates: { id: string; sort_order: number }[]): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    updates.map(({ id, sort_order }) => supabase.from("dishes").update({ sort_order }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("reorderDishes", failed.error.message);
    return { ok: false };
  }
  return { ok: true };
}
