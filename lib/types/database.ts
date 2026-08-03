/**
 * Hand-authored mirror of the Supabase generated types, shaped exactly like
 * `supabase gen types typescript` output. Once a live Supabase project exists,
 * regenerate this file with the Supabase CLI and this module keeps working
 * unchanged — every other file imports the `Restaurant` / `Dish` / ... aliases
 * below, never `Database` directly.
 */

export type RestaurantStatus = "active" | "suspended";
export type RestaurantPlan = "starter" | "pro" | "enterprise";
export type RestaurantOperatingStatus = "open" | "temporarily_closed" | "vacation";
export type RestaurantUserRole = "owner" | "staff";
export type DishStatus = "available" | "sold_out" | "hidden" | "archived";
export type DishBadge = "recommended" | "bestseller" | "new" | "on_offer";
export type ReviewTargetType = "dish" | "restaurant";
export type ReviewStatus = "pending" | "approved" | "hidden";
export type QrType = "menu" | "table";
export type QrCodeStatus = "active" | "archived";
export type PromotionDiscountType = "percentage" | "fixed_amount";

export type Database = {
  public: {
    Tables: {
      restaurants: {
        Row: {
          id: string;
          slug: string;
          name: string;
          logo_url: string | null;
          cover_url: string | null;
          description: string | null;
          phone: string | null;
          whatsapp: string | null;
          address: string | null;
          geo_lat: number | null;
          geo_lng: number | null;
          social_links: Record<string, string>;
          schedule: Record<string, unknown>;
          theme: Record<string, unknown>;
          currency: string;
          default_locale: string;
          supported_locales: string[];
          allergen_policy: string | null;
          status: RestaurantStatus;
          plan: RestaurantPlan;
          operating_status: RestaurantOperatingStatus;
          operating_status_message: string | null;
          operating_status_until: string | null;
          seo_title: string | null;
          seo_description: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["restaurants"]["Row"]> & {
          slug: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurants"]["Row"]>;
        Relationships: [];
      };
      platform_admins: {
        Row: { user_id: string; created_at: string };
        Insert: { user_id: string; created_at?: string };
        Update: Partial<Database["public"]["Tables"]["platform_admins"]["Row"]>;
        Relationships: [];
      };
      restaurant_users: {
        Row: {
          restaurant_id: string;
          user_id: string;
          role: RestaurantUserRole;
          created_at: string;
        };
        Insert: {
          restaurant_id: string;
          user_id: string;
          role: RestaurantUserRole;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["restaurant_users"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: {
          id: string;
          restaurant_id: string;
          name: string;
          icon: string | null;
          sort_order: number;
          available_from: string | null;
          available_to: string | null;
          available_days: number[] | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          restaurant_id: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      category_translations: {
        Row: { category_id: string; locale: string; name: string };
        Insert: { category_id: string; locale: string; name: string };
        Update: Partial<Database["public"]["Tables"]["category_translations"]["Row"]>;
        Relationships: [];
      };
      allergens: {
        Row: {
          id: string;
          code: string;
          icon_key: string;
          name_es: string;
          name_en: string;
        };
        Insert: Partial<Database["public"]["Tables"]["allergens"]["Row"]> & {
          code: string;
          icon_key: string;
          name_es: string;
          name_en: string;
        };
        Update: Partial<Database["public"]["Tables"]["allergens"]["Row"]>;
        Relationships: [];
      };
      dishes: {
        Row: {
          id: string;
          restaurant_id: string;
          category_id: string | null;
          name: string;
          short_description: string | null;
          description: string | null;
          ingredients: string[];
          spice_level: number | null;
          nutritional_info: Record<string, unknown> | null;
          price_cents: number;
          status: DishStatus;
          badges: DishBadge[];
          avg_rating: number;
          rating_count: number;
          sort_order: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["dishes"]["Row"]> & {
          restaurant_id: string;
          name: string;
          price_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["dishes"]["Row"]>;
        Relationships: [];
      };
      dish_translations: {
        Row: {
          dish_id: string;
          locale: string;
          name: string;
          short_description: string | null;
          description: string | null;
          ingredients: string[] | null;
        };
        Insert: {
          dish_id: string;
          locale: string;
          name: string;
          short_description?: string | null;
          description?: string | null;
          ingredients?: string[] | null;
        };
        Update: Partial<Database["public"]["Tables"]["dish_translations"]["Row"]>;
        Relationships: [];
      };
      dish_media: {
        Row: { id: string; dish_id: string; url: string; sort_order: number };
        Insert: Partial<Database["public"]["Tables"]["dish_media"]["Row"]> & {
          dish_id: string;
          url: string;
        };
        Update: Partial<Database["public"]["Tables"]["dish_media"]["Row"]>;
        Relationships: [];
      };
      dish_variants: {
        Row: {
          id: string;
          dish_id: string;
          label: string;
          price_cents: number;
          sort_order: number;
        };
        Insert: Partial<Database["public"]["Tables"]["dish_variants"]["Row"]> & {
          dish_id: string;
          label: string;
          price_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["dish_variants"]["Row"]>;
        Relationships: [];
      };
      dish_allergens: {
        Row: { dish_id: string; allergen_id: string };
        Insert: { dish_id: string; allergen_id: string };
        Update: Partial<Database["public"]["Tables"]["dish_allergens"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          restaurant_id: string;
          target_type: ReviewTargetType;
          dish_id: string | null;
          author_name: string | null;
          rating: number;
          comment: string | null;
          photo_url: string | null;
          status: ReviewStatus;
          owner_reply: string | null;
          owner_reply_at: string | null;
          anonymous_device_id: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          restaurant_id: string;
          target_type: ReviewTargetType;
          rating: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      qr_codes: {
        Row: {
          id: string;
          restaurant_id: string;
          label: string;
          type: QrType;
          table_number: number | null;
          status: QrCodeStatus;
          scan_count: number;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["qr_codes"]["Row"]> & {
          restaurant_id: string;
          label: string;
          type: QrType;
        };
        Update: Partial<Database["public"]["Tables"]["qr_codes"]["Row"]>;
        Relationships: [];
      };
      promotions: {
        Row: {
          id: string;
          restaurant_id: string;
          dish_id: string | null;
          title: string;
          description: string | null;
          discount_type: PromotionDiscountType | null;
          discount_value: number | null;
          starts_at: string;
          ends_at: string;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["promotions"]["Row"]> & {
          restaurant_id: string;
          title: string;
          starts_at: string;
          ends_at: string;
        };
        Update: Partial<Database["public"]["Tables"]["promotions"]["Row"]>;
        Relationships: [];
      };
      analytics_events: {
        Row: {
          id: string;
          restaurant_id: string;
          event_type: string;
          dish_id: string | null;
          qr_id: string | null;
          metadata: Record<string, unknown>;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]> & {
          restaurant_id: string;
          event_type: string;
        };
        Update: Partial<Database["public"]["Tables"]["analytics_events"]["Row"]>;
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      is_platform_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
      has_restaurant_role: {
        Args: { rid: string; roles: string[] };
        Returns: boolean;
      };
    };
    Enums: Record<string, never>;
  };
};

type PublicSchema = Database["public"];

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"];
export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"];
export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"];

// Domain aliases — the names every feature module should import.
export type Restaurant = Tables<"restaurants">;
export type PlatformAdmin = Tables<"platform_admins">;
export type RestaurantUser = Tables<"restaurant_users">;
export type Category = Tables<"categories">;
export type CategoryTranslation = Tables<"category_translations">;
export type Allergen = Tables<"allergens">;
export type Dish = Tables<"dishes">;
export type DishTranslation = Tables<"dish_translations">;
export type DishMedia = Tables<"dish_media">;
export type DishVariant = Tables<"dish_variants">;
export type Review = Tables<"reviews">;
export type QrCode = Tables<"qr_codes">;
export type AnalyticsEvent = Tables<"analytics_events">;
export type Promotion = Tables<"promotions">;
