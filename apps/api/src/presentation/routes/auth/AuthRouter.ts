// src/presentation/routes/auth/AuthRouter.ts
import { BaseRouter } from "../BaseRouter";

export class AuthRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("AuthController");
    
    this.addRoute({
      method: "POST",
      path: "/api/auth/login",
      handler: async (req) => {
        try {
          console.log("📥 Login request received");
          const controller = this.container.get("AuthController");
          return await controller.login(req);
        } catch (error) {
          console.error("❌ Auth route error:", error);
          return new Response(
            JSON.stringify({ success: false, error: error.message }),
            { status: 500 },
          );
        }
      },
    });

    this.addRoute({
      method: "POST",
      path: "/api/auth/register",
      handler: controller.register.bind(controller),
    });

    this.addRoute({
      method: "POST",
      path: "/api/auth/refresh",
      handler: controller.refresh.bind(controller),
    });

    this.addRoute({
      method: "POST",
      path: "/api/auth/logout",
      handler: controller.logout.bind(controller),
    });
  }
}
