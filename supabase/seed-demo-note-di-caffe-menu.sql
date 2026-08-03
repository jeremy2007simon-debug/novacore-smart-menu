-- GENERADO AUTOMATICAMENTE por scripts/generate-demo-menu-seed.py
-- a partir de supabase/demo-data/note-di-caffe-menu.json — no editar a mano.
--
-- Carta real de Note di Caffe extraida de fotografia. Items marcados 'review'
-- en el JSON se insertan con status = 'hidden' (no visibles en la carta
-- publica) hasta confirmarse contra la carta fisica. Items sin precio legible
-- NO se insertan -- se listan al final de este archivo como comentario.
--
-- Requiere que note-di-caffe ya exista (ver seed-demo-note-di-caffe.sql).
-- Idempotente: relanzarlo no duplica categorias ni platos.

do $$
declare
  v_restaurant_id uuid;
  v_category_id uuid;
  v_dish_id uuid;
begin
  select id into v_restaurant_id from restaurants where slug = 'note-di-caffe';
  if v_restaurant_id is null then
    raise exception 'note-di-caffe no existe todavia -- aplica antes seed-demo-note-di-caffe.sql';
  end if;

  -- Retira las categorias/platos placeholder ('Ejemplo - ...') del primer seed:
  -- ya tenemos la carta real, no tiene sentido mostrar las dos a la vez.
  -- Los platos se borran ANTES que sus categorias: dishes.category_id es
  -- ON DELETE SET NULL, no CASCADE, asi que borrar solo la categoria los
  -- dejaria huerfanos (categoria null) en vez de eliminarlos.
  delete from dishes
    where restaurant_id = v_restaurant_id
      and category_id in (
        select id from categories
        where restaurant_id = v_restaurant_id and name like 'Ejemplo — %'
      );
  delete from categories
    where restaurant_id = v_restaurant_id and name like 'Ejemplo — %';

  -- === Cafetería / Coffee ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Cafetería';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Cafetería', 0)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Coffee');
  end if;

  -- Americano
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Americano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Americano', '{}', 140, 'available')
    returning id into v_dish_id;
  end if;

  -- Espresso
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Espresso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Espresso', '{}', 120, 'available')
    returning id into v_dish_id;
  end if;

  -- Cortado
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Cortado';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Cortado', '{}', 130, 'available')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 150);
  end if;

  -- Leche y Leche
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Leche y Leche';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Leche y Leche', '{}', 140, 'available')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 170);
  end if;

  -- Café con leche
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Café con leche';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Café con leche', '{}', 140, 'available')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 170);
  end if;

  -- Cappuccino
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Cappuccino';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Cappuccino', '{}', 160, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 320);
  end if;

  -- Barraquito
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Barraquito';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Barraquito', '{}', 170, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 320);
  end if;

  -- Irish coffee
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Irish coffee';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Irish coffee', '{}', 310, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 490);
  end if;

  -- Chocolate
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Chocolate';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Chocolate', '{}', 250, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 350);
  end if;

  -- Chocolate con Nata
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Chocolate con Nata';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Chocolate con Nata', '{}', 280, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Grande', 360);
  end if;

  -- Goloso
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Goloso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Goloso', '{"Brandy","chocolate y nata"}', 550, 'available')
    returning id into v_dish_id;
  end if;

  -- Lubumba
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Lubumba';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Lubumba', '{"Leche condensada","café","chocolate y nata"}', 550, 'hidden')
    returning id into v_dish_id;
  end if;

  -- Infusiones
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Infusiones';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Infusiones', '{}', 150, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Herbal teas', '{}');
  end if;

  -- === Zumos y Batidos / Juices & Milk Shakes ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Zumos y Batidos';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Zumos y Batidos', 1)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Juices & Milk Shakes');
  end if;

  -- Zumo o batido (1 fruta)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Zumo o batido (1 fruta)';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Zumo o batido (1 fruta)', '{}', 370, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Juice or milkshake (1 fruit)', '{}');
  end if;

  -- Batido Mix
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Batido Mix';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Batido Mix', '{}', 490, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Mix milkshake', '{}');
  end if;

  -- === Bollería y Tartas / Pastries ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Bollería y Tartas';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Bollería y Tartas', 2)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Pastries');
  end if;

  -- Croissant (código 01)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Croissant';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Croissant', '{}', 150, 'available')
    returning id into v_dish_id;
  end if;

  -- Tartaletas variadas (código 02)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tartaletas variadas';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tartaletas variadas', '{}', 200, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Assorted tartlets', '{}');
  end if;

  -- Pastel Relleno (código 03)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pastel Relleno';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pastel Relleno', '{}', 200, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Stuffed Pastry', '{}');
  end if;

  -- Croissant con Nutella (código 04)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Croissant con Nutella';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Croissant con Nutella', '{}', 200, 'available')
    returning id into v_dish_id;
  end if;

  -- Bombolone (código 05)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bombolone';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bombolone', '{}', 160, 'available')
    returning id into v_dish_id;
  end if;

  -- Croissant integral (código 06)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Croissant integral';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Croissant integral', '{}', 280, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Wholegrain croissant', '{}');
  end if;

  -- Muffin sin gluten (código 08)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Muffin sin gluten';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Muffin sin gluten', '{}', 150, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Gluten-free muffin', '{}');
  end if;

  -- Pastas de té (código 10)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pastas de té';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pastas de té', '{"Con mermelada de temporada. Extra topping chocolate o dulce de leche. Preguntar por fruta de temporada."}', 120, 'hidden')
    returning id into v_dish_id;
  end if;

  -- === Crepes Dulces / Sweet Crepes ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Crepes Dulces';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Crepes Dulces', 3)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Sweet Crepes');
  end if;

  -- Azúcar y Limón (código 12)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Azúcar y Limón';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Azúcar y Limón', '{}', 450, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Sugar and lemon', '{}');
  end if;

  -- Nutella (código 13)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Nutella';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Nutella', '{}', 530, 'available')
    returning id into v_dish_id;
  end if;

  -- Plátano (código 14)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Plátano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Plátano', '{}', 530, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Banana', '{}');
  end if;

  -- Fresa (código 15)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Fresa';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Fresa', '{}', 530, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Strawberry', '{}');
  end if;

  -- Piña (código 16)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Piña';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Piña', '{}', 530, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Pineapple', '{}');
  end if;

  -- === Crepes Salados / Salty Crepes ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Crepes Salados';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Crepes Salados', 4)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Salty Crepes');
  end if;

  -- Jamón y Queso (código 18)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Jamón y Queso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Jamón y Queso', '{}', 650, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Ham and Cheese', '{}');
  end if;

  -- Serrano y Queso (código 19)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Serrano y Queso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Serrano y Queso', '{}', 740, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Serrano Ham and Cheese', '{}');
  end if;

  -- Salmón y Brie (código 20)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón y Brie';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón y Brie', '{}', 930, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmon and Brie', '{}');
  end if;

  -- Note di Caffè (código 21)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Note di Caffè';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Note di Caffè', '{"Pollo","mozzarella","ensalada"}', 930, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Note di Caffè', '{"Chicken","mozzarella","salad"}');
  end if;

  -- === Brunch / Let's Brunch ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Brunch';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Brunch', 5)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Let''s Brunch');
  end if;

  -- Note di Caffè Español (código 22)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Note di Caffè Español';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Note di Caffè Español', '{"Muesli","fruta","yogur","queso","jamón","huevo","ensalada","salmón","brie","pan","mantequilla","mermelada","zumo de naranja 1/2 lt."}', 3400, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Spanish (2 pers.)', '{"Muesli","fruit","yogurt","cheese","Serrano ham","egg","salad","salmon","brie","bread","butter","jam","orange juice 1/2 lt"}');
  end if;

  -- Note di Caffè Inglés (código 23)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Note di Caffè Inglés';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Note di Caffè Inglés', '{"Muesli","fruta","yogur","judías","huevo","salchicha","pan","mantequilla","(Café","leche o té) zumo de naranja 1/2 lt."}', 3400, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'English (2 pers.)', '{"Muesli","fruit","yogurt","beans","egg","sausage","bread","butter","(coffee","milk or tea) orange juice 1/2 lt"}');
  end if;

  -- Desayuno Inglés (código 24)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Desayuno Inglés';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Desayuno Inglés', '{"Pan","huevo","bacon","salchichas","judías"}', 890, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'English Breakfast', '{"Bread","egg","bacon","sausages","beans"}');
  end if;

  -- Desayuno Peque (código 25)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Desayuno Peque';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Desayuno Peque', '{"Muesli","fruta","yogur","pan","Nutella","ColaCao"}', 550, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Kid''s Breakfast (1 pers.)', '{"Muesli","fruits","yoghurt","bread","Nutella","ColaCao"}');
  end if;

  -- === Yogurt / Yogurt ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Yogurt';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Yogurt', 6)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Yogurt');
  end if;

  -- Bowl con granola (código 109)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bowl con granola';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bowl con granola', '{}', 480, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bowl with granola', '{}');
  end if;

  -- Bowl con granola y fruta (código 110)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bowl con granola y fruta';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bowl con granola y fruta', '{}', 590, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bowl with granola and fruit', '{}');
  end if;

  -- === Tostadas / Toasts (con pan de centeno / with rye bread) ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Tostadas';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Tostadas', 7)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Toasts (con pan de centeno / with rye bread)');
  end if;

  -- Aguacate, tomate, huevo (código 111)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Aguacate, tomate, huevo';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Aguacate, tomate, huevo', '{}', 750, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Avocado, tomato, egg', '{}');
  end if;

  -- Aguacate, tomate, queso blanco (código 112)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Aguacate, tomate, queso blanco';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Aguacate, tomate, queso blanco', '{}', 750, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Avocado, tomato, white cheese', '{}');
  end if;

  -- Queso blanco, tomate, orégano (código 113)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Queso blanco, tomate, orégano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Queso blanco, tomate, orégano', '{}', 650, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'White cheese, tomato, oregano', '{}');
  end if;

  -- Brie, salmón, rúcula (código 114)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Brie, salmón, rúcula';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Brie, salmón, rúcula', '{}', 930, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Brie, salmon, rocket', '{}');
  end if;

  -- Tumaca, serrano, queso blanco (código 115)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tumaca, serrano, queso blanco';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tumaca, serrano, queso blanco', '{}', 850, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tomato bread, Serrano ham, white cheese', '{}');
  end if;

  -- Queso blanco, miel, nueces (código 116)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Queso blanco, miel, nueces';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Queso blanco, miel, nueces', '{}', 650, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'White cheese, honey, nuts', '{}');
  end if;

  -- Tumaca, aceite, sal (código 117)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tumaca, aceite, sal';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tumaca, aceite, sal', '{}', 340, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tomato bread, oil, salt', '{}');
  end if;

  -- Tumaca, serrano (código 118)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tumaca, serrano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tumaca, serrano', '{}', 520, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tomato bread, Serrano ham', '{}');
  end if;

  -- === Sandwiches / Sandwiches ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Sandwiches';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Sandwiches', 8)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Sandwiches');
  end if;

  -- Tomate, queso blanco y orégano (código 118)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tomate, queso blanco y orégano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tomate, queso blanco y orégano', '{}', 460, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tomato and white cheese', '{}');
  end if;

  -- Mixta (código 26)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Mixta';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Mixta', '{}', 490, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Ham and cheese', '{}');
  end if;

  -- Jamón Serrano y Mozzarella (código 27)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Jamón Serrano y Mozzarella';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Jamón Serrano y Mozzarella', '{}', 520, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Serrano Ham and Mozzarella', '{}');
  end if;

  -- Atún, Tomate y Cebolla (código 28)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Atún, Tomate y Cebolla';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Atún, Tomate y Cebolla', '{}', 520, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tuna, tomato and onion', '{}');
  end if;

  -- Pollo / Lomo, Mechada / Tortilla (código 29)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pollo / Lomo, Mechada / Tortilla';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pollo / Lomo, Mechada / Tortilla', '{}', 520, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Chicken / Pork loin, marinated / Tortilla', '{}');
  end if;

  -- Vegetal (código 30)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Vegetal';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Vegetal', '{"Verduras salteadas variadas"}', 520, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Vegetal', '{"Sautéed vegetables"}');
  end if;

  -- Salmón y Brie (código 32)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón y Brie';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón y Brie', '{}', 610, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmon and Brie', '{}');
  end if;

  -- Queso y Cebolla (código 33)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Queso y Cebolla';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Queso y Cebolla', '{}', 490, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Cheese and Onion', '{}');
  end if;

  -- Bresaola, Mozzarella y Rúcula (código 34)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bresaola, Mozzarella y Rúcula';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bresaola, Mozzarella y Rúcula', '{}', 610, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bresaola, Mozzarella and rocket salad', '{}');
  end if;

  -- Americano (código 35)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Americano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Americano', '{"Jamón","queso","bacon","huevo","ensalada"}', 690, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Americano', '{"Ham","cheese","bacon","egg","salad"}');
  end if;

  -- === Bocadillos - Focaccia / Rolls - Focaccia ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Bocadillos - Focaccia';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Bocadillos - Focaccia', 9)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Rolls - Focaccia');
  end if;

  -- Pollo, Limón, Espárrago, Tortilla (código 36)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pollo, Limón, Espárrago, Tortilla';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pollo, Limón, Espárrago, Tortilla', '{}', 550, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Chicken, lettuce, cheese, aioli', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 350);
  end if;

  -- Pata, Tomate, Queso Blanco (código 37)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pata, Tomate, Queso Blanco';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pata, Tomate, Queso Blanco', '{}', 550, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Pork leg, tomato, white cheese', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 350);
  end if;

  -- Atún (código 38)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Atún';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Atún', '{}', 550, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tuna', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 350);
  end if;

  -- Salami (código 39)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salami';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salami', '{}', 550, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 350);
  end if;

  -- Jamón Serrano (código 40)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Jamón Serrano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Jamón Serrano', '{}', 550, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Serrano Ham', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 390);
  end if;

  -- Salmón (código 42)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón', '{}', 720, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmon', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 390);
  end if;

  -- Bresaola, Mozzarella y Rúcula (código 43)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bresaola, Mozzarella y Rúcula';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bresaola, Mozzarella y Rúcula', '{}', 720, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bresaola, Mozzarella and rocket salad', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 390);
  end if;

  -- Americano (código 00)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Americano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Americano', '{"Jamón","queso","bacon","huevo","ensalada"}', 720, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Americano', '{"Ham","cheese","bacon","egg","salad"}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 doc.', 390);
  end if;

  -- === Ensaladas y Platos Fríos / Salads & Cold dishes ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Ensaladas y Platos Fríos';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Ensaladas y Platos Fríos', 10)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Salads & Cold dishes');
  end if;

  -- Quinoa (código 58)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Quinoa';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Quinoa', '{"Quinoa","lechuga","tomate","zanahoria","pepino","muesli con vinagre balsámico"}', 990, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Quinoa', '{"Quinoa","lettuce","tomato","carrot","cucumber","muesli with balsamic vinegar"}');
  end if;

  -- Atún (código 59)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Atún';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Atún', '{"Lechuga","tomate","atún","cebolla","aceitunas"}', 990, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Atún', '{"Lettuce","tomato","tuna","onion","olives"}');
  end if;

  -- Pollo (código 60)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pollo';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pollo', '{"Lechuga","tomate","pollo","zanahoria","aceitunas"}', 990, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Pollo', '{"Lettuce","tomato","chicken","carrot","olives"}');
  end if;

  -- Salmón (código 61)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón', '{"Lechuga","tomate","salmón","alcaparras","cebolla"}', 990, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmón', '{"Lettuce","tomato","salmon","capers","onion"}');
  end if;

  -- Aguacate (código 63)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Aguacate';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Aguacate', '{"Lechuga","tomate","aguacate","parmesano","salmón","cebolla"}', 1090, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Aguacate', '{"Lettuce","tomato","avocado","parmesan","salmon","onion"}');
  end if;

  -- Carpaccio de Bresaola (código 65)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Carpaccio de Bresaola';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Carpaccio de Bresaola', '{"Bresaola","rúcula","tomates cherry","miel","salsa de limón"}', 1090, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Carpaccio de Bresaola', '{"Bresaola","rocket","cherry tomatoes","honey","lemon sauce"}');
  end if;

  -- Pan (código 67)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pan';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pan', '{}', 250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bread', '{}');
  end if;

  -- === Piadina / Piadina ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Piadina';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Piadina', 11)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Piadina');
  end if;

  -- Mixto (código 44)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Mixto';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Mixto', '{"Jamón y Mozzarella"}', 730, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Mixto', '{"Ham and Mozzarella"}');
  end if;

  -- Jamón Serrano y Mozzarella (código 45)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Jamón Serrano y Mozzarella';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Jamón Serrano y Mozzarella', '{}', 760, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Serrano Ham and Mozzarella', '{}');
  end if;

  -- Atún, Pollo, Tomate y Cebolla (código 46)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Atún, Pollo, Tomate y Cebolla';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Atún, Pollo, Tomate y Cebolla', '{}', 950, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tuna, chicken, tomato and onion', '{}');
  end if;

  -- Pollo, Vegetal, Aïoli (código 47)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pollo, Vegetal, Aïoli';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pollo, Vegetal, Aïoli', '{}', 790, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Chicken, vegetal, aioli', '{}');
  end if;

  -- Vegetal (código 48)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Vegetal';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Vegetal', '{}', 790, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Vegetarian', '{}');
  end if;

  -- Salmón, Brie y Rúcula (código 49)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón, Brie y Rúcula';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón, Brie y Rúcula', '{}', 950, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmon, Brie and rocket', '{}');
  end if;

  -- Salami y Queso (código 50)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salami y Queso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salami y Queso', '{}', 790, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salami and Cheese', '{}');
  end if;

  -- Bresaola, Mozzarella y Rúcula (código 51)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bresaola, Mozzarella y Rúcula';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bresaola, Mozzarella y Rúcula', '{}', 890, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bresaola, Mozzarella and rocket salad', '{}');
  end if;

  -- Strachino, Rúcula y Jamón Serrano (código 52)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Strachino, Rúcula y Jamón Serrano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Strachino, Rúcula y Jamón Serrano', '{}', 890, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Stracchino, rocket salad and Serrano ham', '{}');
  end if;

  -- Strachino, Rúcula, Jamón Serrano (código 53)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Strachino, Rúcula, Jamón Serrano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Strachino, Rúcula, Jamón Serrano', '{}', 890, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Stracchino, rocket salad and Serrano ham', '{}');
  end if;

  -- === Hamburguesas / Burgers ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Hamburguesas';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Hamburguesas', 12)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Burgers');
  end if;

  -- 200 gr. de carne, lechuga, tomate, queso (código 54)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = '200 gr. de carne, lechuga, tomate, queso';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, '200 gr. de carne, lechuga, tomate, queso', '{}', 720, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', '200 gr of beef, lettuce, tomato, cheese', '{}');
  end if;

  -- Hamburguesa de pollo (código 55)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Hamburguesa de pollo';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Hamburguesa de pollo', '{}', 750, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Chicken Burger', '{}');
  end if;

  -- Hamburguesa Americana (código 56)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Hamburguesa Americana';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Hamburguesa Americana', '{}', 890, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'American Burger', '{}');
  end if;

  -- Note di Caffè (código 57)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Note di Caffè';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Note di Caffè', '{"Hamburguesa doble","bacon","jamón"}', 1050, 'available')
    returning id into v_dish_id;
  end if;

  -- Baño de Cheddar (código 00)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Baño de Cheddar';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Baño de Cheddar', '{"Con papas fritas"}', 1600, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Cheddar Bath', '{"With fries"}');
  end if;

  -- === Platos Calientes / Warm Dishes ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Platos Calientes';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Platos Calientes', 13)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Warm Dishes');
  end if;

  -- Lasaña Casera (código 68)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Lasaña Casera';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Lasaña Casera', '{}', 880, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Homemade Lasagne', '{}');
  end if;

  -- Lasaña Parmesano (código 69)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Lasaña Parmesano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Lasaña Parmesano', '{}', 880, 'hidden')
    returning id into v_dish_id;
  end if;

  -- Tortilla Casera (código 71)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tortilla Casera';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tortilla Casera', '{}', 850, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Homemade Spanish omelette', '{}');
  end if;

  -- === Para Niños / For Kids ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Para Niños';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Para Niños', 14)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'For Kids');
  end if;

  -- Nuggets de pollo con papas fritas (código 76)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Nuggets de pollo con papas fritas';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Nuggets de pollo con papas fritas', '{}', 750, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Chicken nuggets with fries', '{}');
  end if;

  -- === Papas / Chips ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Papas';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Papas', 15)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Chips');
  end if;

  -- Papas Note di Caffè (código 79)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Papas Note di Caffè';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Papas Note di Caffè', '{"Con salchicha"}', 750, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Note di Caffè Chips', '{"Crazy chips with sausages"}');
  end if;

  -- Papas bravas (código 00)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Papas bravas';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Papas bravas', '{}', 750, 'hidden')
    returning id into v_dish_id;
  end if;

  -- Sweet Potatoes (código 00)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Sweet Potatoes';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Sweet Potatoes', '{}', 750, 'hidden')
    returning id into v_dish_id;
  end if;

  -- === Pasta / Penne or Spaghetti ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Pasta';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Pasta', 16)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Penne or Spaghetti');
  end if;

  -- Bolognese (código 80)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bolognese';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bolognese', '{}', 850, 'available')
    returning id into v_dish_id;
  end if;

  -- Tomate y Albahaca (código 81)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tomate y Albahaca';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tomate y Albahaca', '{}', 850, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tomato and Basil', '{}');
  end if;

  -- Arrabiata (código 82)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Arrabiata';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Arrabiata', '{"Tomate","ajo","cayena"}', 850, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Arrabiata', '{"Tomato","garlic","chilli"}');
  end if;

  -- Pesto (código 83)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Pesto';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Pesto', '{"Aceite de oliva","ajo","albahaca","frutos secos","parmesano"}', 850, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Pesto', '{"Olive oil","garlic","basil","pine nuts","Parmesan"}');
  end if;

  -- Carbonara (código 84)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Carbonara';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Carbonara', '{"Huevo","nata","parmesano","guanciale"}', 850, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Carbonara', '{"Egg","cream","parmesan","guanciale"}');
  end if;

  -- Salmón y Nata (código 85)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Salmón y Nata';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Salmón y Nata', '{"Salmón","nata","cebolla"}', 930, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Salmón y Nata', '{"Salmon","cream","onion"}');
  end if;

  -- === Pizzas / Pizzas ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Pizzas';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Pizzas', 17)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Pizzas');
  end if;

  -- Margherita (código 93)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Margherita';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Margherita', '{"Tomate","mozzarella"}', 1090, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Margherita', '{"Tomato","mozzarella"}');
  end if;

  -- Prosciutto (código 94)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Prosciutto';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Prosciutto', '{"Tomate","mozzarella","jamón"}', 1090, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Prosciutto', '{"Tomato","mozzarella","ham"}');
  end if;

  -- Tropical (código 95)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tropical';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tropical', '{"Tomate","mozzarella","jamón","piña"}', 1150, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tropical', '{"Tomato","mozzarella","ham","pineapple"}');
  end if;

  -- 4 Stagioni (código 96)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = '4 Stagioni';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, '4 Stagioni', '{"Tomate","mozzarella","jamón","champiñones","alcachofas","aceitunas"}', 1250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', '4 Stagioni', '{"Tomato","mozzarella","ham","mushrooms","artichokes","olives"}');
  end if;

  -- Diavola (código 97)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Diavola';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Diavola', '{"Tomate","mozzarella","salchichón picante"}', 1250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Diavola', '{"Tomato","mozzarella","spicy salami"}');
  end if;

  -- Bombo (código 98)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bombo';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bombo', '{"Tomate","mozzarella","salchichón","salami","bacon"}', 1250, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Bombo', '{"Tomato","mozzarella","sausages","salami","bacon"}');
  end if;

  -- Tonno (código 99)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tonno';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tonno', '{"Tomate","mozzarella","atún","cebolla"}', 1250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tonno', '{"Tomato","mozzarella","tuna","onion"}');
  end if;

  -- Vegetal (código 100)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Vegetal';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Vegetal', '{"Verduras salteadas variadas"}', 1190, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Vegetal', '{"Sautéed vegetables"}');
  end if;

  -- Napoli (código 101)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Napoli';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Napoli', '{"Tomate","mozzarella","anchoas","alcaparras"}', 1090, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Napoli', '{"Tomato","mozzarella","anchovies","capers"}');
  end if;

  -- Reina (código 102)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Reina';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Reina', '{"Tomate","mozzarella","jamón","champiñones"}', 1190, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Reina', '{"Tomato","mozzarella","ham","mushrooms"}');
  end if;

  -- Barbacoa (código 103)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Barbacoa';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Barbacoa', '{"Tomate","mozzarella","salchichón","bacon","salsa barbacoa"}', 1250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Barbacoa', '{"Tomato","mozzarella","sausages","bacon","barbecue sauce"}');
  end if;

  -- 4 Quesos (código 104)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = '4 Quesos';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, '4 Quesos', '{"Tomate","mozzarella","edam","parmesano","roquefort"}', 1250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', '4 Quesos', '{"Tomato","mozzarella","edam","parmesan","roquefort"}');
  end if;

  -- Note di Caffè (código 105)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Note di Caffè';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Note di Caffè', '{"Tomate","mozzarella","strachino","jamón serrano","rúcula"}', 1350, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Note di Caffè', '{"Tomato","mozzarella","stracchino","Serrano ham","rocket"}');
  end if;

  -- Parma (código 107)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Parma';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Parma', '{"Tomate","mozzarella","jamón serrano","rúcula"}', 1290, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Parma', '{"Tomato","mozzarella","Serrano ham","rocket"}');
  end if;

  -- Strachino (código 108)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Strachino';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Strachino', '{"Tomate","mozzarella","strachino","jamón","rúcula"}', 890, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Strachino', '{"Tomato","mozzarella","stracchino","ham","rocket"}');
  end if;

  -- === Refrescos / Soft Drinks ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Refrescos';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Refrescos', 18)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Soft Drinks');
  end if;

  -- Coca Cola
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Coca Cola';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Coca Cola', '{}', 250, 'available')
    returning id into v_dish_id;
  end if;

  -- Coca Cola Light
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Coca Cola Light';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Coca Cola Light', '{}', 250, 'available')
    returning id into v_dish_id;
  end if;

  -- Fanta Naranja o Limón
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Fanta Naranja o Limón';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Fanta Naranja o Limón', '{}', 250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Orange or Lemon', '{}');
  end if;

  -- Nestea
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Nestea';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Nestea', '{}', 250, 'available')
    returning id into v_dish_id;
  end if;

  -- Zumo Minut Maid
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Zumo Minut Maid';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Zumo Minut Maid', '{}', 210, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Minut Maid Juice', '{}');
  end if;

  -- Agua
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Agua';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Agua', '{}', 150, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Water', '{}');
  end if;

  -- Aquarius
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Aquarius';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Aquarius', '{}', 280, 'available')
    returning id into v_dish_id;
  end if;

  -- Red Bull
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Red Bull';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Red Bull', '{}', 380, 'available')
    returning id into v_dish_id;
  end if;

  -- Tónica
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tónica';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tónica', '{}', 250, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Tonic Water', '{}');
  end if;

  -- === Vinos / Wine ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Vinos';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Vinos', 19)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Wine');
  end if;

  -- === Sangría / Sangria ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Sangría';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Sangría', 20)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Sangria');
  end if;

  -- De Vino
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'De Vino';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'De Vino', '{}', 550, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Wine Sangria', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 Ltr.', 1050);
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1 Ltr.', 1750);
  end if;

  -- De Cava
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'De Cava';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'De Cava', '{}', 450, 'hidden')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Cava Sangria', '{}');
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1/2 Ltr.', 1160);
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, '1 Ltr.', 1880);
  end if;

  -- === Cerveza / Beer ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Cerveza';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Cerveza', 21)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Beer');
  end if;

  -- Amstel
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Amstel';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Amstel', '{}', 150, 'available')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Jarra', 250);
  end if;

  -- Heineken
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Heineken';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Heineken', '{}', 160, 'available')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Jarra', 260);
  end if;

  -- Cruz Campo
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Cruz Campo';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Cruz Campo', '{"Gran reserva"}', 260, 'hidden')
    returning id into v_dish_id;
    insert into dish_variants (dish_id, label, price_cents)
    values (v_dish_id, 'Jarra', 360);
  end if;

  -- Tropical
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tropical';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tropical', '{"Botella 33cl"}', 190, 'available')
    returning id into v_dish_id;
  end if;

  -- Dorada Pilsen
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Dorada Pilsen';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Dorada Pilsen', '{"Botella 33cl"}', 180, 'available')
    returning id into v_dish_id;
  end if;

  -- Dorada Especial
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Dorada Especial';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Dorada Especial', '{"Botella 33cl"}', 210, 'available')
    returning id into v_dish_id;
  end if;

  -- Heineken (botella)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Heineken (botella)';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Heineken (botella)', '{"Botella 33cl"}', 180, 'available')
    returning id into v_dish_id;
  end if;

  -- Estrella Galicia
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Estrella Galicia';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Estrella Galicia', '{"Botella 33cl"}', 220, 'available')
    returning id into v_dish_id;
  end if;

  -- 1906
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = '1906';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, '1906', '{"Botella 33cl"}', 270, 'available')
    returning id into v_dish_id;
  end if;

  -- Sidra Kopparberg
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Sidra Kopparberg';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Sidra Kopparberg', '{"Botella 33cl"}', 420, 'available')
    returning id into v_dish_id;
  end if;

  -- Cruz Campo (botella)
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Cruz Campo (botella)';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Cruz Campo (botella)', '{"Botella 33cl"}', 150, 'available')
    returning id into v_dish_id;
  end if;

  -- === Whisky, Ginebra, Ron y Vodka / Whisky, Gin, Rum and Vodka ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Whisky, Ginebra, Ron y Vodka';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Whisky, Ginebra, Ron y Vodka', 22)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Whisky, Gin, Rum and Vodka');
  end if;

  -- === Licores / Liqueurs ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Licores';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Licores', 23)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Liqueurs');
  end if;

  -- Baileys
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Baileys';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Baileys', '{}', 480, 'available')
    returning id into v_dish_id;
  end if;

  -- Tía María
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tía María';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tía María', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Cointreau
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Cointreau';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Cointreau', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Jägermeister
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Jägermeister';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Jägermeister', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Licor 43
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Licor 43';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Licor 43', '{}', 450, 'available')
    returning id into v_dish_id;
  end if;

  -- Tequila
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Tequila';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Tequila', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Licor de Hierbas
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Licor de Hierbas';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Licor de Hierbas', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Sambuca
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Sambuca';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Sambuca', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Grappa
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Grappa';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Grappa', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Limoncello
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Limoncello';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Limoncello', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Amaretto
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Amaretto';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Amaretto', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Ramazzotti
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Ramazzotti';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Ramazzotti', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Montenegro
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Montenegro';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Montenegro', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- Averna
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Averna';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Averna', '{}', 410, 'available')
    returning id into v_dish_id;
  end if;

  -- === Cócteles / Cocktails & Aperitifs ===
  select id into v_category_id from categories
    where restaurant_id = v_restaurant_id and name = 'Cócteles';
  if v_category_id is null then
    insert into categories (restaurant_id, name, sort_order)
    values (v_restaurant_id, 'Cócteles', 24)
    returning id into v_category_id;
    insert into category_translations (category_id, locale, name)
    values (v_category_id, 'en', 'Cocktails & Aperitifs');
  end if;

  -- Vodka
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Vodka';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Vodka', '{}', 650, 'hidden')
    returning id into v_dish_id;
  end if;

  -- Americano
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Americano';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Americano', '{}', 650, 'available')
    returning id into v_dish_id;
  end if;

  -- Campari, Martini Rosso, Soda
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Campari, Martini Rosso, Soda';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Campari, Martini Rosso, Soda', '{}', 490, 'available')
    returning id into v_dish_id;
  end if;

  -- Bellini
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Bellini';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Bellini', '{}', 650, 'available')
    returning id into v_dish_id;
  end if;

  -- Prosecco y zumo de naranja
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Prosecco y zumo de naranja';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Prosecco y zumo de naranja', '{}', 550, 'available')
    returning id into v_dish_id;
    insert into dish_translations (dish_id, locale, name, ingredients)
    values (v_dish_id, 'en', 'Prosecco and orange juice', '{}');
  end if;

  -- Aperol Spritz
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Aperol Spritz';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Aperol Spritz', '{}', 550, 'available')
    returning id into v_dish_id;
  end if;

  -- Campari Spritz
  select id into v_dish_id from dishes
    where category_id = v_category_id and name = 'Campari Spritz';
  if v_dish_id is null then
    insert into dishes (restaurant_id, category_id, name, ingredients, price_cents, status)
    values (v_restaurant_id, v_category_id, 'Campari Spritz', '{}', 550, 'available')
    returning id into v_dish_id;
  end if;

