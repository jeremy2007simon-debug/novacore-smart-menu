import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * `cache()` deduplica esta consulta dentro de la misma request: el layout
 * del panel la usa para el guardia de acceso y cada pantalla la vuelve a
 * llamar para pintar su contenido — Supabase solo se consulta una vez por
 * navegación. Sin filtro de `status`: a diferencia de la carta pública,
 * aquí RLS ya decide qué restaurantes puede ver este usuario (el suyo,
 * activo o no) a través de `has_restaurant_role`.
 */
export const getOwnerRestaurant = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.from("restaurants").select("*").eq("slug", slug).maybeSingle();
  return data;
});
