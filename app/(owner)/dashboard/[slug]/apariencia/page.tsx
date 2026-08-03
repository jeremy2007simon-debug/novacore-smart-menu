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
import { resolveThemeVars } from "@/lib/theme/resolve";
import { isValidHex } from "@/lib/theme/color";
import type { PresetId } from "@/lib/theme/types";
import { demoRestaurant } from "@/lib/demo/note-di-caffe-demo";

export default function AparienciaPage() {
  const initialTheme = demoRestaurant.theme as { preset?: PresetId; overrides?: { primaryColor?: string } };
  const [preset, setPreset] = useState<PresetId>(initialTheme.preset ?? "moderno");
  const [primaryOverride, setPrimaryOverride] = useState(initialTheme.overrides?.primaryColor ?? "");
  const [logo, setLogo] = useState<string | null>(demoRestaurant.logo_url);
  const [cover, setCover] = useState<string | null>(demoRestaurant.cover_url);

  const overrideIsValid = !primaryOverride || isValidHex(primaryOverride);
  const themeVars = resolveThemeVars(
    { preset, overrides: overrideIsValid && primaryOverride ? { primaryColor: primaryOverride } : undefined },
    "light",
  );

  return (
    <div>
      <PageHeader
        title="Apariencia"
        description="Elige un tema y, si quieres, tu color de marca exacto — el resto (radios, sombras, tipografía) lo decide el tema para que nunca se rompa el diseño."
        action={
          <Button onClick={() => showToast.success("Apariencia guardada (demo)")}>Guardar cambios</Button>
        }
      />

      <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
        <div className="flex flex-col gap-8">
          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">Logo y portada</h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <Label className="mb-1.5 block">Logo</Label>
                <ImageDropzone value={logo} onChange={setLogo} aspect="aspect-square" label="Logo cuadrado" />
              </div>
              <div>
                <Label className="mb-1.5 block">Portada</Label>
                <ImageDropzone value={cover} onChange={setCover} aspect="aspect-video" label="Foto de portada (16:9)" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="mb-3 font-display text-base font-semibold text-foreground">Tema visual</h2>
            <ThemePresetPicker value={preset} onChange={setPreset} />
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
              <p className="font-display text-lg font-semibold text-foreground">{demoRestaurant.name}</p>
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
