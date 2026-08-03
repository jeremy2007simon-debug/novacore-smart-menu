import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { Category } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

type CategoryCardProps = {
  category: Pick<Category, "name" | "icon">;
  dishCount?: number;
  href: string;
  active?: boolean;
  className?: string;
};

// category.icon (string libre) queda reservado para un selector de iconos
// en el panel del propietario; hasta entonces se muestra un icono fijo.
export function CategoryCard({ category, dishCount, href, active = false, className }: CategoryCardProps) {
  return (
    <Link href={href} className="block">
      <Card
        className={cn(
          "flex items-center gap-3 p-4 hover:border-primary hover:shadow-md",
          active && "border-primary bg-surface-raised",
          className,
        )}
      >
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
          <UtensilsCrossed className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="flex flex-col">
          <span className="font-display text-sm font-semibold text-foreground">{category.name}</span>
          {dishCount !== undefined ? (
            <span className="text-xs text-muted-foreground">{dishCount} platos</span>
          ) : null}
        </div>
      </Card>
    </Link>
  );
}
