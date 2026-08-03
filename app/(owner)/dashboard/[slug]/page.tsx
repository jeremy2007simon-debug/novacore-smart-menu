import Link from "next/link";
import {
  AlertTriangle,
  ArrowRight,
  Layers,
  QrCode,
  ScanLine,
  Star,
  UtensilsCrossed,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PageHeader } from "@/components/dashboard/page-header";
import {
  demoCategories,
  demoDishes,
  demoQrCodes,
  demoReviews,
} from "@/lib/demo/note-di-caffe-demo";

type OwnerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

function StatCard({
  icon: Icon,
  label,
  value,
  href,
}: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  href: string;
}) {
  return (
    <Link href={href}>
      <Card className="nova-transition p-5 hover:border-primary hover:shadow-md">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary">
            <Icon className="h-5 w-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display text-2xl font-semibold leading-none text-foreground">{value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{label}</p>
          </div>
        </div>
      </Card>
    </Link>
  );
}

/**
 * NOTA — fase de diseño: esta pantalla usa datos de demostración
 * (lib/demo/note-di-caffe-demo.ts). Nada de lo que se ve aquí lee ni
 * escribe todavía en Supabase — eso llega en el siguiente bloque, una vez
 * aprobada la experiencia.
 */
export default async function OwnerDashboardPage({ params }: OwnerDashboardPageProps) {
  const { slug } = await params;

  const totalDishes = demoDishes.length;
  const availableDishes = demoDishes.filter((d) => d.status === "available").length;
  const dishesNeedingReview = demoDishes.filter((d) => d.needs_review);
  const pendingReviews = demoReviews.filter((r) => r.status === "pending").length;
  const totalScans = demoQrCodes.reduce((sum, qr) => sum + qr.scan_count, 0);

  return (
    <div>
      <PageHeader
        title="Resumen"
        description="Un vistazo rápido a cómo está tu carta hoy."
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

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatCard icon={UtensilsCrossed} label="Platos disponibles" value={`${availableDishes}/${totalDishes}`} href={`/dashboard/${slug}/platos`} />
        <StatCard icon={Layers} label="Categorías" value={demoCategories.length} href={`/dashboard/${slug}/categorias`} />
        <StatCard icon={Star} label="Reseñas pendientes" value={pendingReviews} href={`/dashboard/${slug}/resenas`} />
        <StatCard icon={ScanLine} label="Escaneos QR (total)" value={totalScans} href={`/dashboard/${slug}/qr`} />
      </div>

      <div className="mt-8 grid gap-4 md:grid-cols-2">
        <Card className="p-5">
          <h2 className="font-display text-base font-semibold text-foreground">Platos más valorados</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {[...demoDishes]
              .filter((d) => d.rating_count > 0)
              .sort((a, b) => b.avg_rating - a.avg_rating)
              .slice(0, 4)
              .map((dish) => (
                <li key={dish.id} className="flex items-center justify-between text-sm">
                  <span className="text-foreground">{dish.name}</span>
                  <span className="text-muted-foreground">
                    ★ {dish.avg_rating.toFixed(1)} ({dish.rating_count})
                  </span>
                </li>
              ))}
          </ul>
        </Card>

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
              <Link href={`/dashboard/${slug}/apariencia`}>
                <Star className="h-4 w-4" /> Cambiar el tema visual
              </Link>
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
