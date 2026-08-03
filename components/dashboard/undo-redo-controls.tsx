"use client";

import { Redo2, Undo2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export function UndoRedoControls({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
}: {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
}) {
  return (
    <div className="flex gap-1 rounded-md border border-border bg-surface-raised p-1">
      <Button variant="ghost" size="icon" disabled={!canUndo} onClick={onUndo} aria-label="Deshacer" title="Deshacer (Ctrl+Z)">
        <Undo2 className="h-4 w-4" />
      </Button>
      <Button variant="ghost" size="icon" disabled={!canRedo} onClick={onRedo} aria-label="Rehacer" title="Rehacer (Ctrl+Shift+Z)">
        <Redo2 className="h-4 w-4" />
      </Button>
    </div>
  );
}
