import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertTriangle,
  ArrowRight,
  Archive,
  Ban,
  EyeOff,
  Layers,
  QrCode,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import { StatTile } from "@/components/dashboard/stat-tile";
import { LiveActivityFeed } from "@/components/dashboard/live-activity-feed";
import { RestaurantStatusToggle } from "@/components/dashboard/restaurant-status-toggle";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";

type OwnerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OwnerDashboardPage({ params }: OwnerDashboardPageProps) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const supabase = await createSupabaseServerClient();
  const [{ data: dishes }, { data: categories }, { data: reviews }] = await Promise.all([
    supabase.from("dishes").select("status, avg_rating, rating_count").eq("restaurant_id", restaurant.id),
    supabase.from("categories").select("id").eq("restaurant_id", restaurant.id),
    supabase.from("reviews").select("status").eq("restaurant_id", restaurant.id),
  ]);

  const allDishes = dishes ?? [];
  const availableDishes = allDishes.filter((d) => d.status === "available").length;
  const soldOutDishes = allDishes.filter((d) => d.status === "sold_out").length;
  // Los platos ocultos hoy son, en la práctica, los pendientes de revisión
  // de la importación desde foto — no hay un motivo distinto guardado en
  // el esquema todavía, así que el aviso de abajo asume ese caso.
  const hiddenDishes = allDishes.filter((d) => d.status === "hidden").length;
  const pendingReviews = (reviews ?? []).filter((r) => r.status === "pending").length;

  const ratedDishes = allDishes.filter((d) => d.rating_count > 0);
  const totalRatingCount = ratedDishes.reduce((sum, d) => sum + d.rating_count, 0);
  const avgRating =
    totalRatingCount > 0
      ? ratedDishes.reduce((sum, d) => sum + d.avg_rating * d.rating_count, 0) / totalRatingCount
      : 0;

  return (
    <div>
      <PageHeader
        title="Resumen"
        description="Un vistazo rápido a cómo está tu carta hoy."
        action={<RestaurantStatusToggle initialStatus={restaurant.operating_status} />}
      />

      {hiddenDishes > 0 ? (
        <Card className="mb-6 border-danger/40 bg-danger/10 p-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-0">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">{hiddenDishes} platos ocultos</p>
                <p className="text-sm text-muted-foreground">
                  No son visibles en la carta pública — revísalos y actívalos cuando estén listos.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/dashboard/${slug}/platos?status=hidden`}>
                Revisar ahora <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : null}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
        <StatTile
          icon={UtensilsCrossed}
          label="Productos activos"
          value={availableDishes}
          href={`/dashboard/${slug}/platos?status=available`}
          tone="success"
        />
        <StatTile
          icon={Ban}
          label="Productos agotados"
          value={soldOutDishes}
          href={`/dashboard/${slug}/platos?status=sold_out`}
          tone="warning"
        />
        <StatTile
          icon={EyeOff}
          label="Productos ocultos"
          value={hiddenDishes}
          href={`/dashboard/${slug}/platos?status=hidden`}
        />
        <StatTile icon={Layers} label="Categorías" value={(categories ?? []).length} href={`/dashboard/${slug}/categorias`} />
        <StatTile
          icon={Star}
          label="Reseñas pendientes"
          value={pendingReviews}
          href={`/dashboard/${slug}/resenas`}
          tone="warning"
        />
        <StatTile
          icon={Star}
          label="Valoración media"
          value={avgRating > 0 ? avgRating.toFixed(1) : "—"}
          href={`/dashboard/${slug}/resenas`}
        />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <LiveActivityFeed slug={slug} />
        </div>

        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Accesos rápidos</h2>
          <div className="mt-3 flex flex-col gap-2">
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href={`/dashboard/${slug}/platos`}>
                <UtensilsCrossed className="h-4 w-4" /> Añadir un plato
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href={`/dashboard/${slug}/qr`}>
                <QrCode className="h-4 w-4" /> Generar un código QR
              </Link>
            </Button>
            <Button asChild variant="outline" size="sm" className="justify-start">
              <Link href={`/dashboard/${slug}/categorias`}>
                <Archive className="h-4 w-4" /> Reordenar categorías
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
