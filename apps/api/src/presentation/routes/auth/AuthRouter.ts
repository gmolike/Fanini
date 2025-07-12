// src/presentation/routes/auth/AuthRouter.ts
import { BaseRouter } from "../BaseRouter";

export class AuthRouter extends BaseRouter {
  setupRoutes(): void {
    const controller = this.container.get("AuthController");

    this.addRoute({
      method: "POST",
      path: "/api/auth/login",
      handler: controller.login.bind(controller),
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
