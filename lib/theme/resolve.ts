import { contrastForeground, hexToRgbString, hoverShade, isValidHex } from "./color";
import { FONT_STACKS, MOTION, RADIUS_SCALES, STATUS_COLORS, type ColorTokens } from "./tokens";
import { PRESETS } from "./presets";
import type { RestaurantThemeConfig } from "./types";

function applyOverrides(tokens: ColorTokens, mode: "light" | "dark", primaryColor?: string): ColorTokens {
  if (!primaryColor || !isValidHex(primaryColor)) return tokens;
  return {
    ...tokens,
    primary: primaryColor,
    primaryHover: hoverShade(primaryColor, mode),
    primaryForeground: contrastForeground(primaryColor),
    focusRing: primaryColor,
  };
}

function colorTokensToCss(tokens: ColorTokens): string {
  return [
    `--nova-color-bg: ${tokens.bg};`,
    `--nova-color-surface: ${tokens.surface};`,
    `--nova-color-surface-raised: ${tokens.surfaceRaised};`,
    `--nova-color-border: ${tokens.border};`,
    `--nova-color-border-strong: ${tokens.borderStrong};`,
    `--nova-color-text: ${tokens.text};`,
    `--nova-color-text-muted: ${tokens.textMuted};`,
    `--nova-color-text-faint: ${tokens.textFaint};`,
    `--nova-color-primary: ${tokens.primary};`,
    `--nova-color-primary-hover: ${tokens.primaryHover};`,
    `--nova-color-primary-foreground: ${tokens.primaryForeground};`,
    `--nova-color-accent: ${tokens.accent};`,
    `--nova-color-accent-foreground: ${tokens.accentForeground};`,
    `--nova-color-focus-ring: ${tokens.focusRing};`,
  ].join(" ");
}

function statusTokensToCss(mode: "light" | "dark"): string {
  const s = STATUS_COLORS[mode];
  return [
    `--nova-color-success: ${s.success};`,
    `--nova-color-success-foreground: ${s.successForeground};`,
    `--nova-color-warning: ${s.warning};`,
    `--nova-color-warning-foreground: ${s.warningForeground};`,
    `--nova-color-danger: ${s.danger};`,
    `--nova-color-danger-foreground: ${s.dangerForeground};`,
  ].join(" ");
}

function structuralTokensToCss(preset: (typeof PRESETS)[keyof typeof PRESETS]): string {
  const radius = RADIUS_SCALES[preset.radiusShape];
  // El "tinte" de sombra sale del propio bg oscuro del preset: da una
  // sombra ligeramente calida en Elegante/Mediterraneo y fria en Moderno,
  // en vez del mismo negro generico en los seis temas.
  const tint = hexToRgbString(preset.dark.bg);
  return [
    `--nova-radius-sm: ${radius.sm};`,
    `--nova-radius-md: ${radius.md};`,
    `--nova-radius-lg: ${radius.lg};`,
    `--nova-shadow-sm: 0 1px 2px 0 rgba(${tint}, 0.06);`,
    `--nova-shadow-md: 0 4px 12px -2px rgba(${tint}, 0.10), 0 2px 4px -2px rgba(${tint}, 0.06);`,
    `--nova-shadow-lg: 0 12px 32px -8px rgba(${tint}, 0.18), 0 4px 8px -4px rgba(${tint}, 0.08);`,
    `--nova-font-display: ${preset.fontDisplay};`,
    `--nova-font-body: ${preset.fontBody};`,
    `--nova-font-mono: ${FONT_STACKS.mono};`,
    `--nova-duration-fast: ${MOTION.durationFast};`,
    `--nova-duration-base: ${MOTION.durationBase};`,
    `--nova-duration-slow: ${MOTION.durationSlow};`,
    `--nova-ease-out: ${MOTION.easeOut};`,
    `--nova-ease-in-out: ${MOTION.easeInOut};`,
  ].join(" ");
}

function block(selector: string, tokens: ColorTokens, mode: "light" | "dark"): string {
  return `${selector} { ${colorTokensToCss(tokens)} ${statusTokensToCss(mode)} color-scheme: ${mode}; }`;
}

