"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const REASONS = [
  { value: "spam", label: "Spam o publicidad" },
  { value: "offensive", label: "Contenido ofensivo" },
  { value: "fake", label: "Sospecha de reseña falsa" },
  { value: "other", label: "Otro motivo" },
];

/**
 * Escala la reseña a NovaCore para que la revise — nunca cambia la
 * puntuación ni el estado de moderación del propietario por sí sola.
 */
export function ReportReviewDialog({
  open,
  onOpenChange,
  onSubmit,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (reason: string, note: string) => void;
}) {
  const [reason, setReason] = useState(REASONS[0].value);
  const [note, setNote] = useState("");

  function handleSubmit() {
    onSubmit(reason, note.trim());
    setNote("");
    setReason(REASONS[0].value);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reportar reseña</DialogTitle>
          <DialogDescription>
            El equipo de NovaCore la revisará. La puntuación del cliente no cambia.
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-reason">Motivo</Label>
            <Select value={reason} onValueChange={setReason}>
              <SelectTrigger id="report-reason">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {REASONS.map((r) => (
                  <SelectItem key={r.value} value={r.value}>
                    {r.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="report-note">Detalles (opcional)</Label>
            <Textarea
              id="report-note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Añade contexto para el equipo de NovaCore"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Reportar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
