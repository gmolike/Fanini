// src/presentation/routes/event/EventRouter.ts
import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class EventRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("EventController");

    // Protected routes
    this.addRoute({
      method: "GET",
      path: "/api/events",
      handler: controller.getEvents.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "POST",
      path: "/api/events",
      handler: controller.createEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/events/:id",
      handler: controller.getEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "PUT",
      path: "/api/events/:id",
      handler: controller.updateEvent.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "DELETE",
      path: "/api/events/:id",
      handler: controller.deleteEvent.bind(controller),
      middlewares: [authMiddleware],
    });
  }
}
