-- NovaCore Smart Menu — Fase 1: esquema inicial
-- Multi-tenant compartido: toda tabla de contenido lleva restaurant_id
-- (directo o via join a dishes/categories) y se aisla mediante RLS,
-- nunca confiando en filtros de la aplicación.

-- === IDENTIDAD DEL TENANT ===============================================

create table restaurants (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique not null,
  name               text not null,
  logo_url           text,
  cover_url          text,
  description        text,
  phone              text,
  whatsapp           text,
  address            text,
  geo_lat            numeric(9, 6),
  geo_lng            numeric(9, 6),
  social_links       jsonb not null default '{}'::jsonb,
  schedule           jsonb not null default '{}'::jsonb,
  theme              jsonb not null default '{}'::jsonb,
  currency           char(3) not null default 'EUR',
  default_locale     text not null default 'es',
  supported_locales  text[] not null default '{es}',
  allergen_policy    text,
  status             text not null default 'active'
                       check (status in ('active', 'suspended')),
  plan               text not null default 'starter'
                       check (plan in ('starter', 'pro', 'enterprise')),
  operating_status         text not null default 'open'
                             check (operating_status in ('open', 'temporarily_closed', 'vacation')),
  operating_status_message text,
  operating_status_until   timestamptz,
  seo_title          text,
  seo_description    text,
  created_at         timestamptz not null default now()
);

comment on column restaurants.status is
  'Solo NovaCore puede cambiar este valor (ver trigger restaurants_protect_admin_fields_trg).';
comment on column restaurants.operating_status is
  'Lo controla el propio restaurante (owner/staff): abierto / cerrado temporalmente / vacaciones. '
  'No confundir con status, que es el alta/suspensión que decide NovaCore.';
comment on column restaurants.operating_status_until is
  'Fecha orientativa de reapertura (p.ej. fin de vacaciones). El cambio automatico de vuelta a '
  'open no se implementa todavia; de momento es solo informativo para mostrar al cliente.';
comment on column restaurants.seo_title is
  'Override manual del <title> autogenerado. NULL = se genera a partir de name/description.';
comment on column restaurants.seo_description is
  'Override manual de la meta description autogenerada.';

-- === USUARIOS Y ROLES ====================================================

create table platform_admins (
  user_id     uuid primary key references auth.users (id) on delete cascade,
  created_at  timestamptz not null default now()
);

create table restaurant_users (
  restaurant_id  uuid not null references restaurants (id) on delete cascade,
  user_id        uuid not null references auth.users (id) on delete cascade,
  role           text not null check (role in ('owner', 'staff')),
  created_at     timestamptz not null default now(),
  primary key (restaurant_id, user_id)
);

create index restaurant_users_user_idx on restaurant_users (user_id);

-- === CATEGORIAS ===========================================================

create table categories (
  id               uuid primary key default gen_random_uuid(),
  restaurant_id    uuid not null references restaurants (id) on delete cascade,
  name             text not null,
  icon             text,
  sort_order       integer not null default 0,
  available_from   time,
  available_to     time,
  available_days   smallint[],
  created_at       timestamptz not null default now()
);

comment on column categories.available_from is
  'Ventana horaria opcional (ej. Desayunos 08:00-12:00). NULL en available_from/to = siempre visible.';
comment on column categories.available_days is
  'Dias de la semana en que aplica la ventana horaria (0=domingo..6=sabado). NULL/vacio = todos los dias. '
  'El cambio automatico segun la hora actual es logica de aplicacion, no se implementa todavia.';

create index categories_restaurant_idx on categories (restaurant_id);

create table category_translations (
  category_id  uuid not null references categories (id) on delete cascade,
  locale       text not null,
  name         text not null,
  primary key (category_id, locale)
);

-- === CATALOGO DE ALERGENOS (14 UE, sembrado en supabase/seed.sql) ========

create table allergens (
  id        uuid primary key default gen_random_uuid(),
  code      text unique not null,
  icon_key  text not null,
  name_es   text not null,
  name_en   text not null
);

-- === PLATOS ================================================================

create table dishes (
  id                  uuid primary key default gen_random_uuid(),
  restaurant_id       uuid not null references restaurants (id) on delete cascade,
  category_id         uuid references categories (id) on delete set null,
  name                text not null,
  short_description   text,
  description         text,
  ingredients         text[] not null default '{}',
  spice_level         smallint check (spice_level between 0 and 3),
  nutritional_info    jsonb,
  price_cents         integer not null check (price_cents >= 0),
  status              text not null default 'available'
                        check (status in ('available', 'sold_out', 'hidden', 'archived')),
  badges              text[] not null default '{}',
  avg_rating          numeric(2, 1) not null default 0,
  rating_count        integer not null default 0,
  sort_order          integer not null default 0,
  created_at          timestamptz not null default now(),
  constraint dishes_badges_allowed check (
    badges <@ array['recommended', 'bestseller', 'new', 'on_offer']::text[]
  )
);

