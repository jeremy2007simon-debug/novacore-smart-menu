"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { QrCode, QrType } from "@/lib/types/database";

export async function createQrCode(input: {
  restaurantId: string;
  label: string;
  type: QrType;
  tableNumber: number | null;
}): Promise<QrCode | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase
    .from("qr_codes")
    .insert({
      restaurant_id: input.restaurantId,
      label: input.label,
      type: input.type,
      table_number: input.tableNumber,
    })
    .select()
    .single();

  if (error) {
    console.error("createQrCode", error.message);
    return null;
  }
  return data;
}

export async function archiveQrCode(qrId: string): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("qr_codes").update({ status: "archived" }).eq("id", qrId);
  if (error) {
    console.error("archiveQrCode", error.message);
    return { ok: false };
  }
  return { ok: true };
}
