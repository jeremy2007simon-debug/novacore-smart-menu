import { cache } from "react";
import {
  demoAllergens,
  demoCategories,
  demoDishes,
  demoRestaurant,
  demoReviews,
} from "@/lib/demo/note-di-caffe-demo";
import type { DemoCategory, DemoDish, DemoReview } from "@/lib/demo/types";
import type { Restaurant } from "@/lib/types/database";

export type PublicMenu = {
  restaurant: Restaurant;
  categories: DemoCategory[];
  dishes: DemoDish[];
  reviews: DemoReview[];
  allergens: typeof demoAllergens;
};

/**
 * Fuente de datos de la carta pública. Hoy lee del mismo dataset real
 * (lib/demo/note-di-caffe-demo.ts) que usa el panel del propietario, porque
 * este entorno todavía no tiene un proyecto Supabase real conectado — es la
 * misma decisión ya tomada para todo el panel. Solo restaurantes activos
 * son visibles (uno suspendido responde 404, nunca revela que existe).
 *
 * Cuando haya un proyecto Supabase real, esta es la ÚNICA función que hace
 * falta cambiar (por una consulta a restaurants + categories + dishes +
 * reviews filtrada por RLS) — ni el layout ni las páginas que la usan
 * necesitan tocarse.
 */
export const getPublicMenu = cache(async (slug: string): Promise<PublicMenu | null> => {
  if (slug !== demoRestaurant.slug || demoRestaurant.status !== "active") return null;

  return {
    restaurant: demoRestaurant,
    categories: demoCategories,
    dishes: demoDishes,
    reviews: demoReviews,
    allergens: demoAllergens,
  };
});
