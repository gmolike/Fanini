// apps/api/src/infrastructure/repositories/MySQLTaskRepository.ts
import type { Task, TaskContext } from "@/domain/entities/Task";
import { BaseRepository } from "./BaseRepository";
import { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import { MySQLConnection } from "./MySQLConnection";

export class MySQLTaskRepository
  extends BaseRepository<Task>
  implements ITaskRepository
{
  constructor(db: MySQLConnection) {
    super(db, "tasks");
  }

  async create(
    taskData: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm">,
    userId: string,
  ): Promise<Task> {
    const task = {
      ...taskData,
      id: generateId(),
      ...this.addAuditInfo({}, userId, taskData.erstelltVon),
    };

    await this.db.query(
      `INSERT INTO tasks
       (id, titel, beschreibung, context_type, context_id,
        verantwortlich_id, status, prioritaet, frist,
        erstellt_von, erstellt_von_user_id, erstellt_am)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.titel,
        task.beschreibung,
        task.context.type,
        task.context.id,
        task.verantwortlichId,
        task.status,
        task.prioritaet,
        task.frist,
        task.erstelltVon,
        task.erstelltVonUserId,
        task.erstelltAm,
      ],
    );

    // Audit Log mit User ID
    await this.createAuditLog({
      taskId: task.id,
      aktion: "erstellt",
      ausgefuehrtVon: task.erstelltVon,
      ausgefuehrtVonUserId: userId,
      neueWerte: task,
    });

    return task;
  }

  // Context-basierte Suche mit View
  async findByContext(context: TaskContext): Promise<Task[]> {
    const rows = await this.db.query<any[]>(
      `SELECT * FROM v_tasks_with_assignees
       WHERE context_type = ? AND context_id = ?
       ORDER BY prioritaet DESC, frist ASC`,
      [context.type, context.id],
    );

    return rows.map(this.mapRowToTask);
  }

  // Nutze soft delete
  async delete(id: string, userId: string): Promise<void> {
    await this.softDelete(id, userId);

    await this.createAuditLog({
      taskId: id,
      aktion: "geloescht",
      ausgefuehrtVonUserId: userId,
    });
  }

  private mapRowToTask(row: any): Task {
    return {
      id: row.id,
      titel: row.titel,
      beschreibung: row.beschreibung,
      context: {
        type: row.context_type,
        id: row.context_id,
      },
      // Aus View
      zugewieseneNamen: row.zugewiesene_namen
        ? row.zugewiesene_namen.split(",")
        : [],
      anzahlZugewiesene: row.anzahl_zugewiesene || 0,
      // Audit Info
      erstelltVon: row.erstellt_von,
      erstelltVonUserId: row.erstellt_von_user_id,
      erstelltAm: new Date(row.erstellt_am),
      aktualisiertAm: new Date(row.aktualisiert_am),
    };
  }
}
