/**
 * Un tema es SIEMPRE: un preset (identidad visual) + como mucho un color de
 * marca de override. Todo lo demas (radios, sombras, tipografia, espaciado,
 * movimiento) lo decide el preset — nunca un valor libre — para que ningun
 * restaurante pueda romper el layout eligiendo un numero cualquiera.
 */
export type PresetId =
  | "elegante"
  | "moderno"
  | "minimalista"
  | "oscuro"
  | "mediterraneo"
  | "premium";

export type ColorModePreference = "system" | "light" | "dark";

export type RestaurantThemeConfig = {
  preset: PresetId;
  colorMode?: ColorModePreference;
  overrides?: {
    /** Hex de marca del restaurante. El resto de tokens de color (hover,
     * texto sobre el color, etc.) se derivan automaticamente para
     * garantizar contraste, nunca se piden por separado. */
    primaryColor?: string;
  };
};

export const DEFAULT_RESTAURANT_THEME: RestaurantThemeConfig = {
  preset: "moderno",
  colorMode: "system",
};
