import { authMiddleware } from "@/presentation/middleware";
import { createPermissionMiddleware } from "@/presentation/middleware/permissionMiddleware";
import { BaseRouter } from "../BaseRouter";

// apps/api/src/presentation/routes/member/MemberRouter.ts
export class MemberRouter extends BaseRouter {
  setupRoutes(): void {
    // PROBLEM: Hier wird der falsche Controller verwendet!
    const controller = this.container.get("MemberController");

    // Das sollte sein:
    const protectedController = this.container.get("ProtectedMemberController");
    const localMemberController = this.container.get("LocalMemberController");

    // GET /api/members sollte ProtectedMemberController verwenden
    this.addRoute({
      method: "GET",
      path: "/api/members",
      handler: protectedController.getMembers.bind(protectedController), 
      middlewares: [
        authMiddleware,
        createPermissionMiddleware(this.container, "member.read"),
      ],
    });

    // GET /api/members/:id
    this.addRoute({
      method: "GET",
      path: "/api/members/:id",
      handler: controller.getMember.bind(controller),
      middlewares: [authMiddleware],
    });

    // POST /api/members/local
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

    // PUT /api/members/:id/password
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
