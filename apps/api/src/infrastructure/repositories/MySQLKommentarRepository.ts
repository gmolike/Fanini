// apps/api/src/infrastructure/repositories/MySQLKommentarRepository.ts
import type { IKommentarRepository, KommentarContext } from "@/domain/repositories/IKommentarRepository";
import type { Kommentar } from "@/domain/entities/Kommentar";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export const createMySQLKommentarRepository = (
  db: MySQLConnection
): IKommentarRepository => {

  const mapRowToKommentar = (row: any): Kommentar => ({
    id: row.id,
    text: row.text,
    eventId: row.event_id,
    aufgabeId: row.aufgabe_id,
    dokumentId: row.dokument_id,
    autorId: row.autor_id,
    erstelltAm: new Date(row.erstellt_am),
    erwaehntePersonenIds: row.erwaehnte_personen_ids
      ? JSON.parse(row.erwaehnte_personen_ids)
      : [],
    istIntern: Boolean(row.ist_intern),
    // Metadata
    autorName: row.autor_name,
    autorBild: row.autor_bild
  });

  const findByContext = async (context: KommentarContext): Promise<Kommentar[]> => {
    let sql = `
      SELECT k.*,
             CONCAT(m.vorname, ' ', m.nachname) as autor_name,
             m.profilbild as autor_bild
      FROM kommentare k
      JOIN mitglieder m ON k.autor_id = m.id
      WHERE 1=1
    `;
    const params: any[] = [];

    switch (context.type) {
      case 'event':
        sql += ' AND k.event_id = ?';
        break;
      case 'task':
        sql += ' AND k.aufgabe_id = ?';
        break;
      case 'document':
        sql += ' AND k.dokument_id = ?';
        break;
    }
    params.push(context.id);

    sql += ' ORDER BY k.erstellt_am DESC';

    const rows = await db.query<any[]>(sql, params);
    return rows.map(mapRowToKommentar);
  };

  const create = async (
    data: Omit<Kommentar, 'id' | 'erstelltAm'>,
    userId: string
  ): Promise<Kommentar> => {
    const id = generateId();
    const erstelltAm = new Date();

    await db.query(
      `INSERT INTO kommentare
       (id, text, event_id, aufgabe_id, dokument_id, autor_id,
        erstellt_am, erwaehnte_personen_ids, ist_intern)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        data.text,
        data.eventId || null,
        data.aufgabeId || null,
        data.dokumentId || null,
        data.autorId,
        erstelltAm,
        data.erwaehntePersonenIds?.length
          ? JSON.stringify(data.erwaehntePersonenIds)
          : null,
        data.istIntern || false
      ]
    );

    // Benachrichtigungen für erwähnte Personen erstellen
    if (data.erwaehntePersonenIds?.length) {
      await createMentionNotifications(
        data.erwaehntePersonenIds,
        id,
        data.autorId,
        db
      );
    }

    return {
      ...data,
      id,
      erstelltAm
    };
  };

  const update = async (
    id: string,
    text: string,
    userId: string
  ): Promise<Kommentar> => {
    // Prüfe ob User der Autor ist
    const [existing] = await db.query<any[]>(
      `SELECT autor_id FROM kommentare WHERE id = ?`,
      [id]
    );

    if (existing?.autor_id !== userId) {
      throw new Error('Unauthorized to edit this comment');
    }

    await db.query(
      `UPDATE kommentare SET text = ? WHERE id = ?`,
      [text, id]
    );

    const context = await getContextFromComment(id, db);
    const [updated] = await findByContext(context);
    return updated;
  };

  const deleteComment = async (id: string, userId: string): Promise<void> => {
    // Prüfe ob User der Autor ist oder Admin
    const [existing] = await db.query<any[]>(
      `SELECT autor_id FROM kommentare WHERE id = ?`,
      [id]
    );

    if (existing?.autor_id !== userId) {
      // TODO: Check if user is admin
      throw new Error('Unauthorized to delete this comment');
    }

    await db.query(
      `DELETE FROM kommentare WHERE id = ?`,
      [id]
    );
  };

  return {
    findByContext,
    create,
    update,
    delete: deleteComment
  };
};

// Helper functions
const createMentionNotifications = async (
  mentionedUserIds: string[],
  kommentarId: string,
  autorId: string,
  db: MySQLConnection
): Promise<void> => {
  const notifications = mentionedUserIds.map(userId => [
    generateId(),
    userId,
    'erwaehnung',
    'Du wurdest in einem Kommentar erwähnt',
    'Jemand hat dich in einem Kommentar erwähnt',
    'kommentar',
    kommentarId,
    false,
    new Date(),
    'medium'
  ]);

  if (notifications.length > 0) {
    await db.query(
      `INSERT INTO benachrichtigungen
       (id, empfaenger_id, typ, titel, nachricht, kontext_typ,
        kontext_id, gelesen, versendet_am, prioritaet)
       VALUES ?`,
      [notifications]
    );
  }
};

const getContextFromComment = async (
  kommentarId: string,
  db: MySQLConnection
): Promise<KommentarContext> => {
  const [row] = await db.query<any[]>(
    `SELECT event_id, aufgabe_id, dokument_id FROM kommentare WHERE id = ?`,
    [kommentarId]
  );

  if (row.event_id) return { type: 'event', id: row.event_id };
  if (row.aufgabe_id) return { type: 'task', id: row.aufgabe_id };
  if (row.dokument_id) return { type: 'document', id: row.dokument_id };

  throw new Error('Comment has no valid context');
};
