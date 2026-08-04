"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

const MAX_FILE_BYTES = 5 * 1024 * 1024;

function extensionFor(file: File): string {
  const fromName = file.name.split(".").pop();
  if (fromName && fromName.length <= 5) return fromName.toLowerCase();
  return (file.type.split("/").pop() ?? "jpg").toLowerCase();
}

export async function uploadPublicImage(input: {
  folder: "restaurants" | "dishes";
  restaurantId: string;
  file: File;
}): Promise<{ ok: true; url: string } | { ok: false; message: string }> {
  if (!input.file.type.startsWith("image/")) {
    return { ok: false, message: "El archivo debe ser una imagen." };
  }
  if (input.file.size > MAX_FILE_BYTES) {
    return { ok: false, message: "La imagen no puede superar 5 MB." };
  }

  const supabase = await createSupabaseServerClient();
  const path = `${input.folder}/${input.restaurantId}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${extensionFor(input.file)}`;

  const { error } = await supabase.storage.from("public-assets").upload(path, input.file, {
    contentType: input.file.type,
  });
  if (error) return { ok: false, message: error.message };

  const { data } = supabase.storage.from("public-assets").getPublicUrl(path);
  return { ok: true, url: data.publicUrl };
}
