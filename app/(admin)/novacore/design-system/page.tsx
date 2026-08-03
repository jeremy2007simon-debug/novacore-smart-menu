import Link from "next/link";
import { ThemeProvider } from "@/lib/theme/theme-provider";
import { PRESET_LIST } from "@/lib/theme/presets";
import type { ColorModePreference, PresetId, RestaurantThemeConfig } from "@/lib/theme/types";
import { DesignSystemShowcase } from "@/components/showcase/design-system-showcase";
import { cn } from "@/lib/utils/cn";

export const metadata = {
  title: "Design System",
};

const PRESET_IDS = new Set(PRESET_LIST.map((p) => p.id));
const MODES: ColorModePreference[] = ["system", "light", "dark"];

type DesignSystemPageProps = {
  searchParams: Promise<{ preset?: string; mode?: string }>;
};

/**
 * Catálogo interno del sistema de diseño: cambia el preset o el modo de
 * color por la URL (?preset=oscuro&mode=dark), sin JavaScript, para
 * demostrar el mecanismo real de theming — no una simulación aparte.
 */
export default async function DesignSystemPage({ searchParams }: DesignSystemPageProps) {
  const params = await searchParams;
  const preset: PresetId = PRESET_IDS.has(params.preset as PresetId)
    ? (params.preset as PresetId)
    : "moderno";
  const colorMode: ColorModePreference = MODES.includes(params.mode as ColorModePreference)
    ? (params.mode as ColorModePreference)
    : "system";

  const theme: RestaurantThemeConfig = { preset, colorMode };

  return (
    <ThemeProvider theme={theme}>
      <div className="min-h-screen bg-background text-foreground">
        <header className="sticky top-0 z-40 border-b border-border bg-surface/90 backdrop-blur">
          <div className="mx-auto flex max-w-5xl flex-col gap-4 px-6 py-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-faint-foreground">
                NovaCore Smart Menu
              </p>
              <h1 className="font-display text-xl font-semibold">Design System</h1>
            </div>

            <div className="flex flex-wrap items-center gap-4">
              <nav aria-label="Elegir preset" className="flex flex-wrap gap-2">
                {PRESET_LIST.map((p) => (
                  <Link
                    key={p.id}
                    href={`/novacore/design-system?preset=${p.id}&mode=${colorMode}`}
                    className={cn(
                      "nova-transition rounded-full border px-3 py-1 text-xs font-medium",
                      p.id === preset
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface-raised text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {p.label}
                  </Link>
                ))}
              </nav>

              <nav aria-label="Elegir modo de color" className="flex gap-2 border-l border-border pl-4">
                {MODES.map((m) => (
                  <Link
                    key={m}
                    href={`/novacore/design-system?preset=${preset}&mode=${m}`}
                    className={cn(
                      "nova-transition rounded-full border px-3 py-1 text-xs font-medium capitalize",
                      m === colorMode
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-surface-raised text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {m === "system" ? "Sistema" : m === "light" ? "Claro" : "Oscuro"}
                  </Link>
                ))}
              </nav>
            </div>

            <p className="max-w-2xl text-sm text-muted-foreground">
              {PRESET_LIST.find((p) => p.id === preset)?.description}
            </p>
          </div>
        </header>

        <DesignSystemShowcase preset={preset} />
      </div>
    </ThemeProvider>
  );
}
