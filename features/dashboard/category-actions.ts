"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { DemoCategory } from "@/lib/demo/types";
import type { Category } from "@/lib/types/database";

export async function createCategory(input: { restaurantId: string; sortOrder: number }): Promise<Category | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("categories")
    .insert({ restaurant_id: input.restaurantId, name: "Nueva categoría", sort_order: input.sortOrder })
    .select()
    .single();

  if (error) {
    console.error("createCategory", error.message);
    return null;
  }
  return data;
}

export async function updateCategory(categoryId: string, patch: Partial<DemoCategory>): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();

  const categoryPatch: Partial<Category> = {};
  if ("name" in patch) categoryPatch.name = patch.name;
  if ("icon" in patch) categoryPatch.icon = patch.icon;
  if ("sort_order" in patch) categoryPatch.sort_order = patch.sort_order;
  if ("available_from" in patch) categoryPatch.available_from = patch.available_from;
  if ("available_to" in patch) categoryPatch.available_to = patch.available_to;
  if ("available_days" in patch) categoryPatch.available_days = patch.available_days;

  if (Object.keys(categoryPatch).length === 0) return { ok: true };

  const { error } = await supabase.from("categories").update(categoryPatch).eq("id", categoryId);
  if (error) {
    console.error("updateCategory", error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function reorderCategories(updates: { id: string; sort_order: number }[]): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const results = await Promise.all(
    updates.map(({ id, sort_order }) => supabase.from("categories").update({ sort_order }).eq("id", id)),
  );
  const failed = results.find((r) => r.error);
  if (failed?.error) {
    console.error("reorderCategories", failed.error.message);
    return { ok: false };
  }
  return { ok: true };
}
