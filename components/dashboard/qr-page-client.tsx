"use client";

import { useEffect, useState } from "react";
import { Archive, Check, Download, Loader2, Plus, QrCode as QrCodeIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { QRCard } from "@/components/shared/qr-card";
import { QrCreateDialog } from "@/components/dashboard/qr-create-dialog";
import { showToast } from "@/components/ui/toast";
import { generateQrDataUrl, qrTargetUrl } from "@/lib/utils/qr";
import { downloadQrPdf } from "@/lib/utils/qr-pdf";
import { archiveQrCode, createQrCode } from "@/features/dashboard/qr-actions";
import type { QrCode, QrType, Restaurant } from "@/lib/types/database";

const PRESETS: { label: string; type: QrType; table_number: number | null }[] = [
  { label: "Carta general", type: "menu", table_number: null },
  { label: "Mesa 1", type: "table", table_number: 1 },
  { label: "Mesa 2", type: "table", table_number: 2 },
  { label: "Mesa 3", type: "table", table_number: 3 },
  { label: "Terraza", type: "table", table_number: null },
  { label: "Barra", type: "table", table_number: null },
];

export function QrPageClient({ restaurant, initialQrCodes }: { restaurant: Restaurant; initialQrCodes: QrCode[] }) {
  const [qrCodes, setQrCodes] = useState<QrCode[]>(initialQrCodes);
  const [qrImages, setQrImages] = useState<Record<string, string>>({});
  const [createOpen, setCreateOpen] = useState(false);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [creatingPreset, setCreatingPreset] = useState<string | null>(null);

  const active = qrCodes.filter((qr) => qr.status === "active");
  const archived = qrCodes.filter((qr) => qr.status === "archived");

  useEffect(() => {
    const missing = qrCodes.filter((qr) => !qrImages[qr.id]);
    if (missing.length === 0) return;
    let cancelled = false;
    Promise.all(
      missing.map(async (qr) => [qr.id, await generateQrDataUrl(qrTargetUrl(restaurant.slug, qr))] as const),
    ).then((entries) => {
      if (!cancelled) setQrImages((prev) => ({ ...prev, ...Object.fromEntries(entries) }));
    });
    return () => {
      cancelled = true;
    };
  }, [qrCodes, qrImages, restaurant.slug]);

  async function archive(id: string) {
    setQrCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, status: "archived" } : qr)));
    const result = await archiveQrCode(id);
    if (!result.ok) {
      showToast.error("No se pudo archivar el QR", "Inténtalo de nuevo en unos segundos.");
      return;
    }
    showToast.success("QR archivado", "Ya no se muestra como activo, pero no se ha perdido el histórico.");
  }

  async function handleCreate(input: { label: string; type: QrType; tableNumber: number | null }) {
    const created = await createQrCode({
      restaurantId: restaurant.id,
      label: input.label,
      type: input.type,
      tableNumber: input.tableNumber,
    });
    if (!created) {
      showToast.error("No se pudo generar el QR", "Inténtalo de nuevo en unos segundos.");
      return;
    }
    setQrCodes((prev) => [...prev, created]);
    showToast.success("Código QR generado", created.label);
  }

  async function handlePreset(preset: (typeof PRESETS)[number]) {
    setCreatingPreset(preset.label);
    try {
      await handleCreate({ label: preset.label, type: preset.type, tableNumber: preset.table_number });
    } finally {
      setCreatingPreset(null);
    }
  }

  async function handleDownload(qr: QrCode) {
    setDownloadingId(qr.id);
    try {
      await downloadQrPdf(qr, restaurant.name, restaurant.slug);
    } finally {
      setDownloadingId(null);
    }
  }

  return (
    <div>
      <PageHeader
        title="Códigos QR"
        description="Genera un QR para la carta general o para cada mesa, y descarga el PDF listo para imprimir."
        action={
          <Button onClick={() => setCreateOpen(true)}>
            <Plus className="h-4 w-4" /> Nuevo QR
          </Button>
        }
      />

      <div className="mb-6 flex flex-wrap gap-2">
        {PRESETS.map((preset) => {
          const exists = active.some((qr) => qr.label.toLowerCase() === preset.label.toLowerCase());
          return (
            <Button
              key={preset.label}
              variant={exists ? "secondary" : "outline"}
              size="sm"
              disabled={exists || creatingPreset === preset.label}
              onClick={() => handlePreset(preset)}
            >
              {exists ? (
                <Check className="h-3.5 w-3.5" />
              ) : creatingPreset === preset.label ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden="true" />
              ) : (
                <Plus className="h-3.5 w-3.5" />
              )}
              {preset.label}
            </Button>
          );
        })}
      </div>

      {active.length === 0 ? (
        <EmptyState icon={QrCodeIcon} title="Todavía no tienes ningún QR" description="Genera el primero para empezar." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((qr) => (
            <QRCard
              key={qr.id}
              qr={qr}
              qrImageSrc={qrImages[qr.id]}
              actions={
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleDownload(qr)}
                    disabled={downloadingId === qr.id}
                    aria-label="Descargar PDF"
                  >
                    {downloadingId === qr.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
                    ) : (
                      <Download className="h-4 w-4" />
                    )}
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => archive(qr.id)} aria-label="Archivar QR">
                    <Archive className="h-4 w-4" />
                  </Button>
                </div>
              }
            />
          ))}
        </div>
      )}

      {archived.length > 0 ? (
        <div className="mt-8">
          <h2 className="mb-3 font-display text-base font-semibold text-foreground">Archivados</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {archived.map((qr) => (
              <QRCard key={qr.id} qr={qr} qrImageSrc={qrImages[qr.id]} />
            ))}
          </div>
        </div>
      ) : null}

      <QrCreateDialog open={createOpen} onOpenChange={setCreateOpen} onCreate={handleCreate} />
    </div>
  );
}
