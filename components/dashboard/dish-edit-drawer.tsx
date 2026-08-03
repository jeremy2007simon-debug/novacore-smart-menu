"use client";

import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ImageDropzone } from "@/components/shared/image-dropzone";
import { IngredientsInput } from "./ingredients-input";
import { AllergenPicker } from "./allergen-picker";
import { DISH_STATUS_LABEL } from "./dish-status-badge";
import { cn } from "@/lib/utils/cn";
import type { DemoCategory, DemoDish } from "@/lib/demo/note-di-caffe-demo";
import type { DishBadge, DishStatus } from "@/lib/types/database";

const BADGE_OPTIONS: { value: DishBadge; label: string }[] = [
  { value: "recommended", label: "Recomendado" },
  { value: "bestseller", label: "Más vendido" },
  { value: "new", label: "Nuevo" },
  { value: "on_offer", label: "Oferta" },
];

export function DishEditDrawer({
  open,
  onOpenChange,
  dish,
  categories,
  onSave,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dish: DemoDish | null;
  categories: DemoCategory[];
  onSave: (dish: DemoDish) => void;
}) {
  const isNew = dish === null;
  const [name, setName] = useState(dish?.name ?? "");
  const [categoryId, setCategoryId] = useState(dish?.category_id ?? categories[0]?.id ?? "");
  const [price, setPrice] = useState(dish ? (dish.price_cents / 100).toFixed(2) : "");
  const [shortDescription, setShortDescription] = useState(dish?.short_description ?? "");
  const [ingredients, setIngredients] = useState<string[]>(dish?.ingredients ?? []);
  const [allergens, setAllergens] = useState<string[]>([]);
  const [status, setStatus] = useState<DishStatus>(dish?.status ?? "available");
  const [badges, setBadges] = useState<DishBadge[]>(dish?.badges ?? []);
  const [imageUrl, setImageUrl] = useState<string | null>(dish?.image_url ?? null);
  const [needsReview, setNeedsReview] = useState(dish?.needs_review ?? false);

  function toggleBadge(badge: DishBadge) {
    setBadges((prev) => (prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge]));
  }

  function handleSave() {
    const category = categories.find((c) => c.id === categoryId);
    onSave({
      id: dish?.id ?? `new-${Date.now()}`,
      restaurant_id: dish?.restaurant_id ?? categories[0]?.restaurant_id ?? "",
      category_id: categoryId || null,
      category_name: category?.name ?? "",
      name: name.trim() || "Nuevo plato",
      short_description: shortDescription.trim() || null,
      description: dish?.description ?? null,
      ingredients,
      spice_level: dish?.spice_level ?? null,
      nutritional_info: dish?.nutritional_info ?? null,
      price_cents: Math.round((parseFloat(price || "0") || 0) * 100),
      status,
      badges,
      avg_rating: dish?.avg_rating ?? 0,
      rating_count: dish?.rating_count ?? 0,
      sort_order: dish?.sort_order ?? 0,
      created_at: dish?.created_at ?? new Date().toISOString(),
      image_url: imageUrl,
      needs_review: needsReview,
    });
    onOpenChange(false);
  }

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-w-lg overflow-y-auto">
        <DrawerHeader>
          <DrawerTitle>{isNew ? "Nuevo plato" : `Editar «${dish.name}»`}</DrawerTitle>
          <DrawerDescription>
            {isNew ? "Rellena los datos y guarda para añadirlo a la carta." : "Los cambios se ven al momento en la vista previa."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="mt-6 flex flex-col gap-6">
          {needsReview ? (
            <div className="flex items-start gap-3 rounded-lg border border-danger/30 bg-danger/10 p-3">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-danger" aria-hidden="true" />
              <div className="flex-1 text-sm text-foreground">
                <p className="font-medium">Pendiente de revisión</p>
                <p className="mt-0.5 text-muted-foreground">
                  Este plato viene de la carta fotografiada y algún dato no se pudo leer con confianza. Revisa y
                  corrige lo que haga falta.
                </p>
                <label className="mt-2 flex items-center gap-2 text-sm">
                  <Checkbox checked={needsReview} onCheckedChange={(v) => setNeedsReview(v === true)} />
                  Ya lo he revisado y corregido
                </label>
              </div>
            </div>
          ) : null}

          <ImageDropzone value={imageUrl} onChange={setImageUrl} label="Foto del plato" />

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dish-name">Nombre</Label>
            <Input id="dish-name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Ej. Margherita" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="dish-category">Categoría</Label>
              <Select value={categoryId} onValueChange={setCategoryId}>
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
            <Label>Ingredientes</Label>
            <IngredientsInput value={ingredients} onChange={setIngredients} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label>Alérgenos</Label>
            <AllergenPicker value={allergens} onChange={setAllergens} />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="dish-status">Disponibilidad</Label>
            <Select value={status} onValueChange={(v) => setStatus(v as DishStatus)}>
              <SelectTrigger id="dish-status">
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
        </div>

        <div className="mt-8 flex justify-end gap-2 border-t border-border pt-4">
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSave}>Guardar</Button>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
