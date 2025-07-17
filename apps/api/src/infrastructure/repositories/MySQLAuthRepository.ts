// infrastructure/repositories/MySQLAuthRepository.ts
import { User, UserRole } from "@/domain/entities/User";
import { IAuthRepository } from "@/domain/repositories/IAuthRepository";
import { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export class MySQLAuthRepository implements IAuthRepository {
  constructor(private readonly db: MySQLConnection) {}

  // ===== USER METHODS =====
  async findUserByEmail(email: string): Promise<User | null> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM users WHERE email = ?",
      [email],
    );

    return rows[0] ? this.mapToUser(rows[0]) : null;
  }

  async findUserByEasyVereinId(easyVereinId: string): Promise<User | null> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM users WHERE easyverein_id = ?",
      [easyVereinId],
    );

    return rows[0] ? this.mapToUser(rows[0]) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM users WHERE id = ?",
      [id],
    );

    return rows[0] ? this.mapToUser(rows[0]) : null;
  }

  async createUser(
    userData: Omit<User, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<User> {
    const user: User = {
      ...userData,
      id: generateId(),
      erstelltAm: new Date(),
      aktualisiertAm: new Date(),
    };

    await this.db.query(
      `INSERT INTO users
       (id, email, vorname, nachname, mitgliedsnummer, auth_source,
        easyverein_id, password_hash, ist_aktiv, erstellt_am, aktualisiert_am)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        user.id,
        user.email,
        user.vorname,
        user.nachname,
        user.mitgliedsnummer,
        user.authSource,
        user.easyVereinId,
        user.passwordHash,
        user.istAktiv,
        user.erstelltAm,
        user.aktualisiertAm,
      ],
    );

    return user;
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const fields = Object.keys(updates)
      .map((key) => `${this.camelToSnake(key)} = ?`)
      .join(", ");

    const values = Object.values(updates);
    values.push(userId);

    await this.db.query(
      `UPDATE users SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values,
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db.query("UPDATE users SET letzter_login = NOW() WHERE id = ?", [
      userId,
    ]);
  }

  // ===== ROLE METHODS =====
  async getUserRoles(userId: string): Promise<UserRole[]> {
    const rows = await this.db.query<any[]>(
      `SELECT r.*, GROUP_CONCAT(p.resource, '.', p.action) as permissions
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE ur.user_id = ?
       GROUP BY r.id`,
      [userId],
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      berechtigungen: row.permissions ? row.permissions.split(",") : [],
    }));
  }

  async assignRole(
    userId: string,
    roleId: string,
    assignedBy?: string,
  ): Promise<void> {
    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE zugewiesen_am = NOW()`,
      [userId, roleId, assignedBy || userId],
    );
  }

  async removeRole(userId: string, roleId: string): Promise<void> {
    await this.db.query(
      "DELETE FROM user_roles WHERE user_id = ? AND role_id = ?",
      [userId, roleId],
    );
  }

  // ===== REFRESH TOKEN METHODS =====
  async saveRefreshToken(params: {
    userId: string;
    token: string;
    expiresAt: Date;
    deviceInfo?: string;
    ipAddress?: string;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO refresh_tokens
       (id, user_id, token, expires_at, device_info, ip_address)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        generateId(),
        params.userId,
        params.token,
        params.expiresAt,
        params.deviceInfo || null,
        params.ipAddress || null,
      ],
    );
  }

  async findRefreshToken(token: string): Promise<{
    userId: string;
    expiresAt: Date;
    revokedAt?: Date;
  } | null> {
    const rows = await this.db.query<any[]>(
      `SELECT user_id, expires_at, revoked_at
       FROM refresh_tokens
       WHERE token = ?`,
      [token],
    );

    if (rows.length === 0) return null;

    return {
      userId: rows[0].user_id,
      expiresAt: new Date(rows[0].expires_at),
      revokedAt: rows[0].revoked_at ? new Date(rows[0].revoked_at) : undefined,
    };
  }

  async revokeRefreshToken(token: string, revokedBy: string): Promise<void> {
    await this.db.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW(), revoked_by = ?
       WHERE token = ? AND revoked_at IS NULL`,
      [revokedBy, token],
    );
  }

  async revokeAllUserRefreshTokens(
    userId: string,
    revokedBy: string,
  ): Promise<void> {
    await this.db.query(
      `UPDATE refresh_tokens
       SET revoked_at = NOW(), revoked_by = ?
       WHERE user_id = ? AND revoked_at IS NULL`,
      [revokedBy, userId],
    );
  }

  // ===== PRIVATE HELPER METHODS =====
  private mapToUser(row: any): User {
    return {
      id: row.id,
      email: row.email,
      vorname: row.vorname,
      nachname: row.nachname,
      mitgliedsnummer: row.mitgliedsnummer,
      authSource: row.auth_source,
      easyVereinId: row.easyverein_id,
      passwordHash: row.password_hash,
      istAktiv: Boolean(row.ist_aktiv),
      erstelltAm: new Date(row.erstellt_am),
      aktualisiertAm: new Date(row.aktualisiert_am),
      letzterLogin: row.letzter_login ? new Date(row.letzter_login) : undefined,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
