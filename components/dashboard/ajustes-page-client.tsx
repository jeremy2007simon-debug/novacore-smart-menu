"use client";

import { useState } from "react";
import { UserPlus, X } from "lucide-react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { ScheduleEditor, type WeekSchedule } from "@/components/dashboard/schedule-editor";
import { SocialLinksEditor, type SocialLinks } from "@/components/dashboard/social-links-editor";
import { TeamInviteDialog } from "@/components/dashboard/team-invite-dialog";
import { useSaveStatus } from "@/lib/autosave/save-status-context";
import { useActivity } from "@/lib/activity/activity-context";
import { useDebouncedCommit } from "@/lib/utils/use-debounced-commit";
import { showToast } from "@/components/ui/toast";
import { updateRestaurant } from "@/features/dashboard/restaurant-actions";
import { changeTeamMemberRole, inviteTeamMember, removeTeamMember } from "@/features/dashboard/team-actions";
import type { DemoTeamMember } from "@/lib/demo/types";
import type { Restaurant, RestaurantOperatingStatus, RestaurantUserRole } from "@/lib/types/database";

const ROLE_LABEL: Record<RestaurantUserRole, string> = { owner: "Propietario", staff: "Staff" };

const OPERATING_STATUS_LABEL: Record<RestaurantOperatingStatus, string> = {
  open: "Abierto",
  temporarily_closed: "Cerrado temporalmente",
  vacation: "De vacaciones",
};

