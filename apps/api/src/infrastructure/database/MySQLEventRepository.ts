import { Event, EventStatus } from "@/domain/entities/Event";
import {
  IEventRepository,
  EventFilters,
} from "@/domain/repositories/IEventRepository";
import { MySQLConnection } from "./MySQLConnection";

export class MySQLEventRepository implements IEventRepository {
  constructor(private db: MySQLConnection) {}

  async findAll(filters?: EventFilters): Promise<Event[]> {
    let sql = "SELECT * FROM events WHERE 1=1";
    const params: any[] = [];

    if (filters?.status) {
      sql += " AND status = ?";
      params.push(filters.status);
    }

    if (filters?.createdBy) {
      sql += " AND created_by = ?";
      params.push(filters.createdBy);
    }

    if (filters?.fromDate) {
      sql += " AND date >= ?";
      params.push(filters.fromDate);
    }

    if (filters?.toDate) {
      sql += " AND date <= ?";
      params.push(filters.toDate);
    }

    sql += " ORDER BY date DESC";

    const rows = await this.db.query<any[]>(sql, params);

    return rows.map(
      (row) =>
        new Event(
          row.id,
          row.title,
          row.description,
          new Date(row.date),
          row.location,
          row.status as EventStatus,
          row.created_by,
          new Date(row.created_at),
          new Date(row.updated_at),
        ),
    );
  }

  async findById(id: string): Promise<Event | null> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM events WHERE id = ?",
      [id],
    );

    if (rows.length === 0) return null;

    const row = rows[0];
    return new Event(
      row.id,
      row.title,
      row.description,
      new Date(row.date),
      row.location,
      row.status as EventStatus,
      row.created_by,
      new Date(row.created_at),
      new Date(row.updated_at),
    );
  }

  async save(event: Event): Promise<Event> {
    const sql = `
      INSERT INTO events
      (id, title, description, date, location, status, created_by, created_at, updated_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
      title = VALUES(title),
      description = VALUES(description),
      date = VALUES(date),
      location = VALUES(location),
      status = VALUES(status),
      updated_at = VALUES(updated_at)
    `;

    await this.db.query(sql, [
      event.id,
      event.title,
      event.description,
      event.date,
      event.location,
      event.status,
      event.createdBy,
      event.createdAt,
      event.updatedAt,
    ]);

    return event;
  }

  async delete(id: string): Promise<void> {
    await this.db.query("DELETE FROM events WHERE id = ?", [id]);
  }
}
