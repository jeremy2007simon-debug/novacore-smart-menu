import { Card } from "@/components/ui/card";
import { ACTIVITY_KIND_ICON } from "./activity-kind-icon";
import { formatRelativeTime } from "@/lib/utils/time";
import type { DemoActivity } from "@/lib/demo/note-di-caffe-demo";

export function ActivityFeed({
  activity,
  title = "Últimos cambios",
}: {
  activity: DemoActivity[];
  title?: string;
}) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-base font-semibold text-foreground">{title}</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {activity.map((item) => {
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
  );
}
