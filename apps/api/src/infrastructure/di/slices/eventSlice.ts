// apps/api/src/infrastructure/di/slices/eventSlice.ts
import { createGetEventsUseCase } from "@/application/use-cases";
import { createGetEventByIdUseCase } from "@/application/use-cases/event/GetEventById";
import { createMySQLEventRepository } from "@/infrastructure/repositories/MySQLEventRepository";
import { createEventController } from "@/presentation/controllers/event/EventController";
import { Container } from "../container";


export const registerEventSlice = (container: Container) => {
  // Repository
  container.register("EventRepository", () => {
    const db = container.get("Database");
    return createMySQLEventRepository(db);
  });

  // Use Cases
  container.register("GetEventsUseCase", () => {
    const repo = container.get("EventRepository");
    return createGetEventsUseCase(repo);
  });

  container.register("GetEventByIdUseCase", () => {
    const repo = container.get("EventRepository");
    return createGetEventByIdUseCase(repo);
  });

  // Controller
  container.register("EventController", () => {
    const getEvents = container.get("GetEventsUseCase");
    const getEventById = container.get("GetEventByIdUseCase");
    return createEventController(getEvents, getEventById);
  });
};
