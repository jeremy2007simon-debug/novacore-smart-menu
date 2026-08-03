import Link from "next/link";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils/cn";

export function StatTile({
  icon: Icon,
  label,
  value,
  href,
  tone = "primary",
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
  tone?: "primary" | "success" | "warning" | "danger";
}) {
  return (
    <Link href={href}>
      <Card className="nova-transition flex items-center gap-3 p-4 hover:border-primary hover:shadow-md">
        <div
          className={cn(
            "flex h-10 w-10 shrink-0 items-center justify-center rounded-md",
            tone === "primary" && "bg-primary/10 text-primary",
            tone === "success" && "bg-success/10 text-success",
            tone === "warning" && "bg-warning/10 text-warning",
            tone === "danger" && "bg-danger/10 text-danger",
          )}
        >
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div className="min-w-0">
          <p className="font-display text-xl font-semibold leading-none text-foreground">{value}</p>
          <p className="mt-1 text-xs leading-snug text-muted-foreground">{label}</p>
        </div>
      </Card>
    </Link>
  );
}
