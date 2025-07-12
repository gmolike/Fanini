import { Container } from "@/infrastructure/di/container";
import {
  EventController,
  MemberController,
  AuthController,
  StatsController,
  DocumentController
} from "@/presentation/controllers";
import { authMiddleware } from "@/presentation/middleware/auth";

type RouteHandler = (req: Request) => Promise<Response>;
type Middleware = (
  req: Request,
  next: () => Promise<Response>,
) => Promise<Response>;

interface Route {
  method: string;
  path: string;
  handler: RouteHandler;
  middlewares?: Middleware[];
}

export class ApiRouter {
  private readonly routes: Route[] = [];

  constructor(private readonly container: Container) {
    this.setupRoutes();
  }

  private setupRoutes() {
    // Get Controllers from DI Container
    const eventController = this.container.get(
      "EventController",
    ) as EventController;
    const memberController = this.container.get(
      "MemberController",
    ) as MemberController;
    const authController = this.container.get(
      "AuthController",
    ) as AuthController;
    const statsController = this.container.get(
      "StatsController",
    ) as StatsController;
    const documentController = this.container.get(
      "DocumentController",
    ) as DocumentController;

    // Public Routes
    this.addRoute(
      "POST",
      "/api/auth/login",
      authController.login.bind(authController),
    );
    this.addRoute(
      "POST",
      "/api/auth/register",
      authController.register.bind(authController),
    );
    this.addRoute(
      "GET",
      "/api/public/events",
      eventController.getPublicEvents.bind(eventController),
    );

    // Protected Routes (with auth middleware)
    this.addRoute(
      "GET",
      "/api/events",
      eventController.getEvents.bind(eventController),
      [authMiddleware],
    );
    this.addRoute(
      "POST",
      "/api/events",
      eventController.createEvent.bind(eventController),
      [authMiddleware],
    );
    this.addRoute(
      "GET",
      "/api/events/:id",
      eventController.getEvent.bind(eventController),
      [authMiddleware],
    );
    this.addRoute(
      "PUT",
      "/api/events/:id",
      eventController.updateEvent.bind(eventController),
      [authMiddleware],
    );
    this.addRoute(
      "DELETE",
      "/api/events/:id",
      eventController.deleteEvent.bind(eventController),
      [authMiddleware],
    );

    this.addRoute(
      "GET",
      "/api/members",
      memberController.getMembers.bind(memberController),
      [authMiddleware],
    );
    this.addRoute(
      "GET",
      "/api/members/:id",
      memberController.getMember.bind(memberController),
      [authMiddleware],
    );
    // Public Stats Route
    this.addRoute(
      "GET",
      "/api/public/stats",
      statsController.getPublicStats.bind(statsController),
    );
    // Public Routes
    this.addRoute(
      "GET",
      "/api/public/documents",
      documentController.getPublicDocuments.bind(documentController),
    );

    // Protected Routes
    this.addRoute(
      "POST",
      "/api/documents/upload",
      documentController.uploadDocument.bind(documentController),
      [authMiddleware],
    );
  }

  private addRoute(
    method: string,
    path: string,
    handler: RouteHandler,
    middlewares: Middleware[] = [],
  ) {
    this.routes.push({ method, path, handler, middlewares });
  }

  async handle(req: Request): Promise<Response> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    // Find matching route
    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = this.matchPath(pathname, route.path);
      if (match) {
        // Add params to request
        (req as any).params = match.params;

        // Execute middlewares
        let index = 0;
        const next = async (): Promise<Response> => {
          if (index < route.middlewares!.length) {
            const middleware = route.middlewares![index++];
            return middleware(req, next);
          }
          return route.handler(req);
        };

        return next();
      }
    }

    return new Response(JSON.stringify({ error: "Not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    });
  }

  private matchPath(
    pathname: string,
    pattern: string,
  ): { params: Record<string, string> } | null {
    const pathParts = pathname.split("/").filter(Boolean);
    const patternParts = pattern.split("/").filter(Boolean);

    if (pathParts.length !== patternParts.length) return null;

    const params: Record<string, string> = {};

    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(":")) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }

    return { params };
  }
}
