"use client";

import { useMemo } from "react";
import { History } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ACTIVITY_KIND_ICON } from "@/components/dashboard/activity-kind-icon";
import { useActivity } from "@/lib/activity/activity-context";
import { formatRelativeTime } from "@/lib/utils/time";

function dayLabel(iso: string, now: Date): string {
  const date = new Date(iso);
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const diffDays = Math.round((today.getTime() - target.getTime()) / 86400000);

  if (diffDays === 0) return "Hoy";
  if (diffDays === 1) return "Ayer";
  return date.toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric" });
}

export default function ActividadPage() {
  const { activity } = useActivity();

  const groups = useMemo(() => {
    const now = new Date();
    const map = new Map<string, typeof activity>();
    for (const item of activity) {
      const label = dayLabel(item.created_at, now);
      const existing = map.get(label);
      if (existing) existing.push(item);
      else map.set(label, [item]);
    }
    return Array.from(map.entries());
  }, [activity]);

  return (
    <div>
      <PageHeader
        title="Actividad reciente"
        description="Todo lo que ha ocurrido en tu restaurante, con quién lo hizo y cuándo."
      />

      {activity.length === 0 ? (
        <EmptyState icon={History} title="Todavía no hay actividad" description="Tus próximos cambios aparecerán aquí." />
      ) : (
        <div className="flex flex-col gap-6">
          {groups.map(([label, items]) => (
            <div key={label}>
              <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-faint-foreground">{label}</h2>
              <Card className="p-5">
                <ul className="flex flex-col gap-4">
                  {items.map((item) => {
                    const Icon = ACTIVITY_KIND_ICON[item.kind];
                    return (
                      <li key={item.id} className="flex items-start gap-3">
                        <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-raised text-muted-foreground">
                          <Icon className="h-4 w-4" aria-hidden="true" />
                        </span>
                        <div className="min-w-0">
                          <p className="text-sm text-foreground">
                            <span className="font-medium">{item.actor}</span> {item.message}
                          </p>
                          <p className="mt-0.5 text-xs text-faint-foreground">{formatRelativeTime(item.created_at)}</p>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
