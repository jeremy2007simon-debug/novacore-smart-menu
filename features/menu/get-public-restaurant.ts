import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * `cache()` deduplica esta consulta dentro de la misma request: el layout
 * de /r/[slug] la usa para resolver el tema y la página la usa para pintar
 * el contenido — Supabase solo se llama una vez.
 *
 * Solo restaurantes activos: uno suspendido responde 404 (ver
 * app/(public)/r/[slug]/page.tsx), nunca se revela que existe.
 */
export const getPublicRestaurant = cache(async (slug: string) => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("restaurants")
    .select(
      "id, slug, name, description, logo_url, theme, external_rating, external_rating_count, external_review_source",
    )
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  return data;
});
