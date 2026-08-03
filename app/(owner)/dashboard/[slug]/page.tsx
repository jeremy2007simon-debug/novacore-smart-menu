import Link from "next/link";
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
import { ActivityFeed } from "@/components/dashboard/activity-feed";
import { RestaurantStatusToggle } from "@/components/dashboard/restaurant-status-toggle";
import {
  demoActivity,
  demoCategories,
  demoDishes,
  demoRestaurant,
  demoReviews,
} from "@/lib/demo/note-di-caffe-demo";

type OwnerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

/**
 * NOTA — fase de diseño: esta pantalla usa datos de demostración
 * (lib/demo/note-di-caffe-demo.ts). Nada de lo que se ve aquí lee ni
 * escribe todavía en Supabase — eso llega en el siguiente bloque, una vez
 * aprobada la experiencia.
 */
export default async function OwnerDashboardPage({ params }: OwnerDashboardPageProps) {
  const { slug } = await params;

  const availableDishes = demoDishes.filter((d) => d.status === "available").length;
  const soldOutDishes = demoDishes.filter((d) => d.status === "sold_out").length;
  const hiddenDishes = demoDishes.filter((d) => d.status === "hidden").length;
  const dishesNeedingReview = demoDishes.filter((d) => d.needs_review);
  const pendingReviews = demoReviews.filter((r) => r.status === "pending").length;

  const ratedDishes = demoDishes.filter((d) => d.rating_count > 0);
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
        action={<RestaurantStatusToggle initialStatus={demoRestaurant.operating_status} />}
      />

      {dishesNeedingReview.length > 0 ? (
        <Card className="mb-6 border-danger/40 bg-danger/10 p-4">
          <CardContent className="flex flex-wrap items-center justify-between gap-3 p-0">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 text-danger" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium text-foreground">
                  {dishesNeedingReview.length} platos pendientes de revisión
                </p>
                <p className="text-sm text-muted-foreground">
                  Se importaron de la carta en foto y algún dato no se pudo leer con confianza.
                </p>
              </div>
            </div>
            <Button asChild size="sm" variant="outline">
              <Link href={`/dashboard/${slug}/platos?status=needs_review`}>
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
        <StatTile icon={Layers} label="Categorías" value={demoCategories.length} href={`/dashboard/${slug}/categorias`} />
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
          <ActivityFeed activity={demoActivity} />
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
