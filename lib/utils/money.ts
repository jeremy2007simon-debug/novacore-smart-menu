/** `price_cents` vive en la base de datos como entero para no arrastrar
 * errores de redondeo de coma flotante; esto es lo único que lo convierte
 * a texto, y solo aquí. */
export function formatPrice(priceCents: number, currency: string, locale = "es-ES"): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: priceCents % 100 === 0 ? 0 : 2,
  }).format(priceCents / 100);
}
