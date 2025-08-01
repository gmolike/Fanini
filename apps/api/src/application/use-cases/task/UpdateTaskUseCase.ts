// features/task/helpers/index.ts

import { Rolle, Mitglied } from "@/domain/entities";
import type { AuditAction } from "@/domain/entities/AuditLog";
import type {
  Task,
  TaskContext,
  TaskMaterial,
  TaskPriority,
  TaskStatus,
} from "@/domain/entities/Task";
import type { TaskAssignment } from "@/domain/entities/TaskAssignment";
import type { TaskComment } from "@/domain/entities/TaskComment";

/**
 * DTO für Task-Details mit allen Relationen
 */
export type TaskDetailDTO = {
  id: string;
  titel: string;
  beschreibung?: string;
  context: TaskContext;
  verantwortlichId?: string;
  zugewiesenAn: string[];
  zugewiesenePersonen?: MitgliedSummaryDTO[];
  status: TaskStatus;
  prioritaet: TaskPriority;
  frist?: string; // KORRIGIERT: Date zu string für API Response
  materialien: TaskMaterial[];
  abhaengigVon?: string[];
  istStandardaufgabe: boolean;
  kategorie?: string;
  erstelltVon: string;
  erstelltAm: string; // KORRIGIERT: Date zu string
  aktualisiertAm: string; // KORRIGIERT: Date zu string
  erledigtAm?: string; // KORRIGIERT: Date zu string
  erledigtVon?: string;
  geloescht: boolean;
  kommentare?: TaskCommentDTO[];
  history?: TaskHistoryEntry[];
  metadata?: TaskMetadata;
  permissions?: TaskPermissions;
};

/**
 * DTO für Task-Listen-Ansicht
 */
export type TaskListDTO = {
  id: string;
  titel: string;
  status: TaskStatus;
  prioritaet: TaskPriority;
  frist?: string; // KORRIGIERT: Date zu string
  verantwortlichName?: string; // KORRIGIERT: Tippfehler
  zugewieseneAnzahl: number;
  istUeberfaellig: boolean;
  context: TaskContext;
};

/**
 * Mitglied Summary für Task-Zuweisungen
 */
export type MitgliedSummaryDTO = {
  id: string;
  vorname: string;
  nachname: string;
  profilbild?: string;
};

/**
 * Task Kommentar DTO
 */
export type TaskCommentDTO = {
  id: string;
  text: string;
  autorId: string;
  autorName: string;
  erstelltAm: string; // KORRIGIERT: Date zu string
  erwaehntePersonen: string[];
};

/**
 * Task History Entry
 */
export type TaskHistoryEntry = {
  timestamp: string; // KORRIGIERT: Date zu string
  aktion: string;
  durchgefuehrtVon: string;
  aenderungen?: Record<string, any>;
};

/**
 * Task Metadata
 */
export type TaskMetadata = {
  erstellerName?: string;
  verantwortlicherName?: string;
  contextName?: string;
  abhaengigeTaskTitel?: string[];
};

/**
 * Task Permissions für aktuellen User
 */
export type TaskPermissions = {
  kannBearbeiten: boolean;
  kannLoeschen: boolean;
  kannStatusAendern: boolean;
  kannZuweisen: boolean;
  kannKommentieren: boolean;
};

/**
 * DTO für Task-Zusammenfassung
 */
export type TaskSummaryDTO = {
  id: string;
  titel: string;
  status: TaskStatus;
  prioritaet: TaskPriority;
  frist?: string; // KORRIGIERT: Date zu string
  context: TaskContext;
};

/**
 * Parameter Types für Use Cases
 */
export type GetTasksByPersonParams = {
  personId: string;
};

export type GetTasksByTeamParams = {
  teamId: string;
};

export type GetTasksByEventParams = {
  eventId: string;
};

export type UpdateTaskParams = {
  taskId: string;
  data: {
    // KORRIGIERT: data wrapper hinzugefügt
    titel?: string;
    beschreibung?: string;
    status?: TaskStatus;
    prioritaet?: TaskPriority;
    frist?: string;
    zugewiesenAn?: string[];
    materialien?: TaskMaterial[];
  };
  userId: string;
  userRole: Rolle[];
  userName: string;
  context?: any;
};

export type CompleteTaskParams = {
  taskId: string;
  kommentar?: string;
  actualHours?: number;
  userId: string;
  userRole: Rolle[];
  userName: string;
};

/**
 * Result Types für Use Cases
 */
export type GetTasksByPersonResult = {
  tasks: TaskDetailDTO[];
  total: number;
};

