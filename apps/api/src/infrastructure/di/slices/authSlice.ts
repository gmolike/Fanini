// infrastructure/di/slices/authSlice.ts
import { Container } from "../container";
import { MySQLAuthRepository } from "@/infrastructure/repositories/MySQLAuthRepository";
import { AuthController } from "@/presentation/controllers";
import { AuthService } from "@/application/services/AuthService";

export const registerAuthSlice = (container: Container) => {
  // Repository
  container.register("AuthRepository", () => {
    const db = container.get("Database");
    return new MySQLAuthRepository(db);
  });

  // Auth Service (NEU - wird von Use Cases verwendet)
  container.register("AuthService", () => {
    const authRepo = container.get("AuthRepository");

    const easyVereinConfig = {
      clientId: process.env.EASYVEREIN_CLIENT_ID || "",
      clientSecret: process.env.EASYVEREIN_CLIENT_SECRET || "",
      apiUrl: process.env.EASYVEREIN_API_URL || "https://api.easyverein.com",
    };

    const jwtSecret = process.env.JWT_SECRET || "fanini-jwt-secret-2025";

    return new AuthService(authRepo, easyVereinConfig, jwtSecret);
  });

  // Use Cases
  container.register("LoginUseCase", () => {
    const authService = container.get("AuthService");
    return {
      execute: (params: { email: string; password: string }) =>
        authService.login(params.email, params.password),
    };
  });

  container.register("RefreshTokenUseCase", () => {
    const authService = container.get("AuthService");
    return {
      execute: (params: { refreshToken: string }) =>
        authService.refreshToken(params.refreshToken),
    };
  });

  // Controller
  container.register("AuthController", () => {
    const loginUseCase = container.get("LoginUseCase");
    const refreshTokenUseCase = container.get("RefreshTokenUseCase");
    return new AuthController(loginUseCase, refreshTokenUseCase);
  });
};