/**
 * Genera el CSS de un tema resuelto. Dos casos:
 *
 * - `colorMode` es "system" (o no se especifica): el modo por defecto lo
 *   decide el sistema operativo del visitante (media query); el atributo
 *   `data-color-mode` del interruptor manual siempre puede anularlo.
 * - `colorMode` es "light"/"dark": el restaurante fuerza ese modo por
 *   defecto (p.ej. un preset "Oscuro" que nunca quiere abrir en claro),
 *   pero el interruptor del visitante sigue pudiendo anularlo — nunca le
 *   quitamos el control de accesibilidad a quien nos visita.
 */
export function resolveThemeCss(config: RestaurantThemeConfig): string {
  const preset = PRESETS[config.preset];
  const primaryOverride = config.overrides?.primaryColor;

  const light = applyOverrides(preset.light, "light", primaryOverride);
  const dark = applyOverrides(preset.dark, "dark", primaryOverride);
  const structural = structuralTokensToCss(preset);
  const forcedMode = config.colorMode === "light" || config.colorMode === "dark" ? config.colorMode : null;

  const defaultBlock = forcedMode
    ? block(":root", forcedMode === "dark" ? dark : light, forcedMode)
    : `${block(":root", light, "light")}
@media (prefers-color-scheme: dark) {
  ${block(':root:not([data-color-mode="light"])', dark, "dark")}
}`;

  return `
:root { ${structural} }
${defaultBlock}
${block(':root[data-color-mode="dark"]', dark, "dark")}
${block(':root[data-color-mode="light"]', light, "light")}
`.trim();
}

/**
 * Igual que resolveThemeCss, pero como objeto de variables CSS planas en
 * vez de texto — para aplicar un tema a un subárbol concreto vía `style`
 * inline (p.ej. la vista previa dentro del panel del propietario) sin
 * tocar `:root` y sin afectar al resto de la página. Solo un modo de
 * color (no genera el bloque de media query ni el override por atributo,
 * porque aquí no hay interruptor de claro/oscuro que anular).
 */
export function resolveThemeVars(
  config: RestaurantThemeConfig,
  mode: "light" | "dark" = "light",
): Record<string, string> {
  const preset = PRESETS[config.preset];
  const primaryOverride = config.overrides?.primaryColor;
  const tokens = applyOverrides(mode === "dark" ? preset.dark : preset.light, mode, primaryOverride);
  const radius = RADIUS_SCALES[preset.radiusShape];
  const status = STATUS_COLORS[mode];
  const tint = hexToRgbString(preset.dark.bg);

  return {
    "--nova-color-bg": tokens.bg,
    "--nova-color-surface": tokens.surface,
    "--nova-color-surface-raised": tokens.surfaceRaised,
    "--nova-color-border": tokens.border,
    "--nova-color-border-strong": tokens.borderStrong,
    "--nova-color-text": tokens.text,
    "--nova-color-text-muted": tokens.textMuted,
    "--nova-color-text-faint": tokens.textFaint,
    "--nova-color-primary": tokens.primary,
    "--nova-color-primary-hover": tokens.primaryHover,
    "--nova-color-primary-foreground": tokens.primaryForeground,
    "--nova-color-accent": tokens.accent,
    "--nova-color-accent-foreground": tokens.accentForeground,
    "--nova-color-focus-ring": tokens.focusRing,
    "--nova-color-success": status.success,
    "--nova-color-success-foreground": status.successForeground,
    "--nova-color-warning": status.warning,
    "--nova-color-warning-foreground": status.warningForeground,
    "--nova-color-danger": status.danger,
    "--nova-color-danger-foreground": status.dangerForeground,
    "--nova-radius-sm": radius.sm,
    "--nova-radius-md": radius.md,
    "--nova-radius-lg": radius.lg,
    "--nova-shadow-sm": `0 1px 2px 0 rgba(${tint}, 0.06)`,
    "--nova-shadow-md": `0 4px 12px -2px rgba(${tint}, 0.10), 0 2px 4px -2px rgba(${tint}, 0.06)`,
    "--nova-shadow-lg": `0 12px 32px -8px rgba(${tint}, 0.18), 0 4px 8px -4px rgba(${tint}, 0.08)`,
    "--nova-font-display": preset.fontDisplay,
    "--nova-font-body": preset.fontBody,
    "--nova-font-mono": FONT_STACKS.mono,
    "--nova-duration-fast": MOTION.durationFast,
    "--nova-duration-base": MOTION.durationBase,
    "--nova-duration-slow": MOTION.durationSlow,
    "--nova-ease-out": MOTION.easeOut,
    "--nova-ease-in-out": MOTION.easeInOut,
    "color-scheme": mode,
  };
}
