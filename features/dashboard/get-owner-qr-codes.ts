import { cache } from "react";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QrCode } from "@/lib/types/database";

export const getOwnerQrCodes = cache(async (restaurantId: string): Promise<QrCode[]> => {
  const supabase = await createSupabaseServerClient();
  const { data } = await supabase
    .from("qr_codes")
    .select("*")
    .eq("restaurant_id", restaurantId)
    .order("created_at", { ascending: true });
  return data ?? [];
});
