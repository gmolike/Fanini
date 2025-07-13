// apps/api/src/infrastructure/repositories/MySQLEventRepository.ts
import type {
  Event,
  EventLocation,
  EventStatus,
} from "@/domain/entities/Event";
import type {
  EventFilters,
  AuditLogEntry,
  IEventRepository,
} from "@/domain/repositories/IEventRepository";
import type { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export const createMySQLEventRepository = (
  db: MySQLConnection,
): IEventRepository => {
  // Helper: Parse JSON location
  const parseLocation = (locationJson: string): EventLocation => {
    try {
      return JSON.parse(locationJson);
    } catch {
      return { name: locationJson };
    }
  };

  // Helper: Convert DB row to Event entity
  const rowToEvent = (row: any): Event => ({
    id: row.id,
    title: row.titel,
    description: row.beschreibung,
    shortDescription: row.kurzbeschreibung,
    date: new Date(row.datum),
    time: row.uhrzeit,
    durationMinutes: row.dauer_minuten,
    location: parseLocation(row.ort),
    type: row.typ,
    sportBereich: row.sportbereich,
    status: row.status,
    isPublic: Boolean(row.ist_oeffentlich),
    isConfidential: Boolean(row.ist_vertraulich),
    responsibleMemberId: row.verantwortlich_id,
    deputyMemberIds: row.stellvertreter_ids
      ? JSON.parse(row.stellvertreter_ids)
      : undefined,
    budget: row.budget ? parseFloat(row.budget) : undefined,
    budgetUsed: parseFloat(row.budget_verbraucht) || 0,
    maxParticipants: row.max_teilnehmer,
    registrationDeadline: row.anmeldeschluss
      ? new Date(row.anmeldeschluss)
      : undefined,
    ticketLink: row.ticket_link,
    createdAt: new Date(row.erstellt_am),
    createdBy: row.erstellt_von,
    updatedAt: new Date(row.aktualisiert_am || row.erstellt_am),
    updatedBy: row.aktualisiert_von,
    approvedAt: row.genehmigt_am ? new Date(row.genehmigt_am) : undefined,
    approvedBy: row.genehmigt_von,
  });

  // findAll mit erweiterten Filtern
  const findAll = async (filters?: EventFilters): Promise<Event[]> => {
    let sql = "SELECT * FROM events WHERE 1=1";
    const params: any[] = [];

    // Soft Delete Filter
    if (!filters?.includeDeleted) {
      sql += " AND deleted_at IS NULL";
    }

    if (filters?.status) {
      sql += " AND status = ?";
      params.push(filters.status);
    }

    if (filters?.isPublic !== undefined) {
      sql += " AND ist_oeffentlich = ?";
      params.push(filters.isPublic);
    }

    if (filters?.createdBy) {
      sql += " AND erstellt_von = ?";
      params.push(filters.createdBy);
    }

    if (filters?.responsibleId) {
      sql += " AND verantwortlich_id = ?";
      params.push(filters.responsibleId);
    }

    if (filters?.deputyId) {
      sql += " AND JSON_CONTAINS(stellvertreter_ids, ?)";
      params.push(JSON.stringify(filters.deputyId));
    }

    if (filters?.fromDate) {
      sql += " AND datum >= ?";
      params.push(filters.fromDate);
    }

    if (filters?.toDate) {
      sql += " AND datum <= ?";
      params.push(filters.toDate);
    }

    if (filters?.type) {
      sql += " AND typ = ?";
      params.push(filters.type);
    }

    if (filters?.sportBereich) {
      sql += " AND sportbereich = ?";
      params.push(filters.sportBereich);
    }

    sql += " ORDER BY datum DESC, uhrzeit DESC";

    const rows = await db.query<any[]>(sql, params);
    return rows.map(rowToEvent);
  };

  // findById mit Soft Delete Check
  const findById = async (id: string): Promise<Event | null> => {
    const rows = await db.query<any[]>(
      "SELECT * FROM events WHERE id = ? AND deleted_at IS NULL",
      [id],
    );

    if (rows.length === 0) return null;
    return rowToEvent(rows[0]);
  };

  // save (create or update)
  const save = async (event: Event): Promise<Event> => {
    const sql = `
      INSERT INTO events
      (id, titel, beschreibung, kurzbeschreibung, datum, uhrzeit,
       dauer_minuten, ort, typ, sportbereich, status, ist_oeffentlich,
       ist_vertraulich, verantwortlich_id, stellvertreter_ids,
       budget, budget_verbraucht, max_teilnehmer, anmeldeschluss,
       ticket_link, erstellt_am, erstellt_von, aktualisiert_am,
       aktualisiert_von, genehmigt_am, genehmigt_von)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        titel = VALUES(titel),
        beschreibung = VALUES(beschreibung),
        kurzbeschreibung = VALUES(kurzbeschreibung),
        datum = VALUES(datum),
        uhrzeit = VALUES(uhrzeit),
        dauer_minuten = VALUES(dauer_minuten),
        ort = VALUES(ort),
        typ = VALUES(typ),
        sportbereich = VALUES(sportbereich),
        status = VALUES(status),
        ist_oeffentlich = VALUES(ist_oeffentlich),
        ist_vertraulich = VALUES(ist_vertraulich),
        verantwortlich_id = VALUES(verantwortlich_id),
        stellvertreter_ids = VALUES(stellvertreter_ids),
        budget = VALUES(budget),
        budget_verbraucht = VALUES(budget_verbraucht),
        max_teilnehmer = VALUES(max_teilnehmer),
        anmeldeschluss = VALUES(anmeldeschluss),
        ticket_link = VALUES(ticket_link),
        aktualisiert_am = VALUES(aktualisiert_am),
        aktualisiert_von = VALUES(aktualisiert_von),
        genehmigt_am = VALUES(genehmigt_am),
        genehmigt_von = VALUES(genehmigt_von)
    `;

    await db.query(sql, [
      event.id,
      event.title,
      event.description,
      event.shortDescription || null,
      event.date,
      event.time,
      event.durationMinutes || null,
      JSON.stringify(event.location),
      event.type,
      event.sportBereich || null,
      event.status,
      event.isPublic,
      event.isConfidential,
      event.responsibleMemberId,
      event.deputyMemberIds ? JSON.stringify(event.deputyMemberIds) : null,
      event.budget || null,
      event.budgetUsed,
      event.maxParticipants || null,
      event.registrationDeadline || null,
      event.ticketLink || null,
      event.createdAt,
      event.createdBy,
      event.updatedAt || new Date(),
      event.updatedBy || null,
      event.approvedAt || null,
      event.approvedBy || null,
    ]);

    return event;
  };

  // Hard delete (nur für Tests/Admin)
  const deleteEvent = async (id: string): Promise<void> => {
    await db.query("DELETE FROM events WHERE id = ?", [id]);
  };

  // updateWithAudit - Transactional update mit Audit Log
  const updateWithAudit = async (
    event: Event,
    auditEntries: AuditLogEntry[],
  ): Promise<Event> => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Event aktualisieren
      await connection.query(
        `UPDATE events SET
          titel = ?, beschreibung = ?, kurzbeschreibung = ?,
          datum = ?, uhrzeit = ?, dauer_minuten = ?,
          ort = ?, typ = ?, sportbereich = ?,
          status = ?, ist_oeffentlich = ?, ist_vertraulich = ?,
          verantwortlich_id = ?, stellvertreter_ids = ?,
          budget = ?, budget_verbraucht = ?,
          max_teilnehmer = ?, anmeldeschluss = ?,
          ticket_link = ?, aktualisiert_am = ?,
          aktualisiert_von = ?, genehmigt_am = ?,
          genehmigt_von = ?
        WHERE id = ? AND deleted_at IS NULL`,
        [
          event.title,
          event.description,
          event.shortDescription || null,
          event.date,
          event.time,
          event.durationMinutes || null,
          JSON.stringify(event.location),
          event.type,
          event.sportBereich || null,
          event.status,
          event.isPublic,
          event.isConfidential,
          event.responsibleMemberId,
          event.deputyMemberIds ? JSON.stringify(event.deputyMemberIds) : null,
          event.budget || null,
          event.budgetUsed,
          event.maxParticipants || null,
          event.registrationDeadline || null,
          event.ticketLink || null,
          event.updatedAt || new Date(),
          event.updatedBy,
          event.approvedAt || null,
          event.approvedBy || null,
          event.id,
        ],
      );

      // 2. Audit-Einträge erstellen
      for (const entry of auditEntries) {
        await connection.query(
          `INSERT INTO event_audit_log
          (id, event_id, action, field_name, old_value, new_value,
           changed_by, changed_at, ip_address, user_agent)
          VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
          [
            generateId(),
            entry.eventId,
            entry.action,
            entry.fieldName,
            entry.oldValue,
            entry.newValue,
            entry.changedBy,
            entry.ipAddress || null,
            entry.userAgent || null,
          ],
        );
      }

      await connection.commit();
      return event;
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  // softDeleteWithAudit - Soft Delete mit Audit Log
  const softDeleteWithAudit = async (
    id: string,
    deletedBy: string,
    auditEntry: AuditLogEntry,
  ): Promise<void> => {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // 1. Soft Delete
      await connection.query(
        `UPDATE events SET deleted_at = NOW(), deleted_by = ? WHERE id = ?`,
        [deletedBy, id],
      );

      // 2. Audit-Eintrag
      await connection.query(
        `INSERT INTO event_audit_log
        (id, event_id, action, field_name, old_value, new_value,
         changed_by, changed_at, ip_address, user_agent)
        VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), ?, ?)`,
        [
          generateId(),
          auditEntry.eventId,
          auditEntry.action,
          auditEntry.fieldName,
          auditEntry.oldValue,
          auditEntry.newValue,
          auditEntry.changedBy,
          auditEntry.ipAddress || null,
          auditEntry.userAgent || null,
        ],
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  };

  // createStatusHistory - Status-Historie erstellen
  const createStatusHistory = async (params: {
    eventId: string;
    oldStatus?: EventStatus;
    newStatus: EventStatus;
    changedBy: string;
    comment?: string;
  }): Promise<void> => {
    await db.query(
      `INSERT INTO event_audit_log
      (id, event_id, action, field_name, old_value, new_value,
       changed_by, changed_at)
      VALUES (?, ?, 'status_changed', 'status', ?, ?, ?, NOW())`,
      [
        generateId(),
        params.eventId,
        params.oldStatus || null,
        params.newStatus,
        params.changedBy,
      ],
    );
  };

  // getAuditLog - Audit-Historie abrufen
  const getAuditLog = async (
    eventId: string,
  ): Promise<
    Array<{
      action: string;
      fieldName?: string;
      oldValue?: string;
      newValue?: string;
      changedBy: string;
      changedAt: Date;
    }>
  > => {
    const rows = await db.query<any[]>(
      `SELECT action, field_name, old_value, new_value,
              changed_by, changed_at
       FROM event_audit_log
       WHERE event_id = ?
       ORDER BY changed_at DESC
       LIMIT 50`,
      [eventId],
    );

    return rows.map((row) => ({
      action: row.action,
      fieldName: row.field_name || undefined,
      oldValue: row.old_value || undefined,
      newValue: row.new_value || undefined,
      changedBy: row.changed_by,
      changedAt: new Date(row.changed_at),
    }));
  };

  // getParticipantCount - Teilnehmeranzahl
  const getParticipantCount = async (eventId: string): Promise<number> => {
    const result = await db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM event_teilnahme
       WHERE event_id = ?
       AND status IN ('bestaetigt', 'angemeldet')`,
      [eventId],
    );
    return Number(result[0]?.count) || 0;
  };

  // getParticipants - Teilnehmerliste
  const getParticipants = async (
    eventId: string,
  ): Promise<
    Array<{
      id: string;
      name: string;
      status: string;
      registeredAt: Date;
    }>
  > => {
    const rows = await db.query<any[]>(
      `SELECT
        et.mitglied_id as id,
        CONCAT(m.vorname, ' ', m.nachname) as name,
        et.status,
        et.angemeldet_am as registeredAt
       FROM event_teilnahme et
       JOIN mitglieder m ON et.mitglied_id = m.id
       WHERE et.event_id = ?
       ORDER BY et.angemeldet_am DESC`,
      [eventId],
    );

    return rows.map((row) => ({
      id: row.id,
      name: row.name,
      status: row.status,
      registeredAt: new Date(row.registeredAt),
    }));
  };

  // getTaskStats - Aufgaben-Statistiken
  const getTaskStats = async (
    eventId: string,
  ): Promise<{
    total: number;
    completed: number;
  }> => {
    const result = await db.query<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'erledigt' THEN 1 ELSE 0 END) as completed
       FROM aufgaben
       WHERE event_id = ?`,
      [eventId],
    );

    return {
      total: Number(result[0]?.total) || 0,
      completed: Number(result[0]?.completed) || 0,
    };
  };

  // getTasks - Aufgabenliste
  const getTasks = async (
    eventId: string,
  ): Promise<
    Array<{
      id: string;
      title: string;
      status: string;
      assignee?: {
        id: string;
        name: string;
      };
    }>
  > => {
    const rows = await db.query<any[]>(
      `SELECT
        a.id,
        a.titel as title,
        a.status,
        a.verantwortlich_id as assigneeId,
        CONCAT(m.vorname, ' ', m.nachname) as assigneeName
       FROM aufgaben a
       LEFT JOIN mitglieder m ON a.verantwortlich_id = m.id
       WHERE a.event_id = ?
       ORDER BY a.prioritaet DESC, a.erstellt_am DESC`,
      [eventId],
    );

    return rows.map((row) => ({
      id: row.id,
      title: row.title,
      status: row.status,
      assignee: row.assigneeId
        ? {
            id: row.assigneeId,
            name: row.assigneeName,
          }
        : undefined,
    }));
  };

  // Return Repository implementation
  return {
    findAll,
    findById,
    save,
    delete: deleteEvent,
    updateWithAudit,
    softDeleteWithAudit,
    createStatusHistory,
    getAuditLog,
    getParticipantCount,
    getParticipants,
    getTaskStats,
    getTasks,
  };
};
