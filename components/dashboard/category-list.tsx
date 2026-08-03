"use client";

import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Clock, GripVertical, Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InlineEdit } from "./inline-edit";
import { cn } from "@/lib/utils/cn";
import type { DemoCategory } from "@/lib/demo/note-di-caffe-demo";

function SortableItem({
  category,
  onEdit,
  onRename,
}: {
  category: DemoCategory;
  onEdit: () => void;
  onRename: (name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: category.id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm",
        isDragging && "opacity-50",
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="nova-transition cursor-grab text-faint-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Reordenar ${category.name}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="min-w-0 flex-1">
        <InlineEdit
          value={category.name}
          onCommit={onRename}
          ariaLabel={`Editar nombre de ${category.name}`}
          className="block w-full truncate text-sm font-semibold text-foreground"
          inputClassName="max-w-none"
        />
        <p className="text-xs text-muted-foreground">
          {category.dish_count} platos
          {category.available_from ? (
            <span className="ml-2 inline-flex items-center gap-1">
              <Clock className="h-3 w-3" aria-hidden="true" />
              {category.available_from}–{category.available_to}
            </span>
          ) : null}
        </p>
      </div>
      <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar ${category.name}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}

export function CategoryList({
  categories,
  onReorder,
  onEdit,
  onRename,
}: {
  categories: DemoCategory[];
  onReorder: (next: DemoCategory[]) => void;
  onEdit: (category: DemoCategory) => void;
  onRename: (id: string, name: string) => void;
}) {
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = categories.findIndex((c) => c.id === active.id);
    const newIndex = categories.findIndex((c) => c.id === over.id);
    onReorder(arrayMove(categories, oldIndex, newIndex));
  }

  return (
    <DndContext id="categorias-lista" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
        <div className="flex flex-col gap-2">
          {categories.map((category) => (
            <SortableItem
              key={category.id}
              category={category}
              onEdit={() => onEdit(category)}
              onRename={(name) => onRename(category.id, name)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
