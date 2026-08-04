"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { RestaurantUserRole } from "@/lib/types/database";

async function isOwner(restaurantId: string): Promise<boolean> {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase.rpc("has_restaurant_role", { rid: restaurantId, roles: ["owner"] });
  return data === true;
}

/**
 * Invitar añade a alguien a `auth.users` (Admin API — no hay alta pública)
 * y luego lo enlaza al restaurante en `restaurant_users`, que sí respeta
 * RLS: si quien llama no es owner, ese segundo paso falla solo. La
 * comprobación de `isOwner` de aquí evita crear un usuario de `auth.users`
 * huérfano en ese caso.
 */
export async function inviteTeamMember(input: {
  restaurantId: string;
  email: string;
  role: RestaurantUserRole;
}): Promise<{ ok: true } | { ok: false; message: string }> {
  if (!(await isOwner(input.restaurantId))) {
    return { ok: false, message: "Solo un propietario puede invitar." };
  }

  const admin = createSupabaseAdminClient();
  let userId: string | undefined;

  const { data: invited, error: inviteError } = await admin.auth.admin.inviteUserByEmail(input.email);
  if (invited?.user) {
    userId = invited.user.id;
  } else if (inviteError) {
    const { data: existing } = await admin.auth.admin.listUsers();
    const match = existing?.users.find((u) => u.email?.toLowerCase() === input.email.toLowerCase());
    if (!match) {
      return { ok: false, message: inviteError.message };
    }
    userId = match.id;
  }

  if (!userId) {
    return { ok: false, message: "No se pudo invitar a este email." };
  }

  const supabase = await createSupabaseServerClient();
  const { error: insertError } = await supabase
    .from("restaurant_users")
    .insert({ restaurant_id: input.restaurantId, user_id: userId, role: input.role });
  if (insertError) {
    if (insertError.code === "23505") {
      return { ok: false, message: "Esta persona ya tiene acceso a este restaurante." };
    }
    return { ok: false, message: insertError.message };
  }
  return { ok: true };
}

export async function changeTeamMemberRole(
  restaurantId: string,
  userId: string,
  role: RestaurantUserRole,
): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("restaurant_users")
    .update({ role })
    .eq("restaurant_id", restaurantId)
    .eq("user_id", userId);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}

export async function removeTeamMember(restaurantId: string, userId: string): Promise<{ ok: boolean; message?: string }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("restaurant_users").delete().eq("restaurant_id", restaurantId).eq("user_id", userId);
  if (error) return { ok: false, message: error.message };
  return { ok: true };
}
