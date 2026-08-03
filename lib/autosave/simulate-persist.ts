/**
 * Sustituto de la escritura real a Supabase mientras estamos en fase de
 * diseño: resuelve tras un pequeño retardo (simula ida y vuelta de red) y
 * nunca falla por sí sola — el dato real ya vive en el estado de React de
 * cada página desde el primer instante (UI optimista). El siguiente
 * bloque solo tiene que sustituir esta función por la llamada real.
 */
export function simulatePersist(delayMs = 350): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, delayMs));
}
