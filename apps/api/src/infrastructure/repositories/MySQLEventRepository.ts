// apps/api/src/infrastructure/repositories/MySQLEventRepository.ts
import type { Event } from "@/domain/entities/Event";
import type { EventFilters, IEventRepository, EventAuditLogEntry } from "@/domain/repositories/IEventRepository";
import { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export class MySQLEventRepository implements IEventRepository {
  constructor(private readonly db: MySQLConnection) {}

  async findAll(filters?: EventFilters): Promise<Event[]> {
    let sql = `
      SELECT e.*,
             m.vorname as verantwortlich_vorname,
             m.nachname as verantwortlich_nachname
      FROM events e
      LEFT JOIN mitglieder m ON e.responsible_member_id = m.id
      WHERE 1=1
    `;

    const params: any[] = [];

    if (filters?.status) {
      sql += " AND e.status = ?";
      params.push(filters.status);
    }

    if (filters?.isPublic !== undefined) {
      sql += " AND e.is_public = ?";
      params.push(filters.isPublic);
    }

    if (filters?.createdBy) {
      sql += " AND e.created_by = ?";
      params.push(filters.createdBy);
    }

    if (!filters?.includeDeleted) {
      sql += " AND e.deleted_at IS NULL";
    }

    sql += " ORDER BY e.date DESC, e.time DESC";

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(this.mapRowToEvent);
  }

  async findById(id: string): Promise<Event | null> {
    const [row] = await this.db.query<any[]>(
      `SELECT e.*,
              m.vorname as verantwortlich_vorname,
              m.nachname as verantwortlich_nachname
       FROM events e
       LEFT JOIN mitglieder m ON e.responsible_member_id = m.id
       WHERE e.id = ? AND e.deleted_at IS NULL`,
      [id]
    );

    return row ? this.mapRowToEvent(row) : null;
  }

  async save(event: Event): Promise<Event> {
    const isNew = !(await this.findById(event.id));

    if (isNew) {
      await this.db.query(
        `INSERT INTO events
         (id, title, description, short_description, date, time,
          location_name, location_address, location_description,
          type, sport_bereich, status, is_public, is_confidential,
          responsible_member_id, budget, budget_used, max_participants,
          registration_deadline, ticket_link, created_by, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          event.id,
          event.title,
          event.description,
          event.shortDescription,
          event.date,
          event.time,
          event.location.name,
          event.location.address,
          event.location.description,
          event.type,
          event.sportBereich,
          event.status,
          event.isPublic,
          event.isConfidential,
          event.responsibleMemberId,
          event.budget,
          event.budgetUsed,
          event.maxParticipants,
          event.registrationDeadline,
          event.ticketLink,
          event.createdBy,
          event.createdAt
        ]
      );
    } else {
      await this.db.query(
        `UPDATE events SET
         title = ?, description = ?, short_description = ?,
         date = ?, time = ?, location_name = ?,
         location_address = ?, location_description = ?,
         type = ?, sport_bereich = ?, status = ?,
         is_public = ?, is_confidential = ?,
         responsible_member_id = ?, budget = ?,
         budget_used = ?, max_participants = ?,
         registration_deadline = ?, ticket_link = ?,
         updated_at = NOW(), updated_by = ?
         WHERE id = ?`,
        [
          event.title,
          event.description,
          event.shortDescription,
          event.date,
          event.time,
          event.location.name,
          event.location.address,
          event.location.description,
          event.type,
          event.sportBereich,
          event.status,
          event.isPublic,
          event.isConfidential,
          event.responsibleMemberId,
          event.budget,
          event.budgetUsed,
          event.maxParticipants,
          event.registrationDeadline,
          event.ticketLink,
          event.updatedBy,
          event.id
        ]
      );
    }

    return event;
  }

  async delete(id: string): Promise<void> {
    await this.db.query(
      `UPDATE events SET deleted_at = NOW() WHERE id = ?`,
      [id]
    );
  }

  async updateWithAudit(event: Event, auditEntries: EventAuditLogEntry[]): Promise<Event> {
    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      // Update Event
      await this.save(event);

      // Create Audit Entries
      for (const entry of auditEntries) {
        await connection.query(
          `INSERT INTO event_audit_log
           (id, event_id, action, field_name, old_value, new_value,
            changed_by, ip_address, user_agent, created_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            generateId(),
            entry.eventId,
            entry.action,
            entry.fieldName,
            entry.oldValue,
            entry.newValue,
            entry.changedBy,
            entry.ipAddress,
            entry.userAgent
          ]
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
  }

  async softDeleteWithAudit(id: string, deletedBy: string, auditEntry: EventAuditLogEntry): Promise<void> {
    const connection = await this.db.getConnection();
    await connection.beginTransaction();

    try {
      await connection.query(
        `UPDATE events SET deleted_at = NOW(), deleted_by = ? WHERE id = ?`,
        [deletedBy, id]
      );

      await connection.query(
        `INSERT INTO event_audit_log
         (id, event_id, action, changed_by, ip_address, user_agent, created_at)
         VALUES (?, ?, 'deleted', ?, ?, ?, NOW())`,
        [
          generateId(),
          id,
          deletedBy,
          auditEntry.ipAddress,
          auditEntry.userAgent
        ]
      );

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async createStatusHistory(params: {
    eventId: string;
    oldStatus?: string;
    newStatus: string;
    changedBy: string;
    comment?: string;
  }): Promise<void> {
    await this.db.query(
      `INSERT INTO event_status_history
       (id, event_id, old_status, new_status, changed_by, comment, created_at)
       VALUES (?, ?, ?, ?, ?, ?, NOW())`,
      [
        generateId(),
        params.eventId,
        params.oldStatus,
        params.newStatus,
        params.changedBy,
        params.comment
      ]
    );
  }

  async getAuditLog(eventId: string): Promise<Array<{
    action: string;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    changedBy: string;
    changedAt: Date;
  }>> {
    const rows = await this.db.query<any[]>(
      `SELECT action, field_name, old_value, new_value, changed_by, created_at
       FROM event_audit_log
       WHERE event_id = ?
       ORDER BY created_at DESC`,
      [eventId]
    );

    return rows.map(row => ({
      action: row.action,
      fieldName: row.field_name,
      oldValue: row.old_value,
      newValue: row.new_value,
      changedBy: row.changed_by,
      changedAt: new Date(row.created_at)
    }));
  }

  async getParticipantCount(eventId: string): Promise<number> {
    const [result] = await this.db.query<any[]>(
      `SELECT COUNT(*) as count
       FROM event_teilnahmen
       WHERE event_id = ? AND status IN ('angemeldet', 'bestaetigt')`,
      [eventId]
    );

    return result?.count || 0;
  }

  async getParticipants(eventId: string): Promise<Array<{
    id: string;
    name: string;
    status: string;
    registeredAt: Date;
  }>> {
    const rows = await this.db.query<any[]>(
      `SELECT et.mitglied_id as id,
              CONCAT(m.vorname, ' ', m.nachname) as name,
              et.status,
              et.angemeldet_am as registered_at
       FROM event_teilnahmen et
       JOIN mitglieder m ON et.mitglied_id = m.id
       WHERE et.event_id = ?
       ORDER BY et.angemeldet_am DESC`,
      [eventId]
    );

    return rows.map(row => ({
      id: row.id,
      name: row.name,
      status: row.status,
      registeredAt: new Date(row.registered_at)
    }));
  }

  async getTaskStats(eventId: string): Promise<{ total: number; completed: number }> {
    const [result] = await this.db.query<any[]>(
      `SELECT
        COUNT(*) as total,
        SUM(CASE WHEN status = 'erledigt' THEN 1 ELSE 0 END) as completed
       FROM tasks
       WHERE context_type = 'event' AND context_id = ? AND deleted_at IS NULL`,
      [eventId]
    );

    return {
      total: result?.total || 0,
      completed: result?.completed || 0
    };
  }

  async getTasks(eventId: string): Promise<Array<{
    id: string;
    title: string;
    status: string;
    assignee?: {
      id: string;
      name: string;
    };
  }>> {
    const rows = await this.db.query<any[]>(
      `SELECT t.id, t.titel as title, t.status,
              m.id as assignee_id,
              CONCAT(m.vorname, ' ', m.nachname) as assignee_name
       FROM tasks t
       LEFT JOIN mitglieder m ON t.verantwortlich_id = m.id
       WHERE t.context_type = 'event' AND t.context_id = ? AND t.deleted_at IS NULL
       ORDER BY t.prioritaet DESC, t.frist ASC`,
      [eventId]
    );

    return rows.map(row => ({
      id: row.id,
      title: row.title,
      status: row.status,
      assignee: row.assignee_id ? {
        id: row.assignee_id,
        name: row.assignee_name
      } : undefined
    }));
  }

  private mapRowToEvent(row: any): Event {
    return {
      id: row.id,
      title: row.title,
      description: row.description,
      shortDescription: row.short_description,
      date: new Date(row.date),
      time: row.time,
      durationMinutes: row.duration_minutes,
      location: {
        name: row.location_name,
        address: row.location_address,
        description: row.location_description
      },
      type: row.type,
      sportBereich: row.sport_bereich,
      status: row.status,
      isPublic: Boolean(row.is_public),
      isConfidential: Boolean(row.is_confidential),
      responsibleMemberId: row.responsible_member_id,
      deputyMemberIds: row.deputy_member_ids ? JSON.parse(row.deputy_member_ids) : undefined,
      budget: row.budget ? Number(row.budget) : undefined,
      budgetUsed: Number(row.budget_used) || 0,
      maxParticipants: row.max_participants,
      registrationDeadline: row.registration_deadline ? new Date(row.registration_deadline) : undefined,
      ticketLink: row.ticket_link,
      createdAt: new Date(row.created_at),
      createdBy: row.created_by,
      updatedAt: new Date(row.updated_at),
      updatedBy: row.updated_by,
      approvedAt: row.approved_at ? new Date(row.approved_at) : undefined,
      approvedBy: row.approved_by
    };
  }
}

export const createMySQLEventRepository = (db: MySQLConnection): IEventRepository => {
  return new MySQLEventRepository(db);
};
