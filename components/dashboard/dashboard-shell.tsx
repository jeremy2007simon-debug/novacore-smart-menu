"use client";

import { useState } from "react";
import { SidebarNav } from "./sidebar-nav";
import { Topbar } from "./topbar";
import { LivePreviewDrawer } from "./live-preview-drawer";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { demoCategories, demoDishes, demoRestaurant } from "@/lib/demo/note-di-caffe-demo";

export function DashboardShell({
  slug,
  restaurantName,
  children,
}: {
  slug: string;
  restaurantName: string;
  children: React.ReactNode;
}) {
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <aside className="hidden w-60 shrink-0 border-r border-border bg-surface md:block">
        <div className="border-b border-border p-4">
          <p className="font-display text-sm font-semibold">NovaCore</p>
          <p className="text-xs text-faint-foreground">Panel del propietario</p>
        </div>
        <SidebarNav slug={slug} />
      </aside>

      <Drawer open={mobileNavOpen} onOpenChange={setMobileNavOpen}>
        <DrawerContent className="max-w-64 p-0">
          <div className="border-b border-border p-4">
            <p className="font-display text-sm font-semibold">NovaCore</p>
            <p className="text-xs text-faint-foreground">Panel del propietario</p>
          </div>
          <SidebarNav slug={slug} />
        </DrawerContent>
      </Drawer>

      <div className="flex min-w-0 flex-1 flex-col">
        <Topbar
          restaurantName={restaurantName}
          slug={slug}
          onOpenPreview={() => setPreviewOpen(true)}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="flex-1 p-4 md:p-8">{children}</main>
      </div>

      <LivePreviewDrawer
        open={previewOpen}
        onOpenChange={setPreviewOpen}
        restaurant={demoRestaurant}
        categories={demoCategories}
        dishes={demoDishes}
      />
    </div>
  );
}
