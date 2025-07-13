import { Container } from "../container";
import {
  LoginUseCase,
  RefreshTokenUseCase,
} from "@/application/use-cases/auth";
import { AuthRepository } from "@/infrastructure/repositories/auth/AuthRepository";
import { AuthController } from "@/presentation/controllers";

export const registerAuthSlice = (container: Container) => {
  // Repository
  container.register("AuthRepository", () => {
    const db = container.get("Database");
    return new AuthRepository(db);
  });

  // Use Cases
  container.register("LoginUseCase", () => {
    const repo = container.get("AuthRepository");
    return new LoginUseCase(repo);
  });

  container.register("RefreshTokenUseCase", () => {
    const repo = container.get("AuthRepository");
    return new RefreshTokenUseCase(repo);
  });

  // Controller
  container.register("AuthController", () => {
    const login = container.get("LoginUseCase");
    const refreshToken = container.get("RefreshTokenUseCase");
    return new AuthController(login, refreshToken);
  });
};
