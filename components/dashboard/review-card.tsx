"use client";

import { useState } from "react";
import { Check, EyeOff, Flag, MessageSquare } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating } from "@/components/ui/rating";
import { Textarea } from "@/components/ui/textarea";
import { ReportReviewDialog } from "./report-review-dialog";
import type { DemoReview } from "@/lib/demo/note-di-caffe-demo";
import type { ReviewStatus } from "@/lib/types/database";

const STATUS_CONFIG: Record<ReviewStatus, { label: string; variant: "warning" | "success" | "neutral" }> = {
  pending: { label: "Pendiente", variant: "warning" },
  approved: { label: "Aprobada", variant: "success" },
  hidden: { label: "Oculta", variant: "neutral" },
};

export function ReviewCard({
  review,
  onChangeStatus,
  onReply,
  onReport,
}: {
  review: DemoReview;
  onChangeStatus: (status: ReviewStatus) => void;
  onReply: (reply: string) => void;
  onReport: (reason: string, note: string) => void;
}) {
  const [replyDraft, setReplyDraft] = useState(review.owner_reply ?? "");
  const [replying, setReplying] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0">
        <div>
          <div className="flex items-center gap-2">
            <Rating value={review.rating} size="sm" />
            <span className="text-sm font-medium text-foreground">{review.author_name ?? "Anónimo"}</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            {review.dish_name ? `Sobre «${review.dish_name}»` : "Sobre el restaurante"} ·{" "}
            {new Date(review.created_at).toLocaleDateString("es-ES", { day: "numeric", month: "short" })}
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {review.reported ? (
            <Badge variant="danger">
              <Flag className="h-3 w-3" aria-hidden="true" /> Reportada
            </Badge>
          ) : null}
          <Badge variant={STATUS_CONFIG[review.status].variant}>{STATUS_CONFIG[review.status].label}</Badge>
        </div>
      </CardHeader>

      <CardContent>
        {review.comment ? <p className="text-sm text-foreground">{review.comment}</p> : null}

        {review.owner_reply && !replying ? (
          <div className="mt-3 rounded-md bg-surface-raised p-3">
            <p className="text-xs font-medium text-muted-foreground">Tu respuesta</p>
            <p className="mt-1 text-sm text-foreground">{review.owner_reply}</p>
          </div>
        ) : null}

        {replying ? (
          <div className="mt-3 flex flex-col gap-2">
            <Textarea
              value={replyDraft}
              onChange={(e) => setReplyDraft(e.target.value)}
              placeholder="Escribe tu respuesta pública..."
              rows={3}
            />
            <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setReplying(false)}>
                Cancelar
              </Button>
              <Button
                size="sm"
                onClick={() => {
                  onReply(replyDraft);
                  setReplying(false);
                }}
              >
                Publicar respuesta
              </Button>
            </div>
          </div>
        ) : null}
      </CardContent>

      <CardFooter className="flex-wrap gap-2">
        {review.status !== "approved" ? (
          <Button size="sm" variant="outline" onClick={() => onChangeStatus("approved")}>
            <Check className="h-4 w-4" /> Aprobar
          </Button>
        ) : null}
        {review.status !== "hidden" ? (
          <Button size="sm" variant="outline" onClick={() => onChangeStatus("hidden")}>
            <EyeOff className="h-4 w-4" /> Ocultar
          </Button>
        ) : null}
        {!replying ? (
          <Button size="sm" variant="ghost" onClick={() => setReplying(true)}>
            <MessageSquare className="h-4 w-4" /> {review.owner_reply ? "Editar respuesta" : "Responder"}
          </Button>
        ) : null}
        {!review.reported ? (
          <Button size="sm" variant="ghost" onClick={() => setReportOpen(true)}>
            <Flag className="h-4 w-4" /> Reportar
          </Button>
        ) : null}
      </CardFooter>

      <ReportReviewDialog
        open={reportOpen}
        onOpenChange={setReportOpen}
        onSubmit={(reason, note) => {
          onReport(reason, note);
          setReportOpen(false);
        }}
      />
    </Card>
  );
}
