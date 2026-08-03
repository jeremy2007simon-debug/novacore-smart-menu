"use client";

import { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { LayoutGrid, Plus, Table as TableIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { PageHeader } from "@/components/dashboard/page-header";
import { SearchBar } from "@/components/shared/search-bar";
import { DishTable } from "@/components/dashboard/dish-table";
import { DishGrid } from "@/components/dashboard/dish-grid";
import { DishEditDrawer } from "@/components/dashboard/dish-edit-drawer";
import { showToast } from "@/components/ui/toast";
import { demoCategories, demoDishes, demoRestaurant, type DemoDish } from "@/lib/demo/note-di-caffe-demo";
import type { DishStatus } from "@/lib/types/database";
import { DISH_STATUS_LABEL } from "@/components/dashboard/dish-status-badge";

type ViewMode = "table" | "grid";

function PlatosContent() {
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get("status");

  const [dishes, setDishes] = useState<DemoDish[]>(demoDishes);
  const [view, setView] = useState<ViewMode>("grid");
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>(
    initialStatus && (initialStatus in DISH_STATUS_LABEL || initialStatus === "needs_review") ? initialStatus : "all",
  );
  const [editing, setEditing] = useState<DemoDish | null | undefined>(undefined); // undefined = closed

  const filtered = useMemo(() => {
    return dishes.filter((dish) => {
      if (query && !dish.name.toLowerCase().includes(query.toLowerCase())) return false;
      if (categoryFilter !== "all" && dish.category_id !== categoryFilter) return false;
      if (statusFilter === "needs_review") return Boolean(dish.needs_review);
      if (statusFilter !== "all" && dish.status !== statusFilter) return false;
      return true;
    });
  }, [dishes, query, categoryFilter, statusFilter]);

  function handleReorder(next: DemoDish[]) {
    // El arrastre solo reordena el subconjunto filtrado visible; el resto
    // de platos mantiene su posición relativa gracias a que Array#sort es
    // estable: solo se compara explícitamente cuando AMBOS elementos están
    // en el conjunto reordenado, cualquier otro par devuelve 0.
    const newOrder = new Map(next.map((d, i) => [d.id, i]));
    setDishes((prev) =>
      [...prev].sort((a, b) => {
        const ai = newOrder.get(a.id);
        const bi = newOrder.get(b.id);
        if (ai === undefined || bi === undefined) return 0;
        return ai - bi;
      }),
    );
  }

  function handleSave(dish: DemoDish) {
    setDishes((prev) => {
      const exists = prev.some((d) => d.id === dish.id);
      return exists ? prev.map((d) => (d.id === dish.id ? dish : d)) : [...prev, dish];
    });
    showToast.success(editing ? "Plato actualizado" : "Plato añadido", dish.name);
    setEditing(undefined);
  }

  return (
    <div>
      <PageHeader
        title="Platos"
        description={`${dishes.length} platos en total · diseño con datos de demostración, sin conectar todavía a la base de datos.`}
        action={
          <Button onClick={() => setEditing(null)}>
            <Plus className="h-4 w-4" /> Nuevo plato
          </Button>
        }
      />

      <div className="mb-4 flex flex-wrap items-center gap-3">
        <SearchBar onSearch={setQuery} placeholder="Buscar plato..." className="max-w-xs" />

        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categoría" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas las categorías</SelectItem>
            {demoCategories.map((c) => (
              <SelectItem key={c.id} value={c.id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-44">
            <SelectValue placeholder="Estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos los estados</SelectItem>
            {(Object.keys(DISH_STATUS_LABEL) as DishStatus[]).map((s) => (
              <SelectItem key={s} value={s}>
                {DISH_STATUS_LABEL[s]}
              </SelectItem>
            ))}
            <SelectItem value="needs_review">Pendiente de revisión</SelectItem>
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

      {filtered.length === 0 ? (
        <EmptyState
          title="No hay platos con estos filtros"
          description="Prueba a cambiar la búsqueda, la categoría o el estado."
        />
      ) : view === "table" ? (
        <DishTable dishes={filtered} currency={demoRestaurant.currency} onReorder={handleReorder} onEdit={setEditing} />
      ) : (
        <DishGrid dishes={filtered} currency={demoRestaurant.currency} onReorder={handleReorder} onEdit={setEditing} />
      )}

      <DishEditDrawer
        key={editing?.id ?? "new"}
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        dish={editing ?? null}
        categories={demoCategories}
        onSave={handleSave}
      />
    </div>
  );
}

export default function PlatosPage() {
  return (
    <Suspense>
      <PlatosContent />
    </Suspense>
  );
}
