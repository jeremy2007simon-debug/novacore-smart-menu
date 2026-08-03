"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const SIZE_CLASSES = { sm: "h-3.5 w-3.5", md: "h-4 w-4", lg: "h-6 w-6" } as const;

export function Rating({
  value,
  count,
  max = 5,
  size = "md",
  interactive = false,
  onChange,
  className,
}: {
  value: number;
  count?: number;
  max?: number;
  size?: "sm" | "md" | "lg";
  interactive?: boolean;
  onChange?: (value: number) => void;
  className?: string;
}) {
  return (
    <div
      className={cn("inline-flex items-center gap-1", className)}
      role={interactive ? "radiogroup" : "img"}
      aria-label={
        interactive
          ? "Selecciona una valoración"
          : `Valoración: ${value} de ${max} estrellas${count !== undefined ? `, ${count} reseñas` : ""}`
      }
    >
      {Array.from({ length: max }, (_, i) => {
        const filled = i < Math.round(value);
        return interactive ? (
          <button
            key={i}
            type="button"
            role="radio"
            aria-checked={filled}
            aria-label={`${i + 1} estrella${i === 0 ? "" : "s"}`}
            onClick={() => onChange?.(i + 1)}
            className="nova-transition rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--nova-color-focus-ring)]"
          >
            <Star
              className={cn(
                SIZE_CLASSES[size],
                filled ? "fill-accent text-accent" : "fill-transparent text-border-strong",
              )}
              aria-hidden="true"
            />
          </button>
        ) : (
          <Star
            key={i}
            className={cn(
              SIZE_CLASSES[size],
              filled ? "fill-accent text-accent" : "fill-transparent text-border-strong",
            )}
            aria-hidden="true"
          />
        );
      })}
      {count !== undefined ? <span className="ml-1 text-xs text-muted-foreground">({count})</span> : null}
    </div>
  );
}
