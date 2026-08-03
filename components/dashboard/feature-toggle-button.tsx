"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Alterna la etiqueta "Recomendado" con un clic, sin abrir la ficha del
 * plato — el resto de etiquetas (Más vendido, Nuevo, Oferta) se gestionan
 * desde la edición completa.
 */
export function FeatureToggleButton({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={active}
      aria-label={active ? "Quitar de recomendados" : "Marcar como recomendado"}
      title={active ? "Quitar de recomendados" : "Marcar como recomendado"}
      className={cn(
        "nova-transition flex h-7 w-7 shrink-0 items-center justify-center rounded-md hover:bg-surface-raised",
        active ? "text-warning" : "text-faint-foreground",
      )}
    >
      <Star className={cn("h-4 w-4", active && "fill-current")} aria-hidden="true" />
    </button>
  );
}
