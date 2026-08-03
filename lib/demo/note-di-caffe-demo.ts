import type {
  Category,
  Dish,
  QrCode,
  Restaurant,
  Review,
} from "@/lib/types/database";

/**
 * Datos de demostración para diseñar el panel del propietario ANTES de
 * conectarlo a Supabase (decisión explícita: revisar la experiencia con
 * datos de mentira, sin tocar la base de datos todavía).
 *
 * Los platos/categorías/precios son un subconjunto real, curado a mano,
 * de la carta que ya importamos en
 * supabase/demo-data/note-di-caffe-menu.json — no son inventados, pero
 * esta vez sí se han elegido a propósito los estados (disponible,
 * agotado, oculto, archivado) para poder enseñar el panel completo.
 *
 * Las reseñas sí son contenido de relleno explícitamente genérico
 * (nunca se ha dicho que sean reseñas reales de clientes).
 */

export const demoRestaurant: Restaurant = {
  id: "00000000-0000-0000-0000-000000000001",
  slug: "note-di-caffe",
  name: "Note di Caffé",
  logo_url: null,
  cover_url: null,
  description: "Cafetería, bar y restaurante italiano con pizzería y comida para llevar en Los Abrigos, Tenerife.",
  phone: "+34 922 839 233",
  whatsapp: null,
  address: "Calle La Marina Nº9, 38618 Los Abrigos, Santa Cruz de Tenerife, España",
  geo_lat: null,
  geo_lng: null,
  social_links: {},
  schedule: {
    monday: { open: "07:00", close: "23:00" },
    tuesday: { open: "07:00", close: "23:00" },
    wednesday: { open: "07:00", close: "23:00" },
    thursday: { open: "07:00", close: "23:00" },
    friday: { open: "07:00", close: "23:00" },
    saturday: { open: "07:00", close: "23:00" },
    sunday: { open: "07:00", close: "23:00" },
  },
  theme: { preset: "mediterraneo", colorMode: "system" },
  currency: "EUR",
  default_locale: "es",
  supported_locales: ["es"],
  allergen_policy: null,
  status: "active",
  plan: "starter",
  operating_status: "open",
  operating_status_message: null,
  operating_status_until: null,
  seo_title: null,
  seo_description: null,
  external_rating: 4.1,
  external_rating_count: 782,
  external_review_source: "Google",
  created_at: "2026-08-03T00:00:00Z",
};

export type DemoCategory = Category & { dish_count: number };

export const demoCategories: DemoCategory[] = [
  { id: "c1", restaurant_id: demoRestaurant.id, name: "Cafetería", icon: null, sort_order: 0, available_from: null, available_to: null, available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 6 },
  { id: "c2", restaurant_id: demoRestaurant.id, name: "Crepes Salados", icon: null, sort_order: 1, available_from: null, available_to: null, available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 4 },
  { id: "c3", restaurant_id: demoRestaurant.id, name: "Ensaladas y Platos Fríos", icon: null, sort_order: 2, available_from: null, available_to: null, available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 7 },
  { id: "c4", restaurant_id: demoRestaurant.id, name: "Pizzas", icon: null, sort_order: 3, available_from: null, available_to: null, available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 15 },
  { id: "c5", restaurant_id: demoRestaurant.id, name: "Platos Calientes", icon: null, sort_order: 4, available_from: "13:00", available_to: "16:00", available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 7 },
  { id: "c6", restaurant_id: demoRestaurant.id, name: "Hamburguesas", icon: null, sort_order: 5, available_from: null, available_to: null, available_days: null, created_at: "2026-08-03T00:00:00Z", dish_count: 5 },
];

export type DemoDish = Dish & {
  category_name: string;
  image_url: string | null;
  gallery_urls?: string[];
  allergen_codes?: string[];
  needs_review?: boolean;
};

