// apps/api/src/infrastructure/repositories/MySQLCreatorRepository.ts
import type { ICreatorRepository, CreatorFilters } from "@/domain/repositories/ICreatorRepository";
import type { Creator, CreatorWork } from "@/domain/entities/Creator";
import type { ApprovalRequest } from "@/domain/entities/ApprovalRequest";
import type { MySQLConnection } from "./MySQLConnection";
import type { IApprovalRepository } from "@/domain/repositories/IApprovalRepository";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLCreatorRepository = (
  db: MySQLConnection,
  approvalRepo: IApprovalRepository
): ICreatorRepository => {

  const mapRowToCreator = (row: any): Creator => ({
    id: row.id,
    memberId: row.member_id,
    artistName: row.artist_name,
    realName: row.real_name,
    profileImage: row.profile_image,
    description: row.description,
    portfolio: row.portfolio,
    isActive: Boolean(row.is_active),
    activeSince: row.active_since ? new Date(row.active_since) : undefined,
    deactivatedAt: row.deactivated_at ? new Date(row.deactivated_at) : undefined,
    socialMedia: {
      instagram: row.instagram,
      twitter: row.twitter,
      facebook: row.facebook,
      youtube: row.youtube,
      tiktok: row.tiktok,
      website: row.website
    },
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    types: [],
    works: []
  });

  const mapRowToWork = (row: any): CreatorWork => ({
    id: row.id,
    creatorId: row.creator_id,
    title: row.title,
    description: row.description,
    type: row.type,
    fileUrl: row.file_url,
    thumbnailUrl: row.thumbnail_url,
    createdAt: new Date(row.created_at),
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    isPublic: Boolean(row.is_public),
    orderPosition: row.order_position,
    views: row.views || 0,
    likes: row.likes || 0
  });

  const loadCreatorTypes = async (creatorId: string): Promise<string[]> => {
    const rows = await db.query<any[]>(
      `SELECT type FROM creator_types WHERE creator_id = ?`,
      [creatorId]
    );
    return rows.map(row => row.type);
  };

  const findAllPublic = async (
    filters?: CreatorFilters
  ): Promise<Creator[]> => {
    let sql = `
      SELECT c.*,
             COUNT(DISTINCT cw.id) as work_count,
             m.vorname as member_vorname,
             m.nachname as member_nachname
      FROM creators c
      LEFT JOIN creator_works cw ON c.id = cw.creator_id AND cw.is_public = 1
      LEFT JOIN mitglieder m ON c.member_id = m.id
      WHERE c.is_active = 1
    `;
    const params: any[] = [];

    if (filters?.type) {
      sql += ` AND EXISTS (
        SELECT 1 FROM creator_types ct
        WHERE ct.creator_id = c.id AND ct.type = ?
      )`;
      params.push(filters.type);
    }

    if (filters?.search) {
      sql += ` AND (
        c.artist_name LIKE ? OR
        c.real_name LIKE ? OR
        c.description LIKE ?
      )`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY c.id ORDER BY c.artist_name';

    const rows = await db.query<any[]>(sql, params);

    const creators = [];
    for (const row of rows) {
      const creator = mapRowToCreator(row);
      creator.types = await loadCreatorTypes(creator.id);
      creator.metadata = {
        workCount: row.work_count || 0,
        memberName: `${row.member_vorname} ${row.member_nachname}`
      };
      creators.push(creator);
    }

    return creators;
  };

  const findByIdPublic = async (id: string): Promise<Creator | null> => {
    const [row] = await db.query<any[]>(
      `SELECT c.*, m.vorname, m.nachname
       FROM creators c
       LEFT JOIN mitglieder m ON c.member_id = m.id
       WHERE c.id = ? AND c.is_active = 1`,
      [id]
    );

    if (!row) return null;

    const creator = mapRowToCreator(row);
    creator.types = await loadCreatorTypes(creator.id);
    creator.works = await findWorksByCreator(creator.id, true);

    return creator;
  };

  const findAllInternal = async (
    filters?: CreatorFilters,
    userId?: string
  ): Promise<Creator[]> => {
    let sql = `
      SELECT c.*,
             COUNT(DISTINCT cw.id) as work_count,
             m.vorname as member_vorname,
             m.nachname as member_nachname,
             m.email as member_email
      FROM creators c
      LEFT JOIN creator_works cw ON c.id = cw.creator_id
      LEFT JOIN mitglieder m ON c.member_id = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.istAktiv !== undefined) {
      sql += ' AND c.is_active = ?';
      params.push(filters.istAktiv);
    }

    if (filters?.type) {
      sql += ` AND EXISTS (
        SELECT 1 FROM creator_types ct
        WHERE ct.creator_id = c.id AND ct.type = ?
      )`;
      params.push(filters.type);
    }

    if (filters?.search) {
      sql += ` AND (
        c.artist_name LIKE ? OR
        c.real_name LIKE ? OR
        m.email LIKE ?
      )`;
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm, searchTerm);
    }

    sql += ' GROUP BY c.id ORDER BY c.created_at DESC';

    const rows = await db.query<any[]>(sql, params);

    const creators = [];
    for (const row of rows) {
      const creator = mapRowToCreator(row);
      creator.types = await loadCreatorTypes(creator.id);
      creator.metadata = {
        workCount: row.work_count || 0,
        memberName: `${row.member_vorname} ${row.member_nachname}`,
        memberEmail: row.member_email
      };
      creators.push(creator);
    }

    return creators;
  };

  const findByMemberId = async (memberId: string): Promise<Creator | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM creators WHERE member_id = ?`,
      [memberId]
    );

    if (!row) return null;

    const creator = mapRowToCreator(row);
    creator.types = await loadCreatorTypes(creator.id);
    creator.works = await findWorksByCreator(creator.id);

    return creator;
  };

  const create = async (
    data: Omit<Creator, 'id' | 'aktivSeit'>,
    userId: string
  ): Promise<Creator | ApprovalRequest> => {
    const id = generateId();

    // Creator accounts require approval
    const approvalRequest = await approvalRepo.createRequest({
      requestType: 'creator_activation',
      resourceType: 'creators',
      resourceId: id,
      requestedBy: userId,
      newData: data,
      changesSummary: `Neuer Creator Account: ${data.artistName}`,
      priority: 'medium'
    });

    // Create inactive creator
    await db.query(
      `INSERT INTO creators
       (id, member_id, artist_name, real_name, profile_image,
        description, portfolio, is_active, instagram, twitter,
        facebook, youtube, tiktok, website)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.memberId,
        data.artistName,
        data.realName,
        data.profileImage,
        data.description,
        data.portfolio,
        false, // Always start inactive
        data.socialMedia?.instagram,
        data.socialMedia?.twitter,
        data.socialMedia?.facebook,
        data.socialMedia?.youtube,
        data.socialMedia?.tiktok,
        data.socialMedia?.website
      ]
    );

    // Add types
    if (data.types?.length) {
      const typeValues = data.types.map(type => [id, type]);
      await db.query(
        `INSERT INTO creator_types (creator_id, type) VALUES ?`,
        [typeValues]
      );
    }

    return approvalRequest;
  };

  const update = async (
    id: string,
    data: Partial<Creator>,
    userId: string
  ): Promise<Creator> => {
    const flatData: Record<string, any> = {};

    // Flatten social media
    if (data.socialMedia) {
      Object.entries(data.socialMedia).forEach(([key, value]) => {
        flatData[key] = value;
      });
    }

    // Add other fields
    Object.entries(data).forEach(([key, value]) => {
      if (!['id', 'memberId', 'types', 'works', 'socialMedia', 'createdAt', 'updatedAt'].includes(key)) {
        flatData[camelToSnake(key)] = value;
      }
    });

    if (Object.keys(flatData).length > 0) {
      const fields = Object.keys(flatData)
        .map(key => `${key} = ?`)
        .join(', ');

      const values = Object.values(flatData);
      values.push(id);

      await db.query(
        `UPDATE creators SET ${fields}, updated_at = NOW() WHERE id = ?`,
        values
      );
    }

    // Update types if provided
    if (data.types) {
      await db.query(
        `DELETE FROM creator_types WHERE creator_id = ?`,
        [id]
      );

      if (data.types.length > 0) {
        const typeValues = data.types.map(type => [id, type]);
        await db.query(
          `INSERT INTO creator_types (creator_id, type) VALUES ?`,
          [typeValues]
        );
      }
    }

    return (await findByIdPublic(id))!;
  };

  const activate = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `UPDATE creators
       SET is_active = 1, active_since = NOW()
       WHERE id = ?`,
      [id]
    );
  };

  const deactivate = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `UPDATE creators
       SET is_active = 0, deactivated_at = NOW()
       WHERE id = ?`,
      [id]
    );
  };

  const findWorksByCreator = async (
    creatorId: string,
    isPublic?: boolean
  ): Promise<CreatorWork[]> => {
    let sql = `
      SELECT * FROM creator_works
      WHERE creator_id = ?
    `;
    const params: any[] = [creatorId];

    if (isPublic !== undefined) {
      sql += ' AND is_public = ?';
      params.push(isPublic);
    }

    sql += ' ORDER BY order_position, created_at DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToWork);
  };

  const addWork = async (
    creatorId: string,
    work: Omit<CreatorWork, 'id' | 'erstelltAm'>,
    userId: string
  ): Promise<CreatorWork> => {
    const id = generateId();

    await db.query(
      `INSERT INTO creator_works
       (id, creator_id, title, description, type, file_url,
        thumbnail_url, is_public, order_position)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        creatorId,
        work.title,
        work.description,
        work.type,
        work.fileUrl,
        work.thumbnailUrl,
        work.isPublic !== false,
        work.orderPosition || 999
      ]
    );

    const [newWork] = await db.query<any[]>(
      `SELECT * FROM creator_works WHERE id = ?`,
      [id]
    );

    return mapRowToWork(newWork);
  };

  const updateWork = async (
    workId: string,
    data: Partial<CreatorWork>,
    userId: string
  ): Promise<CreatorWork> => {
    const fields = Object.keys(data)
      .filter(key => !['id', 'creatorId', 'createdAt', 'views', 'likes'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'creatorId', 'createdAt', 'views', 'likes'].includes(key))
      .map(([_, value]) => value);

    values.push(workId);

    await db.query(
      `UPDATE creator_works SET ${fields} WHERE id = ?`,
      values
    );

    const [updated] = await db.query<any[]>(
      `SELECT * FROM creator_works WHERE id = ?`,
      [workId]
    );

    return mapRowToWork(updated);
  };

  const deleteWork = async (workId: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM creator_works WHERE id = ?`,
      [workId]
    );
  };

  const incrementViews = async (workId: string): Promise<void> => {
    await db.query(
      `UPDATE creator_works SET views = views + 1 WHERE id = ?`,
      [workId]
    );
  };

  return {
    findAllPublic,
    findByIdPublic,
    findAllInternal,
    findByMemberId,
    create,
    update,
    activate,
    deactivate,
    findWorksByCreator,
    addWork,
    updateWork,
    deleteWork,
    incrementViews
  };
};
