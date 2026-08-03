import type { QrCode, Restaurant } from "@/lib/types/database";
import { DEMO_RESTAURANT_ID } from "@/lib/demo/types";
import type {
  DemoActivity,
  DemoActivityKind,
  DemoCategory,
  DemoDish,
  DemoReview,
  DemoTeamMember,
} from "@/lib/demo/types";
import { demoCategories, demoDishes } from "@/lib/demo/note-di-caffe-menu-data";
export type { DemoActivity, DemoActivityKind, DemoCategory, DemoDish, DemoReview, DemoTeamMember };
export { demoCategories, demoDishes };

/**
 * Datos de demostración para el panel del propietario y la carta pública,
 * ANTES de conectarlos a Supabase (decisión explícita: revisar la
 * experiencia con datos de mentira, sin tocar la base de datos todavía).
 *
 * Las categorías y platos son la carta REAL completa de Note di Caffé
 * (25 categorías, 157 platos), generada automáticamente por
 * scripts/generate-demo-panel-data.py a partir de
 * supabase/demo-data/note-di-caffe-menu.json — la misma fuente que
 * alimenta el seed SQL, así que panel y base de datos real coincidirán.
 * Este archivo solo reexporta ese resultado (ver más abajo) para no
 * cambiar la ruta de import que usa el resto del proyecto.
 *
 * Las reseñas sí son contenido de relleno explícitamente genérico
 * (nunca se ha dicho que sean reseñas reales de clientes).
 */

export const demoRestaurant: Restaurant = {
  id: DEMO_RESTAURANT_ID,
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

export const demoReviews: DemoReview[] = [
  {
    id: "r1",
    restaurant_id: demoRestaurant.id,
    target_type: "dish",
    dish_id: "d7",
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
    dish_id: "d100",
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
    dish_id: "d84",
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

/** Persona que realiza las acciones en esta sesión de demostración. */
export const CURRENT_ACTOR = "Jeremy";

/**
 * Equipo de relleno explícitamente genérico (igual que las reseñas y la
 * actividad de demostración) — no son empleados reales de Note di Caffé.
 * Refleja la tabla real `restaurant_users` (roles "owner"/"staff"), a la
 * espera de que haya invitaciones reales por email con Supabase Auth.
 */
export const demoTeamMembers: DemoTeamMember[] = [
  { id: "m1", name: CURRENT_ACTOR, email: "jeremy@notedicaffe.example", role: "owner", status: "active", created_at: "2026-01-10T00:00:00Z" },
  { id: "m2", name: "Marta Sánchez", email: "marta@notedicaffe.example", role: "staff", status: "active", created_at: "2026-03-02T00:00:00Z" },
  { id: "m3", name: "Carlos Pérez", email: "carlos@notedicaffe.example", role: "staff", status: "invited", created_at: "2026-08-01T00:00:00Z" },
];

/**
 * Registro de actividad de relleno para el "feed" del Resumen: son ejemplos
 * de acciones plausibles sobre los platos/categorías/reseñas ya existentes,
 * no hechos reales (igual que las reseñas de demostración). El historial
 * real, generado por tus propias ediciones, se añade por delante desde
 * `lib/activity/activity-context.tsx`.
 */
export const demoActivity: DemoActivity[] = [
  { id: "act1", kind: "status", actor: CURRENT_ACTOR, message: "marcó «Vegetal» como archivado", created_at: "2026-08-02T21:10:00Z" },
  { id: "act2", kind: "price", actor: CURRENT_ACTOR, message: "cambió el precio de «Diavola» a 12,50 €", created_at: "2026-08-02T18:40:00Z" },
  { id: "act3", kind: "status", actor: "Staff", message: "ocultó «Irish coffee»", created_at: "2026-08-02T09:15:00Z" },
  { id: "act4", kind: "badge", actor: CURRENT_ACTOR, message: "añadió la etiqueta Nuevo a «Carpaccio de Bresaola»", created_at: "2026-08-01T20:05:00Z" },
  { id: "act5", kind: "review", actor: CURRENT_ACTOR, message: "respondió a la reseña de Cliente demo 3", created_at: "2026-07-30T09:00:00Z" },
  { id: "act6", kind: "category", actor: "Staff", message: "actualizó el horario de la categoría Platos Calientes", created_at: "2026-07-29T17:30:00Z" },
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
