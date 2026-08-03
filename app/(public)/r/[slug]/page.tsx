import { notFound } from "next/navigation";
import { RestaurantHeader } from "@/components/public/restaurant-header";
import { MenuBrowser } from "@/components/public/menu-browser";
import { RestaurantFooter } from "@/components/public/restaurant-footer";
import { getPublicMenu } from "@/features/menu/get-public-menu";

type RestaurantPageProps = {
  params: Promise<{ slug: string }>;
};

export default async function RestaurantPublicPage({ params }: RestaurantPageProps) {
  const { slug } = await params;
  const menu = await getPublicMenu(slug);

  if (!menu) notFound();

  return (
    <main>
      <RestaurantHeader restaurant={menu.restaurant} />
      <MenuBrowser
        slug={slug}
        currency={menu.restaurant.currency}
        categories={menu.categories}
        dishes={menu.dishes}
        allergens={menu.allergens}
      />
      <RestaurantFooter restaurant={menu.restaurant} reviews={menu.reviews} />
    </main>
  );
}
