"use client";

import { useState } from "react";
import { AlertTriangle, Globe } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Rating } from "@/components/ui/rating";
import { ImageGalleryEditor } from "./image-gallery-editor";
import { DishLivePreview } from "./dish-live-preview";
import { IngredientsInput } from "./ingredients-input";
import { AllergenPicker } from "./allergen-picker";
import { DISH_STATUS_LABEL } from "./dish-status-badge";
import { showToast } from "@/components/ui/toast";
import { useDebouncedCommit } from "@/lib/utils/use-debounced-commit";
import { cn } from "@/lib/utils/cn";
import { uploadPublicImage } from "@/features/dashboard/upload-image";
import type { DemoCategory, DemoDish } from "@/lib/demo/types";
import type { Allergen, DishBadge, DishStatus, Restaurant } from "@/lib/types/database";

const BADGE_OPTIONS: { value: DishBadge; label: string }[] = [
  { value: "recommended", label: "Recomendado" },
  { value: "bestseller", label: "Más vendido" },
  { value: "new", label: "Nuevo" },
  { value: "on_offer", label: "Oferta" },
];

/**
 * Ficha de plato: cada campo autoguarda al cambiar (debounced en los de
 * texto continuo) llamando a `onFieldChange` — no hay botón "Guardar", el
 * cierre solo cierra el panel, los datos ya están aplicados.
 */
