-- NovaCore Smart Menu — Fase 1: funciones auxiliares, RLS y triggers de proteccion
--
-- Regla de oro de este archivo: la seguridad vive aqui, no en el codigo de la
-- aplicacion. Cualquier bug del lado del servidor de Next.js no debe poder
-- filtrar ni modificar datos de un restaurante distinto al del usuario.

-- === FUNCIONES AUXILIARES (security definer: leen tablas sin politica
-- publica de lectura, como platform_admins, para que cualquier rol pueda
-- evaluarlas dentro de sus propias politicas RLS) =========================

create function is_platform_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from platform_admins where user_id = auth.uid()
  );
$$;

create function has_restaurant_role(rid uuid, roles text[])
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from restaurant_users
    where restaurant_id = rid
      and user_id = auth.uid()
      and role = any(roles)
  );
$$;

grant execute on function is_platform_admin() to anon, authenticated;
grant execute on function has_restaurant_role(uuid, text[]) to anon, authenticated;

-- === TRIGGERS DE PROTECCION ===============================================
-- Defensa en profundidad: aunque RLS ya restringe quien puede hacer UPDATE,
-- estos triggers impiden que un owner/staff autorizado a editar la fila
-- cambie columnas que confirmamos como exclusivas de NovaCore o del cliente.

create function restaurants_protect_admin_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not is_platform_admin() then
    new.status := old.status;
    new.plan := old.plan;
  end if;
  return new;
end;
$$;

create trigger restaurants_protect_admin_fields_trg
  before update on restaurants
  for each row execute function restaurants_protect_admin_fields();

create function reviews_protect_customer_fields()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  -- El propietario/staff solo puede tocar status, owner_reply y owner_reply_at.
  -- La nota, el comentario y la foto del cliente son inmutables tras el envio.
  if not is_platform_admin() then
    new.restaurant_id := old.restaurant_id;
    new.target_type := old.target_type;
    new.dish_id := old.dish_id;
    new.author_name := old.author_name;
    new.rating := old.rating;
    new.comment := old.comment;
    new.photo_url := old.photo_url;
    new.anonymous_device_id := old.anonymous_device_id;
    new.created_at := old.created_at;
  end if;
  return new;
end;
$$;

create trigger reviews_protect_customer_fields_trg
  before update on reviews
  for each row execute function reviews_protect_customer_fields();

-- === ROW LEVEL SECURITY ====================================================

alter table restaurants enable row level security;
alter table platform_admins enable row level security;
alter table restaurant_users enable row level security;
alter table categories enable row level security;
alter table category_translations enable row level security;
alter table allergens enable row level security;
alter table dishes enable row level security;
alter table dish_translations enable row level security;
alter table dish_media enable row level security;
alter table dish_variants enable row level security;
alter table dish_allergens enable row level security;
alter table reviews enable row level security;
alter table qr_codes enable row level security;
alter table analytics_events enable row level security;

-- --- restaurants ------------------------------------------------------------

create policy restaurants_read on restaurants for select
  using (
    status = 'active'
    or has_restaurant_role(id, '{owner,staff}')
    or is_platform_admin()
  );

create policy restaurants_admin_insert on restaurants for insert
  with check (is_platform_admin());

create policy restaurants_update on restaurants for update
  using (has_restaurant_role(id, '{owner,staff}') or is_platform_admin());
  -- status y plan quedan protegidos ademas por restaurants_protect_admin_fields_trg

create policy restaurants_admin_delete on restaurants for delete
  using (is_platform_admin());

-- --- platform_admins ---------------------------------------------------------
-- Sin politica publica de lectura/escritura: solo se gestiona con la
-- service role key desde el panel NovaCore (bypassa RLS).

-- --- restaurant_users ---------------------------------------------------------

create policy restaurant_users_read on restaurant_users for select
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy restaurant_users_owner_insert on restaurant_users for insert
  with check (has_restaurant_role(restaurant_id, '{owner}') or is_platform_admin());

create policy restaurant_users_owner_update on restaurant_users for update
  using (has_restaurant_role(restaurant_id, '{owner}') or is_platform_admin());

create policy restaurant_users_owner_delete on restaurant_users for delete
  using (has_restaurant_role(restaurant_id, '{owner}') or is_platform_admin());
  -- El staff nunca puede gestionar usuarios, ni siquiera a si mismo.

-- --- categories -----------------------------------------------------------

create policy categories_read on categories for select
  using (
    exists (select 1 from restaurants r where r.id = restaurant_id and r.status = 'active')
    or has_restaurant_role(restaurant_id, '{owner,staff}')
    or is_platform_admin()
  );

