// apps/api/src/application/use-cases/event/DeleteEventUseCase.ts
import { IEventRepository } from "@/domain/repositories/IEventRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type DeleteEventParams = {
  id: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class DeleteEventUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: DeleteEventParams): Promise<void> {
    // 1. Event laden
    const event = await this.eventRepository.findById(params.id);
    if (!event) {
      throw new Error("Event nicht gefunden");
    }

    // 2. Berechtigungsprüfung
    const canDelete = await this.permissionService.canDeleteEvent(
      params.userRole,
      params.userId,
      event,
    );
    if (!canDelete) {
      throw new Error("Keine Berechtigung zum Löschen dieses Events");
    }

    // 3. Status-Prüfung
    if (event.status !== "entwurf" && params.userRole !== "ADMIN") {
      throw new Error("Nur Entwürfe können gelöscht werden");
    }

    // 4. Soft Delete mit Audit-Log
    const auditEntry = {
      eventId: event.id,
      action: "deleted" as const,
      fieldName: null,
      oldValue: JSON.stringify(event),
      newValue: null,
      changedBy: params.userId,
      ipAddress: params.ipAddress,
      userAgent: params.userAgent,
    };

    await this.eventRepository.softDeleteWithAudit(
      event.id,
      params.userId,
      auditEntry,
    );
  }
}
