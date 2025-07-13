// apps/api/src/application/use-cases/event/CreateEventUseCase.ts
import {
  createEvent,
  Event,
  EventType,
  SportBereich,
} from "@/domain/entities/Event";
import { IEventRepository } from "@/domain/repositories/IEventRepository";
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import { IPermissionService } from "@/domain/services/IPermissionService";

export type CreateEventParams = {
  titel: string;
  beschreibung: string;
  kurzbeschreibung?: string;
  datum: string;
  uhrzeit: string;
  dauer_minuten?: number;
  ort: {
    name: string;
    adresse?: string;
    beschreibung?: string;
  };
  typ: EventType;
  sportbereich?: SportBereich;
  ist_oeffentlich?: boolean;
  verantwortlich_id: string;
  stellvertreter_ids?: string[];
  budget?: number;
  max_teilnehmer?: number;
  anmeldeschluss?: string;
  ticket_link?: string;
  userId: string;
  userRole: string;
  ipAddress?: string;
  userAgent?: string;
};

export class CreateEventUseCase {
  constructor(
    private readonly eventRepository: IEventRepository,
    private readonly memberRepository: IMemberRepository,
    private readonly permissionService: IPermissionService,
  ) {}

  async execute(params: CreateEventParams): Promise<Event> {
    // 1. Berechtigungsprüfung
    const canCreate = await this.permissionService.canCreateEvent(
      params.userRole,
    );
    if (!canCreate) {
      throw new Error("Keine Berechtigung zum Erstellen von Events");
    }

    // 2. Validierung: Datum in Zukunft
    const eventDate = new Date(params.datum);
    if (eventDate < new Date()) {
      throw new Error("Event-Datum muss in der Zukunft liegen");
    }

    // 3. Validierung: Verantwortlicher existiert
    const responsible = await this.memberRepository.findById(
      params.verantwortlich_id,
    );
    if (!responsible || !responsible.ist_aktiv) {
      throw new Error("Verantwortlicher muss ein aktives Mitglied sein");
    }

    // 4. Validierung: Stellvertreter existieren
    if (params.stellvertreter_ids && params.stellvertreter_ids.length > 0) {
      for (const deputyId of params.stellvertreter_ids) {
        const deputy = await this.memberRepository.findById(deputyId);
        if (!deputy || !deputy.ist_aktiv) {
          throw new Error(
            `Stellvertreter ${deputyId} ist kein aktives Mitglied`,
          );
        }
      }
    }

    // 5. Budget-Validierung (nur Vorstand darf Budget setzen)
    if (params.budget && params.userRole !== "VORSTAND") {
      throw new Error("Nur der Vorstand darf ein Budget festlegen");
    }

    // 6. Event erstellen
    const event = createEvent({
      title: params.titel,
      description: params.beschreibung,
      shortDescription: params.kurzbeschreibung,
      date: eventDate,
      time: params.uhrzeit,
      location: params.ort,
      type: params.typ,
      responsibleMemberId: params.verantwortlich_id,
      createdBy: params.userId,
      isPublic: params.ist_oeffentlich || false,
    });

    // Erweiterte Felder setzen
    const fullEvent: Event = {
      ...event,
      durationMinutes: params.dauer_minuten,
      sportBereich: params.sportbereich,
      deputyMemberIds: params.stellvertreter_ids,
      budget: params.budget,
      maxParticipants: params.max_teilnehmer,
      registrationDeadline: params.anmeldeschluss
        ? new Date(params.anmeldeschluss)
        : undefined,
      ticketLink: params.ticket_link,
      status: "entwurf", // Immer als Entwurf starten
    };

    // 7. Speichern
    const savedEvent = await this.eventRepository.save(fullEvent);

    // 8. Status-Historie initialisieren
    await this.eventRepository.createStatusHistory({
      eventId: savedEvent.id,
      newStatus: "entwurf",
      changedBy: params.userId,
      comment: "Event erstellt",
    });

    return savedEvent;
  }
}
