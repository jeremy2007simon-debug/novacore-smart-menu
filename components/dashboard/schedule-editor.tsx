"use client";

import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";

export type DaySchedule = { open: string; close: string } | null;
export type WeekSchedule = Record<string, DaySchedule>;

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export function ScheduleEditor({
  value,
  onChange,
}: {
  value: WeekSchedule;
  onChange: (next: WeekSchedule) => void;
}) {
  function updateDay(key: string, day: DaySchedule) {
    onChange({ ...value, [key]: day });
  }

  return (
    <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
      {DAYS.map(({ key, label }) => {
        const day = value[key];
        const open = day !== null;
        return (
          <div key={key} className="flex flex-wrap items-center gap-4 p-3">
            <div className="flex w-32 items-center gap-2">
              <Switch
                checked={open}
                onCheckedChange={(checked) => updateDay(key, checked ? { open: "09:00", close: "22:00" } : null)}
                aria-label={`Abierto los ${label}`}
              />
              <span className="text-sm font-medium text-foreground">{label}</span>
            </div>
            {open ? (
              <div className="flex items-center gap-2">
                <Input
                  type="time"
                  value={day.open}
                  onChange={(e) => updateDay(key, { open: e.target.value, close: day.close })}
                  className="w-32"
                  aria-label={`Hora de apertura los ${label}`}
                />
                <span className="text-sm text-muted-foreground">a</span>
                <Input
                  type="time"
                  value={day.close}
                  onChange={(e) => updateDay(key, { open: day.open, close: e.target.value })}
                  className="w-32"
                  aria-label={`Hora de cierre los ${label}`}
                />
              </div>
            ) : (
              <span className="text-sm text-faint-foreground">Cerrado</span>
            )}
          </div>
        );
      })}
    </div>
  );
}
