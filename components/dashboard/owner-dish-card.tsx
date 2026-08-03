import { GripVertical, Pencil, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DishStatusBadge, NeedsReviewBadge } from "./dish-status-badge";
import { formatPrice } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";
import type { DemoDish } from "@/lib/demo/note-di-caffe-demo";

const BADGE_LABEL: Record<string, string> = {
  recommended: "Recomendado",
  bestseller: "Más vendido",
  new: "Nuevo",
  on_offer: "Oferta",
};

export function OwnerDishCard({
  dish,
  currency,
  onEdit,
  dragHandleProps,
  isDragging,
  style,
  innerRef,
}: {
  dish: DemoDish;
  currency: string;
  onEdit: () => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  style?: React.CSSProperties;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  return (
    <div
      ref={innerRef}
      style={style}
      className={cn(
        "nova-transition flex items-start gap-3 rounded-lg border border-border bg-surface p-3 shadow-sm",
        isDragging && "opacity-50",
      )}
    >
      <button
        {...dragHandleProps}
        className="nova-transition mt-1 cursor-grab text-faint-foreground hover:text-foreground active:cursor-grabbing"
        aria-label={`Reordenar ${dish.name}`}
      >
        <GripVertical className="h-4 w-4" />
      </button>

      <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-md bg-surface-raised">
        {dish.image_url ? (
          // eslint-disable-next-line @next/next/no-img-element -- miniatura, panel interno
          <img src={dish.image_url} alt="" className="h-full w-full object-cover" />
        ) : (
          <UtensilsCrossed className="h-5 w-5 text-faint-foreground" aria-hidden="true" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="truncate text-sm font-semibold text-foreground">{dish.name}</p>
          <p className="whitespace-nowrap text-sm font-semibold tabular-nums text-foreground">
            {formatPrice(dish.price_cents, currency)}
          </p>
        </div>
        <p className="mt-0.5 truncate text-xs text-muted-foreground">{dish.category_name}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <DishStatusBadge status={dish.status} />
          {dish.needs_review ? <NeedsReviewBadge /> : null}
          {dish.badges.map((badge) => (
            <Badge key={badge} variant="accent">
              {BADGE_LABEL[badge]}
            </Badge>
          ))}
        </div>
      </div>

      <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar ${dish.name}`}>
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  );
}
