"use client";

import { Select, SelectContent, SelectItem, SelectTrigger } from "@/components/ui/select";
import { DishStatusBadge, DISH_STATUS_LABEL } from "./dish-status-badge";
import type { DishStatus } from "@/lib/types/database";

/**
 * Cambia el estado de un plato con un clic, sin abrir ninguna ventana: el
 * propio badge de estado es el disparador del desplegable.
 */
export function QuickStatusSelect({
  status,
  onChange,
}: {
  status: DishStatus;
  onChange: (status: DishStatus) => void;
}) {
  return (
    <Select value={status} onValueChange={(v) => onChange(v as DishStatus)}>
      <SelectTrigger
        className="h-auto w-auto gap-1 border-none bg-transparent p-0 shadow-none hover:opacity-80 [&>svg]:h-3 [&>svg]:w-3"
        aria-label="Cambiar estado"
      >
        <DishStatusBadge status={status} />
      </SelectTrigger>
      <SelectContent>
        {(Object.keys(DISH_STATUS_LABEL) as DishStatus[]).map((s) => (
          <SelectItem key={s} value={s}>
            {DISH_STATUS_LABEL[s]}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
