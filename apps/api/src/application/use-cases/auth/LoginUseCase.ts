import { IAuthRepository } from "@/infrastructure/repositories/auth/AuthRepository";

export class LoginUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(params: { email: string; password: string }): Promise<{
    success: boolean;
    token?: string;
    refreshToken?: string;
    user?: any;
  }> {
    // TODO: Implement actual login logic
    const user = await this.authRepository.findUserByEmail(params.email);

    if (!user) {
      return { success: false };
    }

    // TODO: Password verification
    return {
      success: true,
      token: "test-token",
      refreshToken: "refresh-token",
      user: {
        id: user.id,
        email: user.email,
        vorname: user.vorname,
        nachname: user.nachname,
        role: "MITGLIED",
      },
    };
  }
}
