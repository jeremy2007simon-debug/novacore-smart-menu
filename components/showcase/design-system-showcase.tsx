"use client";

import { useCallback, useState } from "react";
import {
  Bell,
  ChevronDown,
  LogOut,
  Search as SearchIcon,
  Settings,
  UtensilsCrossed,
  User,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/ui/loader";
import { Modal } from "@/components/ui/modal";
import { Pagination } from "@/components/ui/pagination";
import { Rating } from "@/components/ui/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { showToast } from "@/components/ui/toast";
import { CategoryCard } from "@/components/shared/category-card";
import { DishCard } from "@/components/shared/dish-card";
import { QRCard } from "@/components/shared/qr-card";
import { SearchBar } from "@/components/shared/search-bar";
import type { DishBadge } from "@/lib/types/database";
import type { PresetId } from "@/lib/theme/types";

const DEMO_DISH = {
  name: "Risotto de setas y trufa",
  short_description: "Arroz carnaroli, setas de temporada, aceite de trufa negra y parmesano curado.",
  price_cents: 1850,
  status: "available" as const,
  badges: ["recommended", "on_offer"] as DishBadge[],
  avg_rating: 4.6,
  rating_count: 128,
};

const DEMO_QR = {
  label: "Mesa 7",
  type: "table" as const,
  table_number: 7,
  status: "active" as const,
  scan_count: 342,
};

const DEMO_CATEGORY = { name: "Entrantes", icon: null };

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-4 border-b border-border py-10">
      <div>
        <h2 className="font-display text-lg font-semibold text-foreground">{title}</h2>
        {description ? <p className="mt-1 text-sm text-muted-foreground">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function DesignSystemShowcase({ preset }: { preset: PresetId }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [ratingValue, setRatingValue] = useState(4);
  const [page, setPage] = useState(3);
  const [loadingDemo, setLoadingDemo] = useState(false);
  const [searchDemo, setSearchDemo] = useState("");
  const onSearch = useCallback((query: string) => setSearchDemo(query), []);

  return (
    <div className="mx-auto max-w-5xl px-6 pb-24">
      <Section
        title="Paleta activa"
        description={`Tokens de color resueltos para el preset "${preset}" en el modo actual.`}
      >
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-7">
          {[
            ["background", "bg-background border border-border"],
            ["surface", "bg-surface border border-border"],
            ["surface-raised", "bg-surface-raised border border-border"],
            ["primary", "bg-primary"],
            ["accent", "bg-accent"],
            ["success", "bg-success"],
            ["warning", "bg-warning"],
            ["danger", "bg-danger"],
          ].map(([name, cls]) => (
            <div key={name} className="flex flex-col gap-2">
              <div className={`h-14 rounded-md ${cls}`} />
              <span className="text-xs text-muted-foreground">{name}</span>
            </div>
          ))}
        </div>
      </Section>

      <Section title="Tipografía" description="font-display para títulos, font-body para el resto.">
        <div className="flex flex-col gap-2">
          <p className="font-display text-3xl font-semibold">Carta de Restaurante A</p>
          <p className="font-display text-xl font-semibold">Entrantes</p>
          <p className="text-base text-foreground">
            Texto de cuerpo normal — el que lee un cliente en la descripción de un plato.
          </p>
          <p className="text-sm text-muted-foreground">Texto secundario / metadatos.</p>
          <p className="font-mono text-sm text-faint-foreground">18,50 € · font-mono para cifras</p>
        </div>
      </Section>

      <Section title="Botones" description="Variantes y tamaños — todas comparten el mismo timing de hover.">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="primary">Primario</Button>
          <Button variant="secondary">Secundario</Button>
          <Button variant="outline">Outline</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="destructive">Destructivo</Button>
          <Button variant="link">Enlace</Button>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button size="sm">Pequeño</Button>
          <Button size="md">Mediano</Button>
          <Button size="lg">Grande</Button>
          <Button size="icon" aria-label="Ajustes">
            <Settings className="h-4 w-4" />
          </Button>
          <Button loading>Guardando</Button>
        </div>
      </Section>

      <Section title="Badges">
        <div className="flex flex-wrap gap-2">
          <Badge variant="neutral">Neutral</Badge>
          <Badge variant="primary">Primary</Badge>
          <Badge variant="accent">Accent</Badge>
          <Badge variant="success">Disponible</Badge>
          <Badge variant="warning">Agotado hoy</Badge>
          <Badge variant="danger">Oferta</Badge>
          <Badge variant="outline">Outline</Badge>
        </div>
      </Section>

      <Section title="Card">
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Horario de hoy</CardTitle>
            <CardDescription>Se actualiza automáticamente según la franja horaria.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-foreground">Comidas · 13:00–16:00</p>
          </CardContent>
          <CardFooter>
            <Button size="sm" variant="outline">
              Editar horario
            </Button>
          </CardFooter>
        </Card>
      </Section>

      <Section title="Avatar">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage src="" alt="" />
            <AvatarFallback>
              <User className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <Avatar>
            <AvatarFallback>MG</AvatarFallback>
          </Avatar>
        </div>
      </Section>

      <Section title="Input" description="Con Label accesible (Radix Label) asociado por htmlFor/id.">
        <div className="flex max-w-sm flex-col gap-2">
          <Label htmlFor="demo-input">Nombre del plato</Label>
          <Input id="demo-input" placeholder="Ej. Ensalada César" />
        </div>
      </Section>

      <Section title="SearchBar" description="Debounce de 300ms antes de llamar a onSearch.">
        <div className="flex max-w-md flex-col gap-2">
          <SearchBar onSearch={onSearch} />
          <p className="text-xs text-faint-foreground">Última búsqueda: {searchDemo || "—"}</p>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs defaultValue="info" className="max-w-md">
          <TabsList>
            <TabsTrigger value="info">Información</TabsTrigger>
            <TabsTrigger value="horario">Horario</TabsTrigger>
            <TabsTrigger value="redes">Redes</TabsTrigger>
          </TabsList>
          <TabsContent value="info">Datos generales del restaurante.</TabsContent>
          <TabsContent value="horario">Horario por día de la semana.</TabsContent>
          <TabsContent value="redes">Instagram, Facebook, TikTok.</TabsContent>
        </Tabs>
      </Section>

      <Section title="Tooltip">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="icon" aria-label="Notificaciones">
              <Bell className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>3 reseñas pendientes de moderar</TooltipContent>
        </Tooltip>
      </Section>

      <Section title="Dropdown">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary">
              Mi cuenta <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>propietario@restaurante.com</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Settings className="h-4 w-4" /> Ajustes
            </DropdownMenuItem>
            <DropdownMenuItem>
              <LogOut className="h-4 w-4" /> Cerrar sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="Dialog / Modal / Drawer" description="Los tres comparten el mismo overlay y foco (Radix Dialog).">
        <div className="flex flex-wrap gap-3">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">Abrir Dialog</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Archivar código QR</DialogTitle>
                <DialogDescription>
                  El QR de &ldquo;Mesa 7&rdquo; dejará de mostrarse en el listado activo. Podrás
                  recuperarlo desde el histórico.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button variant="destructive">Archivar</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>

          <Button variant="outline" onClick={() => setModalOpen(true)}>
            Abrir Modal
          </Button>
          <Modal
            open={modalOpen}
            onOpenChange={setModalOpen}
            title="Publicar cambios en la carta"
            description="Los clientes verán los precios actualizados de inmediato."
            footer={
              <>
                <Button variant="ghost" onClick={() => setModalOpen(false)}>
                  Seguir editando
                </Button>
                <Button onClick={() => setModalOpen(false)}>Publicar</Button>
              </>
            }
          />

          <Drawer>
            <DrawerTrigger asChild>
              <Button variant="outline">Abrir Drawer</Button>
            </DrawerTrigger>
            <DrawerContent>
              <DrawerHeader>
                <DrawerTitle>Filtrar carta</DrawerTitle>
                <DrawerDescription>Sin gluten, vegano, picante…</DrawerDescription>
              </DrawerHeader>
            </DrawerContent>
          </Drawer>
        </div>
      </Section>

      <Section title="Toast">
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => showToast.success("Plato guardado")}>
            Éxito
          </Button>
          <Button variant="outline" onClick={() => showToast.error("No se pudo subir la imagen")}>
            Error
          </Button>
          <Button variant="outline" onClick={() => showToast.info("3 reseñas nuevas por moderar")}>
            Info
          </Button>
        </div>
      </Section>

      <Section title="Skeleton / Loader">
        <div className="flex items-center gap-6">
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-28" />
          </div>
          <Loader label="Cargando platos" />
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              setLoadingDemo(true);
              setTimeout(() => setLoadingDemo(false), 1500);
            }}
          >
            {loadingDemo ? <Loader label="Guardando" /> : "Simular carga"}
          </Button>
        </div>
      </Section>

      <Section title="EmptyState">
        <EmptyState
          icon={UtensilsCrossed}
          title="Todavía no hay platos en esta categoría"
          description="Añade el primero desde el panel de propietario."
          action={<Button size="sm">Añadir plato</Button>}
        />
      </Section>

      <Section title="Pagination">
        <Pagination page={page} totalPages={9} onPageChange={setPage} />
      </Section>

      <Section title="Rating" description="Lectura y captura de valoración (misma pieza para las dos).">
        <div className="flex flex-col gap-4">
          <Rating value={4.5} count={128} />
          <Rating value={ratingValue} interactive onChange={setRatingValue} size="lg" />
        </div>
      </Section>

      <Section title="QRCard">
        <div className="max-w-xs">
          <QRCard qr={DEMO_QR} actions={<Button size="sm" variant="ghost">Archivar</Button>} />
        </div>
      </Section>

      <Section title="DishCard">
        <div className="max-w-xs">
          <DishCard dish={DEMO_DISH} currency="EUR" href="#" />
        </div>
      </Section>

      <Section title="CategoryCard">
        <div className="max-w-xs">
          <CategoryCard category={DEMO_CATEGORY} dishCount={12} href="#" active />
        </div>
      </Section>

      <Section title="Icono de búsqueda suelto" description="Confirma que lucide-react es la única librería de iconos usada en toda la app.">
        <SearchIcon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
      </Section>
    </div>
  );
}
