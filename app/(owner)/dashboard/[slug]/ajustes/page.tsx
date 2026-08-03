"use client";

import { useState } from "react";
import { PageHeader } from "@/components/dashboard/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ScheduleEditor, type WeekSchedule } from "@/components/dashboard/schedule-editor";
import { SocialLinksEditor, type SocialLinks } from "@/components/dashboard/social-links-editor";
import { useSaveStatus } from "@/lib/autosave/save-status-context";
import { simulatePersist } from "@/lib/autosave/simulate-persist";
import { useActivity } from "@/lib/activity/activity-context";
import { useDebouncedCommit } from "@/lib/utils/use-debounced-commit";
import { demoRestaurant } from "@/lib/demo/note-di-caffe-demo";
import type { RestaurantOperatingStatus } from "@/lib/types/database";

const OPERATING_STATUS_LABEL: Record<RestaurantOperatingStatus, string> = {
  open: "Abierto",
  temporarily_closed: "Cerrado temporalmente",
  vacation: "De vacaciones",
};

export default function AjustesPage() {
  const { runAutosave } = useSaveStatus();
  const { logActivity } = useActivity();

  const [name, setName] = useState(demoRestaurant.name);
  const [description, setDescription] = useState(demoRestaurant.description ?? "");
  const [phone, setPhone] = useState(demoRestaurant.phone ?? "");
  const [whatsapp, setWhatsapp] = useState(demoRestaurant.whatsapp ?? "");
  const [address, setAddress] = useState(demoRestaurant.address ?? "");

  const [operatingStatus, setOperatingStatus] = useState<RestaurantOperatingStatus>(demoRestaurant.operating_status);
  const [operatingMessage, setOperatingMessage] = useState(demoRestaurant.operating_status_message ?? "");

  const [schedule, setSchedule] = useState<WeekSchedule>(demoRestaurant.schedule as WeekSchedule);
  const [social, setSocial] = useState<SocialLinks>(demoRestaurant.social_links as SocialLinks);

  function saveField(kind: "settings" | "schedule", message: string) {
    logActivity(kind, message);
    runAutosave(() => simulatePersist());
  }

  useDebouncedCommit(name, (v) => v.trim() && saveField("settings", `cambió el nombre del restaurante a «${v}»`));
  useDebouncedCommit(description, () => saveField("settings", "actualizó la descripción del restaurante"));
  useDebouncedCommit(phone, () => saveField("settings", "actualizó el teléfono"));
  useDebouncedCommit(whatsapp, () => saveField("settings", "actualizó el WhatsApp"));
  useDebouncedCommit(address, () => saveField("settings", "actualizó la dirección"));
  useDebouncedCommit(operatingMessage, () => saveField("settings", "actualizó el mensaje para clientes"));
  useDebouncedCommit(schedule, () => saveField("schedule", "actualizó el horario del restaurante"));
  useDebouncedCommit(social, () => saveField("settings", "actualizó las redes sociales"));

  function changeOperatingStatus(status: RestaurantOperatingStatus) {
    setOperatingStatus(status);
    saveField("settings", `cambió el estado del restaurante a ${OPERATING_STATUS_LABEL[status]}`);
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
      </Tabs>
    </div>
  );
}
