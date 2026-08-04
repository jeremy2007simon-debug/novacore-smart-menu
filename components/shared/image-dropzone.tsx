"use client";

import { useCallback, useRef, useState } from "react";
import { ImagePlus, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils/cn";

/**
 * Arrastrar y soltar (o clic) para elegir una imagen. Muestra una vista
 * previa local instantánea mientras `onFileSelect` sube el archivo de
 * verdad; cuando la promesa resuelve, `value` ya trae la URL real y la
 * vista previa local se descarta.
 */
export function ImageDropzone({
  value,
  onFileSelect,
  onRemove,
  aspect = "aspect-video",
  label = "Arrastra una imagen o haz clic para elegirla",
  className,
}: {
  value?: string | null;
  onFileSelect: (file: File) => void | Promise<void>;
  onRemove: () => void;
  aspect?: string;
  label?: string;
  className?: string;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [localPreview, setLocalPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = useCallback(
    (files: FileList | null) => {
      const file = files?.[0];
      if (!file || !file.type.startsWith("image/")) return;
      const objectUrl = URL.createObjectURL(file);
      setLocalPreview(objectUrl);
      setUploading(true);
      Promise.resolve(onFileSelect(file)).finally(() => {
        setUploading(false);
        setLocalPreview(null);
        URL.revokeObjectURL(objectUrl);
      });
    },
    [onFileSelect],
  );

  const displaySrc = localPreview ?? value;

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div
        role="button"
        tabIndex={0}
        onClick={() => inputRef.current?.click()}
        onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          setDragActive(true);
        }}
        onDragLeave={() => setDragActive(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragActive(false);
          handleFiles(e.dataTransfer.files);
        }}
        className={cn(
          "nova-transition relative flex cursor-pointer items-center justify-center overflow-hidden rounded-md border-2 border-dashed",
          aspect,
          dragActive ? "border-primary bg-primary/5" : "border-border bg-surface-raised hover:border-border-strong",
        )}
      >
        {displaySrc ? (
          <>
            {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local u objeto de Supabase Storage, no candidato a next/image */}
            <img src={displaySrc} alt="Vista previa" className="h-full w-full object-cover" />
            {uploading ? (
              <div className="absolute inset-0 flex items-center justify-center bg-background/60">
                <Loader2 className="h-5 w-5 animate-spin text-foreground" aria-hidden="true" />
              </div>
            ) : (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove();
                }}
                aria-label="Quitar imagen"
                className="nova-transition absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm hover:bg-background"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </>
        ) : (
          <div className="flex flex-col items-center gap-2 p-6 text-center">
            {dragActive ? (
              <Upload className="h-6 w-6 text-primary" aria-hidden="true" />
            ) : (
              <ImagePlus className="h-6 w-6 text-faint-foreground" aria-hidden="true" />
            )}
            <p className="text-xs text-muted-foreground">{label}</p>
          </div>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => handleFiles(e.target.files)}
      />
    </div>
  );
}
