import { IMemberRepository } from "@/domain/repositories";
import { BaseRepository } from "./BaseRepository";
import { MySQLConnection } from "./MySQLConnection";

// apps/api/src/infrastructure/repositories/MySQLMemberRepository.ts
export class MySQLMemberRepository
  extends BaseRepository<Member>
  implements IMemberRepository
{
  constructor(db: MySQLConnection) {
    super(db, "mitglieder");
  }
  findById(id: string): Promise<any | null> {
    throw new Error("Method not implemented.");
  }
  update(id: string, data: any): Promise<any> {
    throw new Error("Method not implemented.");
  }
  create(data: { user_id: string; vorname: string; nachname: string; email: string; telefon?: string; member_type: "easyverein" | "creator" | "sponsor" | "partner"; mitglied_seit: Date; ist_aktiv: boolean; }): Promise<any> {
    throw new Error("Method not implemented.");
  }
  createCreatorProfile(data: { member_id: string; kuenstlername: string; portfolio_link?: string; ist_aktiv: boolean; aktiv_seit: Date; }): Promise<any> {
    throw new Error("Method not implemented.");
  }

  // Nutze View für vollständige Daten
  async findAll(filters?: MemberFilters): Promise<MemberWithUser[]> {
    let sql = `
      SELECT * FROM v_active_members
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.roleId) {
      sql += " AND role_id = ?";
      params.push(filters.roleId);
    }

    if (filters?.search) {
      sql += ` AND (
        vorname LIKE ? OR
        nachname LIKE ? OR
        auth_email LIKE ?
      )`;
      const search = `%${filters.search}%`;
      params.push(search, search, search);
    }

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(this.mapViewToMemberWithUser);
  }

  // Transactional Create mit User
  async createWithUser(
    userData: CreateUserData,
    memberData: CreateMemberData,
    createdByUserId: string,
  ): Promise<MemberWithUser> {
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. User erstellen
      const userId = generateId("usr");
      await connection.query(
        `INSERT INTO users
         (id, email, vorname, nachname, password_hash,
          auth_source, ist_aktiv, role)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          userId,
          userData.email,
          userData.vorname,
          userData.nachname,
          userData.passwordHash,
          userData.authSource || "local",
          true,
          "MITGLIED",
        ],
      );

      // 2. Member erstellen
      const memberId = generateId("mbr");
      await connection.query(
        `INSERT INTO mitglieder
         (id, user_id, vorname, nachname, email,
          member_type, mitglied_seit, ist_aktiv)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          memberId,
          userId,
          memberData.vorname,
          memberData.nachname,
          memberData.email,
          memberData.memberType || "easyverein",
          memberData.mitgliedSeit || new Date(),
          true,
        ],
      );

      // 3. Default Role zuweisen
      await connection.query(
        `INSERT INTO user_roles
         (user_id, role_id, zugewiesen_von)
         VALUES (?, ?, ?)`,
        [userId, "role_mitglied", createdByUserId],
      );

      await connection.commit();

      // Lade vollständige Daten
      return await this.findById(memberId);
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  private mapViewToMemberWithUser(row: any): MemberWithUser {
    return {
      // Member Daten
      id: row.id,
      vorname: row.vorname,
      nachname: row.nachname,
      email: row.email,
      telefon: row.telefon,
      istAktiv: Boolean(row.ist_aktiv),

      // User Daten aus View
      user: {
        id: row.user_id,
        email: row.auth_email,
        role: row.auth_role,
        roleName: row.role_name,
        hierarchieEbene: row.hierarchie_ebene,
        letzterLogin: row.letzter_login,
        mustChangePassword: Boolean(row.must_change_password),
      },

      // Metadaten
      mitgliedSeit: row.mitglied_seit,
      erstelltAm: row.erstellt_am,
      aktualisiertAm: row.aktualisiert_am,
    };
  }
}
