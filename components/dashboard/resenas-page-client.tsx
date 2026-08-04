"use client";

import { useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EmptyState } from "@/components/ui/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ReviewCard } from "@/components/dashboard/review-card";
import { showToast } from "@/components/ui/toast";
import { replyToReview, updateReviewStatus } from "@/features/dashboard/review-actions";
import type { DemoReview } from "@/lib/demo/types";
import type { ReviewStatus } from "@/lib/types/database";
import { Star } from "lucide-react";

const TABS: { value: ReviewStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "approved", label: "Aprobadas" },
  { value: "hidden", label: "Ocultas" },
  { value: "all", label: "Todas" },
];

export function ResenasPageClient({ initialReviews }: { initialReviews: DemoReview[] }) {
  const [reviews, setReviews] = useState<DemoReview[]>(initialReviews);
  const [tab, setTab] = useState<ReviewStatus | "all">("pending");

  const pendingCount = useMemo(() => reviews.filter((r) => r.status === "pending").length, [reviews]);

  async function updateStatus(id: string, status: ReviewStatus) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, status } : r)));
    const result = await updateReviewStatus(id, status);
    if (!result.ok) {
      showToast.error("No se pudo actualizar la reseña", "Inténtalo de nuevo en unos segundos.");
      return;
    }
    showToast.success(status === "approved" ? "Reseña aprobada" : "Reseña ocultada");
  }

  async function updateReply(id: string, reply: string) {
    const repliedAt = new Date().toISOString();
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, owner_reply: reply, owner_reply_at: repliedAt } : r)));
    const result = await replyToReview(id, reply);
    if (!result.ok) {
      showToast.error("No se pudo publicar la respuesta", "Inténtalo de nuevo en unos segundos.");
      return;
    }
    showToast.success("Respuesta publicada");
  }

  // No hay todavía una tabla para escalar reseñas a NovaCore — se marca
  // solo en esta sesión, a la espera de ese backend.
  function reportReview(id: string) {
    setReviews((prev) => prev.map((r) => (r.id === id ? { ...r, reported: true } : r)));
    showToast.success("Reseña reportada", "El equipo de NovaCore la revisará. La puntuación no cambia.");
  }

  return (
    <div>
      <PageHeader
        title="Reseñas"
        description={
          pendingCount > 0
            ? `${pendingCount} reseñas esperando moderación.`
            : "No hay reseñas pendientes de moderar ahora mismo."
        }
      />

      <Tabs value={tab} onValueChange={(v) => setTab(v as ReviewStatus | "all")}>
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {TABS.map((t) => {
          const filtered = t.value === "all" ? reviews : reviews.filter((r) => r.status === t.value);
          return (
            <TabsContent key={t.value} value={t.value}>
              {filtered.length === 0 ? (
                <EmptyState icon={Star} title="Nada por aquí" description="No hay reseñas en este estado." />
              ) : (
                <div className="flex flex-col gap-3">
                  {filtered.map((review) => (
                    <ReviewCard
                      key={review.id}
                      review={review}
                      onChangeStatus={(status) => updateStatus(review.id, status)}
                      onReply={(reply) => updateReply(review.id, reply)}
                      onReport={() => reportReview(review.id)}
                    />
                  ))}
                </div>
              )}
            </TabsContent>
          );
        })}
      </Tabs>
    </div>
  );
}
