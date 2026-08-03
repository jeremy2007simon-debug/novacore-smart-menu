import { NextResponse, type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/proxy";

/**
 * En Next.js 16 el antiguo middleware.ts se llama proxy.ts (función
 * `proxy`, no `middleware`) y corre siempre en runtime Node.js.
 *
 * Esto NO es la frontera de seguridad — solo evita que un usuario sin
 * sesión llegue a ver la interfaz de /dashboard o /novacore. Quien decide
 * de verdad qué datos puede leer o escribir cada usuario es RLS en
 * Postgres, verificado de nuevo en cada layout/Server Action (ver
 * lib/auth/roles.ts), tal y como recomienda la propia documentación de
 * Next.js para Proxy + Server Functions.
 */
const PROTECTED_PREFIXES = ["/dashboard", "/novacore"];

export async function proxy(request: NextRequest) {
  const { response, claims } = await updateSession(request);
  const { pathname } = request.nextUrl;

  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (isProtected && !claims) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
