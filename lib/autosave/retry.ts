/**
 * Reintenta `fn` con espera creciente antes de darla por fallida. Puro y
 * sin dependencias de React para poder probarlo de forma aislada.
 */
export async function attemptWithRetry<T>(
  fn: () => Promise<T>,
  { maxAttempts = 3, baseDelayMs = 400 }: { maxAttempts?: number; baseDelayMs?: number } = {},
): Promise<T> {
  let lastError: unknown;
  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      if (attempt < maxAttempts) {
        await new Promise((resolve) => setTimeout(resolve, baseDelayMs * attempt));
      }
    }
  }
  throw lastError;
}
