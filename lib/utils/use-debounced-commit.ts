import { useEffect, useRef } from "react";

/**
 * Confirma `value` (llamando a `onCommit`) tras `delayMs` sin cambios —
 * pensado para campos de texto continuo (nombre, descripción) que deben
 * autoguardarse sin disparar una escritura por cada pulsación.
 */
export function useDebouncedCommit<T>(value: T, onCommit: (value: T) => void, delayMs = 700) {
  const isFirstRender = useRef(true);
  const lastCommitted = useRef(value);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      lastCommitted.current = value;
      return;
    }
    if (Object.is(value, lastCommitted.current)) return;

    const id = setTimeout(() => {
      lastCommitted.current = value;
      onCommit(value);
    }, delayMs);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- onCommit ya viene estable (useCallback) desde quien la usa
  }, [value, delayMs]);
}
