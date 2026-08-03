"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, useSyncExternalStore } from "react";
import { attemptWithRetry } from "./retry";

export type SaveStatus = "saved" | "saving" | "error" | "offline";

type SaveStatusContextValue = {
  status: SaveStatus;
  /** Encola `save`, muestra "Guardando…" mientras corre, reintenta si falla. */
  runAutosave: (save: () => Promise<void>) => void;
};

const SaveStatusContext = createContext<SaveStatusContextValue | null>(null);

function subscribeOnline(onStoreChange: () => void) {
  window.addEventListener("online", onStoreChange);
  window.addEventListener("offline", onStoreChange);
  return () => {
    window.removeEventListener("online", onStoreChange);
    window.removeEventListener("offline", onStoreChange);
  };
}

function getOnlineSnapshot() {
  return navigator.onLine;
}

// En servidor no hay `navigator`: se asume conectado hasta que el cliente
// confirme el estado real (coincide con lo habitual: casi nadie carga la
// página ya sin conexión).
function getOnlineServerSnapshot() {
  return true;
}

/**
 * Único punto de verdad del indicador global de guardado (visible en el
 * Topbar): toda edición en el panel pasa por `runAutosave` en vez de un
 * botón "Guardar". Sin backend real todavía, "guardar" persiste en el
 * estado de React de cada página — el cambio del usuario ya se aplicó ahí
 * al instante (UI optimista); esto solo simula la sincronización remota.
 * El mecanismo de reintentos/estado "error" ya es real y queda listo para
 * cuando eso sea una llamada a Supabase que sí pueda fallar de verdad.
 *
 * `navigator.onLine` es estado externo real: se lee con
 * `useSyncExternalStore` (mismo patrón que ColorModeToggle), nunca con
 * useState+useEffect.
 *
 * Sin conexión, las tareas se encolan en `queueRef` y se procesan en
 * orden en cuanto vuelve el evento `online` — ningún cambio se pierde.
 */
export function SaveStatusProvider({ children }: { children: React.ReactNode }) {
  const isOnline = useSyncExternalStore(subscribeOnline, getOnlineSnapshot, getOnlineServerSnapshot);
  const [outcome, setOutcome] = useState<"saved" | "error">("saved");
  const [pendingCount, setPendingCount] = useState(0);
  const queueRef = useRef<Array<() => Promise<void>>>([]);
  const prevOnlineRef = useRef(isOnline);

  const runTask = useCallback((save: () => Promise<void>) => {
    setPendingCount((n) => n + 1);
    attemptWithRetry(save)
      .then(() => {
        setOutcome("saved");
        setPendingCount((n) => Math.max(0, n - 1));
      })
      .catch(() => {
        setOutcome("error");
        setPendingCount((n) => Math.max(0, n - 1));
      });
  }, []);

  // Reconexión: vacía la cola encolada mientras no había Internet. Es un
  // efecto secundario real (relanzar tareas pendientes), no un espejo de
  // estado externo — por eso sí vive en un efecto.
  useEffect(() => {
    if (isOnline && !prevOnlineRef.current) {
      const queued = queueRef.current;
      queueRef.current = [];
      queued.forEach(runTask);
    }
    prevOnlineRef.current = isOnline;
  }, [isOnline, runTask]);

  const runAutosave = useCallback(
    (save: () => Promise<void>) => {
      if (!isOnline) {
        queueRef.current.push(save);
        return;
      }
      runTask(save);
    },
    [isOnline, runTask],
  );

  const status: SaveStatus = !isOnline ? "offline" : pendingCount > 0 ? "saving" : outcome;

  const value = useMemo(() => ({ status, runAutosave }), [status, runAutosave]);

  return <SaveStatusContext.Provider value={value}>{children}</SaveStatusContext.Provider>;
}

export function useSaveStatus() {
  const ctx = useContext(SaveStatusContext);
  if (!ctx) throw new Error("useSaveStatus debe usarse dentro de SaveStatusProvider");
  return ctx;
}
