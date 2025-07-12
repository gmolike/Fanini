// src/presentation/routes/document/DocumentRouter.ts
import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class DocumentRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("DocumentController");

    // Der Upload bleibt als separate Route bestehen!
    // Wird weiterhin über app/api/documents/upload/route.ts gehandhabt

    this.addRoute({
      method: "GET",
      path: "/api/documents",
      handler: controller.getDocuments.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "DELETE",
      path: "/api/documents/:id",
      handler: controller.deleteDocument.bind(controller),
      middlewares: [authMiddleware],
    });
  }
}