export const demoDishes: DemoDish[] = [
  { id: "d1", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Americano", short_description: null, description: null, ingredients: [], spice_level: null, nutritional_info: null, price_cents: 140, status: "available", badges: [], avg_rating: 0, rating_count: 0, sort_order: 0, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d2", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Cappuccino", short_description: null, description: null, ingredients: [], spice_level: null, nutritional_info: null, price_cents: 160, status: "available", badges: ["bestseller"], avg_rating: 4.8, rating_count: 34, sort_order: 1, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d3", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Barraquito", short_description: null, description: null, ingredients: [], spice_level: null, nutritional_info: null, price_cents: 170, status: "available", badges: ["recommended"], avg_rating: 4.9, rating_count: 51, sort_order: 2, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d4", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Goloso", short_description: "Brandy, chocolate y nata", description: null, ingredients: ["Brandy", "Chocolate", "Nata"], spice_level: null, nutritional_info: null, price_cents: 550, status: "available", badges: [], avg_rating: 0, rating_count: 0, sort_order: 3, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d5", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Lubumba", short_description: "Leche condensada, café, chocolate y nata", description: null, ingredients: ["Leche condensada", "Café", "Chocolate", "Nata"], spice_level: null, nutritional_info: null, price_cents: 550, status: "hidden", badges: [], avg_rating: 0, rating_count: 0, sort_order: 4, created_at: "2026-08-03T00:00:00Z", image_url: null, needs_review: true },
  { id: "d6", restaurant_id: demoRestaurant.id, category_id: "c1", category_name: "Cafetería", name: "Irish Coffee", short_description: null, description: null, ingredients: [], spice_level: null, nutritional_info: null, price_cents: 310, status: "hidden", badges: [], avg_rating: 0, rating_count: 0, sort_order: 5, created_at: "2026-08-03T00:00:00Z", image_url: null },

  { id: "d7", restaurant_id: demoRestaurant.id, category_id: "c2", category_name: "Crepes Salados", name: "Jamón y Queso", short_description: null, description: null, ingredients: ["Jamón", "Queso"], spice_level: null, nutritional_info: null, price_cents: 650, status: "available", badges: [], avg_rating: 4.5, rating_count: 12, sort_order: 0, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d8", restaurant_id: demoRestaurant.id, category_id: "c2", category_name: "Crepes Salados", name: "Serrano y Queso", short_description: null, description: null, ingredients: ["Jamón Serrano", "Queso"], spice_level: null, nutritional_info: null, price_cents: 740, status: "available", badges: [], avg_rating: 4.6, rating_count: 8, sort_order: 1, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d9", restaurant_id: demoRestaurant.id, category_id: "c2", category_name: "Crepes Salados", name: "Salmón y Brie", short_description: null, description: null, ingredients: ["Salmón", "Brie"], spice_level: null, nutritional_info: null, price_cents: 930, status: "sold_out", badges: ["recommended"], avg_rating: 4.9, rating_count: 22, sort_order: 2, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d10", restaurant_id: demoRestaurant.id, category_id: "c2", category_name: "Crepes Salados", name: "Note di Caffè", short_description: "Pollo, mozzarella, ensalada", description: null, ingredients: ["Pollo", "Mozzarella", "Ensalada"], spice_level: null, nutritional_info: null, price_cents: 930, status: "available", badges: [], avg_rating: 0, rating_count: 0, sort_order: 3, created_at: "2026-08-03T00:00:00Z", image_url: null },

  { id: "d11", restaurant_id: demoRestaurant.id, category_id: "c3", category_name: "Ensaladas y Platos Fríos", name: "Ensalada de Quinoa", short_description: "Quinoa, lechuga, tomate, zanahoria, pepino, muesli con vinagre balsámico", description: null, ingredients: ["Quinoa", "Lechuga", "Tomate", "Zanahoria", "Pepino", "Muesli"], spice_level: null, nutritional_info: null, price_cents: 990, status: "available", badges: ["new"], avg_rating: 4.4, rating_count: 6, sort_order: 0, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d12", restaurant_id: demoRestaurant.id, category_id: "c3", category_name: "Ensaladas y Platos Fríos", name: "Ensalada de Atún", short_description: "Lechuga, tomate, atún, cebolla, aceitunas", description: null, ingredients: ["Lechuga", "Tomate", "Atún", "Cebolla", "Aceitunas"], spice_level: null, nutritional_info: null, price_cents: 990, status: "available", badges: [], avg_rating: 4.3, rating_count: 19, sort_order: 1, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d13", restaurant_id: demoRestaurant.id, category_id: "c3", category_name: "Ensaladas y Platos Fríos", name: "Carpaccio de Bresaola", short_description: "Bresaola, rúcula, tomates cherry, miel, salsa de limón", description: null, ingredients: ["Bresaola", "Rúcula", "Tomates cherry", "Miel"], spice_level: null, nutritional_info: null, price_cents: 1090, status: "available", badges: ["recommended"], avg_rating: 4.9, rating_count: 41, sort_order: 2, created_at: "2026-08-03T00:00:00Z", image_url: null },

  { id: "d14", restaurant_id: demoRestaurant.id, category_id: "c4", category_name: "Pizzas", name: "Margherita", short_description: "Tomate, mozzarella", description: null, ingredients: ["Tomate", "Mozzarella"], spice_level: null, nutritional_info: null, price_cents: 1090, status: "available", badges: ["bestseller"], avg_rating: 4.7, rating_count: 96, sort_order: 0, created_at: "2026-08-03T00:00:00Z", image_url: null, allergen_codes: ["gluten", "milk"] },
  { id: "d15", restaurant_id: demoRestaurant.id, category_id: "c4", category_name: "Pizzas", name: "Diavola", short_description: "Tomate, mozzarella, salchichón picante", description: null, ingredients: ["Tomate", "Mozzarella", "Salchichón picante"], spice_level: 2, nutritional_info: null, price_cents: 1250, status: "available", badges: ["on_offer"], avg_rating: 4.5, rating_count: 28, sort_order: 1, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d16", restaurant_id: demoRestaurant.id, category_id: "c4", category_name: "Pizzas", name: "4 Quesos", short_description: "Tomate, mozzarella, edam, parmesano, roquefort", description: null, ingredients: ["Tomate", "Mozzarella", "Edam", "Parmesano", "Roquefort"], spice_level: null, nutritional_info: null, price_cents: 1250, status: "available", badges: [], avg_rating: 4.6, rating_count: 14, sort_order: 2, created_at: "2026-08-03T00:00:00Z", image_url: null, allergen_codes: ["gluten", "milk"] },
  { id: "d17", restaurant_id: demoRestaurant.id, category_id: "c4", category_name: "Pizzas", name: "Strachino", short_description: "Tomate, mozzarella, strachino, jamón, rúcula", description: null, ingredients: ["Tomate", "Mozzarella", "Strachino", "Jamón", "Rúcula"], spice_level: null, nutritional_info: null, price_cents: 890, status: "hidden", badges: [], avg_rating: 0, rating_count: 0, sort_order: 3, created_at: "2026-08-03T00:00:00Z", image_url: null, needs_review: true },
  { id: "d18", restaurant_id: demoRestaurant.id, category_id: "c4", category_name: "Pizzas", name: "Vegetal (receta antigua)", short_description: "Verduras salteadas variadas", description: null, ingredients: ["Verduras salteadas"], spice_level: null, nutritional_info: null, price_cents: 1090, status: "archived", badges: [], avg_rating: 4.1, rating_count: 9, sort_order: 4, created_at: "2026-08-03T00:00:00Z", image_url: null },

  { id: "d19", restaurant_id: demoRestaurant.id, category_id: "c6", category_name: "Hamburguesas", name: "200gr. de Carne", short_description: "Lechuga, tomate, queso", description: null, ingredients: ["Carne 200gr", "Lechuga", "Tomate", "Queso"], spice_level: null, nutritional_info: null, price_cents: 720, status: "available", badges: [], avg_rating: 4.5, rating_count: 33, sort_order: 0, created_at: "2026-08-03T00:00:00Z", image_url: null },
  { id: "d20", restaurant_id: demoRestaurant.id, category_id: "c6", category_name: "Hamburguesas", name: "Hamburguesa Americana", short_description: null, description: null, ingredients: [], spice_level: null, nutritional_info: null, price_cents: 890, status: "sold_out", badges: ["bestseller"], avg_rating: 4.8, rating_count: 47, sort_order: 1, created_at: "2026-08-03T00:00:00Z", image_url: null },
];

export type DemoReview = Review & { dish_name: string | null; reported?: boolean };

export const demoReviews: DemoReview[] = [
  {
    id: "r1",
    restaurant_id: demoRestaurant.id,
    target_type: "dish",
    dish_id: "d3",
    dish_name: "Barraquito",
    author_name: "Cliente demo 1",
    rating: 5,
    comment: "El mejor barraquito que he probado en Tenerife, repetiré seguro.",
    photo_url: null,
    status: "pending",
    owner_reply: null,
    owner_reply_at: null,
    anonymous_device_id: null,
    created_at: "2026-08-02T18:30:00Z",
  },
  {
    id: "r2",
    restaurant_id: demoRestaurant.id,
    target_type: "restaurant",
    dish_id: null,
    dish_name: null,
    author_name: "Cliente demo 2",
    rating: 4,
    comment: "Muy buena relación calidad-precio, el servicio un poco lento en hora punta.",
    photo_url: null,
    status: "pending",
    owner_reply: null,
    owner_reply_at: null,
    anonymous_device_id: null,
    created_at: "2026-08-02T12:10:00Z",
  },
  {
    id: "r3",
    restaurant_id: demoRestaurant.id,
    target_type: "dish",
    dish_id: "d14",
    dish_name: "Margherita",
    author_name: "Cliente demo 3",
    rating: 5,
    comment: "Masa fina y muy buen sabor, la recomiendo.",
    photo_url: null,
    status: "approved",
    owner_reply: "¡Gracias! Nos alegra mucho que te haya gustado.",
    owner_reply_at: "2026-07-30T09:00:00Z",
    anonymous_device_id: null,
    created_at: "2026-07-29T20:00:00Z",
  },
  {
    id: "r4",
    restaurant_id: demoRestaurant.id,
    target_type: "dish",
    dish_id: "d20",
    dish_name: "Hamburguesa Americana",
    author_name: "Cliente demo 4",
    rating: 2,
    comment: "Llegó fría, esperaba más por el precio.",
    photo_url: null,
    status: "hidden",
    owner_reply: null,
    owner_reply_at: null,
    anonymous_device_id: null,
    created_at: "2026-07-25T21:00:00Z",
  },
];

export const demoQrCodes: QrCode[] = [
  { id: "q1", restaurant_id: demoRestaurant.id, label: "Carta general", type: "menu", table_number: null, status: "active", scan_count: 512, created_at: "2026-06-01T00:00:00Z" },
  { id: "q2", restaurant_id: demoRestaurant.id, label: "Mesa 1", type: "table", table_number: 1, status: "active", scan_count: 84, created_at: "2026-06-01T00:00:00Z" },
  { id: "q3", restaurant_id: demoRestaurant.id, label: "Mesa 2", type: "table", table_number: 2, status: "active", scan_count: 76, created_at: "2026-06-01T00:00:00Z" },
  { id: "q4", restaurant_id: demoRestaurant.id, label: "Mesa 3", type: "table", table_number: 3, status: "active", scan_count: 41, created_at: "2026-06-01T00:00:00Z" },
  { id: "q5", restaurant_id: demoRestaurant.id, label: "Terraza 1 (antigua)", type: "table", table_number: 9, status: "archived", scan_count: 12, created_at: "2026-01-15T00:00:00Z" },
];

export type DemoActivityKind = "price" | "status" | "badge" | "review" | "category" | "settings";

export type DemoActivity = {
  id: string;
  kind: DemoActivityKind;
  message: string;
  created_at: string;
};

/**
 * Registro de actividad de relleno para el "feed" del Resumen: son ejemplos
 * de acciones plausibles sobre los platos/categorías/reseñas ya existentes,
 * no hechos reales (igual que las reseñas de demostración).
 */
export const demoActivity: DemoActivity[] = [
  { id: "act1", kind: "status", message: "Marcaste «Vegetal (receta antigua)» como archivado", created_at: "2026-08-02T21:10:00Z" },
  { id: "act2", kind: "price", message: "Cambiaste el precio de «Diavola» a 12,50 €", created_at: "2026-08-02T18:40:00Z" },
  { id: "act3", kind: "status", message: "Ocultaste «Irish Coffee»", created_at: "2026-08-02T09:15:00Z" },
  { id: "act4", kind: "badge", message: "Añadiste la etiqueta Nuevo a «Ensalada de Quinoa»", created_at: "2026-08-01T20:05:00Z" },
  { id: "act5", kind: "review", message: "Respondiste a la reseña de Cliente demo 3", created_at: "2026-07-30T09:00:00Z" },
  { id: "act6", kind: "category", message: "Actualizaste el horario de la categoría Platos Calientes", created_at: "2026-07-29T17:30:00Z" },
];

export const demoAllergens: { id: string; code: string; icon_key: string; name_es: string; name_en: string }[] = [
  { id: "a1", code: "gluten", icon_key: "gluten", name_es: "Cereales con gluten", name_en: "Cereals containing gluten" },
  { id: "a2", code: "crustaceans", icon_key: "crustaceans", name_es: "Crustáceos", name_en: "Crustaceans" },
  { id: "a3", code: "eggs", icon_key: "eggs", name_es: "Huevos", name_en: "Eggs" },
  { id: "a4", code: "fish", icon_key: "fish", name_es: "Pescado", name_en: "Fish" },
  { id: "a5", code: "peanuts", icon_key: "peanuts", name_es: "Cacahuetes", name_en: "Peanuts" },
  { id: "a6", code: "soybeans", icon_key: "soybeans", name_es: "Soja", name_en: "Soybeans" },
  { id: "a7", code: "milk", icon_key: "milk", name_es: "Leche (incl. lactosa)", name_en: "Milk" },
  { id: "a8", code: "nuts", icon_key: "nuts", name_es: "Frutos de cáscara", name_en: "Tree nuts" },
  { id: "a9", code: "celery", icon_key: "celery", name_es: "Apio", name_en: "Celery" },
  { id: "a10", code: "mustard", icon_key: "mustard", name_es: "Mostaza", name_en: "Mustard" },
  { id: "a11", code: "sesame", icon_key: "sesame", name_es: "Granos de sésamo", name_en: "Sesame seeds" },
  { id: "a12", code: "sulphites", icon_key: "sulphites", name_es: "Dióxido de azufre y sulfitos", name_en: "Sulphur dioxide" },
  { id: "a13", code: "lupin", icon_key: "lupin", name_es: "Altramuces", name_en: "Lupin" },
  { id: "a14", code: "molluscs", icon_key: "molluscs", name_es: "Moluscos", name_en: "Molluscs" },
];
