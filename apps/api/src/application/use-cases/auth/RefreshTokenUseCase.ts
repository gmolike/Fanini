import { IAuthRepository } from "@/infrastructure/repositories/auth/AuthRepository";

export class RefreshTokenUseCase {
  constructor(private authRepository: IAuthRepository) {}

  async execute(params: { refreshToken: string }): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
  }> {
    // TODO: Implement actual refresh token logic
    // Hier würde normalerweise die Validierung des refresh tokens stattfinden
    return {
      success: true,
      token: "new-token",
      refreshToken: "new-refresh-token",
    };
  }
}