export function AjustesPageClient({ restaurant, initialTeam }: { restaurant: Restaurant; initialTeam: DemoTeamMember[] }) {
  const { runAutosave } = useSaveStatus();
  const { logActivity } = useActivity();

  const [name, setName] = useState(restaurant.name);
  const [description, setDescription] = useState(restaurant.description ?? "");
  const [phone, setPhone] = useState(restaurant.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(restaurant.whatsapp ?? "");
  const [address, setAddress] = useState(restaurant.address ?? "");

  const [operatingStatus, setOperatingStatus] = useState<RestaurantOperatingStatus>(restaurant.operating_status);
  const [operatingMessage, setOperatingMessage] = useState(restaurant.operating_status_message ?? "");

  const [schedule, setSchedule] = useState<WeekSchedule>(restaurant.schedule as WeekSchedule);
  const [social, setSocial] = useState<SocialLinks>(restaurant.social_links as SocialLinks);

  const [team, setTeam] = useState<DemoTeamMember[]>(initialTeam);
  const [inviteOpen, setInviteOpen] = useState(false);
  const activeOwnerCount = team.filter((m) => m.role === "owner" && m.status === "active").length;

  function saveField(kind: "settings" | "schedule", message: string, patch: Parameters<typeof updateRestaurant>[1]) {
    logActivity(kind, message);
    runAutosave(async () => {
      await updateRestaurant(restaurant.id, patch);
    });
  }

  useDebouncedCommit(
    name,
    (v) => v.trim() && saveField("settings", `cambió el nombre del restaurante a «${v}»`, { name: v.trim() }),
  );
  useDebouncedCommit(description, (v) =>
    saveField("settings", "actualizó la descripción del restaurante", { description: v.trim() || null }),
  );
  useDebouncedCommit(phone, (v) => saveField("settings", "actualizó el teléfono", { phone: v.trim() || null }));
  useDebouncedCommit(whatsapp, (v) => saveField("settings", "actualizó el WhatsApp", { whatsapp: v.trim() || null }));
  useDebouncedCommit(address, (v) => saveField("settings", "actualizó la dirección", { address: v.trim() || null }));
  useDebouncedCommit(operatingMessage, (v) =>
    saveField("settings", "actualizó el mensaje para clientes", { operating_status_message: v.trim() || null }),
  );
  useDebouncedCommit(schedule, (v) => saveField("schedule", "actualizó el horario del restaurante", { schedule: v }));
  useDebouncedCommit(social, (v) => saveField("settings", "actualizó las redes sociales", { social_links: v }));

  function changeOperatingStatus(status: RestaurantOperatingStatus) {
    setOperatingStatus(status);
    saveField("settings", `cambió el estado del restaurante a ${OPERATING_STATUS_LABEL[status]}`, {
      operating_status: status,
    });
  }

  async function changeMemberRole(id: string, role: RestaurantUserRole) {
    const member = team.find((m) => m.id === id);
    if (!member || member.role === role) return;
    if (member.role === "owner" && activeOwnerCount <= 1) {
      showToast.error("Debe haber al menos un propietario", "Asigna el rol de propietario a otra persona antes de quitárselo a esta.");
      return;
    }
    setTeam(team.map((m) => (m.id === id ? { ...m, role } : m)));
    const result = await changeTeamMemberRole(restaurant.id, id, role);
    if (!result.ok) {
      setTeam(team);
      showToast.error("No se pudo cambiar el rol", result.message ?? "Inténtalo de nuevo en unos segundos.");
      return;
    }
    logActivity("settings", `cambió el rol de ${member.name} a ${ROLE_LABEL[role]}`);
  }

  async function removeMember(id: string) {
    const member = team.find((m) => m.id === id);
    if (!member) return;
    if (member.role === "owner" && member.status === "active" && activeOwnerCount <= 1) {
      showToast.error("Debe haber al menos un propietario", "Asigna el rol de propietario a otra persona antes de quitarle el acceso.");
      return;
    }
    setTeam(team.filter((m) => m.id !== id));
    const result = await removeTeamMember(restaurant.id, id);
    if (!result.ok) {
      setTeam(team);
      showToast.error("No se pudo quitar el acceso", result.message ?? "Inténtalo de nuevo en unos segundos.");
      return;
    }
    logActivity(
      "settings",
      member.status === "invited" ? `canceló la invitación a ${member.email}` : `quitó el acceso de ${member.name}`,
    );
  }

  async function inviteMember(email: string, role: RestaurantUserRole) {
    const result = await inviteTeamMember({ restaurantId: restaurant.id, email, role });
    if (!result.ok) {
      showToast.error("No se pudo invitar", result.message);
      return;
    }
    const draft: DemoTeamMember = {
      id: `pending-${Date.now()}`,
      name: email.split("@")[0],
      email,
      role,
      status: "invited",
      created_at: new Date().toISOString(),
    };
    setTeam([...team, draft]);
    logActivity("settings", `invitó a ${email} como ${ROLE_LABEL[role]}`);
    showToast.success("Invitación enviada", `${email} recibirá un enlace para unirse.`);
  }

  return (
    <div>
      <PageHeader
        title="Ajustes"
        description="Información pública de tu restaurante, horarios y redes sociales — cada cambio se guarda solo."
      />

      <Tabs defaultValue="info" className="max-w-2xl">
        <TabsList>
          <TabsTrigger value="info">Información</TabsTrigger>
          <TabsTrigger value="estado">Estado</TabsTrigger>
          <TabsTrigger value="horario">Horario</TabsTrigger>
          <TabsTrigger value="redes">Redes sociales</TabsTrigger>
          <TabsTrigger value="equipo">Equipo</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rest-name">Nombre</Label>
              <Input id="rest-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rest-description">Descripción</Label>
              <Textarea id="rest-description" value={description} onChange={(e) => setDescription(e.target.value)} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rest-phone">Teléfono</Label>
                <Input id="rest-phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="rest-whatsapp">WhatsApp</Label>
                <Input id="rest-whatsapp" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} placeholder="+34 600 000 000" />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="rest-address">Dirección</Label>
              <Textarea id="rest-address" value={address} onChange={(e) => setAddress(e.target.value)} rows={2} />
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="estado">
          <Card className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="operating-status">Estado del restaurante</Label>
              <Select value={operatingStatus} onValueChange={(v) => changeOperatingStatus(v as RestaurantOperatingStatus)}>
                <SelectTrigger id="operating-status" className="max-w-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {(Object.keys(OPERATING_STATUS_LABEL) as RestaurantOperatingStatus[]).map((s) => (
                    <SelectItem key={s} value={s}>
                      {OPERATING_STATUS_LABEL[s]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Distinto del alta/suspensión de NovaCore — esto lo controlas tú y se ve en la carta pública al momento.
              </p>
            </div>
            {operatingStatus !== "open" ? (
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="operating-message">Mensaje para tus clientes</Label>
                <Input
                  id="operating-message"
                  value={operatingMessage}
                  onChange={(e) => setOperatingMessage(e.target.value)}
                  placeholder="Ej. Volvemos el 10 de enero"
                />
              </div>
            ) : null}
          </Card>
        </TabsContent>

        <TabsContent value="horario">
          <ScheduleEditor value={schedule} onChange={setSchedule} />
        </TabsContent>

        <TabsContent value="redes">
          <Card className="p-5">
            <SocialLinksEditor value={social} onChange={setSocial} />
          </Card>
        </TabsContent>

        <TabsContent value="equipo">
          <Card className="flex flex-col gap-4 p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium text-foreground">Quién tiene acceso a este panel</p>
                <p className="text-xs text-muted-foreground">
                  El staff puede gestionar la carta; solo un propietario puede invitar, cambiar roles o quitar acceso.
                </p>
              </div>
              <Button size="sm" onClick={() => setInviteOpen(true)}>
                <UserPlus className="h-4 w-4" /> Invitar
              </Button>
            </div>

            <div className="flex flex-col divide-y divide-border rounded-lg border border-border">
              {team.map((member) => (
                <div key={member.id} className="flex flex-wrap items-center justify-between gap-3 p-3">
                  <div className="flex items-center gap-3">
                    <Avatar>
                      <AvatarFallback>{member.name.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium text-foreground">{member.name}</p>
                        {member.status === "invited" ? <Badge variant="warning">Invitación pendiente</Badge> : null}
                      </div>
                      <p className="text-xs text-muted-foreground">{member.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select value={member.role} onValueChange={(v) => changeMemberRole(member.id, v as RestaurantUserRole)}>
                      <SelectTrigger className="w-36" aria-label={`Rol de ${member.name}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="owner">Propietario</SelectItem>
                        <SelectItem value="staff">Staff</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={member.status === "invited" ? `Cancelar invitación a ${member.email}` : `Quitar acceso a ${member.name}`}
                      onClick={() => removeMember(member.id)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </TabsContent>
      </Tabs>

      <TeamInviteDialog open={inviteOpen} onOpenChange={setInviteOpen} onInvite={inviteMember} />
    </div>
  );
}
