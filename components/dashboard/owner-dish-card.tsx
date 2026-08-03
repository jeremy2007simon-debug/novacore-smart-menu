import { GripVertical, Pencil, UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { NeedsReviewBadge } from "./dish-status-badge";
import { QuickStatusSelect } from "./quick-status-select";
import { QuickCategorySelect } from "./quick-category-select";
import { FeatureToggleButton } from "./feature-toggle-button";
import { InlineEdit } from "./inline-edit";
import { formatPrice } from "@/lib/utils/money";
import { cn } from "@/lib/utils/cn";
import type { DemoCategory, DemoDish } from "@/lib/demo/note-di-caffe-demo";

const BADGE_LABEL: Record<string, string> = {
  recommended: "Recomendado",
  bestseller: "Más vendido",
  new: "Nuevo",
  on_offer: "Oferta",
};

export function OwnerDishCard({
  dish,
  currency,
  categories,
  onEdit,
  onQuickUpdate,
  dragHandleProps,
  isDragging,
  style,
  innerRef,
}: {
  dish: DemoDish;
  currency: string;
  categories: DemoCategory[];
  onEdit: () => void;
  onQuickUpdate: (patch: Partial<DemoDish>) => void;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  isDragging?: boolean;
  style?: React.CSSProperties;
  innerRef?: React.Ref<HTMLDivElement>;
}) {
  const isRecommended = dish.badges.includes("recommended");

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
          <InlineEdit
            value={dish.name}
            onCommit={(v) => onQuickUpdate({ name: v })}
            ariaLabel={`Editar nombre de ${dish.name}`}
            className="truncate text-sm font-semibold text-foreground"
          />
          <InlineEdit
            value={(dish.price_cents / 100).toFixed(2)}
            type="number"
            displayValue={formatPrice(dish.price_cents, currency)}
            onCommit={(v) => {
              const cents = Math.round((parseFloat(v) || 0) * 100);
              if (cents > 0) onQuickUpdate({ price_cents: cents });
            }}
            ariaLabel={`Editar precio de ${dish.name}`}
            className="whitespace-nowrap text-sm font-semibold tabular-nums text-foreground"
          />
        </div>

        <div className="mt-0.5">
          <QuickCategorySelect
            categoryId={dish.category_id}
            categories={categories}
            onChange={(categoryId) => {
              const category = categories.find((c) => c.id === categoryId);
              onQuickUpdate({ category_id: categoryId, category_name: category?.name ?? "" });
            }}
          />
        </div>

        {dish.rating_count > 0 ? (
          <Rating value={dish.avg_rating} count={dish.rating_count} size="sm" className="mt-1" />
        ) : null}

        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          <QuickStatusSelect status={dish.status} onChange={(status) => onQuickUpdate({ status })} />
          {dish.needs_review ? <NeedsReviewBadge /> : null}
          {dish.badges.map((badge) => (
            <Badge key={badge} variant="accent">
              {BADGE_LABEL[badge]}
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex flex-col items-center gap-1">
        <FeatureToggleButton
          active={isRecommended}
          onToggle={() =>
            onQuickUpdate({
              badges: isRecommended
                ? dish.badges.filter((b) => b !== "recommended")
                : [...dish.badges, "recommended"],
            })
          }
        />
        <Button variant="ghost" size="icon" onClick={onEdit} aria-label={`Editar ${dish.name}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
