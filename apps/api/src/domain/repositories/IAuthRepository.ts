import { User, UserRole } from "@/domain/entities";

// domain/repositories/IAuthRepository.ts
export interface IAuthRepository {
  // User finden
  findUserByEmail(email: string): Promise<User | null>;
  findUserByEasyVereinId(easyVereinId: string): Promise<User | null>;
  findUserById(id: string): Promise<User | null>;

  // User verwalten
  createUser(
    userData: Omit<User, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<User>;
  updateUser(userId: string, updates: Partial<User>): Promise<void>;
  updateLastLogin(userId: string): Promise<void>;

  // Rollen
  getUserRoles(userId: string): Promise<UserRole[]>;
  assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string,
  ): Promise<void>;
  removeRole(userId: string, roleId: string): Promise<void>;

  saveRefreshToken(params: {
    userId: string;
    token: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }): Promise<void>;

  findRefreshToken(token: string): Promise<{
    userId: string;
    expiresAt: Date;
    revokedAt?: Date;
  } | null>;

  revokeRefreshToken(token: string, revokedBy: string): Promise<void>;
  revokeAllUserRefreshTokens(userId: string, revokedBy: string): Promise<void>;
}
