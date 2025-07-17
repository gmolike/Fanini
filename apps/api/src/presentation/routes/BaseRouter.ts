// apps/api/src/presentation/routes/BaseRouter.ts
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

  // CORS Headers definieren
  protected corsHeaders = {
    'Access-Control-Allow-Origin': process.env.FRONTEND_URL || 'http://localhost:5173',
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS, PATCH',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };

  constructor(protected container: Container) {
    this.setupRoutes();
    this.setupCorsRoutes(); // Automatisch OPTIONS Routes hinzufügen
  }

  abstract setupRoutes(): void;

  protected addRoute(config: RouteConfig) {
    this.routes.push(config);
  }

  // Automatisch OPTIONS Routes für alle definierten Pfade hinzufügen
  private setupCorsRoutes(): void {
    const uniquePaths = new Set<string>();

    // Sammle alle unique Pfade
    this.routes.forEach(route => {
      uniquePaths.add(route.path);
    });

    // Füge OPTIONS Handler für jeden Pfad hinzu
    uniquePaths.forEach(path => {
      this.routes.push({
        method: 'OPTIONS',
        path,
        handler: async (req: Request) => new Response(null, {
          status: 200,
          headers: this.corsHeaders
        }),
      });
    });
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
            return this.addCorsHeaders(await route.handler(req));
          };
          return next();
        }

        return this.addCorsHeaders(await route.handler(req));
      }
    }

    return null;
  }

  // Helper-Methode um CORS Headers zu allen Responses hinzuzufügen
  private async addCorsHeaders(response: Response): Promise<Response> {
    // Clone response mit neuen Headers
    const headers = new Headers(response.headers);

    Object.entries(this.corsHeaders).forEach(([key, value]) => {
      headers.set(key, value);
    });

    // Stelle sicher, dass Content-Type gesetzt ist
    if (!headers.has('Content-Type')) {
      headers.set('Content-Type', 'application/json');
    }

    const body = await response.text();

    return new Response(body, {
      status: response.status,
      statusText: response.statusText,
      headers,
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
