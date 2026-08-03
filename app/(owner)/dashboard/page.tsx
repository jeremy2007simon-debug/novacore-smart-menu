import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

/**
 * Selector de restaurante: un usuario puede ser owner/staff de más de uno.
 * El resto del panel (platos, categorías, reseñas, QR, ajustes) llega en
 * los siguientes bloques de la Fase 1 — esto solo prueba que la sesión y
 * el aislamiento por restaurant_id funcionan de punta a punta.
 */
export default async function DashboardIndexPage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect("/login?next=/dashboard");

  const { data: memberships } = await supabase
    .from("restaurant_users")
    .select("restaurant_id, role")
    .eq("user_id", auth.claims.sub);

  const restaurantIds = memberships?.map((m) => m.restaurant_id) ?? [];

  const { data: restaurants } = restaurantIds.length
    ? await supabase.from("restaurants").select("id, slug, name").in("id", restaurantIds)
    : { data: [] as { id: string; slug: string; name: string }[] };

  const rows = (memberships ?? []).map((m) => ({
    role: m.role,
    restaurant: restaurants?.find((r) => r.id === m.restaurant_id),
  }));

  return (
    <main className="mx-auto max-w-lg px-6 py-16">
      <h1 className="text-xl font-semibold text-neutral-900">Tus restaurantes</h1>

      {rows.length === 0 ? (
        <p className="mt-4 text-sm text-neutral-500">
          Todavía no tienes ningún restaurante asignado. Contacta con NovaCore para que te den de
          alta.
        </p>
      ) : (
        <ul className="mt-4 flex flex-col gap-2">
          {rows.map(({ role, restaurant }) =>
            restaurant ? (
              <li key={restaurant.id} className="flex items-baseline gap-2">
                <Link className="underline" href={`/dashboard/${restaurant.slug}`}>
                  {restaurant.name}
                </Link>
                <span className="text-xs uppercase tracking-wide text-neutral-400">{role}</span>
              </li>
            ) : null,
          )}
        </ul>
      )}

      <form action="/auth/sign-out" method="post" className="mt-10">
        <button type="submit" className="text-sm text-neutral-500 underline">
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
