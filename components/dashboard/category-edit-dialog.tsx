"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import type { DemoCategory } from "@/lib/demo/note-di-caffe-demo";

export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  restaurantId,
  nextSortOrder,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: DemoCategory | null;
  restaurantId: string;
  nextSortOrder: number;
  onSave: (category: DemoCategory) => void;
}) {
  const isNew = category === null;
  const [name, setName] = useState(category?.name ?? "");
  const [hasSchedule, setHasSchedule] = useState(Boolean(category?.available_from));
  const [from, setFrom] = useState(category?.available_from ?? "08:00");
  const [to, setTo] = useState(category?.available_to ?? "12:00");

  function handleSave() {
    onSave({
      id: category?.id ?? `new-cat-${Date.now()}`,
      restaurant_id: restaurantId,
      name: name.trim() || "Nueva categoría",
      icon: category?.icon ?? null,
      sort_order: category?.sort_order ?? nextSortOrder,
      available_from: hasSchedule ? from : null,
      available_to: hasSchedule ? to : null,
      available_days: category?.available_days ?? null,
      created_at: category?.created_at ?? new Date().toISOString(),
      dish_count: category?.dish_count ?? 0,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? "Nueva categoría" : `Editar «${category.name}»`}</DialogTitle>
          <DialogDescription>
            {isNew ? "Se añadirá al final de la carta; luego puedes arrastrarla para reordenar." : "Los cambios se reflejan al momento en la vista previa."}
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="category-name">Nombre</Label>
            <Input id="category-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Postres" />
          </div>

          <div className="flex items-center justify-between rounded-md border border-border p-3">
            <div>
              <p className="text-sm font-medium text-foreground">Ventana horaria</p>
              <p className="text-xs text-muted-foreground">Muestra esta categoría solo en cierta franja (ej. Desayunos 08:00–12:00).</p>
            </div>
            <Switch checked={hasSchedule} onCheckedChange={setHasSchedule} aria-label="Activar ventana horaria" />
          </div>

          {hasSchedule ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-from">Desde</Label>
                <Input id="category-from" type="time" value={from} onChange={(e) => setFrom(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-to">Hasta</Label>
                <Input id="category-to" type="time" value={to} onChange={(e) => setTo(e.target.value)} />
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
