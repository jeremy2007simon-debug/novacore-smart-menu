import { toast } from "sonner";

/**
 * Sonner ya resuelve cola, apilado, aria-live y animación de entrada/salida
 * — no hace falta reconstruir eso. Este módulo es la única puerta de
 * entrada para lanzar un toast en toda la app, con los tres semánticos que
 * de verdad usamos (el <Toaster/> global vive en app/layout.tsx y ya está
 * estilado con los tokens del tema mediante `toastOptions.classNames`).
 */
export const showToast = {
  success: (message: string, description?: string) => toast.success(message, { description }),
  error: (message: string, description?: string) => toast.error(message, { description }),
  info: (message: string, description?: string) => toast(message, { description }),
};
