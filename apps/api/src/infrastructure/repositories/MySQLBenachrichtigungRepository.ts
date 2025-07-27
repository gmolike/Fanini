// apps/api/src/infrastructure/repositories/MySQLBenachrichtigungRepository.ts
import type { IBenachrichtigungRepository, BenachrichtigungFilters } from "@/domain/repositories/IBenachrichtigungRepository";
import type { Benachrichtigung } from "@/domain/entities/Benachrichtigung";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

const camelToSnake = (str: string): string => {
  return str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);
};

export const createMySQLBenachrichtigungRepository = (
  db: MySQLConnection
): IBenachrichtigungRepository => {

  const mapRowToBenachrichtigung = (row: any): Benachrichtigung => ({
    id: row.id,
    empfaengerId: row.empfaenger_id,
    typ: row.typ,
    titel: row.titel,
    nachricht: row.nachricht,
    kontextTyp: row.kontext_typ,
    kontextId: row.kontext_id,
    gelesen: Boolean(row.gelesen),
    gelesenAm: row.gelesen_am ? new Date(row.gelesen_am) : undefined,
    versendetAm: new Date(row.versendet_am),
    prioritaet: row.prioritaet
  });

  const findByEmpfaenger = async (
    empfaengerId: string,
    filters?: BenachrichtigungFilters
  ): Promise<Benachrichtigung[]> => {
    let sql = `
      SELECT * FROM benachrichtigungen
      WHERE empfaenger_id = ?
    `;
    const params: any[] = [empfaengerId];

    if (filters?.unreadOnly) {
      sql += ' AND gelesen = 0';
    }

    if (filters?.typ) {
      sql += ' AND typ = ?';
      params.push(filters.typ);
    }

    sql += ' ORDER BY prioritaet DESC, versendet_am DESC';

    if (filters?.limit) {
      sql += ' LIMIT ?';
      params.push(filters.limit);
    }

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToBenachrichtigung);
  };

  const create = async (
    data: Omit<Benachrichtigung, 'id' | 'versendetAm'>
  ): Promise<Benachrichtigung> => {
    const id = generateId();
    const versendetAm = new Date();

    await db.query(
      `INSERT INTO benachrichtigungen
       (id, empfaenger_id, typ, titel, nachricht, kontext_typ,
        kontext_id, gelesen, versendet_am, prioritaet)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.empfaengerId,
        data.typ,
        data.titel,
        data.nachricht,
        data.kontextTyp || null,
        data.kontextId || null,
        false,
        versendetAm,
        data.prioritaet
      ]
    );

    return {
      ...data,
      id,
      versendetAm,
      gelesen: false
    };
  };

  const markAsRead = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `UPDATE benachrichtigungen
       SET gelesen = 1, gelesen_am = NOW()
       WHERE id = ? AND empfaenger_id = ?`,
      [id, userId]
    );
  };

  const markAllAsRead = async (empfaengerId: string): Promise<void> => {
    await db.query(
      `UPDATE benachrichtigungen
       SET gelesen = 1, gelesen_am = NOW()
       WHERE empfaenger_id = ? AND gelesen = 0`,
      [empfaengerId]
    );
  };

  const deleteNotification = async (id: string, userId: string): Promise<void> => {
    await db.query(
      `DELETE FROM benachrichtigungen
       WHERE id = ? AND empfaenger_id = ?`,
      [id, userId]
    );
  };

  const getUnreadCount = async (empfaengerId: string): Promise<number> => {
    const [result] = await db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM benachrichtigungen
       WHERE empfaenger_id = ? AND gelesen = 0`,
      [empfaengerId]
    );
    return result?.count || 0;
  };

  return {
    findByEmpfaenger,
    create,
    markAsRead,
    markAllAsRead,
    delete: deleteNotification,
    getUnreadCount
  };
};
