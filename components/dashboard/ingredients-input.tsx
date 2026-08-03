"use client";

import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export function IngredientsInput({
  value,
  onChange,
}: {
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function addIngredient() {
    const trimmed = draft.trim();
    if (!trimmed || value.includes(trimmed)) return;
    onChange([...value, trimmed]);
    setDraft("");
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        {value.map((ingredient) => (
          <Badge key={ingredient} variant="neutral" className="gap-1.5 py-1 pl-2.5 pr-1.5">
            {ingredient}
            <button
              type="button"
              onClick={() => onChange(value.filter((i) => i !== ingredient))}
              aria-label={`Quitar ${ingredient}`}
              className="nova-transition rounded-full hover:text-danger"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        {value.length === 0 ? <p className="text-xs text-faint-foreground">Sin ingredientes añadidos.</p> : null}
      </div>
      <div className="flex gap-2">
        <Input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              addIngredient();
            }
          }}
          placeholder="Añadir ingrediente y pulsar Enter"
          className="flex-1"
        />
        <Button type="button" variant="outline" size="icon" onClick={addIngredient} aria-label="Añadir ingrediente">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
