import { jsPDF } from "jspdf";
import { generateQrDataUrl, qrTargetUrl } from "./qr";
import type { QrCode } from "@/lib/types/database";

/**
 * Genera y descarga un PDF listo para imprimir con el QR, el nombre del
 * restaurante, la etiqueta ("Mesa 3", "Terraza"...) y la URL en texto por
 * si el escaneo falla. Todo client-side, sin backend.
 */
export async function downloadQrPdf(
  qr: Pick<QrCode, "label" | "type" | "table_number">,
  restaurantName: string,
  slug: string,
) {
  const url = qrTargetUrl(slug, qr);
  const dataUrl = await generateQrDataUrl(url);

  const doc = new jsPDF({ unit: "mm", format: "a6" });
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.text(restaurantName, pageWidth / 2, 18, { align: "center" });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(12);
  doc.text(qr.label, pageWidth / 2, 27, { align: "center" });

  const qrSize = 70;
  doc.addImage(dataUrl, "PNG", (pageWidth - qrSize) / 2, 35, qrSize, qrSize);

  doc.setFontSize(9);
  doc.setTextColor(120);
  doc.text("Escanea para ver la carta", pageWidth / 2, 112, { align: "center" });
  doc.text(url, pageWidth / 2, 118, { align: "center" });

  const fileSlug = qr.label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
  doc.save(`qr-${slug}-${fileSlug}.pdf`);
}
