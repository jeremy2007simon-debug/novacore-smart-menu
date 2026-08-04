"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Plus, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { DishTable } from "@/components/dashboard/dish-table";
import { DishGrid } from "@/components/dashboard/dish-grid";
import { DishEditDrawer } from "@/components/dashboard/dish-edit-drawer";
import { UndoRedoControls } from "@/components/dashboard/undo-redo-controls";
import { useUndoableState, useUndoRedoShortcuts } from "@/lib/undo/use-undoable-state";
import { useSaveStatus } from "@/lib/autosave/save-status-context";
import { useActivity } from "@/lib/activity/activity-context";
import { describeDishChange } from "@/lib/activity/describe-dish-change";
import { formatPrice } from "@/lib/utils/money";
import { createDish, reorderDishes, updateDish } from "@/features/dashboard/dish-actions";
import type { DemoCategory, DemoDish } from "@/lib/demo/types";
import type { Allergen, DishBadge, DishStatus, Restaurant } from "@/lib/types/database";
import { DISH_STATUS_LABEL } from "@/components/dashboard/dish-status-badge";

type ViewMode = "table" | "grid";

const STATUS_CHIPS: { value: DishStatus; label: string }[] = (
  Object.keys(DISH_STATUS_LABEL) as DishStatus[]
).map((value) => ({ value, label: DISH_STATUS_LABEL[value] }));

const BADGE_CHIPS: { value: DishBadge; label: string }[] = [
  { value: "recommended", label: "Recomendado" },
  { value: "bestseller", label: "Más vendido" },
  { value: "on_offer", label: "Oferta" },
];

function matchesQuery(dish: DemoDish, currency: string, query: string): boolean {
  if (!query) return true;
  const q = query.toLowerCase();
  return (
    dish.name.toLowerCase().includes(q) ||
    dish.category_name.toLowerCase().includes(q) ||
    dish.ingredients.some((i) => i.toLowerCase().includes(q)) ||
    formatPrice(dish.price_cents, currency).toLowerCase().includes(q) ||
    (dish.price_cents / 100).toFixed(2).includes(q) ||
    DISH_STATUS_LABEL[dish.status].toLowerCase().includes(q)
  );
}

