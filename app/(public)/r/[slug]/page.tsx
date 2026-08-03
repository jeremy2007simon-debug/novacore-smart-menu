import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type RestaurantPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Placeholder de la carta pública: solo demuestra que un visitante sin
 * sesión puede leer un restaurante activo (RLS: restaurants_read) y que uno
 * suspendido responde 404 en vez de revelar que existe. Categorías,
 * buscador, platos y reseñas llegan en el bloque de la carta pública.
 */
export default async function RestaurantPublicPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, description, logo_url")
    .eq("slug", slug)
    .eq("status", "active")
    .maybeSingle();

  if (!restaurant) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">{restaurant.name}</h1>
      {restaurant.description ? (
        <p className="mt-2 text-neutral-600">{restaurant.description}</p>
      ) : null}
      <p className="mt-8 text-sm text-neutral-400">
        Categorías, buscador, platos y reseñas — siguiente bloque de la Fase 1.
      </p>
    </main>
  );
}
