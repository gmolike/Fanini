// apps/api/src/infrastructure/repositories/MySQLTaskRepository.ts
import type { Task, TaskContext } from "@/domain/entities/Task";
import type {
  ITaskRepository,
  TaskFilters,
  TaskAuditLogEntry,
} from "@/domain/repositories/ITaskRepository";
import type { TaskAssignment } from "@/domain/entities/TaskAssignment";
import type { TaskComment } from "@/domain/entities/TaskComment";
import { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export class MySQLTaskRepository implements ITaskRepository {
  constructor(private readonly db: MySQLConnection) {}

  async create(
    task: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<Task> {
    const id = generateId();
    const now = new Date();

    await this.db.query(
      `INSERT INTO tasks
       (id, titel, beschreibung, context_type, context_id,
        verantwortlich_id, status, prioritaet, frist,
        ist_standardaufgabe, kategorie, erstellt_von,
        erstellt_am, aktualisiert_am, geloescht)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        task.titel,
        task.beschreibung,
        task.context.type,
        task.context.id,
        task.verantwortlichId,
        task.status,
        task.prioritaet,
        task.frist,
        task.istStandardaufgabe,
        task.kategorie,
        task.erstelltVon,
        now,
        now,
        false,
      ],
    );

    return {
      ...task,
      id,
      erstelltAm: now,
      aktualisiertAm: now,
    };
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const fields = Object.keys(updates)
      .filter(
        (key) => !["id", "erstelltAm", "erstelltVon", "context"].includes(key),
      )
      .map((key) => `${this.camelToSnake(key)} = ?`)
      .join(", ");

    const values = Object.entries(updates)
      .filter(
        ([key]) =>
          !["id", "erstelltAm", "erstelltVon", "context"].includes(key),
      )
      .map(([_, value]) => value);

    values.push(id);

    await this.db.query(
      `UPDATE tasks SET ${fields}, aktualisiert_am = NOW() WHERE id = ?`,
      values,
    );

    const updated = await this.findById(id);
    if (!updated) throw new Error("Task not found after update");

    return updated;
  }

  async findById(id: string): Promise<Task | null> {
    const [row] = await this.db.query<any[]>(
      `SELECT t.*,
              GROUP_CONCAT(DISTINCT ta.mitglied_id) as zugewiesene_ids
       FROM tasks t
       LEFT JOIN task_assignments ta ON t.id = ta.task_id
       WHERE t.id = ? AND t.geloescht = 0
       GROUP BY t.id`,
      [id],
    );

    return row ? this.mapRowToTask(row) : null;
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    let sql = `
      SELECT t.*,
             GROUP_CONCAT(DISTINCT ta.mitglied_id) as zugewiesene_ids
      FROM tasks t
      LEFT JOIN task_assignments ta ON t.id = ta.task_id
      WHERE t.geloescht = 0
    `;
    const params: any[] = [];

    if (filters?.contextType) {
      sql += " AND t.context_type = ?";
      params.push(filters.contextType);
    }

    if (filters?.contextId) {
      sql += " AND t.context_id = ?";
      params.push(filters.contextId);
    }

    if (filters?.status && filters.status.length > 0) {
      const placeholders = filters.status.map(() => "?").join(",");
      sql += ` AND t.status IN (${placeholders})`;
      params.push(...filters.status);
    }

    if (filters?.prioritaet && filters.prioritaet.length > 0) {
      const placeholders = filters.prioritaet.map(() => "?").join(",");
      sql += ` AND t.prioritaet IN (${placeholders})`;
      params.push(...filters.prioritaet);
    }

    if (filters?.verantwortlichId) {
      sql += " AND t.verantwortlich_id = ?";
      params.push(filters.verantwortlichId);
    }

    if (filters?.zugewiesenAn) {
      sql += " AND ta.mitglied_id = ?";
      params.push(filters.zugewiesenAn);
    }

    if (filters?.frist?.von) {
      sql += " AND t.frist >= ?";
      params.push(filters.frist.von);
    }

    if (filters?.frist?.bis) {
      sql += " AND t.frist <= ?";
      params.push(filters.frist.bis);
    }

    if (filters?.kategorie) {
      sql += " AND t.kategorie = ?";
      params.push(filters.kategorie);
    }

    sql += " GROUP BY t.id ORDER BY t.prioritaet DESC, t.frist ASC";

    const rows = await this.db.query<any[]>(sql, params);
    return rows.map((row) => this.mapRowToTask(row));
  }

  async softDelete(id: string): Promise<void> {
    await this.db.query(
      `UPDATE tasks SET geloescht = 1, aktualisiert_am = NOW() WHERE id = ?`,
      [id],
    );
  }

  async assignMembers(
    taskId: string,
    memberIds: string[],
    assignedBy: string,
  ): Promise<void> {
    // Erst alle bestehenden löschen
    await this.db.query(`DELETE FROM task_assignments WHERE task_id = ?`, [
      taskId,
    ]);

    // Neue zuweisen
    if (memberIds.length > 0) {
      const values = memberIds.map((memberId) => [
        taskId,
        memberId,
        assignedBy,
        new Date(),
      ]);

      await this.db.query(
        `INSERT INTO task_assignments
         (task_id, mitglied_id, zugewiesen_von, zugewiesen_am)
         VALUES ?`,
        [values],
      );
    }
  }

  async unassignMember(taskId: string, memberId: string): Promise<void> {
    await this.db.query(
      `DELETE FROM task_assignments
       WHERE task_id = ? AND mitglied_id = ?`,
      [taskId, memberId],
    );
  }

  async getAssignments(taskId: string): Promise<TaskAssignment[]> {
    const rows = await this.db.query<any[]>(
      `SELECT ta.*,
              CONCAT(m.vorname, ' ', m.nachname) as mitglied_name
       FROM task_assignments ta
       JOIN mitglieder m ON ta.mitglied_id = m.id
       WHERE ta.task_id = ?`,
      [taskId],
    );

    return rows.map((row) => ({
      taskId: row.task_id,
      mitgliedId: row.mitglied_id,
      zugewiesenAm: new Date(row.zugewiesen_am),
      zugewiesenVon: row.zugewiesen_von,
      kommentar: row.kommentar,
    }));
  }

  async addComment(
    comment: Omit<TaskComment, "id" | "erstelltAm">,
  ): Promise<TaskComment> {
    const id = generateId();
    const erstelltAm = new Date();

    await this.db.query(
      `INSERT INTO task_comments
       (id, task_id, autor_id, text, erwaehnte_personen, erstellt_am)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        id,
        comment.taskId,
        comment.autorId,
        comment.text,
        JSON.stringify(comment.erwaehntePersonen),
        erstelltAm,
      ],
    );

    return {
      ...comment,
      id,
      erstelltAm,
    };
  }

  async getComments(taskId: string): Promise<TaskComment[]> {
    const rows = await this.db.query<any[]>(
      `SELECT tc.*,
              CONCAT(m.vorname, ' ', m.nachname) as autor_name
       FROM task_comments tc
       JOIN mitglieder m ON tc.autor_id = m.id
       WHERE tc.task_id = ?
       ORDER BY tc.erstellt_am DESC`,
      [taskId],
    );

    return rows.map((row) => ({
      id: row.id,
      taskId: row.task_id,
      autorId: row.autor_id,
      text: row.text,
      erstelltAm: new Date(row.erstellt_am),
      erwaehntePersonen: row.erwaehnte_personen
        ? JSON.parse(row.erwaehnte_personen)
        : [],
    }));
  }

  async getTasksByEvent(eventId: string): Promise<Task[]> {
    return this.findAll({
      contextType: "event",
      contextId: eventId,
    });
  }

  async getTasksByTeam(teamId: string): Promise<Task[]> {
    return this.findAll({
      contextType: "team",
      contextId: teamId,
    });
  }

  async getMyTasks(memberId: string): Promise<Task[]> {
    const sql = `
      SELECT DISTINCT t.*,
             GROUP_CONCAT(DISTINCT ta.mitglied_id) as zugewiesene_ids
      FROM tasks t
      LEFT JOIN task_assignments ta_all ON t.id = ta_all.task_id
      LEFT JOIN task_assignments ta ON t.id = ta.task_id AND ta.mitglied_id = ?
      WHERE t.geloescht = 0
      AND (t.verantwortlich_id = ? OR ta.mitglied_id = ?)
      GROUP BY t.id
      ORDER BY t.prioritaet DESC, t.frist ASC`;

    const rows = await this.db.query<any[]>(sql, [
      memberId,
      memberId,
      memberId,
    ]);
    return rows.map((row) => this.mapRowToTask(row));
  }

  async createAuditLog(entry: TaskAuditLogEntry): Promise<void> {
    await this.db.query(
      `INSERT INTO task_audit_log
       (id, task_id, aktion, ausgefuehrt_von,
        alte_werte, neue_werte, ip_adresse, user_agent, erstellt_am)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        generateId(),
        entry.taskId,
        entry.aktion,
        entry.ausgefuehrtVon,
        entry.alteWerte ? JSON.stringify(entry.alteWerte) : null,
        entry.neueWerte ? JSON.stringify(entry.neueWerte) : null,
        entry.ipAdresse,
        entry.userAgent,
      ],
    );
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
      verantwortlichId: row.verantwortlich_id,
      zugewiesenAn: row.zugewiesene_ids ? row.zugewiesene_ids.split(",") : [],
      status: row.status,
      prioritaet: row.prioritaet,
      frist: row.frist ? new Date(row.frist) : undefined,
      materialien: row.materialien ? JSON.parse(row.materialien) : [],
      abhaengigVon: row.abhaengig_von
        ? JSON.parse(row.abhaengig_von)
        : undefined,
      istStandardaufgabe: Boolean(row.ist_standardaufgabe),
      kategorie: row.kategorie,
      erstelltVon: row.erstellt_von,
      erstelltAm: new Date(row.erstellt_am),
      aktualisiertAm: new Date(row.aktualisiert_am),
      erledigtAm: row.erledigt_am ? new Date(row.erledigt_am) : undefined,
      erledigtVon: row.erledigt_von,
      geloescht: Boolean(row.geloescht),
    };
  }

  private camelToSnake(str: string): string {
    return str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);
  }
}
