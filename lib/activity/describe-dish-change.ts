import { formatPrice } from "@/lib/utils/money";
import { DISH_STATUS_LABEL } from "@/components/dashboard/dish-status-badge";
import type { DemoActivityKind, DemoDish } from "@/lib/demo/note-di-caffe-demo";

/**
 * Traduce un `patch` sobre un plato al mensaje de actividad correspondiente
 * ("cambió el precio de «Cappuccino» a 1,90 €"), centralizado aquí para
 * que la tabla, las tarjetas y la ficha completa registren exactamente lo
 * mismo sin triplicar la lógica de formato.
 */
export function describeDishChange(
  dish: DemoDish,
  patch: Partial<DemoDish>,
  currency: string,
): { kind: DemoActivityKind; message: string } | null {
  if (patch.name !== undefined && patch.name !== dish.name) {
    return { kind: "name", message: `cambió el nombre de «${dish.name}» a «${patch.name}»` };
  }
  if (patch.price_cents !== undefined && patch.price_cents !== dish.price_cents) {
    return {
      kind: "price",
      message: `cambió el precio de «${dish.name}» a ${formatPrice(patch.price_cents, currency)}`,
    };
  }
  if (patch.status !== undefined && patch.status !== dish.status) {
    return { kind: "status", message: `cambió el estado de «${dish.name}» a ${DISH_STATUS_LABEL[patch.status]}` };
  }
  if (patch.category_name !== undefined && patch.category_name !== dish.category_name) {
    return { kind: "category", message: `movió «${dish.name}» a la categoría ${patch.category_name}` };
  }
  if (patch.badges !== undefined) {
    const wasRecommended = dish.badges.includes("recommended");
    const isRecommended = patch.badges.includes("recommended");
    if (wasRecommended !== isRecommended) {
      return {
        kind: "badge",
        message: isRecommended
          ? `marcó «${dish.name}» como recomendado`
          : `quitó «${dish.name}» de recomendados`,
      };
    }
    return { kind: "badge", message: `actualizó las etiquetas de «${dish.name}»` };
  }
  if (patch.short_description !== undefined && patch.short_description !== dish.short_description) {
    return { kind: "description", message: `actualizó la descripción de «${dish.name}»` };
  }
  if (patch.ingredients !== undefined) {
    return { kind: "settings", message: `actualizó los ingredientes de «${dish.name}»` };
  }
  if (patch.allergen_codes !== undefined) {
    return { kind: "settings", message: `actualizó los alérgenos de «${dish.name}»` };
  }
  if (patch.image_url !== undefined || patch.gallery_urls !== undefined) {
    return { kind: "image", message: `actualizó las fotos de «${dish.name}»` };
  }
  if (patch.needs_review !== undefined && patch.needs_review !== dish.needs_review) {
    return {
      kind: "status",
      message: patch.needs_review
        ? `marcó «${dish.name}» como pendiente de revisión`
        : `marcó «${dish.name}» como revisado`,
    };
  }
  return null;
}