function PlatosContent({
  restaurant,
  initialDishes,
  categories,
  allergens,
}: {
  restaurant: Restaurant;
  initialDishes: DemoDish[];
  categories: DemoCategory[];
  allergens: Allergen[];
}) {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");
  const { runAutosave } = useSaveStatus();
  const { logActivity } = useActivity();

  const { value: dishes, set: setDishes, undo, redo, canUndo, canRedo } = useUndoableState<DemoDish[]>(initialDishes);
  useUndoRedoShortcuts(undo, redo);

  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [activeChips, setActiveChips] = useState<Set<string>>(() => {
    const initial = new Set<string>();
    if (initialStatus && initialStatus in DISH_STATUS_LABEL) initial.add(initialStatus);
    return initial;
  });
  const [editingId, setEditingId] = useState<string | undefined>(undefined); // undefined = closed
  const editing = dishes.find((d) => d.id === editingId);

  function toggleChip(value: string) {
    setActiveChips((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  }

  const filtered = useMemo(() => {
    const statusChips = STATUS_CHIPS.map((c) => c.value).filter((v) => activeChips.has(v));
    const badgeChips = BADGE_CHIPS.map((c) => c.value).filter((v) => activeChips.has(v));

    return dishes.filter((dish) => {
      if (!matchesQuery(dish, restaurant.currency, query)) return false;
      if (categoryFilter !== "all" && dish.category_id !== categoryFilter) return false;
      if (statusChips.length > 0 && !statusChips.includes(dish.status)) return false;
      if (badgeChips.length > 0 && !dish.badges.some((b) => badgeChips.includes(b))) return false;
      return true;
    });
  }, [dishes, query, categoryFilter, activeChips, restaurant.currency]);

  function handleReorder(next: DemoDish[]) {
    // El arrastre solo reordena el subconjunto filtrado visible; el resto
    // de platos mantiene su posición relativa gracias a que Array#sort es
    // estable: solo se compara explícitamente cuando AMBOS elementos están
    // en el conjunto reordenado, cualquier otro par devuelve 0.
    const newOrder = new Map(next.map((d, i) => [d.id, i]));
    const reordered = [...dishes].sort((a, b) => {
      const ai = newOrder.get(a.id);
      const bi = newOrder.get(b.id);
      if (ai === undefined || bi === undefined) return 0;
      return ai - bi;
    });
    setDishes(reordered);
    logActivity("order", "reordenó los platos");
    runAutosave(async () => {
      await reorderDishes(reordered.map((d, i) => ({ id: d.id, sort_order: i })));
    });
  }

  function handleQuickUpdate(id: string, patch: Partial<DemoDish>) {
    const dish = dishes.find((d) => d.id === id);
    if (!dish) return;
    const description = describeDishChange(dish, patch, restaurant.currency);
    setDishes(dishes.map((d) => (d.id === id ? { ...d, ...patch } : d)));
    if (description) {
      logActivity(description.kind, description.message);
      runAutosave(async () => {
        await updateDish(id, patch);
      });
    }
  }

  async function handleCreateDish() {
    const category = categories[0];
    const created = await createDish({
      restaurantId: restaurant.id,
      categoryId: category?.id ?? null,
      sortOrder: dishes.length,
    });
    if (!created) return;

    const draft: DemoDish = {
      ...created,
      category_name: category?.name ?? "",
      image_url: null,
      gallery_urls: [],
      allergen_codes: [],
    };
    setDishes([...dishes, draft]);
    logActivity("name", `añadió el plato «${draft.name}»`);
    setEditingId(draft.id);
  }

  return (
    <div>
      <PageHeader
        title="Platos"
        description={`${dishes.length} platos en total · cada cambio se guarda solo, directamente desde la lista.`}
        action={
          <div className="flex items-center gap-2">
            <UndoRedoControls canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
            <Button onClick={handleCreateDish}>
              <Plus className="h-4 w-4" /> Nuevo plato
            </Button>
          </div>
        }
      />

      <div className="mb-3 flex flex-wrap items-center gap-3">
        <SearchBar onSearch={setQuery} className="max-w-xs" />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {categories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="ml-auto flex gap-1 rounded-md border border-border bg-surface-raised p-1">
          <Button
            variant={view === "grid" ? "primary" : "ghost"}
            size="icon"
            onClick={() => setView("grid")}
            aria-label="Vista en tarjetas"
            aria-pressed={view === "grid"}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "table" ? "primary" : "ghost"}
            size="icon"
            onClick={() => setView("table")}
            aria-label="Vista en tabla"
            aria-pressed={view === "table"}
          >
            <TableIcon className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-1.5">
        {STATUS_CHIPS.map((chip) => (
          <button key={chip.value} type="button" onClick={() => toggleChip(chip.value)} aria-pressed={activeChips.has(chip.value)}>
            <Badge variant={activeChips.has(chip.value) ? "primary" : "outline"} className="cursor-pointer">
              {chip.label}
            </Badge>
          </button>
        ))}
        {BADGE_CHIPS.map((chip) => (
          <button key={chip.value} type="button" onClick={() => toggleChip(chip.value)} aria-pressed={activeChips.has(chip.value)}>
            <Badge variant={activeChips.has(chip.value) ? "accent" : "outline"} className="cursor-pointer">
              {chip.label}
            </Badge>
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay platos con estos filtros"
          description="Prueba a cambiar la búsqueda, la categoría o los filtros activos."
        />
      ) : view === "table" ? (
        <DishTable
          dishes={filtered}
          currency={restaurant.currency}
          categories={categories}
          onReorder={handleReorder}
          onEdit={(dish) => setEditingId(dish.id)}
          onQuickUpdate={handleQuickUpdate}
        />
      ) : (
        <DishGrid
          dishes={filtered}
          currency={restaurant.currency}
          categories={categories}
          onReorder={handleReorder}
          onEdit={(dish) => setEditingId(dish.id)}
          onQuickUpdate={handleQuickUpdate}
        />
      )}

      {editing ? (
        <DishEditDrawer
          key={editing.id}
          open={editingId !== undefined}
          onOpenChange={(open) => !open && setEditingId(undefined)}
          dish={editing}
          categories={categories}
          allergens={allergens}
          restaurant={restaurant}
          onFieldChange={(patch) => handleQuickUpdate(editing.id, patch)}
        />
      ) : null}
    </div>
  );
}

export function PlatosPageClient(props: {
  restaurant: Restaurant;
  initialDishes: DemoDish[];
  categories: DemoCategory[];
  allergens: Allergen[];
}) {
  return (
    <Suspense>
      <PlatosContent {...props} />
    </Suspense>
  );
}
