// apps/api/src/application/use-cases/event/GetPublicEventByIdUseCase.ts

import type { IEventRepository } from "@/domain/repositories/IEventRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { PublicEventDetailDTO } from "@/application/dto/event";
import { TaskStatus } from "@/domain/entities";

/**
 * Get Public Event By Id Parameters
 */
export type GetPublicEventByIdParams = {
  /** Event ID */
  readonly id: string;
};

/**
 * Get Public Event By Id Result
 */
export type GetPublicEventByIdResult = PublicEventDetailDTO | null;

/**
 * Get Public Event By Id Use Case
 * @description Lädt öffentliche Event-Details
 */
export type GetPublicEventByIdUseCase = {
  execute: (
    params: GetPublicEventByIdParams,
  ) => Promise<GetPublicEventByIdResult>;
};

/**
 * Factory für GetPublicEventByIdUseCase
 */
export const createGetPublicEventByIdUseCase = (
  eventRepository: IEventRepository,
  taskRepository: ITaskRepository,
): GetPublicEventByIdUseCase => ({
  execute: async ({ id }) => {
    // Lade Event
    const event = await eventRepository.findById(id);

    // Prüfe ob Event öffentlich sichtbar ist
    if (!event || !event.isPublic || event.status !== "genehmigt") {
      return null;
    }

    // Lade zusätzliche Daten
    const [participants, tasks] = await Promise.all([
      eventRepository.getParticipants(event.id),
      taskRepository.getTasksByEvent(event.id),
    ]);

    // Filtere nur öffentliche Aufgaben
    const publicTasks = tasks
      .filter((task) => task.context.type === "event" && !task.geloescht)
      .filter((task) => task.status !== "offen"); // Nur sichtbar wenn in Bearbeitung

    // Map zu DTO
    const result: PublicEventDetailDTO = {
      id: event.id,
      title: event.title,
      description: event.description,
      shortDescription: event.shortDescription,
      date: event.date.toISOString(),
      time: event.time,
      durationMinutes: event.durationMinutes,
      location: {
        name: event.location.name,
        address: event.location.address,
        description: event.location.description,
        mapsUrl: event.location.address
          ? `https://maps.google.com/?q=${encodeURIComponent(event.location.address)}`
          : undefined,
      },
      type: event.type,
      sportBereich: event.sportBereich,
      maxParticipants: event.maxParticipants,
      participants: participants.map((p) => ({
        id: p.id,
        name: p.name,
        avatarUrl: undefined, // TODO: Implement
        registeredAt: p.registeredAt.toISOString(),
      })),
      registrationDeadline: event.registrationDeadline?.toISOString(),
      ticketLink: event.ticketLink,
      canRegister: canRegisterForEvent(event, participants.length),
      media: [], // TODO: Implement media
      publicTasks: publicTasks.map((task) => ({
        id: task.id,
        title: task.titel,
        description: task.beschreibung,
        status: mapTaskStatusToPublic(task.status), // Status mappen
        priority: task.prioritaet,
        deadline: task.frist?.toISOString(),
        assignedTo: undefined,
      })),
    };

    return result;
  },
});

/**
 * Prüft ob Registrierung möglich ist
 */
const canRegisterForEvent = (
  event: any,
  currentParticipants: number,
): boolean => {
  if (event.date < new Date()) return false;

  if (event.registrationDeadline && event.registrationDeadline < new Date()) {
    return false;
  }

  if (event.maxParticipants && currentParticipants >= event.maxParticipants) {
    return false;
  }

  return true;
};

/**
 * Mappt internen TaskStatus zu öffentlichem Status
 * Review und Blockiert werden nicht öffentlich angezeigt
 */
const mapTaskStatusToPublic = (
  status: TaskStatus,
): "offen" | "in_bearbeitung" | "erledigt" => {
  switch (status) {
    case "offen":
      return "offen";
    case "in_bearbeitung":
    case "review": // Review wird als "in Bearbeitung" angezeigt
    case "blockiert": // Blockiert wird als "in Bearbeitung" angezeigt
      return "in_bearbeitung";
    case "erledigt":
      return "erledigt";
    default:
      return "in_bearbeitung";
  }
};
