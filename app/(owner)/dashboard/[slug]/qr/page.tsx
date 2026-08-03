"use client";

import { useState } from "react";
import { Archive, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { QRCard } from "@/components/shared/qr-card";
import { QrCreateDialog } from "@/components/dashboard/qr-create-dialog";
import { showToast } from "@/components/ui/toast";
import { demoQrCodes, demoRestaurant } from "@/lib/demo/note-di-caffe-demo";
import type { QrCode } from "@/lib/types/database";
import { QrCode as QrCodeIcon } from "lucide-react";

export default function QrPage() {
  const [qrCodes, setQrCodes] = useState<QrCode[]>(demoQrCodes);
  const [createOpen, setCreateOpen] = useState(false);

  const active = qrCodes.filter((qr) => qr.status === "active");
  const archived = qrCodes.filter((qr) => qr.status === "archived");

  function archive(id: string) {
    setQrCodes((prev) => prev.map((qr) => (qr.id === id ? { ...qr, status: "archived" } : qr)));
    showToast.success("QR archivado", "Ya no se muestra como activo, pero no se ha perdido el histórico.");
  }

  function handleCreate(qr: QrCode) {
    setQrCodes((prev) => [...prev, qr]);
    showToast.success("Código QR generado", qr.label);
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

      {active.length === 0 ? (
        <EmptyState icon={QrCodeIcon} title="Todavía no tienes ningún QR" description="Genera el primero para empezar." />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {active.map((qr) => (
            <QRCard
              key={qr.id}
              qr={qr}
              actions={
                <div className="flex gap-1">
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => showToast.info("Descarga de PDF disponible en el bloque del generador de QR")}
                    aria-label="Descargar PDF"
                  >
                    <Download className="h-4 w-4" />
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
              <QRCard key={qr.id} qr={qr} />
            ))}
          </div>
        </div>
      ) : null}

      <QrCreateDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        restaurantId={demoRestaurant.id}
        onCreate={handleCreate}
      />
    </div>
  );
}
