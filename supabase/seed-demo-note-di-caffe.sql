-- Restaurante de demostración: Note di Caffé (Los Abrigos, Tenerife)
--
-- Los datos del restaurante (nombre, slug, dirección, teléfono, horario,
-- valoración y nº de reseñas de Google) son reales, proporcionados por el
-- cliente. external_rating/-_count/-_source son puramente informativos y
-- nunca alimentan la tabla reviews propia de NovaCore (decisión explícita:
-- no se fabrican 782 reseñas falsas).
--
-- Las categorías y los platos sí son EXPLÍCITAMENTE de demostración —
-- ningún nombre de plato, precio o ingrediente de aquí abajo pretende
-- representar la carta real. Sustituir en cuanto exista la carta oficial
-- (o borrar con el bloque comentado al final de este archivo).
--
-- Idempotente: relanzar este script no duplica nada (restaurante,
-- categorías y platos de demostración se reutilizan si ya existen).
-- Ejecutar manualmente (SQL Editor del dashboard o
-- `supabase db execute -f supabase/seed-demo-note-di-caffe.sql`). No forma
-- parte de supabase/seed.sql porque no es infraestructura permanente.

do $$
declare
  v_restaurant_id uuid;
  v_cat_cafe_id uuid;
  v_cat_italiana_id uuid;
  v_cat_pizza_id uuid;
  v_cat_llevar_id uuid;
begin
  insert into restaurants (
    slug, name, description, phone, address, schedule, currency,
    default_locale, supported_locales, theme, status, plan,
    external_rating, external_rating_count, external_review_source
  ) values (
    'note-di-caffe',
    'Note di Caffé',
    'Cafetería, bar y restaurante italiano con pizzería y comida para llevar en Los Abrigos, Tenerife.',
    '+34 922 839 233',
    'Calle La Marina Nº9, 38618 Los Abrigos, Santa Cruz de Tenerife, España',
    '{
      "monday":    {"open": "07:00", "close": "23:00"},
      "tuesday":   {"open": "07:00", "close": "23:00"},
      "wednesday": {"open": "07:00", "close": "23:00"},
      "thursday":  {"open": "07:00", "close": "23:00"},
      "friday":    {"open": "07:00", "close": "23:00"},
      "saturday":  {"open": "07:00", "close": "23:00"},
      "sunday":    {"open": "07:00", "close": "23:00"}
    }'::jsonb,
    'EUR',
    'es',
    '{es}',
    '{"preset": "mediterraneo", "colorMode": "system"}'::jsonb,
    'active',
    'starter',
    4.1,
    782,
    'Google'
  )
  on conflict (slug) do update set
    name = excluded.name,
    description = excluded.description,
    phone = excluded.phone,
    address = excluded.address,
    schedule = excluded.schedule,
    external_rating = excluded.external_rating,
    external_rating_count = excluded.external_rating_count,
    external_review_source = excluded.external_review_source
  returning id into v_restaurant_id;

  -- Cuatro categorías de ejemplo, una por cada tipo de negocio real
  -- declarado (Cafetería/Bar, Restaurante italiano, Pizzería, Comida para
  -- llevar), cada una con un único plato de demostración dentro.

  select id into v_cat_cafe_id from categories
    where restaurant_id = v_restaurant_id and name = 'Ejemplo — Café y bar';
  if v_cat_cafe_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Ejemplo — Café y bar', 0)
    returning id into v_cat_cafe_id;

    insert into dishes (restaurant_id, category_id, name, short_description, ingredients, price_cents, status)
    values (
      v_restaurant_id, v_cat_cafe_id, 'Producto de demostración — Café y bar',
      'Ficha de ejemplo para comprobar el diseño de la carta — sustituir por el plato real de Note di Caffé.',
      array['Ingrediente de ejemplo 1', 'Ingrediente de ejemplo 2'], 150, 'available'
    );
  end if;

  select id into v_cat_italiana_id from categories
    where restaurant_id = v_restaurant_id and name = 'Ejemplo — Cocina italiana';
  if v_cat_italiana_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Ejemplo — Cocina italiana', 1)
    returning id into v_cat_italiana_id;

    insert into dishes (restaurant_id, category_id, name, short_description, ingredients, price_cents, status)
    values (
      v_restaurant_id, v_cat_italiana_id, 'Producto de demostración — Cocina italiana',
      'Ficha de ejemplo para comprobar el diseño de la carta — sustituir por el plato real de Note di Caffé.',
      array['Ingrediente de ejemplo 1', 'Ingrediente de ejemplo 2'], 800, 'available'
    );
  end if;

  select id into v_cat_pizza_id from categories
    where restaurant_id = v_restaurant_id and name = 'Ejemplo — Pizzas';
  if v_cat_pizza_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Ejemplo — Pizzas', 2)
    returning id into v_cat_pizza_id;

    insert into dishes (restaurant_id, category_id, name, short_description, ingredients, price_cents, status)
    values (
      v_restaurant_id, v_cat_pizza_id, 'Producto de demostración — Pizza',
      'Ficha de ejemplo para comprobar el diseño de la carta — sustituir por el plato real de Note di Caffé.',
      array['Ingrediente de ejemplo 1', 'Ingrediente de ejemplo 2'], 900, 'available'
    );
  end if;

  select id into v_cat_llevar_id from categories
    where restaurant_id = v_restaurant_id and name = 'Ejemplo — Para llevar';
  if v_cat_llevar_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Ejemplo — Para llevar', 3)
    returning id into v_cat_llevar_id;

    insert into dishes (restaurant_id, category_id, name, short_description, ingredients, price_cents, status)
    values (
      v_restaurant_id, v_cat_llevar_id, 'Producto de demostración — Para llevar',
      'Ficha de ejemplo para comprobar el diseño de la carta — sustituir por el plato real de Note di Caffé.',
      array['Ingrediente de ejemplo 1'], 500, 'available'
    );
  end if;
end $$;

-- Para borrar todo el contenido de demostración y volver a ejecutar desde
-- cero (los platos y categorías se van en cascada al borrar el restaurante):
-- delete from restaurants where slug = 'note-di-caffe';
