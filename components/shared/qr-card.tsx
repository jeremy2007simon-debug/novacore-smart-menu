import { Archive, QrCode as QrCodeIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import type { QrCode } from "@/lib/types/database";
import { cn } from "@/lib/utils/cn";

/**
 * `qrImageSrc` llega vacío hasta el bloque del generador de QR (sección
 * "Generador QR" de la Fase 1) — hasta entonces se ve un marcador de
 * posición, no un hueco roto.
 */
export function QRCard({
  qr,
  qrImageSrc,
  actions,
  className,
}: {
  qr: Pick<QrCode, "label" | "type" | "table_number" | "status" | "scan_count">;
  qrImageSrc?: string;
  actions?: React.ReactNode;
  className?: string;
}) {
  const archived = qr.status === "archived";

  return (
    <Card className={cn("flex flex-col overflow-hidden", archived && "opacity-70", className)}>
      <CardHeader className="flex-row items-center justify-between gap-2 space-y-0">
        <CardTitle className="text-sm">{qr.label}</CardTitle>
        <Badge variant={archived ? "neutral" : "primary"}>
          {archived ? "Archivado" : qr.type === "table" ? "Mesa" : "Carta"}
        </Badge>
      </CardHeader>

      <CardContent className="flex flex-1 items-center justify-center py-2">
        <div className="flex h-32 w-32 items-center justify-center rounded-md border border-dashed border-border bg-surface-raised">
          {qrImageSrc ? (
            // eslint-disable-next-line @next/next/no-img-element -- SVG/PNG generado dinámicamente por el bloque de QR, no candidato a next/image.
            <img src={qrImageSrc} alt={`Código QR de ${qr.label}`} className="h-28 w-28" />
          ) : (
            <QrCodeIcon className="h-10 w-10 text-faint-foreground" aria-hidden="true" />
          )}
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1">
          {archived ? <Archive className="h-3.5 w-3.5" aria-hidden="true" /> : null}
          {qr.scan_count} escaneos
        </span>
        {actions}
      </CardFooter>
    </Card>
  );
}
