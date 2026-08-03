"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, UtensilsCrossed } from "lucide-react";
import { SearchBar } from "@/components/shared/search-bar";
import { DishCard } from "@/components/shared/dish-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils/cn";
import type { DemoCategory, DemoDish } from "@/lib/demo/types";
import type { Allergen, DishBadge } from "@/lib/types/database";

const BADGE_CHIPS: { value: DishBadge; label: string }[] = [
  { value: "recommended", label: "Recomendado" },
  { value: "bestseller", label: "Más vendido" },
  { value: "on_offer", label: "Oferta" },
];

function matchesQuery(dish: DemoDish, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    dish.name.toLowerCase().includes(q) ||
    dish.category_name.toLowerCase().includes(q) ||
    dish.ingredients.some((i) => i.toLowerCase().includes(q)) ||
    (dish.short_description ?? "").toLowerCase().includes(q)
  );
}

export function MenuBrowser({
  slug,
  currency,
  categories,
  dishes,
  allergens,
}: {
  slug: string;
  currency: string;
  categories: DemoCategory[];
  dishes: DemoDish[];
  allergens: Allergen[];
}) {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [activeBadges, setActiveBadges] = useState<Set<DishBadge>>(new Set());
  const [excludedAllergens, setExcludedAllergens] = useState<Set<string>>(new Set());

  const visibleDishes = useMemo(
    () => dishes.filter((d) => d.status === "available" || d.status === "sold_out"),
    [dishes],
  );

  const categoriesWithCounts = useMemo(
    () =>
      categories
        .map((category) => ({
          ...category,
          visibleCount: visibleDishes.filter((d) => d.category_id === category.id).length,
        }))
        .filter((category) => category.visibleCount > 0),
    [categories, visibleDishes],
  );

  const filtered = useMemo(
    () =>
      visibleDishes.filter((dish) => {
        if (!matchesQuery(dish, query)) return false;
        if (activeCategory !== "all" && dish.category_id !== activeCategory) return false;
        if (activeBadges.size > 0 && !dish.badges.some((b) => activeBadges.has(b))) return false;
        if (excludedAllergens.size > 0 && (dish.allergen_codes ?? []).some((c) => excludedAllergens.has(c))) {
          return false;
        }
        return true;
      }),
    [visibleDishes, query, activeCategory, activeBadges, excludedAllergens],
  );

  function handleSearch(next: string) {
    setQuery(next);
    if (next) setActiveCategory("all");
  }

  function toggleBadge(value: DishBadge) {
    setActiveBadges((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  function toggleAllergen(code: string) {
    setExcludedAllergens((prev) => {
      const next = new Set(prev);
      if (next.has(code)) next.delete(code);
      else next.add(code);
      return next;
    });
  }

  const shownCategories =
    activeCategory === "all" ? categoriesWithCounts : categoriesWithCounts.filter((c) => c.id === activeCategory);

  return (
    <div className="mx-auto max-w-3xl px-6 py-8">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <SearchBar onSearch={handleSearch} placeholder="Busca un plato o ingrediente…" className="flex-1" />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="shrink-0">
              <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
              Alérgenos{excludedAllergens.size > 0 ? ` (${excludedAllergens.size})` : ""}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="max-h-80 overflow-y-auto">
            <DropdownMenuLabel>Ocultar platos que contengan…</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {allergens.map((allergen) => (
              <DropdownMenuCheckboxItem
                key={allergen.code}
                checked={excludedAllergens.has(allergen.code)}
                onSelect={(e) => e.preventDefault()}
                onCheckedChange={() => toggleAllergen(allergen.code)}
              >
                {allergen.name_es}
              </DropdownMenuCheckboxItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="mt-4 flex gap-1.5 overflow-x-auto pb-1">
        <button type="button" onClick={() => setActiveCategory("all")} aria-pressed={activeCategory === "all"}>
          <Badge variant={activeCategory === "all" ? "primary" : "outline"} className="cursor-pointer whitespace-nowrap">
            Todos
          </Badge>
        </button>
        {categoriesWithCounts.map((category) => (
          <button
            key={category.id}
            type="button"
            onClick={() => setActiveCategory(category.id)}
            aria-pressed={activeCategory === category.id}
          >
            <Badge
              variant={activeCategory === category.id ? "primary" : "outline"}
              className="cursor-pointer whitespace-nowrap"
            >
              {category.name}
            </Badge>
          </button>
        ))}
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {BADGE_CHIPS.map((chip) => (
          <button key={chip.value} type="button" onClick={() => toggleBadge(chip.value)} aria-pressed={activeBadges.has(chip.value)}>
            <Badge variant={activeBadges.has(chip.value) ? "accent" : "outline"} className="cursor-pointer">
              {chip.label}
            </Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={UtensilsCrossed}
          title="No hay platos con estos filtros"
          description="Prueba a cambiar la búsqueda o quitar algún filtro."
          className={cn("mt-8")}
        />
      ) : (
        <div className="mt-6 flex flex-col gap-10">
          {shownCategories.map((category) => {
            const categoryDishes = filtered.filter((d) => d.category_id === category.id);
            if (categoryDishes.length === 0) return null;
            return (
              <section key={category.id} id={`categoria-${category.id}`}>
                <h2 className="mb-3 font-display text-lg font-semibold text-foreground">{category.name}</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {categoryDishes.map((dish) => (
                    <DishCard
                      key={dish.id}
                      dish={dish}
                      imageUrl={dish.image_url}
                      currency={currency}
                      href={`/r/${slug}/platos/${dish.id}`}
                    />
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}
