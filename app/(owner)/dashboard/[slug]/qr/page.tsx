import { notFound } from "next/navigation";
import { getOwnerRestaurant } from "@/features/dashboard/get-owner-restaurant";
import { getOwnerQrCodes } from "@/features/dashboard/get-owner-qr-codes";
import { QrPageClient } from "@/components/dashboard/qr-page-client";

export default async function QrPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const restaurant = await getOwnerRestaurant(slug);
  if (!restaurant) notFound();

  const qrCodes = await getOwnerQrCodes(restaurant.id);

  return <QrPageClient restaurant={restaurant} initialQrCodes={qrCodes} />;
}
