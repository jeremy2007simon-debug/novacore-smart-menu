import { notFound } from "next/navigation";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { parseRestaurantTheme } from "@/lib/theme/parse";
import { PRESETS } from "@/lib/theme/presets";
import { getPublicMenu } from "@/features/menu/get-public-menu";

type PublicRestaurantLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

/**
 * Color de la barra del navegador (Android/iOS al añadir a pantalla de
 * inicio) igual al primary del tema del restaurante.
 */
export async function generateViewport({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const menu = await getPublicMenu(slug);
  if (!menu) return {};
  const theme = parseRestaurantTheme(menu.restaurant.theme);
  const preset = PRESETS[theme.preset];
  return { themeColor: theme.overrides?.primaryColor ?? preset.light.primary };
}

/**
 * Cada restaurante instala SU propia carta como app — nombre y color
 * propios, nunca "NovaCore" — apuntando al manifest dinámico de
 * manifest.webmanifest/route.ts en vez del manifest.ts especial de Next
 * (ese no puede leer el slug de la ruta).
 *
 * `robots: index/follow` anula aquí el `noindex` por defecto del layout
 * raíz (app/layout.tsx) — el resto de la app (login, panel del
 * propietario, panel NovaCore) es privada, pero la carta pública de un
 * restaurante SÍ debe indexarse.
 */
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const menu = await getPublicMenu(slug);
  if (!menu) return {};

  const description =
    menu.restaurant.description ?? `Carta digital de ${menu.restaurant.name}. Consulta platos, precios y alérgenos.`;

  return {
    title: { absolute: menu.restaurant.name },
    description,
    manifest: `/r/${slug}/manifest.webmanifest`,
    appleWebApp: { title: menu.restaurant.name, statusBarStyle: "default" as const },
    robots: { index: true, follow: true },
    alternates: { canonical: `/r/${slug}` },
    openGraph: {
      title: menu.restaurant.name,
      description,
      siteName: menu.restaurant.name,
      type: "website",
      url: `/r/${slug}`,
      images: menu.restaurant.logo_url ? [{ url: menu.restaurant.logo_url }] : undefined,
    },
  };
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
  const menu = await getPublicMenu(slug);

  if (!menu) notFound();

  const theme = parseRestaurantTheme(menu.restaurant.theme);

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}
