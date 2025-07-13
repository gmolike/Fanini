// src/presentation/routes/public/OrganizationPublicRouter.ts
import { BaseRouter } from "../BaseRouter";

export class OrganizationPublicRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("OrganizationController");

    this.addRoute({
      method: "GET",
      path: "/api/public/organization/structure",
      handler: controller.getPublicStructure.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/organization/documents",
      handler: controller.getPublicOrganizationDocuments.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/organization/gremien/:gremiumId",
      handler: controller.getPublicGremiumDetail.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/faq",
      handler: controller.getPublicFAQ.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/team-history/years",
      handler: controller.getTeamHistoryYears.bind(controller)
    });

    this.addRoute({
      method: "GET",
      path: "/api/public/team-history/:year",
      handler: controller.getTeamHistoryByYear.bind(controller)
    });
  }
}
