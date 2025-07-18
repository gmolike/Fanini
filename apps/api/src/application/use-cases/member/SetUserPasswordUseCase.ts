import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { PasswordService } from "@/domain/services/PasswordService";

// apps/api/src/application/use-cases/member/SetUserPasswordUseCase.ts
export type SetUserPasswordParams = {
  userId: string;
  password?: string;
  generateTemporary?: boolean;
  performedBy: string;
};

export type SetUserPasswordResult = {
  success: boolean;
  temporaryPassword?: string;
  error?: string;
};

export type SetUserPasswordUseCase = {
  execute: (params: SetUserPasswordParams) => Promise<SetUserPasswordResult>;
};

export const createSetUserPasswordUseCase = (
  authRepository: IAuthRepository,
  passwordService: PasswordService
): SetUserPasswordUseCase => ({
  execute: async (params) => {
    try {
      // Lade User
      const user = await authRepository.findUserById(params.userId);
      if (!user) {
        return { success: false, error: 'Benutzer nicht gefunden' };
      }

      // Nur lokale User können Passwörter haben
      if (user.authSource !== 'local') {
        return { success: false, error: 'Nur lokale Benutzer können Passwörter haben' };
      }

      let password: string;
      let temporaryPassword: string | undefined;

      if (params.generateTemporary) {
        password = passwordService.generateTemporary();
        temporaryPassword = password;
      } else if (params.password) {
        const validation = passwordService.validatePolicy(params.password);
        if (!validation.isValid) {
          return { success: false, error: validation.errors.join(', ') };
        }
        password = params.password;
      } else {
        return { success: false, error: 'Kein Passwort angegeben' };
      }

      const passwordHash = await passwordService.hash(password);
      const expiresAt = new Date();
      expiresAt.setDate(expiresAt.getDate() + 30);

      await authRepository.updateUser(params.userId, {
        passwordHash,
        metadata: {
          ...user.metadata,
          mustChangePassword: true,
          passwordExpiresAt: expiresAt.toISOString(),
          passwordSetBy: params.performedBy,
          passwordSetAt: new Date().toISOString()
        }
      });

      // Log action
      await authRepository.logPasswordAction({
        user_id: params.userId,
        action: 'reset',
        performed_by: params.performedBy,
        expires_at: expiresAt,
        temporary: params.generateTemporary || false
      });

      return {
        success: true,
        temporaryPassword
      };
    } catch (error) {
      console.error('SetUserPasswordUseCase error:', error);
      return { success: false, error: 'Fehler beim Setzen des Passworts' };
    }
  }
});
