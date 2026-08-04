"use client";

import { useEffect, useRef, useState } from "react";
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors, type DragEndEvent } from "@dnd-kit/core";
import { SortableContext, rectSortingStrategy, useSortable, arrayMove } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, ImagePlus, Loader2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils/cn";

function SortableThumb({
  url,
  isPrincipal,
  onRemove,
}: {
  url: string;
  isPrincipal: boolean;
  onRemove: () => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: url });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "group relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-surface-raised",
        isDragging && "opacity-50",
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- puede ser un blob: URL local todavía sin subir */}
      <img src={url} alt="" className="h-full w-full object-cover" />

      {isPrincipal ? (
        <Badge variant="primary" className="absolute bottom-1 left-1">
          Principal
        </Badge>
      ) : null}

      <button
        {...attributes}
        {...listeners}
        aria-label="Reordenar imagen"
        className="nova-transition absolute left-1 top-1 flex h-6 w-6 cursor-grab items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm active:cursor-grabbing group-hover:opacity-100"
      >
        <GripVertical className="h-3.5 w-3.5" aria-hidden="true" />
      </button>

      <button
        type="button"
        onClick={onRemove}
        aria-label="Quitar imagen"
        className="nova-transition absolute right-1 top-1 flex h-6 w-6 items-center justify-center rounded-full bg-background/90 text-foreground opacity-0 shadow-sm hover:bg-danger hover:text-danger-foreground group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </div>
  );
}

/**
 * Galería de imágenes del plato: arrastrar y soltar para reordenar, la
 * primera es siempre la imagen principal (la que se ve en tarjetas y
 * listados). Cada archivo sube a Supabase Storage vía `onUpload` — se
 * procesan uno a uno para no perder ninguno por condiciones de carrera
 * sobre `value`, mostrando una vista previa local con overlay mientras
 * cada subida está en curso.
 */
export function ImageGalleryEditor({
  value,
  onChange,
  onUpload,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  onUpload: (file: File) => Promise<string | null>;
}) {
  const [dragActive, setDragActive] = useState(false);
  const [pending, setPending] = useState<{ key: string; preview: string }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 4 } }));

  const valueRef = useRef(value);
  useEffect(() => {
    valueRef.current = value;
  }, [value]);

  async function addFiles(files: FileList | null) {
    const imageFiles = Array.from(files ?? []).filter((f) => f.type.startsWith("image/"));
    for (const file of imageFiles) {
      const key = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
      const preview = URL.createObjectURL(file);
      setPending((prev) => [...prev, { key, preview }]);
      const url = await onUpload(file);
      setPending((prev) => prev.filter((p) => p.key !== key));
      URL.revokeObjectURL(preview);
      if (url) onChange([...valueRef.current, url]);
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = value.indexOf(String(active.id));
    const newIndex = value.indexOf(String(over.id));
    onChange(arrayMove(value, oldIndex, newIndex));
  }

  return (
    <div className="flex flex-col gap-3">
      <DndContext id="galeria-plato" sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={value} strategy={rectSortingStrategy}>
          <div className="flex flex-wrap gap-3">
            {value.map((url, i) => (
              <SortableThumb
                key={url}
                url={url}
                isPrincipal={i === 0}
                onRemove={() => onChange(value.filter((_, idx) => idx !== i))}
              />
            ))}

            {pending.map((p) => (
              <div
                key={p.key}
                className="relative h-24 w-24 shrink-0 overflow-hidden rounded-md border border-border bg-surface-raised"
              >
                {/* eslint-disable-next-line @next/next/no-img-element -- vista previa local mientras se sube */}
                <img src={p.preview} alt="" className="h-full w-full object-cover opacity-60" />
                <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                  <Loader2 className="h-5 w-5 animate-spin text-foreground" aria-hidden="true" />
                </div>
              </div>
            ))}

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
                addFiles(e.dataTransfer.files);
              }}
              className={cn(
                "nova-transition flex h-24 w-24 shrink-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed text-center",
                dragActive ? "border-primary bg-primary/5" : "border-border bg-surface-raised hover:border-border-strong",
              )}
            >
              <ImagePlus className="h-5 w-5 text-faint-foreground" aria-hidden="true" />
              <span className="px-1 text-[11px] text-muted-foreground">Añadir</span>
            </div>
          </div>
        </SortableContext>
      </DndContext>

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => addFiles(e.target.files)}
      />

      <p className="text-xs text-muted-foreground">
        Arrastra para reordenar. La primera imagen es la principal (la que se ve en la carta y en las listas). Se
        comprimirán automáticamente al guardar.
      </p>
    </div>
  );
}
