"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { useDebouncedCommit } from "@/lib/utils/use-debounced-commit";
import type { DemoCategory } from "@/lib/demo/note-di-caffe-demo";

/**
 * Cada campo autoguarda al cambiar (el nombre, con debounce) — sin
 * Guardar/Cancelar, cerrar solo cierra el panel.
 */
export function CategoryEditDialog({
  open,
  onOpenChange,
  category,
  onFieldChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  category: DemoCategory;
  onFieldChange: (patch: Partial<DemoCategory>) => void;
}) {
  const [name, setName] = useState(category.name);
  const [hasSchedule, setHasSchedule] = useState(Boolean(category.available_from));
  const [from, setFrom] = useState(category.available_from ?? "08:00");
  const [to, setTo] = useState(category.available_to ?? "12:00");

  useDebouncedCommit(name, (v) => {
    if (v.trim()) onFieldChange({ name: v.trim() });
  });

  function toggleSchedule(checked: boolean) {
    setHasSchedule(checked);
    onFieldChange({ available_from: checked ? from : null, available_to: checked ? to : null });
  }

  function changeFrom(value: string) {
    setFrom(value);
    if (hasSchedule) onFieldChange({ available_from: value });
  }

  function changeTo(value: string) {
    setTo(value);
    if (hasSchedule) onFieldChange({ available_to: value });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar «{category.name}»</DialogTitle>
          <DialogDescription>Cada cambio se guarda solo — se refleja al momento en la vista previa.</DialogDescription>
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
            <Switch checked={hasSchedule} onCheckedChange={toggleSchedule} aria-label="Activar ventana horaria" />
          </div>

          {hasSchedule ? (
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-from">Desde</Label>
                <Input id="category-from" type="time" value={from} onChange={(e) => changeFrom(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="category-to">Hasta</Label>
                <Input id="category-to" type="time" value={to} onChange={(e) => changeTo(e.target.value)} />
              </div>
            </div>
          ) : null}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
