import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { hasRestaurantRole } from "@/lib/auth/roles";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

type OwnerDashboardLayoutProps = {
  children: React.ReactNode;
  params: Promise<{ slug: string }>;
};

/**
 * Guarda de acceso del panel de un restaurante concreto. RLS ya impediría
 * leer datos ajenos, pero comprobamos el rol aquí explícitamente (como
 * recomienda la propia documentación de Next.js para Proxy + Server
 * Functions) para poder devolver un 404 — nunca confirmamos si el
 * restaurante existe a alguien sin acceso a él.
 */
export default async function OwnerDashboardLayout({
  children,
  params,
}: OwnerDashboardLayoutProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect(`/login?next=/dashboard/${slug}`);

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("id, name")
    .eq("slug", slug)
    .maybeSingle();

  if (!restaurant) notFound();

  const authorized = await hasRestaurantRole(restaurant.id, ["owner", "staff"]);
  if (!authorized) notFound();

  return (
    <DashboardShell slug={slug} restaurantName={restaurant.name}>
      {children}
    </DashboardShell>
  );
}
