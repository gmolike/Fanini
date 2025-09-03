// apps/api/src/infrastructure/repositories/MySQLTaskRepository.ts (vollständig)
import type { Task, TaskMaterial } from "@/domain/entities/Task";
import type { TaskComment } from "@/domain/entities/TaskComment";
import type {
  ITaskRepository,
  TaskFilters,
} from "@/domain/repositories/ITaskRepository";
import { generateId } from "@faninitiative/shared";
import { MySQLConnection } from "./MySQLConnection";


/**
 * MySQL Implementation des Task Repository
 */
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

    // Zuweisungen speichern
    if (task.zugewiesenAn.length > 0) {
      await this.assignMembers(id, task.zugewiesenAn, task.erstelltVon);
    }

    // Materialien speichern
    if (task.materialien.length > 0) {
      await this.saveMaterialien(id, task.materialien);
    }

    // Abhängigkeiten speichern
    if (task.abhaengigVon?.length) {
      await this.saveDependencies(id, task.abhaengigVon);
    }

    return {
      ...task,
      id,
      erstelltAm: now,
      aktualisiertAm: now,
    };
  }

  async update(id: string, updates: Partial<Task>): Promise<Task> {
    const updateFields: string[] = [];
    const values: any[] = [];

    // Mapping der Update-Felder
    const fieldMapping: Record<string, string> = {
      titel: "titel",
      beschreibung: "beschreibung",
      verantwortlichId: "verantwortlich_id",
      status: "status",
      prioritaet: "prioritaet",
      frist: "frist",
      kategorie: "kategorie",
      erledigtAm: "erledigt_am",
      erledigtVon: "erledigt_von",
    };

    Object.entries(updates).forEach(([key, value]) => {
      if (fieldMapping[key]) {
        updateFields.push(`${fieldMapping[key]} = ?`);
        values.push(value);
      }
    });

    if (updateFields.length > 0) {
      updateFields.push("aktualisiert_am = NOW()");
      values.push(id);

      await this.db.query(
        `UPDATE tasks SET ${updateFields.join(", ")} WHERE id = ?`,
        values,
      );
    }

    const updated = await this.findById(id);
    if (!updated) throw new Error("Task not found after update");

    return updated;
  }

  async findById(id: string): Promise<Task | null> {
    const [row] = await this.db.query<any[]>(
      `SELECT t.*
       FROM tasks t
       WHERE t.id = ? AND t.geloescht = 0`,
      [id],
    );

    if (!row) return null;

    // Lade zugehörige Daten
    const [zugewieseneAn, materialien, abhaengigVon] = await Promise.all([
      this.getAssignedMembers(id),
      this.getMaterialien(id),
      this.getDependencies(id),
    ]);

    return this.mapRowToTask(row, zugewieseneAn, materialien, abhaengigVon);
  }

  async findAll(filters?: TaskFilters): Promise<ReadonlyArray<Task>> {
    let sql = `
      SELECT t.*
      FROM tasks t
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
      sql +=
        " AND EXISTS (SELECT 1 FROM task_assignments ta WHERE ta.task_id = t.id AND ta.mitglied_id = ?)";
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

    if (filters?.istStandardaufgabe !== undefined) {
      sql += " AND t.ist_standardaufgabe = ?";
      params.push(filters.istStandardaufgabe);
    }

    sql += " ORDER BY t.prioritaet DESC, t.frist ASC";

    const rows = await this.db.query<any[]>(sql, params);

    return Promise.all(
      rows.map(async (row) => {
        const [zugewiesenAn, materialien, abhaengigVon] = await Promise.all([
          this.getAssignedMembers(row.id),
          this.getMaterialien(row.id),
          this.getDependencies(row.id),
        ]);

        return this.mapRowToTask(row, zugewiesenAn, materialien, abhaengigVon);
      }),
    );
  }

  async softDelete(id: string): Promise<void> {
    await this.db.query(
      `UPDATE tasks SET geloescht = 1, aktualisiert_am = NOW() WHERE id = ?`,
      [id],
    );
  }

  async assignMembers(
    taskId: string,
    memberIds: ReadonlyArray<string>,
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
      `DELETE FROM task_assignments WHERE task_id = ? AND mitglied_id = ?`,
      [taskId, memberId],
    );
  }

  async getAssignedMembers(taskId: string): Promise<ReadonlyArray<string>> {
    const rows = await this.db.query<any[]>(
      `SELECT mitglied_id FROM task_assignments WHERE task_id = ?`,
      [taskId],
    );
    return rows.map((r) => r.mitglied_id);
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

  async getComments(taskId: string): Promise<ReadonlyArray<TaskComment>> {
    const rows = await this.db.query<any[]>(
      `SELECT * FROM task_comments WHERE task_id = ? ORDER BY erstellt_am DESC`,
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

  async getTasksByEvent(eventId: string): Promise<ReadonlyArray<Task>> {
    return this.findAll({
      contextType: "event",
      contextId: eventId,
    });
  }

  async getTasksByTeam(teamId: string): Promise<ReadonlyArray<Task>> {
    return this.findAll({
      contextType: "team",
      contextId: teamId,
    });
  }

  async getTasksByMember(memberId: string): Promise<ReadonlyArray<Task>> {
    const sql = `
      SELECT DISTINCT t.*
      FROM tasks t
      LEFT JOIN task_assignments ta ON t.id = ta.task_id
      WHERE t.geloescht = 0
      AND (t.verantwortlich_id = ? OR ta.mitglied_id = ? OR t.erstellt_von = ?)
      ORDER BY t.prioritaet DESC, t.frist ASC
    `;

    const rows = await this.db.query<any[]>(sql, [
      memberId,
      memberId,
      memberId,
    ]);

    return Promise.all(
      rows.map(async (row) => {
        const [zugewiesenAn, materialien, abhaengigVon] = await Promise.all([
          this.getAssignedMembers(row.id),
          this.getMaterialien(row.id),
          this.getDependencies(row.id),
        ]);

        return this.mapRowToTask(row, zugewiesenAn, materialien, abhaengigVon);
      }),
    );
  }

  async getDependentTasks(taskId: string): Promise<ReadonlyArray<Task>> {
    const sql = `
      SELECT DISTINCT t.*
      FROM tasks t
      JOIN task_dependencies td ON t.id = td.task_id
      WHERE td.abhaengig_von_id = ? AND t.geloescht = 0
    `;

    const rows = await this.db.query<any[]>(sql, [taskId]);

    return Promise.all(
      rows.map(async (row) => {
        const [zugewiesenAn, materialien, abhaengigVon] = await Promise.all([
          this.getAssignedMembers(row.id),
          this.getMaterialien(row.id),
          this.getDependencies(row.id),
        ]);

        return this.mapRowToTask(row, zugewiesenAn, materialien, abhaengigVon);
      }),
    );
  }

  async getBlockedTasks(taskId: string): Promise<ReadonlyArray<Task>> {
    // Tasks die von dieser Task abhängen und noch nicht erledigt sind
    const dependentTasks = await this.getDependentTasks(taskId);
    const task = await this.findById(taskId);

    if (!task || task.status === "erledigt") {
      return [];
    }

    return dependentTasks.filter((t) => t.status !== "erledigt");
  }

  // Private Helper-Methoden
  private async getMaterialien(
    taskId: string,
  ): Promise<ReadonlyArray<TaskMaterial>> {
    const rows = await this.db.query<any[]>(
      `SELECT * FROM task_materialien WHERE task_id = ? ORDER BY position`,
      [taskId],
    );

    return rows.map((r) => ({
      name: r.name,
      menge: r.menge,
      einheit: r.einheit,
      beschreibung: r.beschreibung,
      besorgt: Boolean(r.besorgt),
      besorgtVon: r.besorgt_von,
      besorgtAm: r.besorgt_am ? new Date(r.besorgt_am) : undefined,
    }));
  }

  private async saveMaterialien(
    taskId: string,
    materialien: ReadonlyArray<TaskMaterial>,
  ): Promise<void> {
    if (materialien.length === 0) return;

    const values = materialien.map((m, index) => [
      taskId,
      m.name,
      m.menge,
      m.einheit,
      m.beschreibung,
      m.besorgt,
      m.besorgtVon,
      m.besorgtAm,
      index,
    ]);

    await this.db.query(
      `INSERT INTO task_materialien
       (task_id, name, menge, einheit, beschreibung, besorgt, besorgt_von, besorgt_am, position)
       VALUES ?`,
      [values],
    );
  }

  private async getDependencies(
    taskId: string,
  ): Promise<ReadonlyArray<string>> {
    const rows = await this.db.query<any[]>(
      `SELECT abhaengig_von_id FROM task_dependencies WHERE task_id = ?`,
      [taskId],
    );
    return rows.map((r) => r.abhaengig_von_id);
  }

  private async saveDependencies(
    taskId: string,
    dependencies: ReadonlyArray<string>,
  ): Promise<void> {
    if (dependencies.length === 0) return;

    const values = dependencies.map((depId) => [taskId, depId]);

    await this.db.query(
      `INSERT INTO task_dependencies (task_id, abhaengig_von_id) VALUES ?`,
      [values],
    );
  }

  private mapRowToTask(
    row: any,
    zugewiesenAn: ReadonlyArray<string>,
    materialien: ReadonlyArray<TaskMaterial>,
    abhaengigVon: ReadonlyArray<string>,
  ): Task {
    return {
      id: row.id,
      titel: row.titel,
      beschreibung: row.beschreibung,
      context: {
        type: row.context_type,
        id: row.context_id,
      },
      verantwortlichId: row.verantwortlich_id,
      zugewiesenAn,
      status: row.status,
      prioritaet: row.prioritaet,
      frist: row.frist ? new Date(row.frist) : undefined,
      materialien,
      abhaengigVon: abhaengigVon.length > 0 ? abhaengigVon : undefined,
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
}
