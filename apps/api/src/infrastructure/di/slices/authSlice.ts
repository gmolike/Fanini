// apps/api/src/infrastructure/di/slices/authSlice.ts
import { AuthService } from "@/application/services/AuthService";
import { createPermissionService } from "@/domain/services/PermissionService";
import {
  MySQLAuthRepository,
  MySQLPermissionRepository,
} from "@/infrastructure/repositories";
import { AuthController } from "@/presentation/controllers/auth/AuthController";
import { createGetUserPermissionsUseCase } from "@/application/use-cases/auth/GetUserPermissionsUseCase";
import type { Container } from "../container";

export const registerAuthSlice = (container: Container): void => {
  console.log("🔐 Registering Auth slice...");

  // Repository
  container.register("AuthRepository", () => {
    const db = container.get("Database");
    return new MySQLAuthRepository(db);
  });

  container.register("PermissionRepository", () => {
    const db = container.get("Database");
    return new MySQLPermissionRepository(db);
  });

  // Services
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

  container.register("PermissionService", () => {
    return createPermissionService();
  });

  // Use Cases
  container.register("GetUserPermissionsUseCase", () => {
    const authRepo = container.get("AuthRepository");
    const permissionRepo = container.get("PermissionRepository");
    return createGetUserPermissionsUseCase(authRepo, permissionRepo);
  });

  // Controller - direkt mit AuthService
  container.register("AuthController", () => {
    const authService = container.get("AuthService");
    const authRepository = container.get("AuthRepository");
    return new AuthController(authService, authRepository);
  });

  console.log("✅ Auth slice registered successfully");
};
