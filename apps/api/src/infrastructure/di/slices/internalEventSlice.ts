// apps/api/src/infrastructure/di/slices/internalEventSlice.ts
import { Container } from "../container";
import {
  CreateEventUseCase,
  UpdateEventUseCase,
  DeleteEventUseCase,
  ChangeEventStatusUseCase,
  GetInternalEventsUseCase,
  GetInternalEventByIdUseCase
} from "@/application/use-cases/event";
import { PermissionService } from "@/infrastructure/services/PermissionService";
import { InternalEventController } from "@/presentation/controllers/event/InternalEventController";

export const registerInternalEventSlice = (container: Container) => {
  // Permission Service
  container.register("PermissionService", () => {
    return new PermissionService();
  });

  // Use Cases
  container.register("CreateEventUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new CreateEventUseCase(eventRepo, memberRepo, permissionService);
  });

  container.register("UpdateEventUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new UpdateEventUseCase(eventRepo, memberRepo, permissionService);
  });

  container.register("DeleteEventUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const permissionService = container.get("PermissionService");
    return new DeleteEventUseCase(eventRepo, permissionService);
  });

  container.register("ChangeEventStatusUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const permissionService = container.get("PermissionService");
    return new ChangeEventStatusUseCase(eventRepo, permissionService);
  });

  container.register("GetInternalEventsUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const memberRepo = container.get("MemberRepository");
    return new GetInternalEventsUseCase(eventRepo, memberRepo);
  });

  container.register("GetInternalEventByIdUseCase", () => {
    const eventRepo = container.get("EventRepository");
    const memberRepo = container.get("MemberRepository");
    const permissionService = container.get("PermissionService");
    return new GetInternalEventByIdUseCase(eventRepo, memberRepo, permissionService);
  });

  // Controller
  container.register("InternalEventController", () => {
    const createEvent = container.get("CreateEventUseCase");
    const updateEvent = container.get("UpdateEventUseCase");
    const deleteEvent = container.get("DeleteEventUseCase");
    const changeStatus = container.get("ChangeEventStatusUseCase");
    const getEvents = container.get("GetInternalEventsUseCase");
    const getEventById = container.get("GetInternalEventByIdUseCase");

    return new InternalEventController(
      createEvent,
      updateEvent,
      deleteEvent,
      changeStatus,
      getEvents,
      getEventById
    );
  });
};
