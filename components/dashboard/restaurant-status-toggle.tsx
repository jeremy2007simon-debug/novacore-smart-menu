"use client";

import { useState } from "react";
import { Switch } from "@/components/ui/switch";
import { showToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils/cn";
import type { RestaurantOperatingStatus } from "@/lib/types/database";

/**
 * Interruptor rápido Abierto/Cerrado para el Resumen: cubre el caso de uso
 * más frecuente con un solo clic. Vacaciones y el mensaje para clientes se
 * gestionan en Ajustes → Estado, donde vive el control completo.
 */
export function RestaurantStatusToggle({ initialStatus }: { initialStatus: RestaurantOperatingStatus }) {
  const [status, setStatus] = useState(initialStatus);
  const isOpen = status === "open";

  function toggle(checked: boolean) {
    setStatus(checked ? "open" : "temporarily_closed");
    showToast.success(checked ? "Restaurante marcado como abierto" : "Restaurante marcado como cerrado");
  }

  return (
    <div className="flex items-center gap-3 rounded-full border border-border bg-surface py-1.5 pl-2 pr-4 shadow-sm">
      <span
        className={cn(
          "flex h-7 w-7 items-center justify-center rounded-full",
          isOpen ? "bg-success/15 text-success" : "bg-danger/15 text-danger",
        )}
      >
        <span className={cn("h-2 w-2 rounded-full", isOpen ? "bg-success" : "bg-danger")} aria-hidden="true" />
      </span>
      <span className="text-sm font-medium text-foreground">{isOpen ? "Abierto ahora" : "Cerrado"}</span>
      <Switch checked={isOpen} onCheckedChange={toggle} aria-label={isOpen ? "Marcar como cerrado" : "Marcar como abierto"} />
    </div>
  );
}
