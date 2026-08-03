"use client";

import Link from "next/link";
import { ExternalLink, Eye, LogOut, Menu, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ColorModeToggle } from "@/lib/theme/color-mode-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Topbar({
  restaurantName,
  slug,
  onOpenPreview,
  onOpenMobileNav,
}: {
  restaurantName: string;
  slug: string;
  onOpenPreview: () => void;
  onOpenMobileNav: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border bg-surface/90 px-4 py-3 backdrop-blur md:px-6">
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={onOpenMobileNav}
        aria-label="Abrir menú"
      >
        <Menu className="h-5 w-5" />
      </Button>

      <div className="min-w-0 flex-1">
        <p className="truncate font-display text-sm font-semibold text-foreground">{restaurantName}</p>
        <p className="truncate text-xs text-faint-foreground">novacoremenu.app/r/{slug}</p>
      </div>

      <Button variant="outline" size="sm" onClick={onOpenPreview}>
        <Eye className="h-4 w-4" />
        Vista previa
      </Button>

      <Button asChild variant="ghost" size="icon" aria-label="Ver carta pública">
        <Link href={`/r/${slug}`} target="_blank" rel="noreferrer">
          <ExternalLink className="h-4 w-4" />
        </Link>
      </Button>

      <ColorModeToggle />

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon" aria-label="Cuenta">
            <User className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem asChild>
            <Link href={`/dashboard/${slug}/ajustes`}>
              <Settings className="h-4 w-4" /> Ajustes del restaurante
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <form action="/auth/sign-out" method="post" className="contents">
              <button type="submit" className="flex w-full items-center gap-2">
                <LogOut className="h-4 w-4" /> Cerrar sesión
              </button>
            </form>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