export type GetTasksByTeamResult = {
  tasks: TaskDetailDTO[];
  total: number;
};

export type GetTasksByEventResult = {
  tasks: TaskDetailDTO[];
  total: number;
};

export type CompleteTaskResult = {
  success: boolean;
  task?: TaskDetailDTO;
  error?: ErrorDTO;
};

export type UpdateTaskResult = {
  success: boolean;
  task?: TaskDetailDTO;
  modifiedFields?: string[];
  error?: ErrorDTO;
};

export type ErrorDTO = {
  code: string;
  message: string;
  details?: any;
};

/**
 * Use Case Type Definitionen
 */
export type GetTasksByPersonUseCase = (
  params: GetTasksByPersonParams,
) => Promise<GetTasksByPersonResult>;
export type GetTasksByTeamUseCase = (
  params: GetTasksByTeamParams,
) => Promise<GetTasksByTeamResult>;
export type GetTasksByEventUseCase = (
  params: GetTasksByEventParams,
) => Promise<GetTasksByEventResult>;

/**
 * Task Repository Interface
 */
export type TaskRepository = {
  getTasksByPerson: (personId: string) => Promise<Task[]>;
  getTasksByTeam: (teamId: string) => Promise<Task[]>;
  getTasksByEvent: (eventId: string) => Promise<Task[]>;
  getTaskById: (taskId: string) => Promise<Task | null>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<Task>;
  getTaskComments: (taskId: string) => Promise<TaskComment[]>;
  getTaskAssignments: (taskId: string) => Promise<TaskAssignment[]>;
  getAllTasks: () => Promise<Task[]>;
  findById: (taskId: string) => Promise<Task | null>;
};

/**
 * Member Repository Interface
 */
export type MemberRepository = {
  findById: (memberId: string) => Promise<Mitglied | null>;
  findByIds: (memberIds: string[]) => Promise<Mitglied[]>;
};

/**
 * Audit Log Service Interface
 */
export type AuditLogService = {
  log: (params: any) => Promise<void>;
};

/**
 * Überprüft, ob ein Benutzer den Task-Status ändern darf
 * @param task - Die zu überprüfende Aufgabe
 * @param userId - Die ID des Benutzers
 * @param userRoles - Die Rollen des Benutzers
 * @returns true wenn der Status geändert werden darf
 */
export const canChangeTaskStatus = (
  task: Task,
  userId: string,
  userRoles: Rolle[],
): boolean => {
  // Admins und Vorstände dürfen immer ändern
  const hasAdminRole = userRoles.some(
    (role) => role.name === "ADMIN" || role.name === "VORSTAND",
  );
  if (hasAdminRole) return true;

  // Beirat darf Status ändern
  const hasBeiratRole = userRoles.some((role) => role.name === "BEIRAT");
  if (hasBeiratRole) return true;

  // Team Event bei Event-Kontext
  if (task.context.type === "event") {
    const hasTeamEventRole = userRoles.some(
      (role) => role.name === "TEAM_EVENT",
    );
    if (hasTeamEventRole) return true;
  }

  // Verantwortlicher darf Status ändern
  if (task.verantwortlichId === userId) return true;

  // Zugewiesene Personen dürfen bestimmte Status ändern
  if (task.zugewiesenAn?.includes(userId)) {
    // Zugewiesene dürfen nur auf in_bearbeitung oder review setzen
    return task.status === "offen" || task.status === "in_bearbeitung";
  }

  return false;
};

/**
 * Mappt eine Task-Entität zu einem DetailDTO
 * KORRIGIERT: Erweiterte Signatur für zusätzliche Daten
 */
export const mapTaskToDetailDTO = (
  task: Task,
  options?: {
    zugewiesenePersonen?: MitgliedSummaryDTO[];
    kommentare?: TaskCommentDTO[];
    history?: TaskHistoryEntry[];
    metadata?: TaskMetadata;
    permissions?: TaskPermissions;
  },
): TaskDetailDTO => {
  return {
    id: task.id,
    titel: task.titel,
    beschreibung: task.beschreibung,
    context: task.context,
    verantwortlichId: task.verantwortlichId,
    zugewiesenAn: task.zugewiesenAn,
    zugewiesenePersonen: options?.zugewiesenePersonen,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    materialien: task.materialien,
    abhaengigVon: task.abhaengigVon,
    istStandardaufgabe: task.istStandardaufgabe,
    kategorie: task.kategorie,
    erstelltVon: task.erstelltVon,
    erstelltAm: task.erstelltAm.toISOString(),
    aktualisiertAm: task.aktualisiertAm.toISOString(),
    erledigtAm: task.erledigtAm?.toISOString(),
    erledigtVon: task.erledigtVon,
    geloescht: task.geloescht,
    kommentare: options?.kommentare,
    history: options?.history,
    metadata: options?.metadata,
    permissions: options?.permissions,
  };
};

