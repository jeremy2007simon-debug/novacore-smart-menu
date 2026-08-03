import { notFound } from "next/navigation";
import { getPublicRestaurant } from "@/features/menu/get-public-restaurant";

type RestaurantPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * Placeholder de la carta pública: ya hereda el tema real del restaurante
 * (ver el layout de este mismo segmento). Categorías, buscador, platos y
 * reseñas llegan en el bloque de la carta pública.
 */
export default async function RestaurantPublicPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const restaurant = await getPublicRestaurant(slug);

  if (!restaurant) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="font-display text-2xl font-semibold text-foreground">{restaurant.name}</h1>
      {restaurant.description ? (
        <p className="mt-2 text-muted-foreground">{restaurant.description}</p>
      ) : null}
      <p className="mt-8 text-sm text-faint-foreground">
        Categorías, buscador, platos y reseñas — siguiente bloque de la Fase 1.
      </p>
    </main>
  );
}
