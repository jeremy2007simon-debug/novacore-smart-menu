import Image from "next/image";
import { Camera, MapPin, MessageCircle, Music2, Phone, Users } from "lucide-react";
import { Rating } from "@/components/ui/rating";
import { Badge } from "@/components/ui/badge";
import { ColorModeToggle } from "@/lib/theme/color-mode-toggle";
import { getOpenStatus } from "@/lib/utils/is-open-now";
import type { WeekSchedule } from "@/components/dashboard/schedule-editor";
import type { SocialLinks } from "@/components/dashboard/social-links-editor";
import type { Restaurant } from "@/lib/types/database";

const SOCIAL_ICON: Record<keyof SocialLinks, React.ElementType> = {
  instagram: Camera,
  facebook: Users,
  tiktok: Music2,
};

export function RestaurantHeader({ restaurant }: { restaurant: Restaurant }) {
  const schedule = restaurant.schedule as WeekSchedule;
  const social = restaurant.social_links as SocialLinks;
  const openStatus = getOpenStatus(schedule, restaurant.operating_status, restaurant.operating_status_message);
  const socialEntries = (Object.keys(SOCIAL_ICON) as (keyof SocialLinks)[]).filter((key) => social[key]);

  return (
    <header className="border-b border-border bg-surface">
      <div className="mx-auto flex max-w-3xl flex-col gap-4 px-6 py-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-4">
            {restaurant.logo_url ? (
              <Image
                src={restaurant.logo_url}
                alt=""
                width={64}
                height={64}
                className="h-16 w-16 shrink-0 rounded-full border border-border object-cover"
              />
            ) : null}
            <div>
              <h1 className="font-display text-2xl font-semibold text-foreground">{restaurant.name}</h1>
              {restaurant.external_rating !== null && restaurant.external_review_source ? (
                <div className="mt-1 flex items-center gap-2">
                  <Rating value={restaurant.external_rating} count={restaurant.external_rating_count ?? undefined} size="sm" />
                  <span className="text-xs text-faint-foreground">vía {restaurant.external_review_source}</span>
                </div>
              ) : null}
            </div>
          </div>
          <ColorModeToggle />
        </div>

        {restaurant.description ? <p className="text-sm text-muted-foreground">{restaurant.description}</p> : null}

        <Badge variant={openStatus.isOpen ? "success" : "neutral"} className="w-fit">
          {openStatus.label}
        </Badge>

        <div className="flex flex-col gap-1.5 text-sm text-muted-foreground">
          {restaurant.address ? (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{restaurant.address}</span>
            </div>
          ) : null}
          {restaurant.phone ? (
            <a href={`tel:${restaurant.phone}`} className="nova-transition flex items-center gap-2 hover:text-foreground">
              <Phone className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>{restaurant.phone}</span>
            </a>
          ) : null}
          {restaurant.whatsapp ? (
            <a
              href={`https://wa.me/${restaurant.whatsapp.replace(/[^0-9]/g, "")}`}
              target="_blank"
              rel="noreferrer"
              className="nova-transition flex items-center gap-2 hover:text-foreground"
            >
              <MessageCircle className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span>WhatsApp</span>
            </a>
          ) : null}
        </div>

        {socialEntries.length > 0 ? (
          <div className="flex items-center gap-3">
            {socialEntries.map((key) => {
              const Icon = SOCIAL_ICON[key];
              return (
                <a
                  key={key}
                  href={social[key]}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={key}
                  className="nova-transition text-muted-foreground hover:text-foreground"
                >
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </a>
              );
            })}
          </div>
        ) : null}
      </div>
    </header>
  );
}
