// src/presentation/routes/BaseRouter.ts
import { Container } from "@/infrastructure/di/container";

export type RouteConfig = {
  method: string;
  path: string;
  handler: (req: Request) => Promise<Response>;
  middlewares?: Array<
    (req: Request, next: () => Promise<Response>) => Promise<Response>
  >;
};

export abstract class BaseRouter {
  protected routes: RouteConfig[] = [];

  constructor(protected container: Container) {
    this.setupRoutes();
  }

  abstract setupRoutes(): void;

  protected addRoute(config: RouteConfig) {
    this.routes.push(config);
  }

  async handle(req: Request): Promise<Response | null> {
    const url = new URL(req.url);
    const pathname = url.pathname;
    const method = req.method;

    for (const route of this.routes) {
      if (route.method !== method) continue;

      const match = this.matchPath(pathname, route.path);
      if (match) {
        (req as any).params = match.params;
        (req as any).query = Object.fromEntries(url.searchParams);

        // Execute middlewares
        if (route.middlewares && route.middlewares.length > 0) {
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

        return route.handler(req);
      }
    }

    return null;
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
