// infrastructure/repositories/MySQLAuthRepository.ts
import { MySQLConnection } from './MySQLConnection';
import { User, UserRole } from '@/domain/entities/User';
import { IAuthRepository } from '@/infrastructure/repositories/auth/AuthRepository';
import { generateId } from '@faninitiative/shared';

export class MySQLAuthRepository implements IAuthRepository {
  constructor(private readonly db: MySQLConnection) {}
  updateRefreshToken(userId: string, token: string): Promise<void> {
    throw new Error('Method not implemented.');
  }

  async findUserByEmail(email: string): Promise<User | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    return rows[0] ? this.mapToUser(rows[0]) : null;
  }

  async findUserByEasyVereinId(easyVereinId: string): Promise<User | null> {
    const rows = await this.db.query<any[]>(
      'SELECT * FROM users WHERE easyverein_id = ?',
      [easyVereinId]
    );

    return rows[0] ? this.mapToUser(rows[0]) : null;
  }

  async createUser(userData: Omit<User, 'id' | 'erstelltAm' | 'aktualisiertAm'>): Promise<User> {
    const user: User = {
      ...userData,
      id: generateId(),
      erstelltAm: new Date(),
      aktualisiertAm: new Date()
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
        user.aktualisiertAm
      ]
    );

    return user;
  }

  async getUserRoles(userId: string): Promise<UserRole[]> {
    const rows = await this.db.query<any[]>(
      `SELECT r.*, GROUP_CONCAT(p.resource, '.', p.action) as permissions
       FROM user_roles ur
       JOIN roles r ON ur.role_id = r.id
       LEFT JOIN role_permissions rp ON r.id = rp.role_id
       LEFT JOIN permissions p ON rp.permission_id = p.id
       WHERE ur.user_id = ?
       GROUP BY r.id`,
      [userId]
    );

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      berechtigungen: row.permissions ? row.permissions.split(',') : []
    }));
  }

  async assignRole(userId: string, roleId: string, assignedBy?: string): Promise<void> {
    await this.db.query(
      `INSERT INTO user_roles (user_id, role_id, zugewiesen_von)
       VALUES (?, ?, ?)
       ON DUPLICATE KEY UPDATE zugewiesen_am = NOW()`,
      [userId, roleId, assignedBy || userId]
    );
  }

  async updateLastLogin(userId: string): Promise<void> {
    await this.db.query(
      'UPDATE users SET letzter_login = NOW() WHERE id = ?',
      [userId]
    );
  }

  async updateUser(userId: string, updates: Partial<User>): Promise<void> {
    const fields = Object.keys(updates)
      .map(key => `${this.camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.values(updates);
    values.push(userId);

    await this.db.query(
      `UPDATE users SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values
    );
  }

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
      letzterLogin: row.letzter_login ? new Date(row.letzter_login) : undefined
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
  }
}
