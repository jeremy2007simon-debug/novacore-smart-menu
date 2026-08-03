import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import type { Database } from "@/lib/types/database";
import { publicEnv } from "@/lib/env";

/**
 * Refresca la sesión de Supabase en cada request y devuelve las claims del
 * JWT ya verificadas (getClaims, no getSession/getUser: es la vía
 * recomendada por Supabase para establecer identidad de forma segura desde
 * un proxy). Se usa desde proxy.ts en la raíz del proyecto.
 */
export async function updateSession(request: NextRequest) {
  let response = NextResponse.next({ request });

  const supabase = createServerClient<Database>(
    publicEnv.NEXT_PUBLIC_SUPABASE_URL,
    publicEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookiesToSet) => {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const { data } = await supabase.auth.getClaims();

  return { response, claims: data?.claims ?? null };
}
