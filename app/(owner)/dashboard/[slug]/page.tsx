import { notFound } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type OwnerDashboardPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function OwnerDashboardPage({ params }: OwnerDashboardPageProps) {
  const { slug } = await params;
  const supabase = await createSupabaseServerClient();

  const { data: restaurant } = await supabase
    .from("restaurants")
    .select("name, status, plan")
    .eq("slug", slug)
    .maybeSingle();

  if (!restaurant) notFound();

  return (
    <main className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-xl font-semibold text-neutral-900">{restaurant.name}</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Estado: {restaurant.status} · Plan: {restaurant.plan}
      </p>
      <p className="mt-8 text-sm text-neutral-400">
        Platos, categorías, reseñas, generador de QR y ajustes del restaurante se implementan en
        los siguientes bloques del plan de la Fase 1.
      </p>
    </main>
  );
}
