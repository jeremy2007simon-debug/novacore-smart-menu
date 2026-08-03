"use client";

import { createContext, useCallback, useContext, useState } from "react";
import { CURRENT_ACTOR, demoActivity, type DemoActivity, type DemoActivityKind } from "@/lib/demo/note-di-caffe-demo";

type ActivityContextValue = {
  activity: DemoActivity[];
  /** Registra una acción real del propietario al principio del historial. */
  logActivity: (kind: DemoActivityKind, message: string) => void;
};

const ActivityContext = createContext<ActivityContextValue | null>(null);

let nextId = 1000;

/**
 * Historial compartido de "Actividad reciente": vive en DashboardShell
 * (montado una vez, sobrevive a la navegación entre pantallas) para que
 * cualquier edición en Platos, Categorías, Apariencia o Ajustes aparezca
 * aquí al instante, sin necesitar un backend todavía.
 */
export function ActivityProvider({ children }: { children: React.ReactNode }) {
  const [activity, setActivity] = useState<DemoActivity[]>(demoActivity);

  const logActivity = useCallback((kind: DemoActivityKind, message: string) => {
    setActivity((prev) => [
      { id: `local-${nextId++}`, kind, actor: CURRENT_ACTOR, message, created_at: new Date().toISOString() },
      ...prev,
    ]);
  }, []);

  return <ActivityContext.Provider value={{ activity, logActivity }}>{children}</ActivityContext.Provider>;
}

export function useActivity() {
  const ctx = useContext(ActivityContext);
  if (!ctx) throw new Error("useActivity debe usarse dentro de ActivityProvider");
  return ctx;
}
