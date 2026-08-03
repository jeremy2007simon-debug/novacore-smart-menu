import { resolveThemeCss } from "./resolve";
import type { RestaurantThemeConfig } from "./types";

/**
 * Vuelca el tema resuelto (preset + override de color, si lo hay) como
 * variables CSS en un <style> renderizado en servidor — cero JS, cero
 * parpadeo, funciona igual con JavaScript desactivado. El modo claro/oscuro
 * ya viene resuelto dentro de ese mismo bloque (ver resolveThemeCss).
 *
 * El único JS estrictamente necesario es ColorModeScript: sin él, un
 * visitante que ya eligió "oscuro" en una visita anterior vería un parpadeo
 * de claro→oscuro en la primera pintura de la página.
 */
export function ThemeProvider({
  theme,
  children,
}: {
  theme: RestaurantThemeConfig;
  children: React.ReactNode;
}) {
  const css = resolveThemeCss(theme);

  return (
    <>
      {/* CSS generado a partir de datos propios (presets.ts) más, como
          mucho, un hex validado con isValidHex; nunca texto libre de usuario. */}
      <style id="nova-theme-tokens" dangerouslySetInnerHTML={{ __html: css }} />
      {children}
    </>
  );
}

/**
 * Script de arranque para evitar el parpadeo claro→oscuro. Se exporta como
 * texto (no como componente `<Script>`) porque `beforeInteractive` solo
 * puede usarse escrito directamente en app/layout.tsx — ver ese archivo.
 */
export const COLOR_MODE_INIT_SCRIPT = `(function(){try{var m=localStorage.getItem('nova-color-mode');if(m==='light'||m==='dark'){document.documentElement.setAttribute('data-color-mode',m);}}catch(e){}})();`;
