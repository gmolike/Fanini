// apps/api/src/presentation/middleware/auth.ts
import { verify } from "jsonwebtoken";

export async function authMiddleware(
  req: Request,
  next: () => Promise<Response>,
): Promise<Response> {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return Response.json(
        { error: "Missing or invalid authorization header" },
        { status: 401 },
      );
    }

    const token = authHeader.substring(7);
    const decoded = verify(token, process.env.JWT_SECRET || "secret") as any;

    // User-Daten an Request anhängen
    (req as any).userId = decoded.userId;
    (req as any).userRole = decoded.role;
    (req as any).userName = decoded.name;

    return next();
  } catch (error) {
    return Response.json(
      { error: "Invalid or expired token" },
      { status: 401 },
    );
  }
}
