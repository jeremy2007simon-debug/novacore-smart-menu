/**
 * Utilidades de color mínimas y sin dependencias externas. Solo lo
 * necesario para poder aceptar un color de marca de un restaurante y
 * derivar el resto (hover, texto encima) garantizando contraste — nunca al
 * revés (nunca se le pide al restaurante que rellene siete valores).
 */

type Rgb = { r: number; g: number; b: number };

export function isValidHex(value: string): boolean {
  return /^#([0-9a-f]{6})$/i.test(value.trim());
}

function hexToRgb(hex: string): Rgb {
  const clean = hex.replace("#", "");
  return {
    r: parseInt(clean.slice(0, 2), 16),
    g: parseInt(clean.slice(2, 4), 16),
    b: parseInt(clean.slice(4, 6), 16),
  };
}

function rgbToHex({ r, g, b }: Rgb): string {
  const toHex = (n: number) => Math.round(Math.min(255, Math.max(0, n))).toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

// Luminancia relativa (WCAG 2.x) para decidir si el texto encima debe ser
// blanco o casi negro.
function relativeLuminance({ r, g, b }: Rgb): number {
  const channel = (c: number) => {
    const s = c / 255;
    return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
  };
  return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
}

/** Blanco o tinta oscura del propio sistema, lo que de más contraste sobre `hex`. */
export function contrastForeground(hex: string, darkInk = "#181613"): string {
  const luminance = relativeLuminance(hexToRgb(hex));
  return luminance > 0.42 ? darkInk : "#ffffff";
}

function mix(hex: string, target: Rgb, amount: number): string {
  const c = hexToRgb(hex);
  return rgbToHex({
    r: c.r + (target.r - c.r) * amount,
    g: c.g + (target.g - c.g) * amount,
    b: c.b + (target.b - c.b) * amount,
  });
}

/** Variante para :hover — se oscurece sobre fondo claro, se aclara sobre fondo oscuro. */
export function hoverShade(hex: string, mode: "light" | "dark"): string {
  return mode === "light"
    ? mix(hex, { r: 0, g: 0, b: 0 }, 0.14)
    : mix(hex, { r: 255, g: 255, b: 255 }, 0.14);
}

/** "R, G, B" listo para interpolar dentro de un rgba(...) en CSS generado. */
export function hexToRgbString(hex: string): string {
  const { r, g, b } = hexToRgb(hex);
  return `${r}, ${g}, ${b}`;
}
