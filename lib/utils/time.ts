const UNITS: { unit: Intl.RelativeTimeFormatUnit; seconds: number }[] = [
  { unit: "year", seconds: 31536000 },
  { unit: "month", seconds: 2592000 },
  { unit: "day", seconds: 86400 },
  { unit: "hour", seconds: 3600 },
  { unit: "minute", seconds: 60 },
];

const formatter = new Intl.RelativeTimeFormat("es", { numeric: "auto" });

export function formatRelativeTime(iso: string, now: Date = new Date()): string {
  const diffSeconds = (new Date(iso).getTime() - now.getTime()) / 1000;

  for (const { unit, seconds } of UNITS) {
    if (Math.abs(diffSeconds) >= seconds) {
      return formatter.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return formatter.format(Math.round(diffSeconds / 60), "minute");
}
