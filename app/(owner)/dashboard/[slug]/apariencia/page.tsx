import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { AparienciaPageClient } from "@/components/dashboard/apariencia-page-client";

export default async function AparienciaPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  return <AparienciaPageClient restaurant={restaurant} />;
}
