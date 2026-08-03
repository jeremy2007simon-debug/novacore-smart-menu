import { Clock } from "lucide-react";
import { Rating } from "@/components/ui/rating";
import { EmptyState } from "@/components/ui/empty-state";
import type { WeekSchedule } from "@/components/dashboard/schedule-editor";
import type { Restaurant } from "@/lib/types/database";
import type { DemoReview } from "@/lib/demo/types";

const DAYS: { key: string; label: string }[] = [
  { key: "monday", label: "Lunes" },
  { key: "tuesday", label: "Martes" },
  { key: "wednesday", label: "Miércoles" },
  { key: "thursday", label: "Jueves" },
  { key: "friday", label: "Viernes" },
  { key: "saturday", label: "Sábado" },
  { key: "sunday", label: "Domingo" },
];

export function RestaurantFooter({ restaurant, reviews }: { restaurant: Restaurant; reviews: DemoReview[] }) {
  const schedule = restaurant.schedule as WeekSchedule;
  const restaurantReviews = reviews.filter((r) => r.target_type === "restaurant" && r.status === "approved");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto grid max-w-3xl gap-10 px-6 py-10 sm:grid-cols-2">
        <div>
          <h2 className="mb-3 flex items-center gap-1.5 font-display text-base font-semibold text-foreground">
            <Clock className="h-4 w-4" aria-hidden="true" /> Horario
          </h2>
          <dl className="flex flex-col gap-1 text-sm">
            {DAYS.map(({ key, label }) => {
              const day = schedule[key];
              return (
                <div key={key} className="flex items-center justify-between gap-4">
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="text-foreground">{day ? `${day.open} – ${day.close}` : "Cerrado"}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div>
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">Opiniones del restaurante</h2>
          {restaurantReviews.length === 0 ? (
            <EmptyState title="Aún no hay opiniones" description="Las opiniones publicadas aparecerán aquí." />
          ) : (
            <div className="flex flex-col gap-4">
              {restaurantReviews.map((review) => (
                <div key={review.id} className="rounded-lg border border-border p-4">
                  <div className="flex items-center gap-2">
                    <Rating value={review.rating} size="sm" />
                    <span className="text-sm font-medium text-foreground">{review.author_name ?? "Anónimo"}</span>
                  </div>
                  {review.comment ? <p className="mt-2 text-sm text-foreground">{review.comment}</p> : null}
                  {review.owner_reply ? (
                    <div className="mt-3 rounded-md bg-surface-raised p-3">
                      <p className="text-xs font-medium text-muted-foreground">Respuesta de {restaurant.name}</p>
                      <p className="mt-1 text-sm text-foreground">{review.owner_reply}</p>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </footer>
  );
}
