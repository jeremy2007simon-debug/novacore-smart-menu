"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Rating } from "@/components/ui/rating";
import { showToast } from "@/components/ui/toast";

/**
 * Sin un proyecto Supabase real conectado todavía no hay dónde persistir
 * una reseña nueva de verdad — igual que el autoguardado del panel del
 * propietario (`simulatePersist`), esto simula el envío y pasa a un estado
 * de "gracias" en vez de insertar la fila. El día que haya un backend real,
 * solo hay que sustituir el `setTimeout` por la llamada a Supabase.
 */
export function WriteReviewForm({ dishName }: { dishName: string }) {
  const [rating, setRating] = useState(0);
  const [authorName, setAuthorName] = useState("");
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      showToast.error("Elige una valoración", "Toca una estrella para puntuar el plato.");
      return;
    }
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      showToast.success("¡Gracias por tu reseña!", "Se publicará en cuanto el restaurante la revise.");
    }, 400);
  }

  if (submitted) {
    return (
      <Card>
        <CardContent className="p-5 text-sm text-muted-foreground">
          Tu reseña sobre «{dishName}» se ha enviado y quedará publicada en cuanto el restaurante la revise. ¡Gracias
          por tu opinión!
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="flex flex-col gap-4 p-5">
        <p className="font-display text-sm font-semibold text-foreground">Deja tu opinión sobre este plato</p>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label>Tu valoración</Label>
            <Rating value={rating} onChange={setRating} interactive size="lg" />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-author">Tu nombre (opcional)</Label>
            <Input
              id="review-author"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              placeholder="Anónimo"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="review-comment">Comentario (opcional)</Label>
            <Textarea
              id="review-comment"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={`¿Qué te ha parecido ${dishName}?`}
              rows={3}
            />
          </div>
          <Button type="submit" disabled={submitting} className="self-start">
            {submitting ? "Enviando…" : "Publicar reseña"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