/**
 * Mappt eine Task-Entität zu einem ListDTO
 * @param task - Die Task-Entität
 * @param verantwortlichName - Optional: Name des Verantwortlichen
 * @returns Das gemappte TaskListDTO
 */
export const mapTaskToListDTO = (
  task: Task,
  verantwortlichName?: string,
): TaskListDTO => {
  const today = new Date();
  const istUeberfaellig = task.frist
    ? new Date(task.frist) < today && task.status !== "erledigt"
    : false;

  return {
    id: task.id,
    titel: task.titel,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    verantwortlichName, // KORRIGIERT: Tippfehler behoben
    zugewieseneAnzahl: task.zugewiesenAn.length,
    istUeberfaellig,
    context: task.context,
  };
};

/**
 * Mappt mehrere Tasks zu ListDTOs
 * @param tasks - Array von Tasks
 * @param mitgliederMap - Optional: Map von Mitglied-IDs zu Namen
 * @returns Array von TaskListDTOs
 */
export const mapTasksToListDTOs = (
  tasks: Task[],
  mitgliederMap?: Map<string, string>,
): TaskListDTO[] => {
  return tasks.map((task) => {
    const verantwortlichName =
      task.verantwortlichId && mitgliederMap
        ? mitgliederMap.get(task.verantwortlichId)
        : undefined;

    return mapTaskToListDTO(task, verantwortlichName);
  });
};

/**
 * Mappt eine Task-Entität zu einem SummaryDTO
 * @param task - Die Task-Entität
 * @returns Das gemappte TaskSummaryDTO
 */
export const mapTaskToSummaryDTO = (task: Task): TaskSummaryDTO => {
  return {
    id: task.id,
    titel: task.titel,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    context: task.context,
  };
};

/**
 * Identifiziert blockierte Tasks
 * @param tasks - Array von Tasks
 * @param allTasks - Optional: Alle Tasks für Abhängigkeitsprüfung
 * @returns Array von blockierten Task-IDs
 */
export const identifyBlockedTasks = (
  tasks: Task[],
  allTasks?: Task[],
): string[] => {
  const blockedIds: string[] = [];

  tasks.forEach((task) => {
    // Explizit blockierte Tasks
    if (task.status === "blockiert") {
      blockedIds.push(task.id);
      return;
    }

    // Implizit blockierte durch Abhängigkeiten
    if (task.abhaengigVon && task.abhaengigVon.length > 0 && allTasks) {
      const isBlocked = task.abhaengigVon.some((depId) => {
        const depTask = allTasks.find((t) => t.id === depId);
        return depTask && depTask.status !== "erledigt";
      });

      if (isBlocked) {
        blockedIds.push(task.id);
      }
    }
  });

  return blockedIds;
};

/**
 * Filtert überfällige Tasks
 * @param tasks - Array von Tasks
 * @returns Array von überfälligen Tasks
 */
export const getOverdueTasks = (tasks: Task[]): Task[] => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return tasks.filter((task) => {
    if (!task.frist || task.status === "erledigt" || task.geloescht) {
      return false;
    }
    const fristDate = new Date(task.frist);
    fristDate.setHours(0, 0, 0, 0);
    return fristDate < today;
  });
};

/**
 * Factory für GetTasksByPerson UseCase
 * @param repository - Task Repository
 * @returns UseCase Funktion
 */
export const createGetTasksByPersonUseCase = (
  repository: TaskRepository,
): GetTasksByPersonUseCase => {
  return async (params: GetTasksByPersonParams) => {
    const tasks = await repository.getTasksByPerson(params.personId);
    const activeTasks = tasks.filter((t) => !t.geloescht);
    return {
      tasks: activeTasks.map((task) => mapTaskToDetailDTO(task)),
      total: activeTasks.length,
    };
  };
};

/**
 * Factory für GetTasksByTeam UseCase
 * @param repository - Task Repository
 * @returns UseCase Funktion
 */
