// src/presentation/routes/public/EventPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class EventPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("EventController");

    this.addRoute({
      method: "GET",
      path: "/api/public/event/list",
      handler: controller.getPublicEventList.bind(controller),
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/event/:eventId",
      handler: controller.getPublicEventDetail.bind(controller),
    });
  }
}
