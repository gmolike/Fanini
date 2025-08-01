// apps/api/src/infrastructure/di/slices/eventSlice.ts
import {
  createGetPublicEventsUseCase,
  createGetPublicEventByIdUseCase,
} from "@/application/use-cases/event";
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
  container.register("GetPublicEventsUseCase", () => {
    const repo = container.get("EventRepository");
    return createGetPublicEventsUseCase(repo);
  });

  container.register("GetPublicEventByIdUseCase", () => {
    const repo = container.get("EventRepository");
    const taskRepo = container.get("TaskRepository");
    return createGetPublicEventByIdUseCase(repo, taskRepo);
  });

  // Controller
  container.register("EventController", () => {
    const getPublicEvents = container.get("GetPublicEventsUseCase");
    const getPublicEventById = container.get("GetPublicEventByIdUseCase");
    return createEventController(getPublicEvents, getPublicEventById);
  });
};
