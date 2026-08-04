import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { DemoTeamMember } from "@/lib/demo/types";

/**
 * `restaurant_users` solo guarda `user_id` — el nombre/email vive en
 * `auth.users`, no expuesto por PostgREST. RLS ya filtra qué filas de
 * `restaurant_users` puede ver quien llama (owner/staff del propio
 * restaurante, o admin de plataforma); esta función solo completa esas
 * filas ya autorizadas con el email real vía la Admin API.
 */
export const getOwnerTeam = cache(async (restaurantId: string): Promise<DemoTeamMember[]> => {
  const supabase = await createSupabaseServerClient();
  const { data: rows } = await supabase
    .from("restaurant_users")
    .select("user_id, role, created_at")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });

  if (!rows || rows.length === 0) return [];

  const admin = createSupabaseAdminClient();
  return Promise.all(
    rows.map(async (row): Promise<DemoTeamMember> => {
      const { data } = await admin.auth.admin.getUserById(row.user_id);
      const email = data.user?.email ?? "";
      return {
        id: row.user_id,
        name: email ? email.split("@")[0] : "Usuario",
        email,
        role: row.role,
        status: data.user?.email_confirmed_at ? "active" : "invited",
        created_at: row.created_at,
      };
    }),
  );
});