create policy categories_staff_insert on categories for insert
  with check (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy categories_staff_update on categories for update
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy categories_admin_delete on categories for delete
  using (is_platform_admin());
  -- Owner/staff archivan sus platos y reordenan categorias, pero no borran
  -- una categoria de forma definitiva (confirmado: solo borrado logico).

create policy category_translations_read on category_translations for select
  using (
    exists (
      select 1 from categories c
      join restaurants r on r.id = c.restaurant_id
      where c.id = category_id
        and (r.status = 'active' or has_restaurant_role(c.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );

create policy category_translations_write on category_translations for all
  using (
    exists (
      select 1 from categories c
      where c.id = category_id
        and (has_restaurant_role(c.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );

-- --- allergens (catalogo global de NovaCore) -------------------------------

create policy allergens_public_read on allergens for select using (true);
create policy allergens_admin_write on allergens for all using (is_platform_admin());

-- --- dishes -----------------------------------------------------------------

create policy dishes_read on dishes for select
  using (
    (
      status in ('available', 'sold_out')
      and exists (select 1 from restaurants r where r.id = restaurant_id and r.status = 'active')
    )
    or has_restaurant_role(restaurant_id, '{owner,staff}')
    or is_platform_admin()
  );

create policy dishes_staff_insert on dishes for insert
  with check (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy dishes_staff_update on dishes for update
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy dishes_admin_delete on dishes for delete
  using (is_platform_admin());
  -- Borrado definitivo de un plato: exclusivo de NovaCore. Owner/staff usan
  -- status = 'archived'.

create policy dish_translations_read on dish_translations for select
  using (
    exists (
      select 1 from dishes d
      join restaurants r on r.id = d.restaurant_id
      where d.id = dish_id
        and (
          (d.status in ('available', 'sold_out') and r.status = 'active')
          or has_restaurant_role(d.restaurant_id, '{owner,staff}')
          or is_platform_admin()
        )
    )
  );

create policy dish_translations_write on dish_translations for all
  using (
    exists (
      select 1 from dishes d
      where d.id = dish_id
        and (has_restaurant_role(d.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );

create policy dish_media_read on dish_media for select
  using (
    exists (
      select 1 from dishes d
      join restaurants r on r.id = d.restaurant_id
      where d.id = dish_id
        and (
          (d.status in ('available', 'sold_out') and r.status = 'active')
          or has_restaurant_role(d.restaurant_id, '{owner,staff}')
          or is_platform_admin()
        )
    )
  );

create policy dish_media_write on dish_media for all
  using (
    exists (
      select 1 from dishes d
      where d.id = dish_id
        and (has_restaurant_role(d.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );
  -- Una foto individual de la galeria si se puede borrar directamente:
  -- no es "eliminar el plato", es sustituir contenido.

create policy dish_variants_read on dish_variants for select
  using (
    exists (
      select 1 from dishes d
      join restaurants r on r.id = d.restaurant_id
      where d.id = dish_id
        and (
          (d.status in ('available', 'sold_out') and r.status = 'active')
          or has_restaurant_role(d.restaurant_id, '{owner,staff}')
          or is_platform_admin()
        )
    )
  );

create policy dish_variants_write on dish_variants for all
  using (
    exists (
      select 1 from dishes d
      where d.id = dish_id
        and (has_restaurant_role(d.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );

create policy dish_allergens_read on dish_allergens for select
  using (
    exists (
      select 1 from dishes d
      join restaurants r on r.id = d.restaurant_id
      where d.id = dish_id
        and (
          (d.status in ('available', 'sold_out') and r.status = 'active')
          or has_restaurant_role(d.restaurant_id, '{owner,staff}')
          or is_platform_admin()
        )
    )
  );

create policy dish_allergens_write on dish_allergens for all
  using (
    exists (
      select 1 from dishes d
      where d.id = dish_id
        and (has_restaurant_role(d.restaurant_id, '{owner,staff}') or is_platform_admin())
    )
  );

-- --- reviews ------------------------------------------------------------------

create policy reviews_read on reviews for select
  using (
    status = 'approved'
    or has_restaurant_role(restaurant_id, '{owner,staff}')
    or is_platform_admin()
  );

create policy reviews_public_insert on reviews for insert
  with check (status = 'pending');
  -- Cualquiera (incluido anon) puede enviar una resena, siempre en pending.

create policy reviews_moderate_update on reviews for update
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());
  -- Solo status/owner_reply/owner_reply_at son editables de verdad:
  -- reviews_protect_customer_fields_trg revierte el resto.

create policy reviews_admin_delete on reviews for delete
  using (is_platform_admin());
  -- Owner/staff nunca borran una resena, ni siquiera las que ocultan.

-- --- qr_codes -------------------------------------------------------------

create policy qr_codes_read on qr_codes for select
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy qr_codes_staff_insert on qr_codes for insert
  with check (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy qr_codes_staff_update on qr_codes for update
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());

create policy qr_codes_admin_delete on qr_codes for delete
  using (is_platform_admin());
  -- Ver nota en el resumen de la Fase 1: pendiente confirmar si el
  -- propietario deberia poder desactivar/borrar sus propios QR sin admin.

-- --- analytics_events -------------------------------------------------------
-- Sin politica de insert: el registro de eventos se hace exclusivamente
-- desde un Route Handler con la service role key (bypassa RLS), nunca
-- desde el cliente con la anon key. Esto evita eventos falseados.

create policy analytics_events_read on analytics_events for select
  using (has_restaurant_role(restaurant_id, '{owner,staff}') or is_platform_admin());
