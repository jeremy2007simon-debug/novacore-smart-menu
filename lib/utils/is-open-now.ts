import type { RestaurantOperatingStatus } from "@/lib/types/database";
import type { WeekSchedule } from "@/components/dashboard/schedule-editor";

const DAY_KEYS = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"] as const;

export type OpenStatus = { isOpen: boolean; label: string };

/**
 * "De vacaciones"/"Cerrado temporalmente" (operating_status) siempre gana
 * sobre el horario semanal: es una decisión explícita del propietario para
 * hoy, no algo que el horario recurrente deba contradecir.
 */
export function getOpenStatus(
  schedule: WeekSchedule,
  operatingStatus: RestaurantOperatingStatus,
  operatingStatusMessage: string | null,
  now: Date = new Date(),
): OpenStatus {
  if (operatingStatus === "temporarily_closed") {
    return { isOpen: false, label: operatingStatusMessage ?? "Cerrado temporalmente" };
  }
  if (operatingStatus === "vacation") {
    return { isOpen: false, label: operatingStatusMessage ?? "De vacaciones" };
  }

  const today = schedule[DAY_KEYS[now.getDay()]];
  if (!today) return { isOpen: false, label: "Cerrado hoy" };

  const minutesNow = now.getHours() * 60 + now.getMinutes();
  const [openH, openM] = today.open.split(":").map(Number);
  const [closeH, closeM] = today.close.split(":").map(Number);
  const openMinutes = openH * 60 + openM;
  const rawCloseMinutes = closeH * 60 + closeM;
  const closeMinutes = rawCloseMinutes <= openMinutes ? rawCloseMinutes + 24 * 60 : rawCloseMinutes;

  if (minutesNow >= openMinutes && minutesNow < closeMinutes) {
    return { isOpen: true, label: `Abierto ahora · cierra a las ${today.close}` };
  }
  return { isOpen: false, label: `Cerrado ahora · abre a las ${today.open}` };
}
