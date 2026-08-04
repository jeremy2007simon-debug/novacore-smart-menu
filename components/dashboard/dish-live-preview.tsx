import { UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { parseRestaurantTheme } from "@/lib/theme/parse";
import { resolveThemeVars } from "@/lib/theme/resolve";
import { formatPrice } from "@/lib/utils/money";
import type { Allergen, DishBadge, DishStatus, Restaurant } from "@/lib/types/database";

const BADGE_LABEL: Record<DishBadge, string> = {
  recommended: "Recomendado",
  bestseller: "Más vendido",
  new: "Nuevo",
  on_offer: "Oferta",
};

type PreviewDish = {
  name: string;
  price_cents: number;
  short_description: string | null;
  status: DishStatus;
  badges: DishBadge[];
  images: string[];
  avg_rating: number;
  rating_count: number;
  ingredients: string[];
  allergenCodes: string[];
};

/**
 * Vista previa en un marco de móvil de cómo verá el cliente esta ficha,
 * actualizada al instante desde el propio estado del formulario. No
 * reutiliza el DishCard público tal cual porque aquí la imagen puede ser
 * un blob: URL (foto recién soltada, todavía sin subir) y next/image no
 * puede optimizar blobs — se usa <img> a propósito.
 */
export function DishLivePreview({
  dish,
  restaurant,
  allergens,
}: {
  dish: PreviewDish;
  restaurant: Pick<Restaurant, "theme" | "currency">;
  allergens: Pick<Allergen, "code" | "name_es">[];
}) {
  const theme = parseRestaurantTheme(restaurant.theme);
  const themeVars = resolveThemeVars(theme, "light");
  const principalImage = dish.images[0] ?? null;
  const soldOut = dish.status === "sold_out";
  const isHiddenOrArchived = dish.status === "hidden" || dish.status === "archived";
  const allergenNames = dish.allergenCodes
    .map((code) => allergens.find((a) => a.code === code)?.name_es)
    .filter((n): n is string => Boolean(n));

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative w-full max-w-72 overflow-hidden rounded-[2rem] border-8 border-neutral-900 bg-neutral-900 shadow-xl">
        <div
          style={themeVars as React.CSSProperties}
          className="max-h-[560px] min-h-[420px] overflow-y-auto bg-background"
        >
          <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-raised">
            {principalImage ? (
              // eslint-disable-next-line @next/next/no-img-element -- puede ser un blob: URL local
              <img src={principalImage} alt="" className="h-full w-full object-cover" />
            ) : (
              <div className="flex h-full items-center justify-center">
                <UtensilsCrossed className="h-8 w-8 text-faint-foreground" aria-hidden="true" />
              </div>
            )}

            {isHiddenOrArchived || soldOut ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/70">
                <Badge variant="neutral">{soldOut ? "Agotado" : "No visible para clientes"}</Badge>
              </div>
            ) : null}

            {dish.badges.length > 0 ? (
              <div className="absolute left-2 top-2 flex flex-wrap gap-1">
                {dish.badges.map((badge) => (
                  <Badge key={badge} variant={badge === "on_offer" ? "danger" : "accent"}>
                    {BADGE_LABEL[badge]}
                  </Badge>
                ))}
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-base font-semibold text-balance text-foreground">
                {dish.name || "Nombre del plato"}
              </h3>
              <span className="whitespace-nowrap font-display text-base font-semibold text-foreground">
                {formatPrice(dish.price_cents, restaurant.currency)}
              </span>
            </div>

            {dish.short_description ? (
              <p className="text-sm text-muted-foreground">{dish.short_description}</p>
            ) : null}

            {dish.rating_count > 0 ? (
              <Rating value={dish.avg_rating} count={dish.rating_count} size="sm" />
            ) : null}

            {dish.ingredients.length > 0 ? (
              <div className="mt-1 flex flex-wrap gap-1">
                {dish.ingredients.map((ing) => (
                  <Badge key={ing} variant="outline">
                    {ing}
                  </Badge>
                ))}
              </div>
            ) : null}

            {allergenNames.length > 0 ? (
              <p className="mt-1 text-xs text-faint-foreground">Alérgenos: {allergenNames.join(", ")}</p>
            ) : null}
          </div>
        </div>
      </div>
      <p className="text-xs text-muted-foreground">Así lo verá tu cliente</p>
    </div>
  );
}
