// apps/api/src/infrastructure/repositories/MySQLSocialMediaPostRepository.ts
import type { ISocialMediaPostRepository, SocialMediaFilters } from "@/domain/repositories/ISocialMediaPostRepository";
import type { SocialMediaPost } from "@/domain/entities/SocialMediaPost";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLSocialMediaPostRepository = (
  db: MySQLConnection
): ISocialMediaPostRepository => {

  const mapRowToPost = (row: any): SocialMediaPost => ({
    id: row.id,
    inhalt: row.inhalt,
    plattform: row.plattform ? JSON.parse(row.plattform) : [],
    eventId: row.event_id,
    postDatum: row.post_datum ? new Date(row.post_datum) : undefined,
    status: row.status,
    erstelltVon: row.erstellt_von,
    erstelltAm: new Date(row.erstellt_am),
    approvedVon: row.approved_von,
    approvedAm: row.approved_am ? new Date(row.approved_am) : undefined,
    hashtags: row.hashtags ? JSON.parse(row.hashtags) : [],
    medienUrls: row.medien_urls ? JSON.parse(row.medien_urls) : []
  });

  const findAll = async (
    userId?: string,
    filters?: SocialMediaFilters,
  ): Promise<SocialMediaPost[]> => {
    let sql = `
      SELECT p.*,
             e.titel as event_titel,
             m.vorname as ersteller_vorname,
             m.nachname as ersteller_nachname
      FROM social_media_posts p
      LEFT JOIN events e ON p.event_id = e.id
      LEFT JOIN mitglieder m ON p.erstellt_von = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.platform) {
      sql += ' AND JSON_CONTAINS(p.plattform, ?)';
      params.push(JSON.stringify(filters.platform));
    }

    if (filters?.status) {
      sql += ' AND p.status = ?';
      params.push(filters.status);
    }

    if (filters?.eventId) {
      sql += ' AND p.event_id = ?';
      params.push(filters.eventId);
    }

    if (filters?.dateFrom) {
      sql += ' AND p.post_datum >= ?';
      params.push(filters.dateFrom);
    }

    if (filters?.dateTo) {
      sql += ' AND p.post_datum <= ?';
      params.push(filters.dateTo);
    }

    sql += ' ORDER BY p.post_datum ASC, p.erstellt_am DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(row => ({
      ...mapRowToPost(row),
      metadata: {
        eventTitel: row.event_titel,
        erstellerName: `${row.ersteller_vorname} ${row.ersteller_nachname}`
      }
    }));
  };

  const findById = async (
    id: string,
    userId: string
  ): Promise<SocialMediaPost | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM social_media_posts WHERE id = ?`,
      [id]
    );

    return row ? mapRowToPost(row) : null;
  };

  const create = async (
    data: Omit<SocialMediaPost, 'id' | 'erstelltAm'>,
    userId: string
  ): Promise<SocialMediaPost> => {
    const id = generateId();

    await db.query(
      `INSERT INTO social_media_posts
       (id, inhalt, plattform, event_id, post_datum, status,
        erstellt_von, hashtags, medien_urls)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.inhalt,
        JSON.stringify(data.plattform),
        data.eventId || null,
        data.postDatum || null,
        'draft',
        data.erstelltVon,
        JSON.stringify(data.hashtags || []),
        JSON.stringify(data.medienUrls || [])
      ]
    );

    return (await findById(id, userId))!;
  };

  const update = async (
    id: string,
    data: Partial<SocialMediaPost>,
    userId: string
  ): Promise<SocialMediaPost> => {
    const fields = Object.keys(data)
      .filter(key => !['id', 'erstelltAm', 'erstelltVon'].includes(key))
      .map(key => {
        if (['plattform', 'hashtags', 'medienUrls'].includes(key)) {
          return `${camelToSnake(key)} = ?`;
        }
        return `${camelToSnake(key)} = ?`;
      })
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'erstelltAm', 'erstelltVon'].includes(key))
      .map(([key, value]) => {
        if (['plattform', 'hashtags', 'medienUrls'].includes(key)) {
          return JSON.stringify(value);
        }
        return value;
      });

    values.push(id);

    await db.query(
      `UPDATE social_media_posts SET ${fields} WHERE id = ?`,
      values
    );

    return (await findById(id, userId))!;
  };

  const deletePost = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM social_media_posts
       WHERE id = ? AND status = 'draft'`,
      [id]
    );
  };

  const approve = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `UPDATE social_media_posts
       SET status = 'scheduled',
           approved_von = ?,
           approved_am = NOW()
       WHERE id = ?`,
      [userId, id]
    );
  };

  return {
    findAll,
    findById,
    create,
    update,
    delete: deletePost,
    approve
  };
};
