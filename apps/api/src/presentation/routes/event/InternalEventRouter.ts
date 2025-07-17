// apps/api/src/presentation/routes/event/InternalEventRouter.ts
import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class InternalEventRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("InternalEventController");

    // Liste aller Events (intern)
    this.addRoute({
      method: "GET",
      path: "/api/internal/events",
      handler: controller.getInternalEvents.bind(controller),
      middlewares: [authMiddleware],
    });

    // Event Details (intern)
    this.addRoute({
      method: "GET",
      path: "/api/internal/events/:id",
      handler: controller.getInternalEventById.bind(controller),
      middlewares: [authMiddleware],
    });

    // Event erstellen
    this.addRoute({
      method: "POST",
      path: "/api/internal/events",
      handler: controller.createEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    // Event aktualisieren
    this.addRoute({
      method: "PUT",
      path: "/api/internal/events/:id",
      handler: controller.updateEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    // Event löschen
    this.addRoute({
      method: "DELETE",
      path: "/api/internal/events/:id",
      handler: controller.deleteEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    // Status ändern
    this.addRoute({
      method: "PATCH",
      path: "/api/internal/events/:id/status",
      handler: controller.changeEventStatus.bind(controller),
      middlewares: [authMiddleware],
    });
  }
}
