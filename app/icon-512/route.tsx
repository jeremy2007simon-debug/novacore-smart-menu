import { renderAppIcon } from "@/lib/utils/app-icon";

export function GET() {
  return renderAppIcon({ size: 512 });
}
