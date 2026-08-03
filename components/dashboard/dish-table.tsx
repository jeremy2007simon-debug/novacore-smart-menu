"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DishStatusBadge, NeedsReviewBadge } from "./dish-status-badge";
import { formatPrice } from "@/lib/utils/money";
import type { DemoDish } from "@/lib/demo/note-di-caffe-demo";

function SortableRow({
  dish,
  currency,
  onEdit,
}: {
  dish: DemoDish;
  currency: string;
  onEdit: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id });
  const style = { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 };

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
      <td className="py-2.5 pr-3 text-sm font-medium text-foreground">{dish.name}</td>
      <td className="py-2.5 pr-3 text-sm text-muted-foreground">{dish.category_name}</td>
      <td className="py-2.5 pr-3 text-sm tabular-nums text-foreground">{formatPrice(dish.price_cents, currency)}</td>
      <td className="py-2.5 pr-3">
        <div className="flex flex-wrap gap-1.5">
          <DishStatusBadge status={dish.status} />
          {dish.needs_review ? <NeedsReviewBadge /> : null}
        </div>
      </td>
      <td className="py-2.5 pr-2 text-right">
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
  onReorder,
  onEdit,
}: {
  dishes: DemoDish[];
  currency: string;
  onReorder: (next: DemoDish[]) => void;
  onEdit: (dish: DemoDish) => void;
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
                <th className="w-10" />
              </tr>
            </thead>
            <tbody>
              {dishes.map((dish) => (
                <SortableRow key={dish.id} dish={dish} currency={currency} onEdit={() => onEdit(dish)} />
              ))}
            </tbody>
          </table>
        </SortableContext>
      </DndContext>
    </div>
  );
}
