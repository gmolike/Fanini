// apps/api/src/domain/repositories/IAuthRepository.ts
import type { User, UserRole } from "@/domain/entities/User";

/**
 * Auth Repository Interface
 * @description Definiert alle Methoden für Authentifizierungs-Datenzugriff
 */
export interface IAuthRepository {
  // ===== USER METHODS =====
  /**
   * Findet einen User anhand der E-Mail
   * @param email - Die E-Mail-Adresse
   * @returns User oder null
   */
  findUserByEmail(email: string): Promise<User | null>;

  /**
   * Findet einen User anhand der EasyVerein ID
   * @param easyVereinId - Die EasyVerein ID
   * @returns User oder null
   */
  findUserByEasyVereinId(easyVereinId: string): Promise<User | null>;

  /**
   * Findet einen User anhand der ID
   * @param id - Die User ID
   * @returns User oder null
   */
  findUserById(id: string): Promise<User | null>;

  /**
   * Erstellt einen neuen User
   * @param userData - Die User-Daten ohne ID und Timestamps
   * @returns Der erstellte User
   */
  createUser(
    userData: Omit<User, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<User>;

  /**
   * Aktualisiert einen User
   * @param userId - Die User ID
   * @param updates - Die zu aktualisierenden Felder
   */
  updateUser(userId: string, updates: Partial<User>): Promise<void>;

  /**
   * Aktualisiert den letzten Login-Zeitpunkt
   * @param userId - Die User ID
   */
  updateLastLogin(userId: string): Promise<void>;

  // ===== ROLE METHODS =====
  /**
   * Lädt alle Rollen eines Users
   * @param userId - Die User ID
   * @returns Array von UserRole
   */
  getUserRoles(userId: string): Promise<UserRole[]>;

  /**
   * Weist einem User eine Rolle zu
   * @param userId - Die User ID
   * @param roleId - Die Rollen ID
   * @param assignedBy - ID des zuweisenden Users
   */
  assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string,
  ): Promise<void>;

  /**
   * Entfernt eine Rolle von einem User
   * @param userId - Die User ID
   * @param roleId - Die Rollen ID
   */
  removeRole(userId: string, roleId: string): Promise<void>;

  // ===== REFRESH TOKEN METHODS =====
  /**
   * Speichert einen Refresh Token
   * @param params - Token-Parameter
   */
  saveRefreshToken(params: {
    userId: string;
    token: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }): Promise<void>;

  /**
   * Findet einen Refresh Token
   * @param token - Der Token-String
   * @returns Token-Daten oder null
   */
  findRefreshToken(token: string): Promise<{
    userId: string;
    expiresAt: Date;
    revokedAt?: Date;
  } | null>;

  /**
   * Widerruft einen Refresh Token
   * @param token - Der Token-String
   * @param revokedBy - ID des widerrufenden Users
   */
  revokeRefreshToken(token: string, revokedBy: string): Promise<void>;

  /**
   * Widerruft alle Refresh Tokens eines Users
   * @param userId - Die User ID
   * @param revokedBy - ID des widerrufenden Users
   */
  revokeAllUserRefreshTokens(userId: string, revokedBy: string): Promise<void>;
  
  /**
   * Loggt eine Password-Aktion
   * @param params - Die Log-Parameter
   */
  logPasswordAction(params: {
    user_id: string;
    action: "set" | "change" | "reset" | "expire";
    performed_by: string;
    expires_at?: Date;
    temporary: boolean;
    ip_address?: string;
    user_agent?: string;
  }): Promise<void>;
}
