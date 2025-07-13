// apps/api/src/application/use-cases/event/UpdateEventUseCase.ts
import { Event } from "@/domain/entities/Event";
import { IEventRepository } from "@/domain/repositories/IEventRepository";
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type UpdateEventParams = {
  id: string;
  data: Partial<{
    titel: string;
    beschreibung: string;
    kurzbeschreibung: string;
    datum: string;
    uhrzeit: string;
    dauer_minuten: number;
    ort: {
      name: string;
      adresse?: string;
      beschreibung?: string;
    };
    typ: string;
    sportbereich: string;
    ist_oeffentlich: boolean;
    verantwortlich_id: string;
    stellvertreter_ids: string[];
    budget: number;
    max_teilnehmer: number;
    anmeldeschluss: string;
    ticket_link: string;
  }>;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class UpdateEventUseCase {
  constructor(
    private eventRepository: IEventRepository,
    private memberRepository: IMemberRepository,
    private permissionService: IPermissionService,
  ) {}

  async execute(params: UpdateEventParams): Promise<Event> {
    // 1. Event laden
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      throw new Error("Event nicht gefunden");
    }

    // 2. Berechtigungsprüfung
    const canEdit = await this.permissionService.canEditEvent(
      params.userRole,
      params.userId,
      event,
    );
    if (!canEdit) {
      throw new Error("Keine Berechtigung zum Bearbeiten dieses Events");
    }

    // 3. Status-spezifische Einschränkungen
    if (event.status !== "entwurf" && event.status !== "geplant") {
      const allowedFields = ["beschreibung", "kurzbeschreibung", "ticket_link"];
      const updateFields = Object.keys(params.data);

      const hasRestrictedFields = updateFields.some(
        (field) => !allowedFields.includes(field),
      );

      if (hasRestrictedFields && params.userRole !== "VORSTAND") {
        throw new Error(
          "Genehmigte Events können nur eingeschränkt bearbeitet werden",
        );
      }
    }

    // 4. Budget-Validierung
    if (params.data.budget !== undefined && params.userRole !== "VORSTAND") {
      throw new Error("Nur der Vorstand darf das Budget ändern");
    }

    // 5. Stellvertreter validieren
    if (params.data.stellvertreter_ids) {
      for (const deputyId of params.data.stellvertreter_ids) {
        const deputy = await this.memberRepository.findById(deputyId);
        if (!deputy || !deputy.ist_aktiv) {
          throw new Error(
            `Stellvertreter ${deputyId} ist kein aktives Mitglied`,
          );
        }
      }
    }

    // 6. Audit-Einträge für jede Änderung erstellen
    const auditEntries = [];
    for (const [field, newValue] of Object.entries(params.data)) {
      const oldValue = (event as any)[field];
      if (JSON.stringify(oldValue) !== JSON.stringify(newValue)) {
        auditEntries.push({
          eventId: event.id,
          action: "updated" as const,
          fieldName: field,
          oldValue: JSON.stringify(oldValue),
          newValue: JSON.stringify(newValue),
          changedBy: params.userId,
          ipAddress: params.ipAddress,
          userAgent: params.userAgent,
        });
      }
    }

    // 7. Event aktualisieren
    const updatedEvent: Event = {
      ...event,
      ...params.data,
      updatedAt: new Date(),
      updatedBy: params.userId,
    };

    // 8. Speichern mit Audit-Log
    const savedEvent = await this.eventRepository.updateWithAudit(
      updatedEvent,
      auditEntries,
    );

    return savedEvent;
  }
}
