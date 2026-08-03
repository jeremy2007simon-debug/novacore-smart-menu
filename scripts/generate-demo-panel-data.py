#!/usr/bin/env python3
"""
Convierte supabase/demo-data/note-di-caffe-menu.json en
lib/demo/note-di-caffe-menu-data.ts: las 25 categorías y los platos con
precio legible (157) de la carta real de Note di Caffé, listos para el
panel del propietario y la carta pública.

Es el equivalente en TypeScript de scripts/generate-demo-menu-seed.py
(que genera el seed SQL) — ambos leen el mismo JSON y aplican las mismas
reglas, para que exista una única fuente de verdad para la carta real:

- Precio base: el explícito, o si no hay, el de la primera variante.
  Las variantes adicionales no se modelan todavía en el panel (no hay UI
  de precios por tamaño), igual que en el seed SQL solo llegan a
  dish_variants, no a filas de plato adicionales.
- Ingredientes: description partido por comas, si hay descripción.
- Estado: "hidden" si el item está marcado "review" (precio pendiente de
  confirmar contra la carta física), si no "available".
- Items sin precio en ningún sitio (ni price ni variants): NO se generan.
- No se inventan avg_rating, rating_count, badges, allergen_codes,
  image_url ni horarios de categoría — todo eso se deja vacío/neutro
  hasta que el propietario lo rellene de verdad.

Uso: python3 scripts/generate-demo-panel-data.py

Vuelve a ejecutarlo cada vez que se corrija el JSON — no edites el .ts
generado a mano, se sobrescribe.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "supabase" / "demo-data" / "note-di-caffe-menu.json"
OUT = ROOT / "lib" / "demo" / "note-di-caffe-menu-data.ts"

CREATED_AT = "2026-08-03T00:00:00Z"


def ts_str(s):
    return json.dumps(s, ensure_ascii=False)


def ts_str_array(items):
    return "[" + ", ".join(ts_str(i) for i in items) + "]"


def ingredients_from_description(description):
    if not description:
        return []
    return [p.strip() for p in description.split(",") if p.strip()]


def main():
    data = json.loads(SRC.read_text())
    categories = sorted(data["categories"], key=lambda c: c["sort_order"])

    category_lines = []
    dish_lines = []
    skipped_no_price = []

    cat_index = 0
    dish_index = 0

    for cat in categories:
        cat_index += 1
        cat_id = f"c{cat_index}"
        cat_name = cat["name"]

        cat_dishes = []

        for item in cat["items"]:
            name = item.get("name")
            price = item.get("price")
            variants = item.get("variants", [])
            review = bool(item.get("review"))

            # Precio base: el explicito, o si no hay, el de la primera variante.
            base_price = price
            if base_price is None and variants:
                base_price = variants[0]["price"]

            if base_price is None:
                code = f" (código {item['code']})" if item.get("code") else ""
                skipped_no_price.append(f"{cat_name} > {name}{code}")
                continue

            dish_index += 1
            dish_id = f"d{dish_index}"

            description = item.get("description")
            ingredients = ingredients_from_description(description)
            status = "hidden" if review else "available"
            price_cents = int(round(base_price * 100))

            fields = [
                f'id: "{dish_id}"',
                "restaurant_id: DEMO_RESTAURANT_ID",
                f'category_id: "{cat_id}"',
                f"category_name: {ts_str(cat_name)}",
                f"name: {ts_str(name)}",
                f"short_description: {ts_str(description) if description else 'null'}",
                "description: null",
                f"ingredients: {ts_str_array(ingredients)}",
                "spice_level: null",
                "nutritional_info: null",
                f"price_cents: {price_cents}",
                f'status: "{status}"',
                "badges: []",
                "avg_rating: 0",
                "rating_count: 0",
                f"sort_order: {len(cat_dishes)}",
                f'created_at: "{CREATED_AT}"',
                "image_url: null",
            ]
            if review:
                fields.append("needs_review: true")

            dish_lines.append("  { " + ", ".join(fields) + " },")
            cat_dishes.append(dish_id)

        fields = [
            f'id: "{cat_id}"',
            "restaurant_id: DEMO_RESTAURANT_ID",
            f"name: {ts_str(cat_name)}",
            "icon: null",
            f"sort_order: {cat_index - 1}",
            "available_from: null",
            "available_to: null",
            "available_days: null",
            f'created_at: "{CREATED_AT}"',
            f"dish_count: {len(cat_dishes)}",
        ]
        category_lines.append("  { " + ", ".join(fields) + " },")

    lines = []
    lines.append("// GENERADO AUTOMATICAMENTE por scripts/generate-demo-panel-data.py")
    lines.append("// a partir de supabase/demo-data/note-di-caffe-menu.json — no editar a mano.")
    lines.append("//")
    lines.append("// La carta real completa de Note di Caffe (25 categorias, "
                  f"{dish_index} platos con precio")
    lines.append("// legible) para el panel del propietario y la carta publica. Los items")
    lines.append("// marcados 'review' en el JSON llegan con status \"hidden\" y needs_review: true")
    lines.append("// (precio pendiente de confirmar contra la carta fisica). Items sin precio en")
    lines.append("// ningun sitio no se generan -- ver el comentario al final de este archivo.")
    lines.append('import type { DemoCategory, DemoDish } from "./types";')
    lines.append('import { DEMO_RESTAURANT_ID } from "./types";')
    lines.append("")
    lines.append("export const demoCategories: DemoCategory[] = [")
    lines.extend(category_lines)
    lines.append("];")
    lines.append("")
    lines.append("export const demoDishes: DemoDish[] = [")
    lines.extend(dish_lines)
    lines.append("];")
    lines.append("")
    lines.append("// === Artículos SIN precio legible: NO generados, dar de alta a mano cuando se confirme ===")
    for s in skipped_no_price:
        lines.append(f"// {s}")
    lines.append("")

    OUT.write_text("\n".join(lines))

    print(f"Escrito {OUT}")
    print(f"Categorías: {cat_index}")
    review_count = sum(1 for line in dish_lines if "needs_review: true" in line)
    print(f"Platos generados: {dish_index} (de los cuales {review_count} en status=hidden por revisión)")
    print(f"Platos SIN generar por falta de precio: {len(skipped_no_price)}")


if __name__ == "__main__":
    main()
