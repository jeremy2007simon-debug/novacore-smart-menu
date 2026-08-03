import type { Category, Dish, Review, RestaurantUserRole } from "@/lib/types/database";

/**
 * Tipos e identificador compartidos entre los datos de demostración
 * curados a mano (lib/demo/note-di-caffe-demo.ts) y la carta completa
 * generada automáticamente (lib/demo/note-di-caffe-menu-data.ts, ver
 * scripts/generate-demo-panel-data.py). Viven aquí, separados de ambos,
 * para que el archivo generado pueda importarlos sin depender del
 * archivo hecho a mano (evita un ciclo de imports).
 */
export const DEMO_RESTAURANT_ID = "00000000-0000-0000-0000-000000000001";

export type DemoCategory = Category & { dish_count: number };

export type DemoDish = Dish & {
  category_name: string;
  image_url: string | null;
  gallery_urls?: string[];
  allergen_codes?: string[];
  needs_review?: boolean;
};

export type DemoReview = Review & { dish_name: string | null; reported?: boolean };

export type DemoActivityKind =
  | "name"
  | "price"
  | "description"
  | "status"
  | "category"
  | "order"
  | "badge"
  | "image"
  | "review"
  | "settings"
  | "theme"
  | "schedule";

export type DemoActivity = {
  id: string;
  kind: DemoActivityKind;
  actor: string;
  /** Verbo + complemento, sin el actor delante — se renderiza como `${actor} ${message}`. */
  message: string;
  created_at: string;
};

export type DemoTeamMemberStatus = "active" | "invited";

export type DemoTeamMember = {
  id: string;
  name: string;
  email: string;
  role: RestaurantUserRole;
  status: DemoTeamMemberStatus;
  created_at: string;
};
