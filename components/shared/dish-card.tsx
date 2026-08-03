import Image from "next/image";
import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Rating } from "@/components/ui/rating";
import { formatPrice } from "@/lib/utils/money";
import type { Dish, DishBadge } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

const BADGE_LABEL: Record<DishBadge, string> = {
  recommended: "Recomendado",
  bestseller: "Más vendido",
  new: "Nuevo",
  on_offer: "Oferta",
};

type DishCardProps = {
  dish: Pick<
    Dish,
    "name" | "short_description" | "price_cents" | "status" | "badges" | "avg_rating" | "rating_count"
  >;
  imageUrl?: string | null;
  currency: string;
  href: string;
  className?: string;
};

export function DishCard({ dish, imageUrl, currency, href, className }: DishCardProps) {
  const soldOut = dish.status === "sold_out";

  return (
    <Card className={cn("group flex flex-col overflow-hidden", className)}>
      <div className="relative aspect-4/3 w-full overflow-hidden bg-surface-raised">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={dish.name}
            fill
            sizes="(min-width: 768px) 320px, 50vw"
            className="nova-transition object-cover group-hover:scale-[1.03]"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <UtensilsCrossed className="h-8 w-8 text-faint-foreground" aria-hidden="true" />
          </div>
        )}

        {soldOut ? (
          <div className="absolute inset-0 flex items-center justify-center bg-background/70">
            <Badge variant="neutral">Agotado</Badge>
          </div>
        ) : null}

        {dish.badges.length > 0 ? (
          <div className="absolute left-2 top-2 flex flex-wrap gap-1">
            {dish.badges.map((badge) => (
              <Badge key={badge} variant={badge === "on_offer" ? "danger" : "accent"}>
                {BADGE_LABEL[badge]}
              </Badge>
            ))}
          </div>
        ) : null}
      </div>

      <CardContent className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-base font-semibold text-balance text-foreground">
            {dish.name}
          </h3>
          <span className="whitespace-nowrap font-display text-base font-semibold text-foreground">
            {formatPrice(dish.price_cents, currency)}
          </span>
        </div>

        {dish.short_description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{dish.short_description}</p>
        ) : null}

        {dish.rating_count > 0 ? (
          <Rating value={dish.avg_rating} count={dish.rating_count} size="sm" />
        ) : null}

        <Button asChild variant="outline" size="sm" className="mt-2 self-start">
          <Link href={href}>Ver más</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
