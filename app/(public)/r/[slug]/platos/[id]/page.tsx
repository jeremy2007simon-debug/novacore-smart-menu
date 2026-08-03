import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/empty-state";
import { WriteReviewForm } from "@/components/public/write-review-form";
import { getPublicMenu, type PublicMenu } from "@/features/menu/get-public-menu";
import { formatPrice } from "@/lib/utils/money";
import type { DishBadge } from "@/lib/types/database";

const BADGE_LABEL: Record<DishBadge, string> = {
  recommended: "Recomendado",
  bestseller: "Más vendido",
  new: "Nuevo",
  on_offer: "Oferta",
};

type DishPageProps = {
  params: Promise<{ slug: string; id: string }>;
};

// "hidden"/"archived" nunca son visibles para el cliente final, ni por
// enlace directo: se comportan como si el plato no existiera.
function findVisibleDish(menu: PublicMenu, id: string) {
  const dish = menu.dishes.find((d) => d.id === id);
  if (!dish || dish.status === "hidden" || dish.status === "archived") return null;
  return dish;
}

export async function generateMetadata({ params }: DishPageProps) {
  const { slug, id } = await params;
  const menu = await getPublicMenu(slug);
  if (!menu) return {};
  const dish = findVisibleDish(menu, id);
  if (!dish) return {};

  const description =
    dish.short_description ??
    (dish.ingredients.length > 0
      ? `${dish.ingredients.join(", ")} — ${formatPrice(dish.price_cents, menu.restaurant.currency)}.`
      : `Descubre ${dish.name} en la carta de ${menu.restaurant.name}.`);
  const title = `${dish.name} — ${menu.restaurant.name}`;

  return {
    title: { absolute: title },
    description,
    alternates: { canonical: `/r/${slug}/platos/${id}` },
    openGraph: {
      title,
      description,
      type: "website" as const,
      url: `/r/${slug}/platos/${id}`,
      images: dish.image_url ? [{ url: dish.image_url }] : undefined,
    },
  };
}

export default async function DishDetailPage({ params }: DishPageProps) {
  const { slug, id } = await params;
  const menu = await getPublicMenu(slug);
  if (!menu) notFound();

  const dish = findVisibleDish(menu, id);
  if (!dish) notFound();

  const soldOut = dish.status === "sold_out";
  const allergenNames = (dish.allergen_codes ?? [])
    .map((code) => menu.allergens.find((a) => a.code === code)?.name_es)
    .filter((n): n is string => Boolean(n));
  const dishReviews = menu.reviews.filter((r) => r.dish_id === dish.id && r.status === "approved");

  return (
    <main className="mx-auto max-w-2xl px-6 py-8">
      <Link
        href={`/r/${slug}`}
        className="nova-transition inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Volver a la carta
      </Link>

      <div className="relative mt-4 aspect-4/3 w-full overflow-hidden rounded-lg bg-surface-raised">
        {dish.image_url ? (
          <Image
            src={dish.image_url}
            alt={dish.name}
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UtensilsCrossed className="h-10 w-10 text-faint-foreground" aria-hidden="true" />
          </div>
        )}
        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="neutral">Agotado</Badge>
          </div>
        ) : null}
      </div>

      <div className="mt-5 flex items-start justify-between gap-4">
        <h1 className="font-display text-2xl font-semibold text-balance text-foreground">{dish.name}</h1>
        <span className="whitespace-nowrap font-display text-xl font-semibold text-foreground">
          {formatPrice(dish.price_cents, menu.restaurant.currency)}
        </span>
      </div>

      {dish.badges.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {dish.badges.map((badge) => (
            <Badge key={badge} variant={badge === "on_offer" ? "danger" : "accent"}>
              {BADGE_LABEL[badge]}
            </Badge>
          ))}
        </div>
      ) : null}

      {dish.rating_count > 0 ? (
        <div className="mt-3">
          <Rating value={dish.avg_rating} count={dish.rating_count} />
        </div>
      ) : null}

      {dish.short_description ? <p className="mt-4 text-muted-foreground">{dish.short_description}</p> : null}

      {dish.ingredients.length > 0 ? (
        <div className="mt-4">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-faint-foreground">Ingredientes</p>
          <div className="flex flex-wrap gap-1.5">
            {dish.ingredients.map((ingredient) => (
              <Badge key={ingredient} variant="outline">
                {ingredient}
              </Badge>
            ))}
          </div>
        </div>
      ) : null}

      {allergenNames.length > 0 ? (
        <p className="mt-3 text-sm text-faint-foreground">Alérgenos: {allergenNames.join(", ")}</p>
      ) : null}

      <div className="mt-10 flex flex-col gap-4">
        <h2 className="font-display text-lg font-semibold text-foreground">Reseñas</h2>

        {dishReviews.length === 0 ? (
          <EmptyState title="Aún no hay reseñas" description="Sé el primero en opinar sobre este plato." />
        ) : (
          <div className="flex flex-col gap-4">
            {dishReviews.map((review) => (
              <div key={review.id} className="rounded-lg border border-border p-4">
                <div className="flex items-center gap-2">
                  <Rating value={review.rating} size="sm" />
                  <span className="text-sm font-medium text-foreground">{review.author_name ?? "Anónimo"}</span>
                </div>
                {review.comment ? <p className="mt-2 text-sm text-foreground">{review.comment}</p> : null}
                {review.owner_reply ? (
                  <div className="mt-3 rounded-md bg-surface-raised p-3">
                    <p className="text-xs font-medium text-muted-foreground">Respuesta de {menu.restaurant.name}</p>
                    <p className="mt-1 text-sm text-foreground">{review.owner_reply}</p>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        )}

        <WriteReviewForm dishName={dish.name} />
      </div>
    </main>
  );
}
