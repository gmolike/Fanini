// apps/api/src/application/use-cases/member/CreateLocalMemberUseCase.ts
import type { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { PasswordService } from "@/domain/services/PasswordService";
import type { User } from "@/domain/entities/User";

export type CreateLocalMemberParams = {
  // Basis-Daten
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  memberType: 'creator' | 'sponsor' | 'partner';

  // Password-Optionen
  passwordOption: 'none' | 'generate' | 'manual';
  password?: string;

  // Creator-spezifisch
  kuenstlername?: string;
  portfolio?: string;

  // Meta
  createdBy: string;
};

export type CreateLocalMemberResult = {
  success: boolean;
  memberId?: string;
  userId?: string;
  temporaryPassword?: string;
  error?: string;
};

export type CreateLocalMemberUseCase = {
  execute: (params: CreateLocalMemberParams) => Promise<CreateLocalMemberResult>;
};

export const createCreateLocalMemberUseCase = (
  authRepository: IAuthRepository,
  memberRepository: IMemberRepository,
  passwordService: PasswordService,
  transactionManager: any // TODO: Proper type
): CreateLocalMemberUseCase => ({
  execute: async (params) => {
    try {
      return await transactionManager.runInTransaction(async () => {
        // 1. Prüfe ob E-Mail bereits existiert
        const existingUser = await authRepository.findUserByEmail(params.email);
        if (existingUser) {
          return {
            success: false,
            error: 'E-Mail-Adresse wird bereits verwendet'
          };
        }

        // 2. Erstelle User
        let passwordHash: string | undefined;
        let temporaryPassword: string | undefined;
        let mustChangePassword = false;
        let passwordExpiresAt: Date | undefined;

        if (params.passwordOption === 'generate') {
          temporaryPassword = passwordService.generateTemporary();
          passwordHash = await passwordService.hash(temporaryPassword);
          mustChangePassword = true;
          passwordExpiresAt = new Date();
          passwordExpiresAt.setDate(passwordExpiresAt.getDate() + 30);
        } else if (params.passwordOption === 'manual' && params.password) {
          const validation = passwordService.validatePolicy(params.password);
          if (!validation.isValid) {
            return {
              success: false,
              error: validation.errors.join(', ')
            };
          }
          passwordHash = await passwordService.hash(params.password);
        }

        const user = await authRepository.createUser({
          email: params.email,
          vorname: params.vorname,
          nachname: params.nachname,
          authSource: 'local',
          passwordHash,
          istAktiv: true,
          role: params.memberType === 'creator' ? 'MITGLIED' : 'MITGLIED',
          metadata: {
            memberType: params.memberType,
            mustChangePassword,
            passwordExpiresAt: passwordExpiresAt?.toISOString(),
            passwordSetBy: params.createdBy,
            passwordSetAt: new Date().toISOString()
          }
        });

        // 3. Erstelle Mitglied
        const member = await memberRepository.create({
          user_id: user.id,
          vorname: params.vorname,
          nachname: params.nachname,
          email: params.email,
          telefon: params.telefon,
          member_type: params.memberType,
          mitglied_seit: new Date(),
          ist_aktiv: true
        });

        // 4. Bei Creator: Erstelle creator_profile
        if (params.memberType === 'creator') {
          await memberRepository.createCreatorProfile({
            member_id: member.id,
            kuenstlername: params.kuenstlername || `${params.vorname} ${params.nachname}`,
            portfolio_link: params.portfolio,
            ist_aktiv: true,
            aktiv_seit: new Date()
          });
        }

        // 5. Logge Password-Action
        if (passwordHash) {
          await authRepository.logPasswordAction({
            user_id: user.id,
            action: 'set',
            performed_by: params.createdBy,
            expires_at: passwordExpiresAt,
            temporary: params.passwordOption === 'generate'
          });
        }

        return {
          success: true,
          memberId: member.id,
          userId: user.id,
          temporaryPassword
        };
      });
    } catch (error) {
      console.error('CreateLocalMemberUseCase error:', error);
      return {
        success: false,
        error: 'Fehler beim Anlegen des Mitglieds'
      };
    }
  }
});
