"use client";

import { cn } from "@/lib/utils/cn";
import type { Allergen } from "@/lib/types/database";

export function AllergenPicker({
  value,
  onChange,
  allergens,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  allergens: Pick<Allergen, "code" | "name_es">[];
}) {
  function toggle(code: string) {
    onChange(value.includes(code) ? value.filter((c) => c !== code) : [...value, code]);
  }

  return (
    <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
      {allergens.map((allergen) => {
        const active = value.includes(allergen.code);
        return (
          <button
            key={allergen.code}
            type="button"
            onClick={() => toggle(allergen.code)}
            aria-pressed={active}
            className={cn(
              "nova-transition rounded-md border px-3 py-2 text-left text-xs font-medium",
              active
                ? "border-primary bg-primary/10 text-foreground"
                : "border-border bg-surface text-muted-foreground hover:border-border-strong",
            )}
          >
            {allergen.name_es}
          </button>
        );
      })}
    </div>
  );
}
