// application/use-cases/auth/LoginUseCase.ts
import { AuthService } from "@/application/services/AuthService";
import { IAuthRepository } from "@/domain/repositories/IAuthRepository";

export class LoginUseCase {
  private authService: AuthService;

  constructor(authRepository: IAuthRepository) {
    this.authService = new AuthService(
      authRepository,
      {
        clientId: process.env.EASYVEREIN_CLIENT_ID!,
        clientSecret: process.env.EASYVEREIN_CLIENT_SECRET!,
        apiUrl: process.env.EASYVEREIN_API_URL || "https://api.easyverein.com",
      },
      process.env.JWT_SECRET || "fanini-jwt-secret-2025",
    );
  }

  async execute(params: { email: string; password: string }) {
    return this.authService.login(params.email, params.password);
  }
}
