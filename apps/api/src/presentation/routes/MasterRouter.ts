// src/presentation/routes/MasterRouter.ts
import { Container } from "@/infrastructure/di/container";
import { BaseRouter } from "./BaseRouter";

// Public Routers
import { EventPublicRouter } from "./public/EventPublicRouter";
import { CreatorPublicRouter } from "./public/CreatorPublicRouter";
import { DocumentPublicRouter } from "./public/DocumentPublicRouter";
import { NewsletterPublicRouter } from "./public/NewsletterPublicRouter";
import { OrganizationPublicRouter } from "./public/OrganizationPublicRouter";
import { StatsPublicRouter } from "./public/StatsPublicRouter";

// Protected Routers
import { AuthRouter } from "./auth/AuthRouter";
import { InternalEventRouter } from "./event/InternalEventRouter";
import { MemberRouter } from "./member/MemberRouter";
import { DocumentRouter } from "./document/DocumentRouter";
import { TaskRouter } from "./task/TaskRouter";

export class MasterRouter {
  private readonly routers: BaseRouter[] = [];

  constructor(container: Container) {
    // Initialize all routers
    this.routers = [
      // Public routes
      new EventPublicRouter(container),
      new CreatorPublicRouter(container),
      new DocumentPublicRouter(container),
      new NewsletterPublicRouter(container),
      new OrganizationPublicRouter(container),
      new StatsPublicRouter(container),

      // Protected routes
      new AuthRouter(container),
      new InternalEventRouter(container),
      new MemberRouter(container),
      new DocumentRouter(container),
      new TaskRouter(container),
    ];
  }

  async handle(req: Request): Promise<Response> {
    for (const router of this.routers) {
      const response = await router.handle(req);
      if (response) return response;
    }

    return new Response(JSON.stringify({ error: "Route not found" }), {
      status: 404,
    });
  }
}
