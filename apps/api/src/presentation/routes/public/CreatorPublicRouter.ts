// src/presentation/routes/public/CreatorPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class CreatorPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("CreatorController");

    this.addRoute({
      method: "GET",
      path: "/api/public/creators/list",
      handler: controller.getPublicCreatorList.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/creators/:creatorId",
      handler: controller.getPublicCreatorDetail.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/creators/gallery",
      handler: controller.getPublicGallery.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/creators/:creatorId/works",
      handler: controller.getPublicCreatorWorks.bind(controller)
    });
  }
}
