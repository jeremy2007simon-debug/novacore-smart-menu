import QRCode from "qrcode";
import type { QrCode } from "@/lib/types/database";

/**
 * URL pública que apunta el código QR. `novacoremenu.app` es el dominio
 * provisional ya usado en el resto del panel (Topbar, SEO) mientras no
 * conectemos un dominio real por restaurante.
 */
export function qrTargetUrl(slug: string, qr: Pick<QrCode, "type" | "table_number" | "label">): string {
  const base = `https://novacoremenu.app/r/${slug}`;
  if (qr.type !== "table") return base;
  if (qr.table_number !== null) return `${base}?mesa=${qr.table_number}`;
  return `${base}?zona=${encodeURIComponent(qr.label.toLowerCase())}`;
}

export function generateQrDataUrl(url: string): Promise<string> {
  return QRCode.toDataURL(url, { margin: 1, width: 320 });
}
