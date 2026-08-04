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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { QrType } from "@/lib/types/database";

export function QrCreateDialog({
  open,
  onOpenChange,
  onCreate,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreate: (input: { label: string; type: QrType; tableNumber: number | null }) => void | Promise<void>;
}) {
  const [type, setType] = useState<QrType>("table");
  const [tableNumber, setTableNumber] = useState("");
  const [label, setLabel] = useState("");
  const [creating, setCreating] = useState(false);

  async function handleCreate() {
    const finalLabel = label.trim() || (type === "table" ? `Mesa ${tableNumber || "?"}` : "Carta general");
    setCreating(true);
    try {
      await onCreate({
        label: finalLabel,
        type,
        tableNumber: type === "table" && tableNumber ? Number(tableNumber) : null,
      });
      onOpenChange(false);
      setLabel("");
      setTableNumber("");
    } finally {
      setCreating(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Nuevo código QR</DialogTitle>
          <DialogDescription>Genera un QR para la carta general o para una mesa concreta.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-5">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qr-type">Tipo</Label>
            <Select value={type} onValueChange={(v) => setType(v as QrType)}>
              <SelectTrigger id="qr-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="menu">Carta general</SelectItem>
                <SelectItem value="table">Mesa</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {type === "table" ? (
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="qr-table">Número de mesa</Label>
              <Input
                id="qr-table"
                type="number"
                min="1"
                value={tableNumber}
                onChange={(e) => setTableNumber(e.target.value)}
                placeholder="Ej. 7"
              />
            </div>
          ) : null}

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="qr-label">Etiqueta (opcional)</Label>
            <Input
              id="qr-label"
              value={label}
              onChange={(e) => setLabel(e.target.value)}
              placeholder={type === "table" ? `Mesa ${tableNumber || "1"}` : "Carta general"}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={creating}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={creating}>
            {creating ? "Generando…" : "Generar QR"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
