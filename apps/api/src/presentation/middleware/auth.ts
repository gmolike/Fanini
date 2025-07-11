export async function authMiddleware(
  req: Request,
  next: () => Promise<Response>,
): Promise<Response> {
  // TODO: Implement proper auth
  // For now, just pass through
  (req as any).userId = "test-user-id";
  (req as any).userRole = "member";

  return next();
}
