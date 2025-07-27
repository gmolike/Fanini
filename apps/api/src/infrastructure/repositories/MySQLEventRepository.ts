// apps/api/src/infrastructure/repositories/MySQLEventRepository.ts
import { BaseRepository } from "./BaseRepository";
import type { Event } from "@/domain/entities/Event";
import type { EventFilters, IEventRepository } from "@/domain/repositories/IEventRepository";
import { MySQLConnection } from "./MySQLConnection";

export class MySQLEventRepository
  extends BaseRepository<Event>
  implements IEventRepository
{
  constructor(db: MySQLConnection) {
    super(db, "events");
  }

  async findAll(filters?: EventFilters): Promise<Event[]> {
    let sql = `
      SELECT
        e.*,
        m.vorname as verantwortlich_vorname,
        m.nachname as verantwortlich_nachname,
        u.email as erstellt_von_email,
        COUNT(DISTINCT et.mitglied_id) as teilnehmer_count,
        COUNT(DISTINCT t.id) as task_count
      FROM events e
      LEFT JOIN mitglieder m ON e.verantwortlich_id = m.id
      LEFT JOIN users u ON e.erstellt_von_user_id = u.id
      LEFT JOIN event_teilnahmen et ON e.id = et.event_id
        AND et.status IN ('angemeldet', 'bestaetigt')
      LEFT JOIN tasks t ON e.id = t.context_id
        AND t.context_type = 'event'
        AND t.deleted_at IS NULL
      WHERE ${this.softDeleteClause("e")}
    `;

    const params: any[] = [];

    // Apply filters...
    if (filters?.createdByUserId) {
      sql += " AND e.erstellt_von_user_id = ?";
      params.push(filters.createdByUserId);
    }

    sql += " GROUP BY e.id ORDER BY e.datum DESC, e.uhrzeit DESC";

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map(this.mapRowToEvent);
  }

  async save(event: Event, userId: string): Promise<Event> {
    const auditedEvent = this.addAuditInfo(
      event,
      userId,
      event.responsibleMemberId,
    );

    await this.db.query(
      `INSERT INTO events
       (id, titel, beschreibung, ...,
        erstellt_von, erstellt_von_user_id, erstellt_am,
        aktualisiert_von, aktualisiert_von_user_id, aktualisiert_am)
       VALUES (?, ?, ?, ..., ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
        titel = VALUES(titel),
        ...,
        aktualisiert_von = VALUES(aktualisiert_von),
        aktualisiert_von_user_id = VALUES(aktualisiert_von_user_id),
        aktualisiert_am = NOW()`,
      [
        auditedEvent.id,
        auditedEvent.title,
        auditedEvent.description,
        // ... andere Felder
        auditedEvent.createdBy,
        auditedEvent.createdByUserId,
        auditedEvent.createdAt,
        auditedEvent.updatedBy,
        auditedEvent.updatedByUserId,
        auditedEvent.updatedAt,
      ],
    );

    return auditedEvent;
  }

  // Nutze View für Performance
  async findWithStats(id: string): Promise<EventWithStats | null> {
    const [row] = await this.db.query<any[]>(
      "SELECT * FROM v_events_with_stats WHERE id = ?",
      [id],
    );

    return row ? this.mapRowToEventWithStats(row) : null;
  }

  private mapRowToEvent(row: any): Event {
    return {
      id: row.id,
      title: row.titel,
      // ... andere Mappings
      metadata: {
        createdBy: row.erstellt_von,
        createdByUserId: row.erstellt_von_user_id,
        createdByEmail: row.erstellt_von_email,
        verantwortlichName: row.verantwortlich_vorname
          ? `${row.verantwortlich_vorname} ${row.verantwortlich_nachname}`
          : undefined,
        stats: {
          teilnehmerCount: row.teilnehmer_count || 0,
          taskCount: row.task_count || 0,
        },
      },
    };
  }
}
