"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NeedsReviewBadge } from "./dish-status-badge";
import { QuickStatusSelect } from "./quick-status-select";
import { QuickCategorySelect } from "./quick-category-select";
import { FeatureToggleButton } from "./feature-toggle-button";
import { InlineEdit } from "./inline-edit";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils/money";
import type { DemoCategory, DemoDish } from "@/lib/demo/note-di-caffe-demo";

function SortableRow({
  dish,
  currency,
  categories,
  onEdit,
  onQuickUpdate,
}: {
  dish: DemoDish;
  currency: string;
  categories: DemoCategory[];
  onEdit: () => void;
  onQuickUpdate: (patch: Partial<DemoDish>, toastMessage?: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };
  const isRecommended = dish.badges.includes("recommended");

  return (
    <tr ref={setNodeRef} style={style} className="border-b border-border last:border-0">
      <td className="w-8 py-2 pl-2">
        <button
          {...attributes}
          {...listeners}
          className="nova-transition cursor-grab text-faint-foreground hover:text-foreground active:cursor-grabbing"
          aria-label={`Reordenar ${dish.name}`}
        >
          <GripVertical className="h-4 w-4" />
        </button>
      </td>
      <td className="py-1.5 pr-3">
        <InlineEdit
          value={dish.name}
          onCommit={(v) => onQuickUpdate({ name: v }, "Nombre actualizado")}
          ariaLabel={`Editar nombre de ${dish.name}`}
          className="text-sm font-medium text-foreground"
        />
      </td>
      <td className="py-1.5 pr-3">
        <QuickCategorySelect
          categoryId={dish.category_id}
          categories={categories}
          onChange={(categoryId) => {
            const category = categories.find((c) => c.id === categoryId);
            onQuickUpdate({ category_id: categoryId, category_name: category?.name ?? "" }, "Categoría actualizada");
          }}
        />
      </td>
      <td className="py-1.5 pr-3">
        <InlineEdit
          value={(dish.price_cents / 100).toFixed(2)}
          type="number"
          displayValue={formatPrice(dish.price_cents, currency)}
          onCommit={(v) => {
            const cents = Math.round((parseFloat(v) || 0) * 100);
            if (cents > 0) onQuickUpdate({ price_cents: cents }, "Precio actualizado");
          }}
          ariaLabel={`Editar precio de ${dish.name}`}
          className="text-sm tabular-nums text-foreground"
        />
      </td>
      <td className="py-1.5 pr-3">
        <div className="flex flex-wrap items-center gap-1.5">
          <QuickStatusSelect
            status={dish.status}
            onChange={(status) => onQuickUpdate({ status }, "Estado actualizado")}
          />
          {dish.needs_review ? <NeedsReviewBadge /> : null}
        </div>
      </td>
      <td className="py-1.5 pr-3">
        {dish.rating_count > 0 ? (
          <Rating value={dish.avg_rating} count={dish.rating_count} size="sm" />
        ) : (
          <span className="text-xs text-faint-foreground">Sin valoraciones</span>
        )}
      </td>
      <td className="py-1.5 pr-1">
        <FeatureToggleButton
          active={isRecommended}
          onToggle={() =>
            onQuickUpdate(
              {
                badges: isRecommended
                  ? dish.badges.filter((b) => b !== "recommended")
                  : [...dish.badges, "recommended"],
              },
              isRecommended ? "Quitado de recomendados" : "Marcado como recomendado",
            )
          }
        />
      </td>
      <td className="py-1.5 pr-2 text-right">
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar ${dish.name}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      </td>
    </tr>
  );
}

export function DishTable({
  dishes,
  currency,
  categories,
  onReorder,
  onEdit,
  onQuickUpdate,
}: {
  dishes: DemoDish[];
  currency: string;
  categories: DemoCategory[];
  onReorder: (next: DemoDish[]) => void;
  onEdit: (dish: DemoDish) => void;
  onQuickUpdate: (id: string, patch: Partial<DemoDish>, toastMessage?: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = dishes.findIndex((d) => d.id === active.id);
    const newIndex = dishes.findIndex((d) => d.id === over.id);
    onReorder(arrayMove(dishes, oldIndex, newIndex));
  }

  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      {/* DndContext must wrap the whole <table>, not sit inside <tbody>:
          it renders a hidden accessibility announcer <div>, which HTML
          does not allow as a direct child of <tbody> (caused a hydration
          error — verified in the browser before fixing). */}
      <DndContext id="platos-tabla" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={dishes.map((d) => d.id)} strategy={verticalListSortingStrategy}>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border bg-surface-raised text-left text-xs font-medium uppercase tracking-wide text-faint-foreground">
                <th className="w-8" />
                <th className="py-2 pr-3">Plato</th>
                <th className="py-2 pr-3">Categoría</th>
                <th className="py-2 pr-3">Precio</th>
                <th className="py-2 pr-3">Estado</th>
                <th className="py-2 pr-3">Valoración</th>
                <th className="w-10">Destacar</th>
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <SortableRow
                  key={dish.id}
                  dish={dish}
                  currency={currency}
                  categories={categories}
                  onEdit={() => onEdit(dish)}
                  onQuickUpdate={(patch, toastMessage) => onQuickUpdate(dish.id, patch, toastMessage)}
                />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
