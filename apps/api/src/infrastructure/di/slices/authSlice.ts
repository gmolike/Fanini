// apps/api/src/infrastructure/di/slices/authSlice.ts
import type { Container } from "../container";
import { MySQLAuthRepository } from "@/infrastructure/repositories/MySQLAuthRepository";
import { AuthController } from "@/presentation/controllers/auth/AuthController";
import { AuthService } from "@/application/services/AuthService";
import type {
  LoginUseCase,
  RefreshTokenUseCase,
} from "@/application/use-cases/auth";

export const registerAuthSlice = (container: Container): void => {
  console.log("🔐 Registering Auth slice...");

  // Repository
  container.register("AuthRepository", () => {
    const db = container.get("Database");
    return new MySQLAuthRepository(db);
  });

  // Auth Service
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
  container.register("LoginUseCase", (): LoginUseCase => {
    const authService = container.get("AuthService");
    return {
      execute: (params) => authService.login(params.email, params.password),
    };
  });

  container.register("RefreshTokenUseCase", (): RefreshTokenUseCase => {
    const authService = container.get("AuthService");
    return {
      execute: (params) => authService.refreshToken(params.refreshToken),
    };
  });

  // Controller - HIER IST WAHRSCHEINLICH DAS PROBLEM
  container.register("AuthController", () => {
    console.log("📋 Creating AuthController...");
    const loginUseCase = container.get("LoginUseCase");
    const refreshTokenUseCase = container.get("RefreshTokenUseCase");
    const authRepository = container.get("AuthRepository");
    return new AuthController(
      loginUseCase,
      refreshTokenUseCase,
      authRepository,
    );
  });

  console.log("✅ Auth slice registered successfully");
};
