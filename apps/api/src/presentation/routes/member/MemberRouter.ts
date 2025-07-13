// src/presentation/routes/member/MemberRouter.ts
import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class MemberRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("MemberController");

    this.addRoute({
      method: "GET",
      path: "/api/members",
      handler: controller.getMembers.bind(controller),
      middlewares: [authMiddleware]
    });

    this.addRoute({
      method: "GET",
      path: "/api/members/:id",
      handler: controller.getMember.bind(controller),
      middlewares: [authMiddleware]
    });
  }
}
