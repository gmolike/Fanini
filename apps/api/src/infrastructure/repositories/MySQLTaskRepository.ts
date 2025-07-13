import { Task, TaskStatus, TaskPriority } from "@/domain/entities/Task";
import { TaskAssignment } from "@/domain/entities/TaskAssignment";
import { TaskComment, createTaskComment } from "@/domain/entities/TaskComment";
import {
  ITaskRepository,
  TaskFilters,
  AuditLogEntry,
} from "@/domain/repositories/ITaskRepository";
import { MySQLConnection } from "./MySQLConnection";
import { generateId } from "@faninitiative/shared";

export class MySQLTaskRepository implements ITaskRepository {
  constructor(private readonly db: MySQLConnection) {}

  // Helper: Row zu Task Entity
  private rowToTask(row: any): Task {
    return {
      id: row.id,
      titel: row.titel,
      beschreibung: row.beschreibung,
      context: {
        type: row.context_type,
        id: row.context_id,
      },
      verantwortlichId: row.verantwortlich_id,
      zugewiesenAn: [], // Wird separat geladen
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

  // Helper: Zugewiesene Mitglieder laden
  private async loadAssignedMembers(taskId: string): Promise<string[]> {
    const rows = await this.db.query<any[]>(
      "SELECT mitglied_id FROM task_assignments WHERE task_id = ?",
      [taskId],
    );
    return rows.map((row) => row.mitglied_id);
  }

  async create(
    taskData: Omit<Task, "id" | "erstelltAm" | "aktualisiertAm">,
  ): Promise<Task> {
    const task: Task = {
      ...taskData,
      id: generateId(),
      erstelltAm: new Date(),
      aktualisiertAm: new Date(),
    };

    await this.db.query(
      `INSERT INTO tasks
      (id, titel, beschreibung, context_type, context_id, verantwortlich_id,
       status, prioritaet, frist, materialien, abhaengig_von, ist_standardaufgabe,
       kategorie, erstellt_von, erstellt_am, aktualisiert_am, geloescht)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.titel,
        task.beschreibung || null,
        task.context.type,
        task.context.id,
        task.verantwortlichId || null,
        task.status,
        task.prioritaet,
        task.frist || null,
        JSON.stringify(task.materialien),
        task.abhaengigVon ? JSON.stringify(task.abhaengigVon) : null,
        task.istStandardaufgabe,
        task.kategorie || null,
        task.erstelltVon,
        task.erstelltAm,
        task.aktualisiertAm,
        false,
      ],
    );

    // Wenn verantwortlichId gesetzt ist, auch als Assignment hinzufügen
    if (task.verantwortlichId) {
      await this.assignMembers(
        task.id,
        [task.verantwortlichId],
        task.erstelltVon,
      );
    }

    // Audit Log
    await this.createAuditLog({
      taskId: task.id,
      aktion: "erstellt",
      ausgefuehrtVon: task.erstelltVon,
      neueWerte: task,
    });

    return task;
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const existingTask = await this.findById(id);
    if (!existingTask) {
      throw new Error("Task nicht gefunden");
    }

    const updatedTask: Task = {
      ...existingTask,
      ...updates,
      id: existingTask.id,
      erstelltAm: existingTask.erstelltAm,
      aktualisiertAm: new Date(),
    };

    await this.db.query(
      `UPDATE tasks SET
        titel = ?, beschreibung = ?, context_type = ?, context_id = ?,
        verantwortlich_id = ?, status = ?, prioritaet = ?, frist = ?,
        materialien = ?, abhaengig_von = ?, ist_standardaufgabe = ?,
        kategorie = ?, aktualisiert_am = ?, erledigt_am = ?, erledigt_von = ?
      WHERE id = ? AND geloescht = FALSE`,
      [
        updatedTask.titel,
        updatedTask.beschreibung || null,
        updatedTask.context.type,
        updatedTask.context.id,
        updatedTask.verantwortlichId || null,
        updatedTask.status,
        updatedTask.prioritaet,
        updatedTask.frist || null,
        JSON.stringify(updatedTask.materialien),
        updatedTask.abhaengigVon
          ? JSON.stringify(updatedTask.abhaengigVon)
          : null,
        updatedTask.istStandardaufgabe,
        updatedTask.kategorie || null,
        updatedTask.aktualisiertAm,
        updatedTask.erledigtAm || null,
        updatedTask.erledigtVon || null,
        id,
      ],
    );

    // Audit Log für Änderungen
    const changedFields: any = {};
    Object.keys(updates).forEach((key) => {
      if (
        JSON.stringify((existingTask as any)[key]) !==
        JSON.stringify((updates as any)[key])
      ) {
        changedFields[key] = {
          alt: (existingTask as any)[key],
          neu: (updates as any)[key],
        };
      }
    });

    if (Object.keys(changedFields).length > 0) {
      await this.createAuditLog({
        taskId: id,
        aktion: "aktualisiert",
        ausgefuehrtVon: updates.erstelltVon || "system",
        alteWerte: changedFields,
        neueWerte: updates,
      });
    }

    return updatedTask;
  }

  async findById(id: string): Promise<Task | null> {
    const rows = await this.db.query<any[]>(
      "SELECT * FROM tasks WHERE id = ? AND geloescht = FALSE",
      [id],
    );

    if (rows.length === 0) return null;

    const task = this.rowToTask(rows[0]);
    task.zugewiesenAn = await this.loadAssignedMembers(id);

    return task;
  }

  async findAll(filters?: TaskFilters): Promise<Task[]> {
    let sql = "SELECT * FROM tasks WHERE geloescht = FALSE";
    const params: any[] = [];

    if (filters) {
      if (filters.contextType) {
        sql += " AND context_type = ?";
        params.push(filters.contextType);
      }

      if (filters.contextId) {
        sql += " AND context_id = ?";
        params.push(filters.contextId);
      }

      if (filters.status && filters.status.length > 0) {
        sql += ` AND status IN (${filters.status.map(() => "?").join(",")})`;
        params.push(...filters.status);
      }

      if (filters.prioritaet && filters.prioritaet.length > 0) {
        sql += ` AND prioritaet IN (${filters.prioritaet.map(() => "?").join(",")})`;
        params.push(...filters.prioritaet);
      }

      if (filters.verantwortlichId) {
        sql += " AND verantwortlich_id = ?";
        params.push(filters.verantwortlichId);
      }

      if (filters.zugewiesenAn) {
        sql += ` AND id IN (
          SELECT task_id FROM task_assignments WHERE mitglied_id = ?
        )`;
        params.push(filters.zugewiesenAn);
      }

      if (filters.frist) {
        if (filters.frist.von) {
          sql += " AND frist >= ?";
          params.push(filters.frist.von);
        }
        if (filters.frist.bis) {
          sql += " AND frist <= ?";
          params.push(filters.frist.bis);
        }
      }
    }

    sql += " ORDER BY prioritaet DESC, frist ASC, erstellt_am DESC";

    const rows = await this.db.query<any[]>(sql, params);

    // Lade zugewiesene Mitglieder für alle Tasks
    const tasks = await Promise.all(
      rows.map(async (row) => {
        const task = this.rowToTask(row);
        task.zugewiesenAn = await this.loadAssignedMembers(task.id);
        return task;
      }),
    );

    return tasks;
  }

  async softDelete(id: string): Promise<void> {
    await this.db.query(
      "UPDATE tasks SET geloescht = TRUE, aktualisiert_am = NOW() WHERE id = ?",
      [id],
    );

    await this.createAuditLog({
      taskId: id,
      aktion: "geloescht",
      ausgefuehrtVon: "system",
    });
  }

  async assignMembers(
    taskId: string,
    memberIds: string[],
    assignedBy: string,
  ): Promise<void> {
    const connection = await this.db.getConnection();

    try {
      await connection.beginTransaction();

      for (const memberId of memberIds) {
        // Prüfe ob bereits zugewiesen
        const existing = await connection.query(
          "SELECT 1 FROM task_assignments WHERE task_id = ? AND mitglied_id = ?",
          [taskId, memberId],
        );

        if ((existing as any[]).length === 0) {
          await connection.query(
            `INSERT INTO task_assignments
            (task_id, mitglied_id, zugewiesen_von, zugewiesen_am)
            VALUES (?, ?, ?, NOW())`,
            [taskId, memberId, assignedBy],
          );
        }
      }

      await connection.commit();

      // Audit Log
      await this.createAuditLog({
        taskId,
        aktion: "mitglieder_zugewiesen",
        ausgefuehrtVon: assignedBy,
        neueWerte: { memberIds },
      });
    } catch (error) {
      await connection.rollback();
      throw error;
    } finally {
      connection.release();
    }
  }

  async unassignMember(taskId: string, memberId: string): Promise<void> {
    await this.db.query(
      "DELETE FROM task_assignments WHERE task_id = ? AND mitglied_id = ?",
      [taskId, memberId],
    );

    await this.createAuditLog({
      taskId,
      aktion: "mitglied_entfernt",
      ausgefuehrtVon: "system",
      alteWerte: { memberId },
    });
  }

  async getAssignments(taskId: string): Promise<TaskAssignment[]> {
    const rows = await this.db.query<any[]>(
      `SELECT ta.*, CONCAT(m.vorname, ' ', m.nachname) as mitglied_name
       FROM task_assignments ta
       JOIN mitglieder m ON ta.mitglied_id = m.id
       WHERE ta.task_id = ?
       ORDER BY ta.zugewiesen_am DESC`,
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
    commentData: Omit<TaskComment, "id" | "erstelltAm">,
  ): Promise<TaskComment> {
    const comment = createTaskComment(commentData);

    await this.db.query(
      `INSERT INTO task_comments
      (id, task_id, autor_id, text, erwaehnte_personen, erstellt_am)
      VALUES (?, ?, ?, ?, ?, ?)`,
      [
        comment.id,
        comment.taskId,
        comment.autorId,
        comment.text,
        JSON.stringify(comment.erwaehntePersonen),
        comment.erstelltAm,
      ],
    );

    return comment;
  }

  async getComments(taskId: string): Promise<TaskComment[]> {
    const rows = await this.db.query<any[]>(
      `SELECT c.*, CONCAT(m.vorname, ' ', m.nachname) as autor_name
       FROM task_comments c
       JOIN mitglieder m ON c.autor_id = m.id
       WHERE c.task_id = ?
       ORDER BY c.erstellt_am DESC`,
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
    return this.findAll({
      zugewiesenAn: memberId,
      nurAktive: true,
    });
  }

  async createAuditLog(entry: AuditLogEntry): Promise<void> {
    await this.db.query(
      `INSERT INTO task_audit_log
      (id, task_id, aktion, ausgefuehrt_von, ausgefuehrt_am,
       alte_werte, neue_werte, ip_adresse, user_agent)
      VALUES (?, ?, ?, ?, NOW(), ?, ?, ?, ?)`,
      [
        generateId(),
        entry.taskId,
        entry.aktion,
        entry.ausgefuehrtVon,
        entry.alteWerte ? JSON.stringify(entry.alteWerte) : null,
        entry.neueWerte ? JSON.stringify(entry.neueWerte) : null,
        entry.ipAdresse || null,
        entry.userAgent || null,
      ],
    );
  }
}
