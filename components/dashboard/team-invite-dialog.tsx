"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { RestaurantUserRole } from "@/lib/types/database";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function TeamInviteDialog({
  open,
  onOpenChange,
  onInvite,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onInvite: (email: string, role: RestaurantUserRole) => void;
}) {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState<RestaurantUserRole>("staff");
  const isValid = EMAIL_PATTERN.test(email.trim());

  function handleInvite() {
    if (!isValid) return;
    onInvite(email.trim(), role);
    onOpenChange(false);
    setEmail("");
    setRole("staff");
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invitar al equipo</DialogTitle>
          <DialogDescription>Le enviaremos un enlace para que cree su acceso a este restaurante.</DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-email">Correo electrónico</Label>
            <Input
              id="invite-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="nombre@ejemplo.com"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="invite-role">Rol</Label>
            <Select value={role} onValueChange={(v) => setRole(v as RestaurantUserRole)}>
              <SelectTrigger id="invite-role">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="staff">Staff — gestiona la carta, no el equipo</SelectItem>
                <SelectItem value="owner">Propietario — acceso completo</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleInvite} disabled={!isValid}>
            Enviar invitación
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
