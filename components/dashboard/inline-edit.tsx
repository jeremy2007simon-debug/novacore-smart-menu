"use client";

import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

/**
 * Texto que se convierte en un input al hacer clic, para editar sin abrir
 * ninguna ventana — Enter o perder el foco confirma, Escape cancela.
 */
export function InlineEdit({
  value,
  onCommit,
  displayValue,
  type = "text",
  className,
  inputClassName,
  ariaLabel,
}: {
  value: string;
  onCommit: (value: string) => void;
  displayValue?: React.ReactNode;
  type?: "text" | "number";
  className?: string;
  inputClassName?: string;
  ariaLabel: string;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [editing]);

  function commit() {
    setEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onCommit(trimmed);
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type={type}
        step={type === "number" ? "0.10" : undefined}
        min={type === "number" ? "0" : undefined}
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            commit();
          }
          if (e.key === "Escape") {
            setDraft(value);
            setEditing(false);
          }
        }}
        aria-label={ariaLabel}
        className={cn(
          "h-7 w-full max-w-28 rounded border border-primary bg-surface px-1.5 text-sm text-foreground focus:outline-none",
          inputClassName,
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        setDraft(value);
        setEditing(true);
      }}
      aria-label={ariaLabel}
      className={cn(
        "nova-transition rounded px-1.5 py-0.5 text-left hover:bg-surface-raised",
        className,
      )}
    >
      {displayValue ?? value}
    </button>
  );
}
