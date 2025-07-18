// src/presentation/routes/member/MemberRouter.ts
import { createPermissionMiddleware } from "@/presentation/middleware/permissionMiddleware";
import { BaseRouter } from "../BaseRouter";
import { authMiddleware } from "@/presentation/middleware/auth";

export class MemberRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("MemberController");

    this.addRoute({
      method: "GET",
      path: "/api/members",
      handler: controller.getMembers.bind(controller),
      middlewares: [authMiddleware],
    });

    this.addRoute({
      method: "GET",
      path: "/api/members/:id",
      handler: controller.getMember.bind(controller),
      middlewares: [authMiddleware],
    });
    const localMemberController = this.container.get("LocalMemberController");

    // Create local member
    this.addRoute({
      method: "POST",
      path: "/api/members/local",
      handler: localMemberController.createLocalMember.bind(
        localMemberController,
      ),
      middlewares: [
        authMiddleware,
        createPermissionMiddleware(this.container, "member.create"),
      ],
    });

    // Set member password
    this.addRoute({
      method: "PUT",
      path: "/api/members/:id/password",
      handler: localMemberController.setPassword.bind(localMemberController),
      middlewares: [
        authMiddleware,
        createPermissionMiddleware(this.container, "member.edit_all"),
      ],
    });
  }
}
