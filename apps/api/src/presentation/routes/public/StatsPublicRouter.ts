// src/presentation/routes/public/StatsPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class StatsPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("StatsController");

    this.addRoute({
      method: "GET",
      path: "/api/public/stats",
      handler: controller.getPublicStats.bind(controller)
    });
  }
}
