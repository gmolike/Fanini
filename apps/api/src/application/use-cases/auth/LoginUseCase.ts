// apps/api/src/application/use-cases/auth/LoginUseCase.ts
import type { LoginResult } from "@/application/services/AuthService";

/**
 * Login Use Case
 * @description Business-Logik für User-Login
 */
export type LoginUseCase = {
  /**
   * Führt den Login aus
   * @param params - Login-Parameter
   * @returns Login-Ergebnis
   */
  execute: (params: {
    email: string;
    password: string;
  }) => Promise<LoginResult>;
};
