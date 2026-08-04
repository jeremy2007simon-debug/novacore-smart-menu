import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { getOwnerReviews } from "@/features/dashboard/get-owner-reviews";
import { ResenasPageClient } from "@/components/dashboard/resenas-page-client";

export default async function ResenasPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const reviews = await getOwnerReviews(restaurant.id);

  return <ResenasPageClient initialReviews={reviews} />;
}
