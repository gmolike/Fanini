// apps/api/src/infrastructure/repositories/MySQLNewsletterRepository.ts
import type { INewsletterRepository, NewsletterFilters } from "@/domain/repositories/INewsletterRepository";
import type { Newsletter, NewsletterSubscription } from "@/domain/entities/Newsletter";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLNewsletterRepository = (
  db: MySQLConnection
): INewsletterRepository => {

  const mapRowToNewsletter = (row: any): Newsletter => ({
    id: row.id,
    edition: row.edition,
    title: row.title,
    subtitle: row.subtitle,
    publishedAt: row.published_at ? new Date(row.published_at) : undefined,
    status: row.status,
    headerImage: row.header_image,
    introduction: row.introduction,
    sections: row.sections ? JSON.parse(row.sections) : [],
    closingMessage: row.closing_message,
    nextEditionHint: row.next_edition_hint,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at)
  });

  const mapRowToSubscription = (row: any): NewsletterSubscription => ({
    id: row.id,
    email: row.email,
    firstName: row.first_name,
    lastName: row.last_name,
    acceptsMarketing: Boolean(row.accepts_marketing),
    confirmedAt: row.confirmed_at ? new Date(row.confirmed_at) : undefined,
    unsubscribedAt: row.unsubscribed_at ? new Date(row.unsubscribed_at) : undefined,
    createdAt: new Date(row.created_at)
  });

  const findAllPublic = async (filters?: NewsletterFilters): Promise<Newsletter[]> => {
    let sql = `
      SELECT * FROM newsletters
      WHERE status = 'published'
    `;
    const params: any[] = [];

    if (filters?.year) {
      sql += ' AND YEAR(published_at) = ?';
      params.push(filters.year);
    }

    sql += ' ORDER BY published_at DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToNewsletter);
  };

  const findByIdPublic = async (id: string): Promise<Newsletter | null> => {
    const [row] = await db.query<any[]>(
      `SELECT * FROM newsletters WHERE id = ? AND status = 'published'`,
      [id]
    );

    return row ? mapRowToNewsletter(row) : null;
  };

  const findAllInternal = async (
    filters?: NewsletterFilters,
    userId?: string
  ): Promise<Newsletter[]> => {
    let sql = `
      SELECT * FROM newsletters
      WHERE 1=1
    `;
    const params: any[] = [];

    if (filters?.status) {
      sql += ' AND status = ?';
      params.push(filters.status);
    }

    if (filters?.year) {
      sql += ' AND YEAR(COALESCE(published_at, created_at)) = ?';
      params.push(filters.year);
    }

    sql += ' ORDER BY created_at DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToNewsletter);
  };

  const create = async (
    data: Omit<Newsletter, 'id' | 'createdAt'>,
    userId: string
  ): Promise<Newsletter> => {
    const id = generateId();

    await db.query(
      `INSERT INTO newsletters
       (id, edition, title, subtitle, status, header_image,
        introduction, closing_message, next_edition_hint)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.edition,
        data.title,
        data.subtitle,
        'draft',
        data.headerImage,
        data.introduction,
        data.closingMessage,
        data.nextEditionHint
      ]
    );

    return (await findByIdPublic(id))!;
  };

  const update = async (
    id: string,
    data: Partial<Newsletter>,
    userId: string
  ): Promise<Newsletter> => {
    const fields = Object.keys(data)
      .filter(key => !['id', 'createdAt'].includes(key))
      .map(key => `${camelToSnake(key)} = ?`)
      .join(', ');

    const values = Object.entries(data)
      .filter(([key]) => !['id', 'createdAt'].includes(key))
      .map(([key, value]) => {
        if (key === 'sections') {
          return JSON.stringify(value);
        }
        return value;
      });

    values.push(id);

    await db.query(
      `UPDATE newsletters SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );

    return (await findByIdPublic(id))!;
  };

  const deleteNewsletter = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM newsletters WHERE id = ? AND status = 'draft'`,
      [id]
    );
  };

  const subscribe = async (
    email: string,
    data: Omit<NewsletterSubscription, 'id' | 'createdAt'>
  ): Promise<NewsletterSubscription> => {
    const id = generateId();

    await db.query(
      `INSERT INTO newsletter_subscriptions
       (id, email, first_name, last_name, accepts_marketing)
       VALUES (?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         first_name = VALUES(first_name),
         last_name = VALUES(last_name),
         accepts_marketing = VALUES(accepts_marketing),
         unsubscribed_at = NULL`,
      [
        id,
        email,
        data.firstName,
        data.lastName,
        data.acceptsMarketing || true
      ]
    );

    const [subscription] = await db.query<any[]>(
      `SELECT * FROM newsletter_subscriptions WHERE email = ?`,
      [email]
    );

    return mapRowToSubscription(subscription);
  };

  const confirmSubscription = async (email: string): Promise<void> => {
    await db.query(
      `UPDATE newsletter_subscriptions
       SET confirmed_at = NOW()
       WHERE email = ? AND confirmed_at IS NULL`,
      [email]
    );
  };

  const unsubscribe = async (email: string): Promise<void> => {
    await db.query(
      `UPDATE newsletter_subscriptions
       SET unsubscribed_at = NOW()
       WHERE email = ?`,
      [email]
    );
  };

  const getActiveSubscribers = async (): Promise<NewsletterSubscription[]> => {
    const rows = await db.query<any[]>(
      `SELECT * FROM newsletter_subscriptions
       WHERE confirmed_at IS NOT NULL
       AND unsubscribed_at IS NULL
       AND accepts_marketing = 1`
    );

    return rows.map(mapRowToSubscription);
  };

  return {
    findAllPublic,
    findByIdPublic,
    findAllInternal,
    create,
    update,
    delete: deleteNewsletter,
    subscribe,
    confirmSubscription,
    unsubscribe,
    getActiveSubscribers
  };
};
