import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { getOwnerMenu } from "@/features/dashboard/get-owner-menu";
import { CategoriasPageClient } from "@/components/dashboard/categorias-page-client";

export default async function CategoriasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const menu = await getOwnerMenu(restaurant.id);
  if (!menu) notFound();

  return <CategoriasPageClient restaurant={restaurant} initialCategories={menu.categories} />;
}