export const createGetTasksByTeamUseCase = (
  repository: TaskRepository,
): GetTasksByTeamUseCase => {
  return async (params: GetTasksByTeamParams) => {
    const tasks = await repository.getTasksByTeam(params.teamId);
    const activeTasks = tasks.filter((t) => !t.geloescht);
    return {
      tasks: activeTasks.map((task) => mapTaskToDetailDTO(task)),
      total: activeTasks.length,
    };
  };
};

/**
 * Factory für GetTasksByEvent UseCase
 * @param repository - Task Repository
 * @returns UseCase Funktion
 */
export const createGetTasksByEventUseCase = (
  repository: TaskRepository,
): GetTasksByEventUseCase => {
  return async (params: GetTasksByEventParams) => {
    const tasks = await repository.getTasksByEvent(params.eventId);
    const activeTasks = tasks.filter((t) => !t.geloescht);
    return {
      tasks: activeTasks.map((task) => mapTaskToDetailDTO(task)),
      total: activeTasks.length,
    };
  };
};

/**
 * Sortiert Tasks nach Priorität und Frist
 * @param tasks - Array von Tasks
 * @returns Sortiertes Array
 */
export const sortTasksByPriority = (
  tasks: TaskDetailDTO[],
): TaskDetailDTO[] => {
  const priorityOrder: Record<TaskPriority, number> = {
    kritisch: 0,
    hoch: 1,
    mittel: 2,
    niedrig: 3,
  };

  return [...tasks].sort((a, b) => {
    // Erst nach Priorität
    const priorityDiff =
      priorityOrder[a.prioritaet] - priorityOrder[b.prioritaet];
    if (priorityDiff !== 0) return priorityDiff;

    // Dann nach Frist (frühere zuerst)
    if (a.frist && b.frist) {
      return new Date(a.frist).getTime() - new Date(b.frist).getTime();
    }
    if (a.frist) return -1;
    if (b.frist) return 1;

    // Zuletzt nach Erstellungsdatum
    return new Date(a.erstelltAm).getTime() - new Date(b.erstelltAm).getTime();
  });
};

/**
 * Gruppiert Tasks nach Status
 * @param tasks - Array von Tasks
 * @returns Gruppierte Tasks
 */
export const groupTasksByStatus = (
  tasks: TaskDetailDTO[],
): Record<TaskStatus, TaskDetailDTO[]> => {
  const groups: Partial<Record<TaskStatus, TaskDetailDTO[]>> = {};

  tasks.forEach((task) => {
    if (!groups[task.status]) {
      groups[task.status] = [];
    }
    groups[task.status]!.push(task);
  });

  return groups as Record<TaskStatus, TaskDetailDTO[]>;
};

/**
 * Berechnet Task-Statistiken
 * @param tasks - Array von Tasks
 * @returns Statistik-Objekt
 */
export const calculateTaskStats = (tasks: TaskDetailDTO[]) => {
  const total = tasks.length;
  const byStatus = groupTasksByStatus(tasks);

  return {
    total,
    offen: byStatus["offen"]?.length || 0,
    inBearbeitung: byStatus["in_bearbeitung"]?.length || 0,
    review: byStatus["review"]?.length || 0,
    erledigt: byStatus["erledigt"]?.length || 0,
    blockiert: byStatus["blockiert"]?.length || 0,
    überfällig: getOverdueTasks(tasks as any).length,
  };
};

/**
 * Filtert Tasks nach Context-Typ
 * @param tasks - Array von Tasks
 * @param contextType - Der Context-Typ
 * @returns Gefilterte Tasks
 */
export const filterTasksByContextType = (
  tasks: TaskDetailDTO[],
  contextType: "event" | "team" | "general",
): TaskDetailDTO[] => {
  return tasks.filter((task) => task.context.type === contextType);
};

/**
 * Prüft ob Task Materialien benötigt
 * @param task - Task
 * @returns true wenn unbeschaffte Materialien vorhanden
 */
export const taskNeedsMaterials = (task: Task): boolean => {
  return task.materialien.some((material) => !material.besorgt);
};

/**
 * Erstellt Audit-Log-Eintrag für Task-Änderung
 * @param task - Task
 * @param action - Durchgeführte Aktion
 * @param userId - Benutzer-ID
 * @param changes - Änderungen
 * @returns Audit-Log-Parameter
 */
export const createTaskAuditParams = (
  task: Task,
  action: AuditAction,
  userId: string,
  changes?: Array<{ field: string; oldValue: any; newValue: any }>,
) => {
  return {
    userId,
    action,
    entityType: "task" as const,
    entityId: task.id,
    entityName: task.titel,
    changes,
    metadata: {
      context: task.context,
      prioritaet: task.prioritaet,
    },
  };
};
