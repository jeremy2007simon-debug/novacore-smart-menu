"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { DemoCategory } from "@/lib/demo/note-di-caffe-demo";

/**
 * Cambia la categoría de un plato con un clic, sin abrir ninguna ventana.
 */
export function QuickCategorySelect({
  categoryId,
  categories,
  onChange,
}: {
  categoryId: string | null;
  categories: DemoCategory[];
  onChange: (categoryId: string) => void;
}) {
  return (
    <Select value={categoryId ?? ""} onValueChange={onChange}>
      <SelectTrigger
        className="h-auto w-auto gap-1 border-none bg-transparent p-0.5 text-sm text-muted-foreground shadow-none hover:bg-surface-raised hover:text-foreground [&>svg]:h-3 [&>svg]:w-3"
        aria-label="Cambiar categoría"
      >
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {categories.map((c) => (
          <SelectItem key={c.id} value={c.id}>
            {c.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
