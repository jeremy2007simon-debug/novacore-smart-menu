-- Storage RLS para el bucket público 'public-assets' (logos, portadas de
-- restaurante, imágenes de plato). El bucket es público en lectura (lo sirve
-- Storage directamente sin pasar por RLS); solo el dueño/staff del
-- restaurante dueño de la carpeta (o un admin de la plataforma) puede
-- escribir. La ruta siempre empieza por `{restaurants|dishes}/{restaurant_id}/...`,
-- así que el id de restaurante se lee del segundo segmento de la carpeta.

create policy public_assets_owner_insert
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'public-assets'
  and (
    is_platform_admin()
    or has_restaurant_role((storage.foldername(name))[2]::uuid, array['owner', 'staff'])
  )
);

create policy public_assets_owner_update
on storage.objects for update
to authenticated
using (
  bucket_id = 'public-assets'
  and (
    is_platform_admin()
    or has_restaurant_role((storage.foldername(name))[2]::uuid, array['owner', 'staff'])
  )
);

create policy public_assets_owner_delete
on storage.objects for delete
to authenticated
using (
  bucket_id = 'public-assets'
  and (
    is_platform_admin()
    or has_restaurant_role((storage.foldername(name))[2]::uuid, array['owner', 'staff'])
  )
);
