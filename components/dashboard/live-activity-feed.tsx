"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActivityFeed } from "./activity-feed";
import { useActivity } from "@/lib/activity/activity-context";

/**
 * Envoltorio cliente para leer el historial compartido (`ActivityProvider`,
 * montado en DashboardShell) desde el Resumen, que es un Server Component.
 */
export function LiveActivityFeed({ slug, limit = 6 }: { slug: string; limit?: number }) {
  const { activity } = useActivity();

  return (
    <div>
      <ActivityFeed activity={activity.slice(0, limit)} />
      <Link
        href={`/dashboard/${slug}/actividad`}
        className="nova-transition mt-2 inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline"
      >
        Ver toda la actividad <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </div>
  );
}
