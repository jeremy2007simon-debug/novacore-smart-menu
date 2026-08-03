"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { CategoryList } from "@/components/dashboard/category-list";
import { CategoryEditDialog } from "@/components/dashboard/category-edit-dialog";
import { UndoRedoControls } from "@/components/dashboard/undo-redo-controls";
import { useUndoableState, useUndoRedoShortcuts } from "@/lib/undo/use-undoable-state";
import { useSaveStatus } from "@/lib/autosave/save-status-context";
import { simulatePersist } from "@/lib/autosave/simulate-persist";
import { useActivity } from "@/lib/activity/activity-context";
import { describeCategoryChange } from "@/lib/activity/describe-category-change";
import { demoCategories, demoRestaurant, type DemoCategory } from "@/lib/demo/note-di-caffe-demo";

export default function CategoriasPage() {
  const { runAutosave } = useSaveStatus();
  const { logActivity } = useActivity();

  const {
    value: categories,
    set: setCategories,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useUndoableState<DemoCategory[]>(demoCategories);
  useUndoRedoShortcuts(undo, redo);

  const [editingId, setEditingId] = useState<string | undefined>(undefined);
  const editing = categories.find((c) => c.id === editingId);

  function handleReorder(next: DemoCategory[]) {
    setCategories(next.map((c, i) => ({ ...c, sort_order: i })));
    logActivity("order", "reordenó las categorías");
    runAutosave(() => simulatePersist());
  }

  function handleFieldChange(id: string, patch: Partial<DemoCategory>) {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    const description = describeCategoryChange(category, patch);
    setCategories(categories.map((c) => (c.id === id ? { ...c, ...patch } : c)));
    if (description) {
      logActivity(description.kind, description.message);
      runAutosave(() => simulatePersist());
    }
  }

  function handleCreateCategory() {
    const draft: DemoCategory = {
      id: `new-cat-${Date.now()}`,
      restaurant_id: demoRestaurant.id,
      name: "Nueva categoría",
      icon: null,
      sort_order: categories.length,
      available_from: null,
      available_to: null,
      available_days: null,
      created_at: new Date().toISOString(),
      dish_count: 0,
    };
    setCategories([...categories, draft]);
    logActivity("category", `añadió la categoría «${draft.name}»`);
    runAutosave(() => simulatePersist());
    setEditingId(draft.id);
  }

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Arrastra para cambiar el orden en que aparecen en la carta pública."
        action={
          <div className="flex items-center gap-2">
            <UndoRedoControls canUndo={canUndo} canRedo={canRedo} onUndo={undo} onRedo={redo} />
            <Button onClick={handleCreateCategory}>
              <Plus className="h-4 w-4" /> Nueva categoría
            </Button>
          </div>
        }
      />

      <div className="max-w-xl">
        <CategoryList
          categories={categories}
          onReorder={handleReorder}
          onEdit={(category) => setEditingId(category.id)}
          onRename={(id, name) => handleFieldChange(id, { name })}
        />
      </div>

      {editing ? (
        <CategoryEditDialog
          key={editing.id}
          open={editingId !== undefined}
          onOpenChange={(open) => !open && setEditingId(undefined)}
          category={editing}
          onFieldChange={(patch) => handleFieldChange(editing.id, patch)}
        />
      ) : null}
    </div>
  );
}
