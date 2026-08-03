import "server-only";

import { createClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/types/database";
import { publicEnv } from "@/lib/env";

/**
 * Cliente con la service role key: bypassa RLS por completo.
 *
 * Importar esto SOLO desde Route Handlers o Server Actions que ya hayan
 * verificado `is_platform_admin()` explícitamente (por ejemplo, el panel
 * NovaCore al crear/suspender un restaurante, o el endpoint de ingesta de
 * analítica). El paquete `server-only` hace que el build falle si este
 * archivo terminase importado, aunque sea indirectamente, desde código de
 * cliente.
 */
export function createSupabaseAdminClient() {
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "Falta SUPABASE_SERVICE_ROLE_KEY. Esta variable nunca debe tener el prefijo " +
        "NEXT_PUBLIC_ y solo se configura en el entorno del servidor.",
    );
  }

  return createClient<Database>(publicEnv.NEXT_PUBLIC_SUPABASE_URL, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
