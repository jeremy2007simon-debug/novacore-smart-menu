"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import type { ReviewStatus } from "@/lib/types/database";

export async function updateReviewStatus(reviewId: string, status: ReviewStatus): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.from("reviews").update({ status }).eq("id", reviewId);
  if (error) {
    console.error("updateReviewStatus", error.message);
    return { ok: false };
  }
  return { ok: true };
}

export async function replyToReview(reviewId: string, reply: string): Promise<{ ok: boolean }> {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase
    .from("reviews")
    .update({ owner_reply: reply, owner_reply_at: new Date().toISOString() })
    .eq("id", reviewId);
  if (error) {
    console.error("replyToReview", error.message);
    return { ok: false };
  }
  return { ok: true };
}
