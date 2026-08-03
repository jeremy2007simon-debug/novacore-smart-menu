"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { OwnerDishCard } from "./owner-dish-card";
import type { DemoCategory, DemoDish } from "@/lib/demo/note-di-caffe-demo";

function SortableCard({
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
  onQuickUpdate: (patch: Partial<DemoDish>) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: dish.id });

  return (
    <OwnerDishCard
      dish={dish}
      currency={currency}
      categories={categories}
      onEdit={onEdit}
      onQuickUpdate={onQuickUpdate}
      innerRef={setNodeRef}
      isDragging={isDragging}
      style={{ transform: CSS.Transform.toString(transform), transition }}
      dragHandleProps={{ ...attributes, ...listeners }}
    />
  );
}

export function DishGrid({
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
  onQuickUpdate: (id: string, patch: Partial<DemoDish>) => void;
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
    <DndContext id="platos-tarjetas" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={dishes.map((d) => d.id)} strategy={rectSortingStrategy}>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {dishes.map((dish) => (
            <SortableCard
              key={dish.id}
              dish={dish}
              currency={currency}
              categories={categories}
              onEdit={() => onEdit(dish)}
              onQuickUpdate={(patch) => onQuickUpdate(dish.id, patch)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