comment on column dishes.badges is
  'Etiquetas de marketing que el propio owner/staff activa: recommended, bestseller, new, on_offer. '
  'Distinto de las promociones con fecha (tabla promotions).';

create index dishes_restaurant_idx on dishes (restaurant_id);
create index dishes_category_idx on dishes (category_id);
create index dishes_ingredients_gin on dishes using gin (ingredients);

create table dish_translations (
  dish_id            uuid not null references dishes (id) on delete cascade,
  locale             text not null,
  name               text not null,
  short_description  text,
  description        text,
  ingredients        text[],
  primary key (dish_id, locale)
);

comment on column dish_translations.ingredients is
  'NULL = usa dishes.ingredients (idioma por defecto del restaurante) para este plato.';

create table dish_media (
  id          uuid primary key default gen_random_uuid(),
  dish_id     uuid not null references dishes (id) on delete cascade,
  url         text not null,
  sort_order  integer not null default 0
);

create index dish_media_dish_idx on dish_media (dish_id);

create table dish_variants (
  id           uuid primary key default gen_random_uuid(),
  dish_id      uuid not null references dishes (id) on delete cascade,
  label        text not null,
  price_cents  integer not null check (price_cents >= 0),
  sort_order   integer not null default 0
);

create index dish_variants_dish_idx on dish_variants (dish_id);

create table dish_allergens (
  dish_id      uuid not null references dishes (id) on delete cascade,
  allergen_id  uuid not null references allergens (id) on delete cascade,
  primary key (dish_id, allergen_id)
);

-- === RESENAS ===============================================================

create table reviews (
  id                   uuid primary key default gen_random_uuid(),
  restaurant_id        uuid not null references restaurants (id) on delete cascade,
  target_type          text not null check (target_type in ('dish', 'restaurant')),
  dish_id              uuid references dishes (id) on delete cascade,
  author_name          text,
  rating               smallint not null check (rating between 1 and 5),
  comment              text,
  photo_url            text,
  status               text not null default 'pending'
                         check (status in ('pending', 'approved', 'hidden')),
  owner_reply          text,
  owner_reply_at       timestamptz,
  anonymous_device_id  uuid,
  created_at           timestamptz not null default now(),
  constraint reviews_dish_id_matches_target check (
    (target_type = 'dish' and dish_id is not null)
    or (target_type = 'restaurant' and dish_id is null)
  )
);

create index reviews_restaurant_idx on reviews (restaurant_id);
create index reviews_dish_idx on reviews (dish_id);

-- === QR ====================================================================

create table qr_codes (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants (id) on delete cascade,
  label          text not null,
  type           text not null check (type in ('menu', 'table')),
  table_number   integer,
  status         text not null default 'active'
                   check (status in ('active', 'archived')),
  scan_count     integer not null default 0,
  created_at     timestamptz not null default now()
);

comment on column qr_codes.status is
  'El propietario archiva un QR que ya no usa (borrado logico); el borrado definitivo '
  'sigue siendo exclusivo de NovaCore (ver qr_codes_admin_delete).';

create index qr_codes_restaurant_idx on qr_codes (restaurant_id);

-- === EVENTOS (registro para futuras estadisticas; sin panel todavia) ======

create table analytics_events (
  id             uuid primary key default gen_random_uuid(),
  restaurant_id  uuid not null references restaurants (id) on delete cascade,
  event_type     text not null,
  dish_id        uuid references dishes (id) on delete set null,
  qr_id          uuid references qr_codes (id) on delete set null,
  metadata       jsonb not null default '{}'::jsonb,
  created_at     timestamptz not null default now()
);

create index analytics_events_restaurant_day_idx on analytics_events (restaurant_id, created_at);

-- === PROMOCIONES TEMPORALES ================================================
-- Descuento con fecha de inicio/fin. dish_id nulo = promocion de todo el
-- restaurante (banner); con dish_id = descuento de un plato concreto.

create table promotions (
  id              uuid primary key default gen_random_uuid(),
  restaurant_id   uuid not null references restaurants (id) on delete cascade,
  dish_id         uuid references dishes (id) on delete cascade,
  title           text not null,
  description     text,
  discount_type   text check (discount_type in ('percentage', 'fixed_amount')),
  discount_value  numeric(10, 2),
  starts_at       timestamptz not null,
  ends_at         timestamptz not null,
  created_at      timestamptz not null default now(),
  constraint promotions_valid_range check (ends_at > starts_at)
);

create index promotions_restaurant_idx on promotions (restaurant_id);
create index promotions_dish_idx on promotions (dish_id);

-- NovaCore Smart Menu es el primer modulo de una suite mas amplia para
-- restaurantes. Reservado para fases futuras (no se crea todavia, solo
-- documentado aqui, para que su llegada no obligue a rediseñar nada):
-- orders, order_items, reservations, payments, loyalty_accounts, ar_assets,
-- marketing_campaigns, automation_rules. Todas seguirian el mismo patron:
-- restaurant_id + RLS.
