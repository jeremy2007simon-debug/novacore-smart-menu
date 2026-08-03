import { notFound } from "next/navigation";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { parseRestaurantTheme } from "@/lib/theme/parse";
import { PRESETS } from "@/lib/theme/presets";
import { getPublicRestaurant } from "@/features/menu/get-public-restaurant";

type PublicRestaurantLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

async function resolveTheme(slug: string) {
  const restaurant = await getPublicRestaurant(slug);
  if (!restaurant) return null;
  return parseRestaurantTheme(restaurant.theme);
}

/**
 * Color de la barra del navegador (Android/iOS al añadir a pantalla de
 * inicio) igual al primary del tema del restaurante — pequeño paso real de
 * cara a PWA, sin necesitar todavía manifest.json ni iconos propios (esos
 * llegan con "cambiar el logo" del panel del propietario).
 */
export async function generateViewport({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const theme = await resolveTheme(slug);
  if (!theme) return {};
  const preset = PRESETS[theme.preset];
  return { themeColor: theme.overrides?.primaryColor ?? preset.light.primary };
}

/**
 * Sustituye el tema de NovaCore por el del restaurante para toda la carta
 * pública. `parseRestaurantTheme` nunca deja pasar un valor corrupto de
 * theme jsonb: como mucho, cae al preset por defecto.
 */
export default async function PublicRestaurantLayout({
  children,
  params,
}: PublicRestaurantLayoutProps) {
  const { slug } = await params;
  const theme = await resolveTheme(slug);

  if (!theme) notFound();

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
