// apps/api/src/infrastructure/repositories/MySQLGremienRepository.ts
import type { IGremienRepository, GremiumFilters } from "@/domain/repositories/IGremienRepository";
import type { Gremium, GremiumMember } from "@/domain/entities/Gremium";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

// Helper function
const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLGremienRepository = (
  db: MySQLConnection
): IGremienRepository => {

  const mapRowToGremium = (row: any): Gremium => ({
    id: row.id,
    type: row.type,
    name: row.name,
    description: row.description,
    shortDescription: row.short_description,
    headerImage: row.header_image,
    gradient: row.gradient,
    meetingSchedule: row.meeting_schedule,
    contactEmail: row.contact_email,
    establishedDate: row.established_date ? new Date(row.established_date) : undefined,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    members: []
  });

  const mapRowToMember = (row: any): GremiumMember => ({
    id: row.id,
    gremiumId: row.gremium_id,
    name: row.name,
    role: row.role,
    image: row.image,
    description: row.description,
    memberSince: row.member_since ? new Date(row.member_since) : undefined,
    email: row.email,
    phone: row.phone,
    orderPosition: row.order_position
  });

  const findAllPublic = async (): Promise<Gremium[]> => {
    const rows = await db.query<any[]>(
      `SELECT g.*,
              COUNT(gm.id) as member_count
       FROM gremien g
       LEFT JOIN gremium_members gm ON g.id = gm.gremium_id
       GROUP BY g.id
       ORDER BY g.type`
    );

    const gremien = rows.map(mapRowToGremium);

    // Load members for each gremium
    for (const gremium of gremien) {
      const memberRows = await db.query<any[]>(
        `SELECT id, gremium_id, name, role, image, description, order_position
         FROM gremium_members
         WHERE gremium_id = ?
         ORDER BY order_position, name`,
        [gremium.id]
      );

      gremium.members = memberRows.map(row => ({
        ...mapRowToMember(row),
        // Öffentlich: keine Email/Telefon
        email: undefined,
        phone: undefined
      }));
    }

    return gremien;
  };

  const findByTypePublic = async (type: string): Promise<Gremium | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM gremien WHERE type = ?`,
      [type]
    );

    if (!row) return null;

    const gremium = mapRowToGremium(row);

    const memberRows = await db.query<any[]>(
      `SELECT id, gremium_id, name, role, image, description, order_position
       FROM gremium_members
       WHERE gremium_id = ?
       ORDER BY order_position, name`,
      [gremium.id]
    );

    gremium.members = memberRows.map(row => ({
      ...mapRowToMember(row),
      email: undefined,
      phone: undefined
    }));

    return gremium;
  };

  const findAllInternal = async (userId: string): Promise<Gremium[]> => {
    const rows = await db.query<any[]>(
      `SELECT g.* FROM gremien g ORDER BY g.type`
    );

    const gremien = rows.map(mapRowToGremium);

    for (const gremium of gremien) {
      const memberRows = await db.query<any[]>(
        `SELECT * FROM gremium_members
         WHERE gremium_id = ?
         ORDER BY order_position, name`,
        [gremium.id]
      );

      gremium.members = memberRows.map(mapRowToMember);
    }

    return gremien;
  };

  const findByIdInternal = async (id: string, userId: string): Promise<Gremium | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM gremien WHERE id = ?`,
      [id]
    );

    if (!row) return null;

    const gremium = mapRowToGremium(row);

    const memberRows = await db.query<any[]>(
      `SELECT * FROM gremium_members
       WHERE gremium_id = ?
       ORDER BY order_position, name`,
      [gremium.id]
    );

    gremium.members = memberRows.map(mapRowToMember);

    return gremium;
  };

  const updateGremium = async (
    id: string,
    data: Partial<Gremium>,
    userId: string
  ): Promise<Gremium> => {
    const fields = Object.keys(data)
      .filter(key => key !== 'id' && key !== 'members')
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'members')
      .map(([_, value]) => value);

    values.push(id);

    await db.query(
      `UPDATE gremien SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return (await findByIdInternal(id, userId))!;
  };

  const addMember = async (
    gremiumId: string,
    member: Omit<GremiumMember, 'id'>,
    userId: string
  ): Promise<GremiumMember> => {
    const memberId = generateId();

    await db.query(
      `INSERT INTO gremium_members
       (id, gremium_id, name, role, image, description, member_since,
        email, phone, order_position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memberId,
        gremiumId,
        member.name,
        member.role,
        member.image,
        member.description,
        member.memberSince,
        member.email,
        member.phone,
        member.orderPosition || 999
      ]
    );

    const [newMember] = await db.query<any[]>(
      `SELECT * FROM gremium_members WHERE id = ?`,
      [memberId]
    );

    return mapRowToMember(newMember);
  };

  const updateMember = async (
    memberId: string,
    data: Partial<GremiumMember>,
    userId: string
  ): Promise<GremiumMember> => {
    const fields = Object.keys(data)
      .filter(key => key !== 'id' && key !== 'gremiumId')
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => key !== 'id' && key !== 'gremiumId')
      .map(([_, value]) => value);

    values.push(memberId);

    await db.query(
      `UPDATE gremium_members SET ${fields} WHERE id = ?`,
      values
    );

    const [updated] = await db.query<any[]>(
      `SELECT * FROM gremium_members WHERE id = ?`,
      [memberId]
    );

    return mapRowToMember(updated);
  };

  const removeMember = async (memberId: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM gremium_members WHERE id = ?`,
      [memberId]
    );
  };

  return {
    findAllPublic,
    findByTypePublic,
    findAllInternal,
    findByIdInternal,
    updateGremium,
    addMember,
    updateMember,
    removeMember
  };
};
