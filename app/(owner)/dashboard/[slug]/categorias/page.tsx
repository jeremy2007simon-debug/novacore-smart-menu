"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/dashboard/page-header";
import { CategoryList } from "@/components/dashboard/category-list";
import { CategoryEditDialog } from "@/components/dashboard/category-edit-dialog";
import { showToast } from "@/components/ui/toast";
import { demoCategories, demoRestaurant, type DemoCategory } from "@/lib/demo/note-di-caffe-demo";

export default function CategoriasPage() {
  const [categories, setCategories] = useState<DemoCategory[]>(demoCategories);
  const [editing, setEditing] = useState<DemoCategory | null | undefined>(undefined);

  function handleReorder(next: DemoCategory[]) {
    setCategories(next.map((c, i) => ({ ...c, sort_order: i })));
  }

  function handleSave(category: DemoCategory) {
    setCategories((prev) => {
      const exists = prev.some((c) => c.id === category.id);
      return exists ? prev.map((c) => (c.id === category.id ? category : c)) : [...prev, category];
    });
    showToast.success(editing ? "Categoría actualizada" : "Categoría añadida", category.name);
    setEditing(undefined);
  }

  function handleRename(id: string, name: string) {
    setCategories((prev) => prev.map((c) => (c.id === id ? { ...c, name } : c)));
    showToast.success("Nombre actualizado");
  }

  return (
    <div>
      <PageHeader
        title="Categorías"
        description="Arrastra para cambiar el orden en que aparecen en la carta pública."
        action={
          <Button onClick={() => setEditing(null)}>
            <Plus className="h-4 w-4" /> Nueva categoría
          </Button>
        }
      />

      <div className="max-w-xl">
        <CategoryList categories={categories} onReorder={handleReorder} onEdit={setEditing} onRename={handleRename} />
      </div>

      <CategoryEditDialog
        key={editing?.id ?? "new"}
        open={editing !== undefined}
        onOpenChange={(open) => !open && setEditing(undefined)}
        category={editing ?? null}
        restaurantId={demoRestaurant.id}
        nextSortOrder={categories.length}
        onSave={handleSave}
      />
    </div>
  );
}