export function DishEditDrawer({
  open,
  onOpenChange,
  dish,
  categories,
  allergens,
  restaurant,
  onFieldChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: DemoDish;
  categories: DemoCategory[];
  allergens: Allergen[];
  restaurant: Pick<Restaurant, "id" | "theme" | "currency">;
  onFieldChange: (patch: Partial<DemoDish>) => void;
}) {
  const [name, setName] = useState(dish.name);
  const [price, setPrice] = useState((dish.price_cents / 100).toFixed(2));
  const [shortDescription, setShortDescription] = useState(dish.short_description ?? "");
  const [ingredients, setIngredients] = useState<string[]>(dish.ingredients);
  const [allergensValue, setAllergens] = useState<string[]>(dish.allergen_codes ?? []);
  const [badges, setBadges] = useState<DishBadge[]>(dish.badges);
  const [images, setImages] = useState<string[]>(dish.gallery_urls ?? (dish.image_url ? [dish.image_url] : []));

  useDebouncedCommit(name, (v) => {
    if (v.trim()) onFieldChange({ name: v.trim() });
  });
  useDebouncedCommit(price, (v) => {
    const cents = Math.round((parseFloat(v) || 0) * 100);
    if (cents > 0) onFieldChange({ price_cents: cents });
  });
  useDebouncedCommit(shortDescription, (v) => onFieldChange({ short_description: v.trim() || null }));

  function toggleBadge(badge: DishBadge) {
    const next = badges.includes(badge) ? badges.filter((b) => b !== badge) : [...badges, badge];
    setBadges(next);
    onFieldChange({ badges: next });
  }

  function changeCategory(categoryId: string) {
    const category = categories.find((c) => c.id === categoryId);
    onFieldChange({ category_id: categoryId, category_name: category?.name ?? "" });
  }

  function changeStatus(status: DishStatus) {
    onFieldChange({ status });
  }

  function changeIngredients(next: string[]) {
    setIngredients(next);
    onFieldChange({ ingredients: next });
  }

  function changeAllergens(next: string[]) {
    setAllergens(next);
    onFieldChange({ allergen_codes: next });
  }

  function changeImages(next: string[]) {
    setImages(next);
    onFieldChange({ image_url: next[0] ?? null, gallery_urls: next });
  }

  async function uploadImage(file: File): Promise<string | null> {
    const result = await uploadPublicImage({ folder: "dishes", restaurantId: restaurant.id, file });
    if (!result.ok) {
      showToast.error("No se pudo subir la imagen", result.message);
      return null;
    }
    return result.url;
  }

  const previewDish = {
    name,
    price_cents: Math.round((parseFloat(price || "0") || 0) * 100),
    short_description: shortDescription.trim() || null,
    status: dish.status,
    badges,
    images,
    avg_rating: dish.avg_rating,
    rating_count: dish.rating_count,
    ingredients,
    allergenCodes: allergensValue,
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="flex w-full max-w-5xl flex-col p-0">
        <DrawerHeader className="border-b border-border p-6 pr-14">
          <DrawerTitle>Editar «{dish.name}»</DrawerTitle>
          <DrawerDescription>Cada cambio se guarda solo — ve el resultado al momento en la vista previa.</DrawerDescription>
        </DrawerHeader>

        <div className="flex flex-1 overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6">
            {dish.status === "hidden" ? (
              <div className="mb-6 flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3">
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
                <div className="flex-1 text-sm text-foreground">
                  <p className="font-medium">Oculto para clientes</p>
                  <p className="mt-0.5 text-muted-foreground">
                    Revisa que el nombre y el precio son correctos y cambia la disponibilidad de aquí abajo a
                    «Disponible» cuando esté listo para publicarse.
                  </p>
                </div>
              </div>
            ) : null}

            <Tabs defaultValue="general">
              <TabsList className="flex-wrap">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="imagenes">Imágenes</TabsTrigger>
                <TabsTrigger value="ingredientes">Ingredientes</TabsTrigger>
                <TabsTrigger value="alergenos">Alérgenos</TabsTrigger>
                <TabsTrigger value="idiomas">Idiomas</TabsTrigger>
                <TabsTrigger value="seo">SEO</TabsTrigger>
                <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="flex flex-col gap-6">
                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dish-name">Nombre</Label>
                  <Input id="dish-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Margherita" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dish-category">Categoría</Label>
                    <Select value={dish.category_id ?? ""} onValueChange={changeCategory}>
                      <SelectTrigger id="dish-category">
                        <SelectValue placeholder="Elige una categoría" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id}>
                            {c.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="dish-price">Precio (€)</Label>
                    <Input
                      id="dish-price"
                      type="number"
                      inputMode="decimal"
                      step="0.10"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      placeholder="0.00"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dish-description">Descripción corta</Label>
                  <Textarea
                    id="dish-description"
                    value={shortDescription}
                    onChange={(e) => setShortDescription(e.target.value)}
                    placeholder="Deja vacío si no quieres añadir descripción todavía"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label htmlFor="dish-status">Disponibilidad</Label>
                  <Select value={dish.status} onValueChange={(v) => changeStatus(v as DishStatus)}>
                    <SelectTrigger id="dish-status" className="max-w-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {(Object.keys(DISH_STATUS_LABEL) as DishStatus[]).map((s) => (
                        <SelectItem key={s} value={s}>
                          {DISH_STATUS_LABEL[s]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex flex-col gap-1.5">
                  <Label>Etiquetas</Label>
                  <div className="flex flex-wrap gap-2">
                    {BADGE_OPTIONS.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        onClick={() => toggleBadge(option.value)}
                        aria-pressed={badges.includes(option.value)}
                      >
                        <Badge variant={badges.includes(option.value) ? "accent" : "outline"} className={cn("cursor-pointer")}>
                          {option.label}
                        </Badge>
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="imagenes">
                <ImageGalleryEditor value={images} onChange={changeImages} onUpload={uploadImage} />
              </TabsContent>

              <TabsContent value="ingredientes">
                <Label>Ingredientes</Label>
                <div className="mt-1.5">
                  <IngredientsInput value={ingredients} onChange={changeIngredients} />
                </div>
              </TabsContent>

              <TabsContent value="alergenos">
                <Label>Alérgenos</Label>
                <div className="mt-1.5">
                  <AllergenPicker value={allergensValue} onChange={changeAllergens} allergens={allergens} />
                </div>
              </TabsContent>

              <TabsContent value="idiomas" className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <Badge variant="primary">
                    <Globe className="h-3 w-3" aria-hidden="true" /> Español (principal)
                  </Badge>
                </div>
                <Card className="p-4 text-sm text-muted-foreground">
                  El nombre, la descripción y los ingredientes de este plato se editan en las pestañas General e
                  Ingredientes — ahí se traducirán automáticamente cuando añadas más idiomas.
                </Card>
                <Button
                  variant="outline"
                  size="sm"
                  className="self-start"
                  onClick={() => showToast.info("Próximamente", "Añade más idiomas desde Ajustes cuando esté disponible.")}
                >
                  <Globe className="h-4 w-4" /> Añadir idioma
                </Button>
              </TabsContent>

              <TabsContent value="seo" className="flex flex-col gap-3">
                <p className="text-sm text-muted-foreground">
                  Se genera automáticamente a partir del nombre y la descripción corta — cámbialos en General para
                  cambiar cómo aparece aquí.
                </p>
                <Card className="flex flex-col gap-1 p-4">
                  <p className="text-xs text-faint-foreground">
                    novacoremenu.app › r › note-di-caffe › platos › {dish.id}
                  </p>
                  <p className="text-base text-primary">{name || "Nombre del plato"} — Note di Caffé</p>
                  <p className="text-sm text-muted-foreground">
                    {shortDescription || `Descubre ${name || "este plato"} en la carta de Note di Caffé.`}
                  </p>
                </Card>
              </TabsContent>

              <TabsContent value="estadisticas" className="flex flex-col gap-4">
                {dish.rating_count > 0 ? (
                  <Card className="flex items-center justify-between p-4">
                    <div>
                      <p className="text-sm font-medium text-foreground">Valoración de clientes</p>
                      <p className="text-xs text-muted-foreground">{dish.rating_count} reseñas en total</p>
                    </div>
                    <Rating value={dish.avg_rating} count={dish.rating_count} />
                  </Card>
                ) : (
                  <Card className="p-4 text-sm text-muted-foreground">Este plato todavía no tiene reseñas.</Card>
                )}
                <Card className="p-4 text-sm text-muted-foreground">
                  Las visitas, pedidos y conversión estarán disponibles aquí cuando conectemos las analíticas.
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          <div className="hidden w-80 shrink-0 items-center justify-center border-l border-border bg-surface-raised p-6 lg:flex">
            <DishLivePreview dish={previewDish} restaurant={restaurant} allergens={allergens} />
          </div>
        </div>

        <div className="flex justify-end border-t border-border p-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cerrar
          </Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
