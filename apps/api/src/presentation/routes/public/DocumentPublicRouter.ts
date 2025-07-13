// src/presentation/routes/public/DocumentPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class DocumentPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("DocumentController");

    this.addRoute({
      method: "GET",
      path: "/api/public/documents",
      handler: controller.getPublicDocuments.bind(controller),
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/documents/:documentId",
      handler: controller.getPublicDocumentDetail.bind(controller),
    });
  }
}
