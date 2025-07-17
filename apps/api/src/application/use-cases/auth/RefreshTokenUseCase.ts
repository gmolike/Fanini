// apps/api/src/application/use-cases/auth/RefreshTokenUseCase.ts
import type { RefreshResult } from "@/application/services/AuthService";

/**
 * Refresh Token Use Case
 * @description Business-Logik für Token-Refresh
 */
export type RefreshTokenUseCase = {
  /**
   * Erneuert den Access Token
   * @param params - Refresh-Parameter
   * @returns Refresh-Ergebnis
   */
  execute: (params: { refreshToken: string }) => Promise<RefreshResult>;
};
