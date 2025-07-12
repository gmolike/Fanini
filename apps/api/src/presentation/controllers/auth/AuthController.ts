export class AuthController {
  constructor(
    private loginUseCase: any,
    private refreshTokenUseCase: any
  ) {}

  async login(req: Request): Promise<Response> {
    // TODO: Implement
    return Response.json({ message: 'Login endpoint' });
  }

  async register(req: Request): Promise<Response> {
    // TODO: Implement
    return Response.json({ message: 'Register endpoint' });
  }

  async refresh(req: Request): Promise<Response> {
    // TODO: Implement
    return Response.json({ message: 'Refresh endpoint' });
  }

  async logout(req: Request): Promise<Response> {
    // TODO: Implement
    return Response.json({ message: 'Logout endpoint' });
  }
}
