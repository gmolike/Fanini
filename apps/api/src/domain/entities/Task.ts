// apps/api/src/domain/entities/Task.ts
import { generateId } from "@faninitiative/shared";

/**
 * Task Context definiert den Kontext einer Aufgabe
 * @property type - Der Typ des Kontexts (event, team, general)
 * @property id - Die ID des zugehörigen Kontexts (null bei general)
 */
export type TaskContext = {
  readonly type: "event" | "team" | "general";
  readonly id: string | null;
};

/**
 * Task Priority Level
 */
export type TaskPriority = "niedrig" | "mittel" | "hoch" | "kritisch";

/**
 * Task Status im Workflow
 */
export type TaskStatus =
  | "offen"
  | "in_bearbeitung"
  | "review"
  | "erledigt"
  | "blockiert";

/**
 * Material das für eine Task benötigt wird
 */
export type TaskMaterial = {
  readonly name: string;
  readonly menge: number;
  readonly einheit: string;
  readonly beschreibung?: string;
  readonly besorgt: boolean;
  readonly besorgtVon?: string;
  readonly besorgtAm?: Date;
};

/**
 * Task Entity - Zentrale Aufgaben-Entität
 */
export type Task = {
  readonly id: string;
  readonly titel: string;
  readonly beschreibung?: string;
  readonly context: TaskContext;
  readonly verantwortlichId?: string;
  readonly zugewiesenAn: ReadonlyArray<string>;
  readonly status: TaskStatus;
  readonly prioritaet: TaskPriority;
  readonly frist?: Date;
  readonly materialien: ReadonlyArray<TaskMaterial>;
  readonly abhaengigVon?: ReadonlyArray<string>;
  readonly istStandardaufgabe: boolean;
  readonly kategorie?: string;
  readonly erstelltVon: string;
  readonly erstelltAm: Date;
  readonly aktualisiertAm: Date;
  readonly erledigtAm?: Date;
  readonly erledigtVon?: string;
  readonly geloescht: boolean;
};

/**
 * Factory-Funktion zum Erstellen einer neuen Task
 */
export const createTask = (params: {
  readonly titel: string;
  readonly beschreibung?: string;
  readonly context: TaskContext;
  readonly verantwortlichId?: string;
  readonly prioritaet?: TaskPriority;
  readonly frist?: Date;
  readonly erstelltVon: string;
}): Task => {
  const now = new Date();
  return {
    id: generateId(),
    titel: params.titel,
    beschreibung: params.beschreibung,
    context: params.context,
    verantwortlichId: params.verantwortlichId,
    zugewiesenAn: params.verantwortlichId ? [params.verantwortlichId] : [],
    status: "offen",
    prioritaet: params.prioritaet || "mittel",
    frist: params.frist,
    materialien: [],
    abhaengigVon: undefined,
    istStandardaufgabe: false,
    kategorie: undefined,
    erstelltVon: params.erstelltVon,
    erstelltAm: now,
    aktualisiertAm: now,
    erledigtAm: undefined,
    erledigtVon: undefined,
    geloescht: false,
  };
};

/**
 * Business Rule: Kann Task von User bearbeitet werden?
 */
export const canTaskBeEditedBy = (task: Task, userId: string): boolean => {
  return (
    task.verantwortlichId === userId ||
    task.zugewiesenAn.includes(userId) ||
    task.erstelltVon === userId
  );
};

/**
 * Business Rule: Ist Task blockiert durch Abhängigkeiten?
 */
export const isTaskBlocked = (
  task: Task,
  allTasks: ReadonlyArray<Task>,
): boolean => {
  if (!task.abhaengigVon || task.abhaengigVon.length === 0) return false;

  const dependencies = allTasks.filter((t) =>
    task.abhaengigVon!.includes(t.id),
  );
  return dependencies.some((dep) => dep.status !== "erledigt");
};

/**
 * Status-Übergänge im Workflow
 */
export const TASK_STATUS_TRANSITIONS: Record<
  TaskStatus,
  ReadonlyArray<TaskStatus>
> = {
  offen: ["in_bearbeitung", "blockiert"],
  in_bearbeitung: ["review", "blockiert", "offen"],
  review: ["erledigt", "in_bearbeitung", "blockiert"],
  erledigt: [],
  blockiert: ["offen", "in_bearbeitung"],
} as const;

/**
 * Prüft ob Status-Übergang erlaubt ist
 */
export const isStatusTransitionAllowed = (
  from: TaskStatus,
  to: TaskStatus,
): boolean => {
  return TASK_STATUS_TRANSITIONS[from].includes(to);
};
