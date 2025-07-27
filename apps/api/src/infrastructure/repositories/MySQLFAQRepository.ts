// apps/api/src/infrastructure/repositories/MySQLFAQRepository.ts
import type { IFAQRepository, FAQFilters } from "@/domain/repositories/IFAQRepository";
import type { FAQ } from "@/domain/entities/FAQ";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLFAQRepository = (
  db: MySQLConnection
): IFAQRepository => {

  const mapRowToFAQ = (row: any): FAQ => ({
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category,
    orderPosition: row.order_position,
    views: row.views || 0,
    isPopular: Boolean(row.is_popular),
    updatedAt: new Date(row.updated_at),
    createdAt: new Date(row.created_at)
  });

  const findAllPublic = async (filters?: FAQFilters): Promise<FAQ[]> => {
    let sql = `
      SELECT * FROM faqs
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.category) {
      sql += ' AND category = ?';
      params.push(filters.category);
    }

    if (filters?.search) {
      sql += ' AND (question LIKE ? OR answer LIKE ?)';
      const searchTerm = `%${filters.search}%`;
      params.push(searchTerm, searchTerm);
    }

    if (filters?.popularOnly) {
      sql += ' AND is_popular = 1';
    }

    sql += ' ORDER BY order_position ASC, views DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToFAQ);
  };

  const findByIdPublic = async (id: string): Promise<FAQ | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM faqs WHERE id = ?`,
      [id]
    );

    return row ? mapRowToFAQ(row) : null;
  };

  const create = async (
    data: Omit<FAQ, 'id' | 'createdAt' | 'views'>,
    userId: string
  ): Promise<FAQ> => {
    const id = generateId();

    await db.query(
      `INSERT INTO faqs
       (id, question, answer, category, order_position, is_popular)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.question,
        data.answer,
        data.category,
        data.orderPosition || 999,
        data.isPopular || false
      ]
    );

    return (await findByIdPublic(id))!;
  };

  const update = async (
    id: string,
    data: Partial<FAQ>,
    userId: string
  ): Promise<FAQ> => {
    const fields = Object.keys(data)
      .filter(key => !['id', 'createdAt', 'views'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'createdAt', 'views'].includes(key))
      .map(([_, value]) => value);

    values.push(id);

    await db.query(
      `UPDATE faqs SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return (await findByIdPublic(id))!;
  };

  const deleteFAQ = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM faqs WHERE id = ?`,
      [id]
    );
  };

  const incrementViews = async (id: string): Promise<void> => {
    await db.query(
      `UPDATE faqs SET views = views + 1 WHERE id = ?`,
      [id]
    );

    // Mark as popular if views > 100
    await db.query(
      `UPDATE faqs SET is_popular = 1 WHERE id = ? AND views > 100`,
      [id]
    );
  };

  return {
    findAllPublic,
    findByIdPublic,
    create,
    update,
    delete: deleteFAQ,
    incrementViews
  };
};
