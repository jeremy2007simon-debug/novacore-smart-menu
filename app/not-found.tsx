import Link from "next/link";
import { UtensilsCrossed } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-4 px-6 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-surface-raised text-muted-foreground">
        <UtensilsCrossed className="h-6 w-6" aria-hidden="true" />
      </div>
      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-xl font-semibold text-foreground">Página no encontrada</h1>
        <p className="max-w-sm text-sm text-muted-foreground">
          El enlace al que has llegado no existe o ya no está disponible.
        </p>
      </div>
      <Button asChild variant="outline">
        <Link href="/">Ir al inicio</Link>
      </Button>
    </main>
  );
}
