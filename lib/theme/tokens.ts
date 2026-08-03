import type { PresetId } from "./types";

/**
 * Tokens semánticos que un preset puede fijar para cada modo de color.
 * Un componente nunca usa un hex directamente — siempre una de estas
 * claves, expuestas como variable CSS `--nova-*` y, desde ahí, como
 * utilidad de Tailwind (ver app/globals.css). Cambiar un preset nunca
 * toca un componente: solo cambia lo que hay detrás de estas variables.
 */
export type ColorTokens = {
  bg: string;
  surface: string;
  surfaceRaised: string;
  border: string;
  borderStrong: string;
  text: string;
  textMuted: string;
  textFaint: string;
  primary: string;
  primaryHover: string;
  primaryForeground: string;
  accent: string;
  accentForeground: string;
  focusRing: string;
};

/** Escala de radios: nunca un píxel libre, solo una de estas tres formas. */
export type RadiusShape = "sharp" | "soft" | "relaxed";

export const RADIUS_SCALES: Record<RadiusShape, { sm: string; md: string; lg: string }> = {
  sharp: { sm: "2px", md: "4px", lg: "6px" },
  soft: { sm: "6px", md: "10px", lg: "16px" },
  relaxed: { sm: "8px", md: "14px", lg: "22px" },
};

/** Pareja de familias tipográficas — solo pilas de fuentes de sistema: cero
 * peticiones de red, cero impacto en Core Web Vitals por fuentes. */
export const FONT_STACKS = {
  serif: "'Iowan Old Style','Palatino Linotype',Georgia,'Times New Roman',serif",
  slabSerif: "Georgia,'Noto Serif','Times New Roman',serif",
  grotesk: "-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  neutralSans: "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif",
  mono: "ui-monospace,'SF Mono','Cascadia Code',Menlo,Consolas,monospace",
} as const;

/**
 * Colores de estado: iguales en TODOS los presets y en ambos modos de
 * color. Un "error" tiene que seguir leyéndose como error sin importar la
 * identidad visual del restaurante — no son parte de la marca.
 */
export const STATUS_COLORS = {
  light: {
    success: "#2F8F5B",
    successForeground: "#ffffff",
    warning: "#B8863A",
    warningForeground: "#ffffff",
    danger: "#B23B3B",
    dangerForeground: "#ffffff",
  },
  dark: {
    success: "#4CBE84",
    successForeground: "#0d1410",
    warning: "#DCAC6B",
    warningForeground: "#1a1206",
    danger: "#E07A7A",
    dangerForeground: "#1a0d0d",
  },
} as const;

/** Movimiento: consistente en toda la app, no es configurable por restaurante. */
export const MOTION = {
  durationFast: "120ms",
  durationBase: "200ms",
  durationSlow: "360ms",
  easeOut: "cubic-bezier(0.16, 1, 0.3, 1)",
  easeInOut: "cubic-bezier(0.65, 0, 0.35, 1)",
} as const;

export type PresetDefinition = {
  id: PresetId;
  label: string;
  description: string;
  radiusShape: RadiusShape;
  fontDisplay: string;
  fontBody: string;
  light: ColorTokens;
  dark: ColorTokens;
};
