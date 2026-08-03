"use client";

import { Check, CloudOff, Loader2, TriangleAlert } from "lucide-react";
import { useSaveStatus, type SaveStatus } from "@/lib/autosave/save-status-context";
import { cn } from "@/lib/utils/cn";

const CONFIG: Record<SaveStatus, { icon: typeof Check; label: string; tone: string; spin: boolean }> = {
  saved: {
    icon: Check,
    label: "Todos los cambios guardados.",
    tone: "text-success",
    spin: false,
  },
  saving: {
    icon: Loader2,
    label: "Guardando cambios…",
    tone: "text-warning",
    spin: true,
  },
  error: {
    icon: TriangleAlert,
    label: "Error al guardar. Reintentando…",
    tone: "text-danger",
    spin: false,
  },
  offline: {
    icon: CloudOff,
    label: "Sin conexión. Los cambios se sincronizarán cuando vuelva Internet.",
    tone: "text-warning",
    spin: false,
  },
};

export function SaveStatusIndicator() {
  const { status } = useSaveStatus();
  const { icon: Icon, label, tone, spin } = CONFIG[status];

  return (
    <div
      className="flex min-w-0 items-center gap-1.5 text-xs text-muted-foreground"
      role="status"
      aria-live="polite"
      title={label}
    >
      <Icon className={cn("h-3.5 w-3.5 shrink-0", tone, spin && "animate-spin")} aria-hidden="true" />
      <span className="hidden truncate sm:inline">{label}</span>
    </div>
  );
}
