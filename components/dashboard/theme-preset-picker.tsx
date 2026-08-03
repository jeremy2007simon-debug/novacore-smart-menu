"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { PRESET_LIST } from "@/lib/theme/presets";
import type { PresetId } from "@/lib/theme/types";

export function ThemePresetPicker({
  value,
  onChange,
}: {
  value: PresetId;
  onChange: (preset: PresetId) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {PRESET_LIST.map((preset) => {
        const active = preset.id === value;
        return (
          <button
            key={preset.id}
            type="button"
            onClick={() => onChange(preset.id)}
            aria-pressed={active}
            className={cn(
              "nova-transition flex flex-col gap-3 rounded-lg border p-3 text-left",
              active ? "border-primary ring-2 ring-primary/30" : "border-border hover:border-border-strong",
            )}
          >
            <div className="flex overflow-hidden rounded-md" style={{ height: 40 }}>
              <span className="flex-1" style={{ background: preset.light.bg }} />
              <span className="flex-1" style={{ background: preset.light.primary }} />
              <span className="flex-1" style={{ background: preset.light.accent }} />
              <span className="flex-1" style={{ background: preset.dark.bg }} />
            </div>
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-sm font-semibold text-foreground">{preset.label}</p>
                <p className="text-xs text-muted-foreground">{preset.description}</p>
              </div>
              {active ? (
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
                  <Check className="h-3 w-3" aria-hidden="true" />
                </span>
              ) : null}
            </div>
          </button>
        );
      })}
    </div>
  );
}
