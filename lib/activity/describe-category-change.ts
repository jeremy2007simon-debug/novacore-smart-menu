import type { DemoActivityKind, DemoCategory } from "@/lib/demo/note-di-caffe-demo";

export function describeCategoryChange(
  category: DemoCategory,
  patch: Partial<DemoCategory>,
): { kind: DemoActivityKind; message: string } | null {
  if (patch.name !== undefined && patch.name !== category.name) {
    return { kind: "name", message: `cambió el nombre de la categoría «${category.name}» a «${patch.name}»` };
  }
  if (patch.available_from !== undefined || patch.available_to !== undefined) {
    if (patch.available_from === null) {
      return { kind: "schedule", message: `quitó la ventana horaria de «${category.name}»` };
    }
    return { kind: "schedule", message: `actualizó el horario de «${category.name}»` };
  }
  return null;
}
