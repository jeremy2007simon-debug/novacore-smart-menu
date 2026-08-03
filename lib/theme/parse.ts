import { PRESETS } from "./presets";
import { DEFAULT_RESTAURANT_THEME, type PresetId, type RestaurantThemeConfig } from "./types";
import { isValidHex } from "./color";

const VALID_PRESET_IDS = new Set(Object.keys(PRESETS));

/**
 * `restaurants.theme` es un jsonb sin esquema forzado por Postgres — un
 * valor corrupto o de una versión futura del producto no debe tumbar la
 * página, solo hacer que se sirva con el preset por defecto.
 */
export function parseRestaurantTheme(raw: unknown): RestaurantThemeConfig {
  if (!raw || typeof raw !== "object") return DEFAULT_RESTAURANT_THEME;
  const value = raw as Record<string, unknown>;

  const preset: PresetId = VALID_PRESET_IDS.has(value.preset as string)
    ? (value.preset as PresetId)
    : DEFAULT_RESTAURANT_THEME.preset;

  const colorMode =
    value.colorMode === "light" || value.colorMode === "dark" || value.colorMode === "system"
      ? value.colorMode
      : "system";

  const overridesRaw = value.overrides as Record<string, unknown> | undefined;
  const primaryColor =
    overridesRaw && typeof overridesRaw.primaryColor === "string" && isValidHex(overridesRaw.primaryColor)
      ? overridesRaw.primaryColor
      : undefined;

  return {
    preset,
    colorMode,
    overrides: primaryColor ? { primaryColor } : undefined,
  };
}
