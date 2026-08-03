import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { RestaurantUserRole } from "@/lib/types/database";

/**
 * Estas dos funciones llaman a las funciones SQL `is_platform_admin` /
 * `has_restaurant_role` (ver supabase/migrations/..._functions_and_rls.sql)
 * con el cliente autenticado del usuario actual — el mismo criterio que ya
 * aplican las políticas RLS, para que un layout pueda decidir "no
 * autorizado" antes incluso de intentar leer datos.
 */

export async function isPlatformAdmin(): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("is_platform_admin", {});
  return !error && data === true;
}

export async function hasRestaurantRole(
  restaurantId: string,
  roles: RestaurantUserRole[],
): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("has_restaurant_role", {
    rid: restaurantId,
    roles,
  });
  return !error && data === true;
}
