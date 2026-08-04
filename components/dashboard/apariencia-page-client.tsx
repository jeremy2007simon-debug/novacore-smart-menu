"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { ThemePresetPicker } from "@/components/dashboard/theme-preset-picker";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Rating } from "@/components/ui/rating";
import { showToast } from "@/components/ui/toast";
import { useSaveStatus } from "@/lib/autosave/save-status-context";
import { useActivity } from "@/lib/activity/activity-context";
import { useDebouncedCommit } from "@/lib/utils/use-debounced-commit";
import { resolveThemeVars } from "@/lib/theme/resolve";
import { isValidHex } from "@/lib/theme/color";
import { PRESETS } from "@/lib/theme/presets";
import type { PresetId } from "@/lib/theme/types";
import { uploadPublicImage } from "@/features/dashboard/upload-image";
import { updateRestaurant } from "@/features/dashboard/restaurant-actions";
import type { Restaurant } from "@/lib/types/database";

export function AparienciaPageClient({ restaurant }: { restaurant: Restaurant }) {
  const { runAutosave } = useSaveStatus();
  const { logActivity } = useActivity();

  const initialTheme = restaurant.theme as { preset?: PresetId; overrides?: { primaryColor?: string } };
  const [preset, setPreset] = useState<PresetId>(initialTheme.preset ?? "moderno");
  const [primaryOverride, setPrimaryOverride] = useState(initialTheme.overrides?.primaryColor ?? "");
  const [logo, setLogo] = useState<string | null>(restaurant.logo_url);
  const [cover, setCover] = useState<string | null>(restaurant.cover_url);

  function persistTheme(nextPreset: PresetId, nextOverride: string) {
    return updateRestaurant(restaurant.id, {
      theme: { preset: nextPreset, overrides: nextOverride ? { primaryColor: nextOverride } : undefined },
    });
  }

  function changePreset(next: PresetId) {
    setPreset(next);
    logActivity("theme", `cambió el tema visual a ${PRESETS[next].label}`);
    runAutosave(async () => {
      await persistTheme(next, primaryOverride);
    });
  }

  async function changeLogo(file: File) {
    const result = await uploadPublicImage({ folder: "restaurants", restaurantId: restaurant.id, file });
    if (!result.ok) {
      showToast.error("No se pudo subir el logo", result.message);
      return;
    }
    setLogo(result.url);
    logActivity("image", "actualizó el logo");
    runAutosave(async () => {
      await updateRestaurant(restaurant.id, { logo_url: result.url });
    });
  }

  function removeLogo() {
    setLogo(null);
    logActivity("image", "quitó el logo");
    runAutosave(async () => {
      await updateRestaurant(restaurant.id, { logo_url: null });
    });
  }

  async function changeCover(file: File) {
    const result = await uploadPublicImage({ folder: "restaurants", restaurantId: restaurant.id, file });
    if (!result.ok) {
      showToast.error("No se pudo subir la portada", result.message);
      return;
    }
    setCover(result.url);
    logActivity("image", "actualizó la foto de portada");
    runAutosave(async () => {
      await updateRestaurant(restaurant.id, { cover_url: result.url });
    });
  }

  function removeCover() {
    setCover(null);
    logActivity("image", "quitó la foto de portada");
    runAutosave(async () => {
      await updateRestaurant(restaurant.id, { cover_url: null });
    });
  }

  const overrideIsValid = !primaryOverride || isValidHex(primaryOverride);
  useDebouncedCommit(primaryOverride, (value) => {
    if (!value || isValidHex(value)) {
      logActivity("theme", value ? `cambió el color de marca a ${value}` : "quitó el color de marca personalizado");
      runAutosave(async () => {
        await persistTheme(preset, value);
      });
    }
  });

  const themeVars = resolveThemeVars(
    { preset, overrides: overrideIsValid && primaryOverride ? { primaryColor: primaryOverride } : undefined },
    "light",
  );

  return (
    <div>
      <PageHeader
        title="Apariencia"
        description="Elige un tema y, si quieres, tu color de marca exacto — el resto (radios, sombras, tipografía) lo decide el tema para que nunca se rompa el diseño."
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">Logo y portada</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Logo</Label>
                <ImageDropzone
                  value={logo}
                  onFileSelect={changeLogo}
                  onRemove={removeLogo}
                  aspect="aspect-square"
                  label="Logo cuadrado"
                />
              </div>
              <div>
                <Label className="mb-1.5 block">Portada</Label>
                <ImageDropzone
                  value={cover}
                  onFileSelect={changeCover}
                  onRemove={removeCover}
                  aspect="aspect-video"
                  label="Foto de portada (16:9)"
                />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">Tema visual</h2>
            <ThemePresetPicker value={preset} onChange={changePreset} />
          </section>

          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">Color de marca (opcional)</h2>
            <div className="flex max-w-xs items-center gap-3">
              <Input
                value={primaryOverride}
                onChange={(e) => setPrimaryOverride(e.target.value)}
                placeholder="#c1633d"
                className={!overrideIsValid ? "border-danger" : undefined}
              />
              <span
                className="h-9 w-9 shrink-0 rounded-md border border-border"
                style={{ background: overrideIsValid && primaryOverride ? primaryOverride : "transparent" }}
              />
            </div>
            {!overrideIsValid ? (
              <p className="mt-1.5 text-xs text-danger">Usa un hex válido, ej. #C1633D.</p>
            ) : (
              <p className="mt-1.5 text-xs text-muted-foreground">
                Deja vacío para usar el color por defecto del tema elegido.
              </p>
            )}
          </section>
        </div>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <p className="mb-2 text-xs font-medium uppercase tracking-wide text-faint-foreground">Vista previa</p>
          <div style={themeVars} className="overflow-hidden rounded-lg border border-border">
            <div className="bg-background p-5">
              <p className="font-display text-lg font-semibold text-foreground">{restaurant.name}</p>
              <p className="mt-1 text-sm text-muted-foreground">Así se ve tu tema en la carta pública.</p>
              <div className="mt-3 flex items-center gap-2">
                <Rating value={4.6} count={128} />
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                <Badge variant="primary">Recomendado</Badge>
                <Badge variant="accent">Oferta</Badge>
              </div>
              <Card className="mt-4">
                <CardContent className="flex items-center justify-between p-4">
                  <div>
                    <p className="text-sm font-semibold text-foreground">Margherita</p>
                    <p className="text-xs text-muted-foreground">Tomate, mozzarella</p>
                  </div>
                  <p className="font-display text-sm font-semibold text-foreground">10,90 €</p>
                </CardContent>
              </Card>
              <Button className="mt-4 w-full">Ver más</Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
