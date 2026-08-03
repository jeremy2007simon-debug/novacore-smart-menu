"use client";

import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Rating } from "@/components/ui/rating";
import { CategoryCard } from "@/components/shared/category-card";
import { DishCard } from "@/components/shared/dish-card";
import { parseRestaurantTheme } from "@/lib/theme/parse";
import { resolveThemeVars } from "@/lib/theme/resolve";
import type { DemoCategory, DemoDish } from "@/lib/demo/note-di-caffe-demo";
import type { Restaurant } from "@/lib/types/database";

/**
 * Vista previa en tiempo real de la carta pública, dentro de un marco de
 * móvil, reutilizando los MISMOS componentes (DishCard, CategoryCard) que
 * ve el cliente final — nunca una maqueta aparte que se pueda desincronizar
 * del diseño real.
 */
export function LivePreviewDrawer({
  open,
  onOpenChange,
  restaurant,
  categories,
  dishes,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  restaurant: Restaurant;
  categories: DemoCategory[];
  dishes: DemoDish[];
}) {
  const visibleDishes = dishes.filter((d) => d.status === "available" || d.status === "sold_out");
  const theme = parseRestaurantTheme(restaurant.theme);
  const themeVars = resolveThemeVars(theme, "light");

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-md">
        <DrawerHeader>
          <DrawerTitle>Vista previa de la carta</DrawerTitle>
          <DrawerDescription>
            Así la ve un cliente ahora mismo, con el tema real del restaurante (modo claro).
          </DrawerDescription>
        </DrawerHeader>

        <div
          style={themeVars as React.CSSProperties}
          className="mt-4 flex-1 overflow-y-auto rounded-lg border border-border bg-background"
        >
          <div className="border-b border-border p-4">
            <p className="font-display text-lg font-semibold text-foreground">{restaurant.name}</p>
            {restaurant.description ? (
              <p className="mt-1 text-sm text-muted-foreground">{restaurant.description}</p>
            ) : null}
            {restaurant.external_rating && restaurant.external_review_source ? (
              <div className="mt-2 flex items-center gap-2">
                <Rating value={restaurant.external_rating} count={restaurant.external_rating_count ?? undefined} />
                <span className="text-xs text-faint-foreground">vía {restaurant.external_review_source}</span>
              </div>
            ) : null}
          </div>

          <div className="flex flex-col gap-2 p-4">
            {categories.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                dishCount={dishes.filter((d) => d.category_id === category.id && d.status !== "archived" && d.status !== "hidden").length}
                href="#"
              />
            ))}
          </div>

          <div className="grid grid-cols-1 gap-4 p-4 pt-0 sm:grid-cols-2">
            {visibleDishes.map((dish) => (
              <DishCard key={dish.id} dish={dish} imageUrl={dish.image_url} currency={restaurant.currency} href="#" />
            ))}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
