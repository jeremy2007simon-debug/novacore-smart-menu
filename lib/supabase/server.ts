import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import type { Database } from "@/lib/types/database";
import { publicEnv } from "@/lib/env";

/**
 * Cliente de Supabase para Server Components, Server Actions y Route
 * Handlers. Usa la anon key: la seguridad real la aplica RLS a través del
 * JWT del usuario, no este módulo. Crear uno nuevo en cada request — nunca
 * reutilizar la instancia entre peticiones.
 */
export async function createSupabaseServerClient() {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Se llamó desde un Server Component, que no puede escribir
            // cookies. El proxy (proxy.ts) ya refresca la sesión en cada
            // request, así que esto es seguro de ignorar aquí.
          }
        },
      },
    },
  );
}
