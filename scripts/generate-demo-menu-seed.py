#!/usr/bin/env python3
"""
Convierte supabase/demo-data/note-di-caffe-menu.json en un seed SQL
idempotente (supabase/seed-demo-note-di-caffe-menu.sql).

Uso: python3 scripts/generate-demo-menu-seed.py

Vuelve a ejecutarlo cada vez que se corrija un "pendiente de revisión" en
el JSON (por ejemplo, tras confirmar un precio contra la carta física) —
no edites el .sql generado a mano, se sobrescribe.
"""

import json
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "supabase" / "demo-data" / "note-di-caffe-menu.json"
OUT = ROOT / "supabase" / "seed-demo-note-di-caffe-menu.sql"


def esc(s):
    if s is None:
        return "null"
    return "'" + str(s).replace("'", "''") + "'"


def cents(price):
    return int(round(price * 100))


def pg_text_array(items):
    if not items:
        return "'{}'"
    escaped = [str(i).replace("'", "''").replace('"', '\\"') for i in items]
    inner = ",".join(f'"{e}"' for e in escaped)
    return f"'{{{inner}}}'"


def item_en_name(item):
    if item.get("name_en"):
        return item["name_en"]
    return item.get("translations", {}).get("en", {}).get("name")


def item_en_description(item):
    return item.get("translations", {}).get("en", {}).get("description")


def ingredients_from_description(description):
    if not description:
        return []
    return [p.strip() for p in description.split(",") if p.strip()]


def main():
    data = json.loads(SRC.read_text())

    lines = []
    lines.append("-- GENERADO AUTOMATICAMENTE por scripts/generate-demo-menu-seed.py")
    lines.append("-- a partir de supabase/demo-data/note-di-caffe-menu.json — no editar a mano.")
    lines.append("--")
    lines.append("-- Carta real de Note di Caffe extraida de fotografia. Items marcados 'review'")
    lines.append("-- en el JSON se insertan con status = 'hidden' (no visibles en la carta")
    lines.append("-- publica) hasta confirmarse contra la carta fisica. Items sin precio legible")
    lines.append("-- NO se insertan -- se listan al final de este archivo como comentario.")
    lines.append("--")
    lines.append("-- Requiere que note-di-caffe ya exista (ver seed-demo-note-di-caffe.sql).")
    lines.append("-- Idempotente: relanzarlo no duplica categorias ni platos.")
    lines.append("")
    lines.append("do $$")
    lines.append("declare")
    lines.append("  v_restaurant_id uuid;")
    lines.append("  v_category_id uuid;")
    lines.append("  v_dish_id uuid;")
    lines.append("begin")
    lines.append("  select id into v_restaurant_id from restaurants where slug = 'note-di-caffe';")
    lines.append("  if v_restaurant_id is null then")
    lines.append("    raise exception 'note-di-caffe no existe todavia -- aplica antes seed-demo-note-di-caffe.sql';")
    lines.append("  end if;")
    lines.append("")
    lines.append("  -- Retira las categorias/platos placeholder ('Ejemplo - ...') del primer seed:")
    lines.append("  -- ya tenemos la carta real, no tiene sentido mostrar las dos a la vez.")
    lines.append("  -- Los platos se borran ANTES que sus categorias: dishes.category_id es")
    lines.append("  -- ON DELETE SET NULL, no CASCADE, asi que borrar solo la categoria los")
    lines.append("  -- dejaria huerfanos (categoria null) en vez de eliminarlos.")
    lines.append("  delete from dishes")
    lines.append("    where restaurant_id = v_restaurant_id")
    lines.append("      and category_id in (")
    lines.append("        select id from categories")
    lines.append("        where restaurant_id = v_restaurant_id and name like 'Ejemplo — %'")
    lines.append("      );")
    lines.append("  delete from categories")
    lines.append("    where restaurant_id = v_restaurant_id and name like 'Ejemplo — %';")
    lines.append("")

    skipped_no_price = []
    inserted_count = 0
    hidden_count = 0

    for cat in data["categories"]:
        cat_name = cat["name"]
        lines.append(f"  -- === {cat_name} / {cat.get('name_en', '')} ===")
        lines.append("  select id into v_category_id from categories")
        lines.append(f"    where restaurant_id = v_restaurant_id and name = {esc(cat_name)};")
        lines.append("  if v_category_id is null then")
        lines.append("    insert into categories (restaurant_id, name, sort_order)")
        lines.append(f"    values (v_restaurant_id, {esc(cat_name)}, {cat['sort_order']})")
        lines.append("    returning id into v_category_id;")
        cat_en_name = cat.get("name_en")
        if cat_en_name:
            lines.append("    insert into category_translations (category_id, locale, name)")
            lines.append(f"    values (v_category_id, 'en', {esc(cat_en_name)});")
        lines.append("  end if;")
        lines.append("")

        for item in cat["items"]:
            name = item.get("name")
            price = item.get("price")
            variants = item.get("variants", [])
            review = bool(item.get("review"))

            # Precio base: el explicito, o si no hay, el de la primera variante.
            base_price = price
            remaining_variants = variants
            if base_price is None and variants:
                base_price = variants[0]["price"]
                remaining_variants = variants[1:]

            if base_price is None:
                code = f" (code {item['code']})" if item.get("code") else ""
                skipped_no_price.append(f"{cat_name} > {name}{code}")
                continue

            description = item.get("description")
            ingredients = ingredients_from_description(description) if description else []
            status = "hidden" if review else "available"
            if review:
                hidden_count += 1
            inserted_count += 1

            code_comment = f" (código {item['code']})" if item.get("code") else ""
            lines.append(f"  -- {name}{code_comment}")
            lines.append("  select id into v_dish_id from dishes")
            lines.append(f"    where category_id = v_category_id and name = {esc(name)};")
            lines.append("  if v_dish_id is null then")
            lines.append("    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)")
            lines.append(
                f"    values (v_restaurant_id, v_category_id, {esc(name)}, {pg_text_array(ingredients)}, "
                f"{cents(base_price)}, {esc(status)})"
            )
            lines.append("    returning id into v_dish_id;")

            en_name = item_en_name(item)
            en_description = item_en_description(item)
            en_ingredients = ingredients_from_description(en_description) if en_description else []
            if en_name or en_ingredients:
                t_name = en_name or name
                lines.append("    insert into dish_translations (dish_id, locale, name, ingredients)")
                lines.append(f"    values (v_dish_id, 'en', {esc(t_name)}, {pg_text_array(en_ingredients)});")

            for v in remaining_variants:
                lines.append("    insert into dish_variants (dish_id, label, price_cents)")
                lines.append(f"    values (v_dish_id, {esc(v['label'])}, {cents(v['price'])});")

            lines.append("  end if;")
            lines.append("")

    lines.append("end $$;")
    lines.append("")
    lines.append("-- === Artículos SIN precio legible: NO insertados, dar de alta a mano cuando se confirme ===")
    for s in skipped_no_price:
        lines.append(f"-- {s}")

    OUT.write_text("\n".join(lines) + "\n")

    print(f"Escrito {OUT}")
    print(f"Platos insertados: {inserted_count} (de los cuales {hidden_count} en status=hidden por revisión)")
    print(f"Platos SIN insertar por falta de precio: {len(skipped_no_price)}")


if __name__ == "__main__":
    main()
