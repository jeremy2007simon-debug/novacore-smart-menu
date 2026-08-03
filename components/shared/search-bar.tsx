"use client";

import { useEffect, useState } from "react";
import { Search, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";

/**
 * `onSearch` debe venir memoizado (useCallback) por quien la usa — si
 * cambia de identidad en cada render, el debounce se reinicia sin parar y
 * la búsqueda nunca llega a dispararse.
 */
export function SearchBar({
  placeholder = "Busca por nombre, ingrediente, categoría o precio…",
  onSearch,
  debounceMs = 300,
  className,
}: {
  placeholder?: string;
  onSearch: (query: string) => void;
  debounceMs?: number;
  className?: string;
}) {
  const [value, setValue] = useState("");

  useEffect(() => {
    const id = setTimeout(() => onSearch(value.trim()), debounceMs);
    return () => clearTimeout(id);
  }, [value, debounceMs, onSearch]);

  return (
    <div className={cn("relative", className)}>
      <Search
        className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-faint-foreground"
        aria-hidden="true"
      />
      <Input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        aria-label="Buscar en la carta"
        className="pl-9 pr-9"
      />
      {value ? (
        <button
          type="button"
          onClick={() => setValue("")}
          aria-label="Borrar búsqueda"
          className="nova-transition absolute right-3 top-1/2 -translate-y-1/2 text-faint-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" aria-hidden="true" />
        </button>
      ) : null}
    </div>
  );
}
