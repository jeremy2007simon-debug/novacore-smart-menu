import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { getOwnerMenu } from "@/features/dashboard/get-owner-menu";
import { PlatosPageClient } from "@/components/dashboard/platos-page-client";

export default async function PlatosPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const menu = await getOwnerMenu(restaurant.id);
  if (!menu) notFound();

  return (
    <PlatosPageClient restaurant={restaurant} initialDishes={menu.dishes} categories={menu.categories} allergens={menu.allergens} />
  );
}
