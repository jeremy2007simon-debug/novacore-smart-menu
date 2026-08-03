import { AlertTriangle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { DishStatus } from "@/lib/types/database";

const STATUS_CONFIG: Record<DishStatus, { label: string; variant: "success" | "warning" | "neutral" }> = {
  available: { label: "Disponible", variant: "success" },
  sold_out: { label: "Agotado", variant: "warning" },
  hidden: { label: "Oculto", variant: "neutral" },
  archived: { label: "Archivado", variant: "neutral" },
};

export function DishStatusBadge({ status }: { status: DishStatus }) {
  const config = STATUS_CONFIG[status];
  return <Badge variant={config.variant}>{config.label}</Badge>;
}

/**
 * Marca aparte del estado (Disponible/Agotado/Oculto/Archivado): identifica
 * platos importados de la carta cuyo texto no se pudo leer con confianza y
 * que el propietario debe completar o corregir desde el propio panel.
 */
export function NeedsReviewBadge() {
  return (
    <Badge variant="danger">
      <AlertTriangle className="h-3 w-3" aria-hidden="true" />
      Pendiente de revisión
    </Badge>
  );
}

export const DISH_STATUS_LABEL: Record<DishStatus, string> = {
  available: "Disponible",
  sold_out: "Agotado",
  hidden: "Oculto",
  archived: "Archivado",
};
