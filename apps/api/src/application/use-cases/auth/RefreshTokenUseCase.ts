// application/use-cases/auth/RefreshTokenUseCase.ts
import { AuthService } from "@/application/services/AuthService";

export type RefreshTokenUseCase = {
  execute: (params: {
    refreshToken: string;
  }) => ReturnType<AuthService["refreshToken"]>;
};
