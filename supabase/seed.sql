-- NovaCore Smart Menu — datos de siembra
-- Se ejecuta automáticamente tras las migraciones con `supabase db reset`
-- (convención del Supabase CLI: supabase/seed.sql en la raíz de supabase/).

-- Catálogo de los 14 alérgenos de declaración obligatoria en la UE
-- (Reglamento (UE) 1169/2011). Es un catálogo global de NovaCore, no de un
-- restaurante concreto — cada plato lo referencia vía dish_allergens.
insert into allergens (code, icon_key, name_es, name_en) values
  ('gluten',    'gluten',      'Cereales con gluten',            'Cereals containing gluten'),
  ('crustaceans', 'crustaceans', 'Crustáceos',                   'Crustaceans'),
  ('eggs',      'eggs',        'Huevos',                         'Eggs'),
  ('fish',      'fish',        'Pescado',                        'Fish'),
  ('peanuts',   'peanuts',     'Cacahuetes',                     'Peanuts'),
  ('soybeans',  'soybeans',    'Soja',                           'Soybeans'),
  ('milk',      'milk',        'Leche (incl. lactosa)',          'Milk (incl. lactose)'),
  ('nuts',      'nuts',        'Frutos de cáscara',              'Tree nuts'),
  ('celery',    'celery',      'Apio',                           'Celery'),
  ('mustard',   'mustard',     'Mostaza',                        'Mustard'),
  ('sesame',    'sesame',      'Granos de sésamo',                'Sesame seeds'),
  ('sulphites', 'sulphites',   'Dióxido de azufre y sulfitos',   'Sulphur dioxide and sulphites'),
  ('lupin',     'lupin',       'Altramuces',                     'Lupin'),
  ('molluscs',  'molluscs',    'Moluscos',                       'Molluscs')
on conflict (code) do nothing;
