import { NextResponse } from "next/server";
import { getPublicMenu } from "@/features/menu/get-public-menu";
import { parseRestaurantTheme } from "@/lib/theme/parse";
import { PRESETS } from "@/lib/theme/presets";

/**
 * Manifest PROPIO de cada restaurante (nombre, colores) para que un
 * cliente pueda instalar solo SU carta en la pantalla de inicio, sin ver
 * "NovaCore" por ningún lado — no puede ser el manifest.ts especial de
 * Next (app/manifest.ts) porque ese no recibe los params de la ruta; aquí
 * es un route handler normal, así que sí puede leer el slug.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const menu = await getPublicMenu(slug);

  if (!menu) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const theme = parseRestaurantTheme(menu.restaurant.theme);
  const preset = PRESETS[theme.preset];
  const themeColor = theme.overrides?.primaryColor ?? preset.light.primary;

  return NextResponse.json(
    {
      name: menu.restaurant.name,
      short_name: menu.restaurant.name,
      description: menu.restaurant.description ?? `Carta digital de ${menu.restaurant.name}.`,
      start_url: `/r/${slug}`,
      scope: `/r/${slug}`,
      display: "standalone",
      background_color: preset.light.bg,
      theme_color: themeColor,
      icons: [
        { src: "/icon-192", sizes: "192x192", type: "image/png", purpose: "any" },
        { src: "/icon-512", sizes: "512x512", type: "image/png", purpose: "any" },
        { src: "/icon-512-maskable", sizes: "512x512", type: "image/png", purpose: "maskable" },
      ],
    },
    { headers: { "Content-Type": "application/manifest+json" } },
  );
}
