import {
  ArrowUpDown,
  Clock,
  Euro,
  EyeOff,
  Image as ImageIcon,
  Layers,
  MessageSquare,
  Palette,
  Pencil,
  Settings,
  Tag,
  Text,
} from "lucide-react";
import type { DemoActivityKind } from "@/lib/demo/note-di-caffe-demo";

export const ACTIVITY_KIND_ICON: Record<DemoActivityKind, React.ElementType> = {
  name: Pencil,
  price: Euro,
  description: Text,
  status: EyeOff,
  category: Layers,
  order: ArrowUpDown,
  badge: Tag,
  image: ImageIcon,
  review: MessageSquare,
  settings: Settings,
  theme: Palette,
  schedule: Clock,
};