end $$;

-- === Artículos SIN precio legible: NO insertados, dar de alta a mano cuando se confirme ===
-- Platos Calientes > Omelette de Jamón y Queso (code 72)
-- Platos Calientes > Omelette de Salmón (code 73)
-- Platos Calientes > Omelette de Atún (code 74)
-- Platos Calientes > Omelette de Verduras (code 75)
-- Platos Calientes > Salchicha Polaca (code 109)
-- Papas > Papas fritas (code 77)
-- Papas > Papas locas (code 78)
-- Pizzas > Extras
-- Vinos > Tinto
-- Vinos > Rosado
-- Vinos > Cava
-- Vinos > Prosecco
-- Whisky, Ginebra, Ron y Vodka > J&B
-- Whisky, Ginebra, Ron y Vodka > Johnnie Walker Red
-- Whisky, Ginebra, Ron y Vodka > Johnnie Walker Black
-- Whisky, Ginebra, Ron y Vodka > Jack Daniel's
-- Whisky, Ginebra, Ron y Vodka > Gordon's
-- Whisky, Ginebra, Ron y Vodka > Beefeater
-- Whisky, Ginebra, Ron y Vodka > Bombay
-- Whisky, Ginebra, Ron y Vodka > Arehucas
-- Whisky, Ginebra, Ron y Vodka > Ron Miel
-- Whisky, Ginebra, Ron y Vodka > Bacardí
-- Whisky, Ginebra, Ron y Vodka > Malibu
-- Whisky, Ginebra, Ron y Vodka > Havana 7
-- Whisky, Ginebra, Ron y Vodka > Smirnoff
