"use client";

import { Camera, Users, Music2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export type SocialLinks = { instagram?: string; facebook?: string; tiktok?: string };

// lucide-react no incluye logotipos de marca (los retiró por marca
// registrada) — se usa un icono genérico coherente con el resto del
// sistema de iconos en vez de mezclar una segunda librería solo para esto.
const FIELDS: { key: keyof SocialLinks; label: string; icon: React.ElementType; placeholder: string }[] = [
  { key: "instagram", label: "Instagram", icon: Camera, placeholder: "https://instagram.com/tu-restaurante" },
  { key: "facebook", label: "Facebook", icon: Users, placeholder: "https://facebook.com/tu-restaurante" },
  { key: "tiktok", label: "TikTok", icon: Music2, placeholder: "https://tiktok.com/@tu-restaurante" },
];

export function SocialLinksEditor({
  value,
  onChange,
}: {
  value: SocialLinks;
  onChange: (next: SocialLinks) => void;
}) {
  return (
    <div className="flex flex-col gap-4">
      {FIELDS.map(({ key, label, icon: Icon, placeholder }) => (
        <div key={key} className="flex flex-col gap-1.5">
          <Label htmlFor={`social-${key}`} className="flex items-center gap-1.5">
            <Icon className="h-3.5 w-3.5" aria-hidden="true" />
            {label}
          </Label>
          <Input
            id={`social-${key}`}
            type="url"
            value={value[key] ?? ""}
            onChange={(e) => onChange({ ...value, [key]: e.target.value })}
            placeholder={placeholder}
          />
        </div>
      ))}
    </div>
  );
}
