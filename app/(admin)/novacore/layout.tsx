import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isPlatformAdmin } from "@/lib/auth/roles";

export default async function NovaCoreLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getClaims();
  if (!auth?.claims) redirect("/login?next=/novacore");

  const authorized = await isPlatformAdmin();
  if (!authorized) redirect("/login");

  return <>{children}</>;
}
