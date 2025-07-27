// apps/api/src/infrastructure/repositories/MySQLMemberRepository.ts
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export class MySQLMemberRepository implements IMemberRepository {
  constructor(private readonly db: MySQLConnection) {}

  async findAll(filters?: {
    active?: boolean;
    search?: string;
    roleId?: string;
  }): Promise<any[]> {
    let sql = `
      SELECT m.*,
             u.email as auth_email,
             u.role,
             r.name as role_name
      FROM mitglieder m
      LEFT JOIN users u ON m.user_id = u.id
      LEFT JOIN user_roles ur ON u.id = ur.user_id
      LEFT JOIN roles r ON ur.role_id = r.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.active !== undefined) {
      sql += " AND m.ist_aktiv = ?";
      params.push(filters.active);
    }

    if (filters?.search) {
      sql += ` AND (
        m.vorname LIKE ? OR
        m.nachname LIKE ? OR
        m.email LIKE ? OR
        u.email LIKE ?
      )`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm, searchTerm);
    }

    if (filters?.roleId) {
      sql += " AND ur.role_id = ?";
      params.push(filters.roleId);
    }

    sql += " ORDER BY m.nachname, m.vorname";

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(this.mapRowToMember);
  }

  async findById(id: string): Promise<any> {
    const [row] = await this.db.query<any[]>(
      `SELECT m.*,
              u.email as auth_email,
              u.role,
              r.name as role_name
       FROM mitglieder m
       LEFT JOIN users u ON m.user_id = u.id
       LEFT JOIN user_roles ur ON u.id = ur.user_id
       LEFT JOIN roles r ON ur.role_id = r.id
       WHERE m.id = ?`,
      [id],
    );

    return row ? this.mapRowToMember(row) : null;
  }

  async update(id: string, data: any): Promise<any> {
    const fields = Object.keys(data)
      .filter(
        (key) =>
          !["id", "user_id", "erstellt_am", "aktualisiert_am"].includes(key),
      )
      .map((key) => `${this.camelToSnake(key)} = ?`)
      .join(", ");

    const values = Object.entries(data)
      .filter(
        ([key]) =>
          !["id", "user_id", "erstellt_am", "aktualisiert_am"].includes(key),
      )
      .map(([_, value]) => value);

    values.push(id);

    await this.db.query(
      `UPDATE mitglieder SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values,
    );

    return this.findById(id);
  }

  async create(data: {
    user_id: string;
    vorname: string;
    nachname: string;
    email: string;
    telefon?: string;
    member_type: "easyverein" | "creator" | "sponsor" | "partner";
    mitglied_seit: Date;
    ist_aktiv: boolean;
  }): Promise<any> {
    const id = generateId("mbr");

    await this.db.query(
      `INSERT INTO mitglieder
       (id, user_id, vorname, nachname, email, telefon,
        member_type, mitglied_seit, ist_aktiv)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.user_id,
        data.vorname,
        data.nachname,
        data.email,
        data.telefon,
        data.member_type,
        data.mitglied_seit,
        data.ist_aktiv,
      ],
    );

    return this.findById(id);
  }

  async createCreatorProfile(data: {
    member_id: string;
    kuenstlername: string;
    portfolio_link?: string;
    ist_aktiv: boolean;
    aktiv_seit: Date;
  }): Promise<any> {
    const id = generateId("crt");

    await this.db.query(
      `INSERT INTO creator_profiles
       (id, member_id, kuenstlername, portfolio_link,
        ist_aktiv, aktiv_seit)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.member_id,
        data.kuenstlername,
        data.portfolio_link,
        data.ist_aktiv,
        data.aktiv_seit,
      ],
    );

    return { id, ...data };
  }

  private mapRowToMember(row: any): any {
    return {
      id: row.id,
      userId: row.user_id,
      vorname: row.vorname,
      nachname: row.nachname,
      email: row.email,
      telefon: row.telefon,
      memberType: row.member_type,
      mitgliedSeit: row.mitglied_seit ? new Date(row.mitglied_seit) : undefined,
      istAktiv: Boolean(row.ist_aktiv),
      hatVertraulichkeitserklaerung: Boolean(
        row.hat_vertraulichkeitserklaerung,
      ),
      profilbild: row.profilbild,
      beschreibung: row.beschreibung,
      sichtbarkeitEmail: row.sichtbarkeit_email,
      sichtbarkeitTelefon: row.sichtbarkeit_telefon,
      sichtbarkeitProfil: row.sichtbarkeit_profil,
      erstelltAm: new Date(row.erstellt_am),
      aktualisiertAm: new Date(row.aktualisiert_am),
      // User Info
      authEmail: row.auth_email,
      role: row.role,
      roleName: row.role_name,
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
