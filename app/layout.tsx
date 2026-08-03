import type { Metadata } from "next";
import Script from "next/script";
import { Toaster } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { COLOR_MODE_INIT_SCRIPT, ThemeProvider } from "@/lib/theme/theme-provider";
import { DEFAULT_RESTAURANT_THEME } from "@/lib/theme/types";
import { publicEnv } from "@/lib/env";
import "./globals.css";

/**
 * `robots: noindex` por defecto: es lo correcto para /login, /dashboard y
 * /novacore (paneles privados, no contenido para buscadores). La carta
 * pública de cada restaurante lo anula explícitamente en su propio
 * layout (app/(public)/r/[slug]/layout.tsx) — ahí sí queremos indexar.
 */
export const metadata: Metadata = {
  metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
  title: {
    default: "NovaCore Smart Menu",
    template: "%s · NovaCore Smart Menu",
  },
  description: "Cartas digitales para restaurantes.",
  robots: { index: false, follow: false },
};

/**
 * Tema por defecto para todo lo que no es la carta pública de un
 * restaurante concreto: la propia identidad de NovaCore (login, panel de
 * propietario, panel NovaCore). La carta pública de cada restaurante
 * sustituye este ThemeProvider por el suyo en
 * app/(public)/r/[slug]/layout.tsx — el de aquí simplemente deja de
 * aplicarse en cuanto el anidado pinta encima.
 */
const NOVACORE_CHROME_THEME = DEFAULT_RESTAURANT_THEME;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Script id="nova-color-mode-init" strategy="beforeInteractive">
          {COLOR_MODE_INIT_SCRIPT}
        </Script>
        <ThemeProvider theme={NOVACORE_CHROME_THEME}>
          <TooltipProvider delayDuration={200}>{children}</TooltipProvider>
          <Toaster
            position="bottom-right"
            closeButton
            toastOptions={{
              classNames: {
                toast: "bg-surface-raised! border-border! text-foreground! shadow-lg!",
                title: "text-foreground!",
                description: "text-muted-foreground!",
                actionButton: "bg-primary! text-primary-foreground!",
                cancelButton: "bg-surface! text-muted-foreground!",
                success: "border-success!",
                error: "border-danger!",
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
