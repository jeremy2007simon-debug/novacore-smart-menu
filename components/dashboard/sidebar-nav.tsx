"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Layers,
  UtensilsCrossed,
  Star,
  QrCode,
  Palette,
  Settings,
  History,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { href: "", label: "Resumen", icon: LayoutDashboard },
  { href: "/platos", label: "Platos", icon: UtensilsCrossed },
  { href: "/categorias", label: "Categorías", icon: Layers },
  { href: "/resenas", label: "Reseñas", icon: Star },
  { href: "/qr", label: "Códigos QR", icon: QrCode },
  { href: "/apariencia", label: "Apariencia", icon: Palette },
  { href: "/actividad", label: "Actividad", icon: History },
  { href: "/ajustes", label: "Ajustes", icon: Settings },
] as const;

export function SidebarNav({ slug }: { slug: string }) {
  const pathname = usePathname();
  const base = `/dashboard/${slug}`;

  return (
    <nav aria-label="Panel del propietario" className="flex flex-col gap-1 p-3">
      {NAV_ITEMS.map((item) => {
        const href = `${base}${item.href}`;
        const active = item.href === "" ? pathname === base : pathname.startsWith(href);
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={href}
            aria-current={active ? "page" : undefined}
            className={cn(
              "nova-transition flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium",
              active
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-surface-raised hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" aria-hidden="true" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
