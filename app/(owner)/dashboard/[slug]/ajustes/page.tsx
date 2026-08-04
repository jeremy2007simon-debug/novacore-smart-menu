import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { getOwnerTeam } from "@/features/dashboard/get-owner-team";
import { AjustesPageClient } from "@/components/dashboard/ajustes-page-client";

export default async function AjustesPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const team = await getOwnerTeam(restaurant.id);

  return <AjustesPageClient restaurant={restaurant} initialTeam={team} />;
}
