import { Euro, EyeOff, Layers, MessageSquare, Settings, Tag } from "lucide-react";
import { Card } from "@/components/ui/card";
import { formatRelativeTime } from "@/lib/utils/time";
import type { DemoActivity, DemoActivityKind } from "@/lib/demo/note-di-caffe-demo";

const KIND_ICON: Record<DemoActivityKind, React.ElementType> = {
  price: Euro,
  status: EyeOff,
  badge: Tag,
  review: MessageSquare,
  category: Layers,
  settings: Settings,
};

export function ActivityFeed({ activity }: { activity: DemoActivity[] }) {
  return (
    <Card className="p-5">
      <h2 className="font-display text-base font-semibold text-foreground">Últimos cambios</h2>
      <ul className="mt-4 flex flex-col gap-4">
        {activity.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <li key={item.id} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-surface-raised text-muted-foreground">
                <Icon className="h-4 w-4" aria-hidden="true" />
              </span>
              <div className="min-w-0">
                <p className="text-sm text-foreground">{item.message}</p>
                <p className="mt-0.5 text-xs text-faint-foreground">{formatRelativeTime(item.created_at)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </Card>
  );
}
