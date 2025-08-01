// apps/api/src/application/use-cases/task/helpers/index.ts
import type { Task, TaskStatus, TaskPriority } from "@/domain/entities/Task";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type {
  TaskListDTO,
  TaskDetailDTO,
  TaskPermissionsDTO,
  UserReferenceDTO,
  TaskHistoryDTO,
  TaskCommentDTO,
  TaskDependencyDTO
} from "@/application/dto/task";

/**
 * Mappt eine Task zu einem Detail DTO
 */
export const mapTaskToDetailDTO = async (
  task: Task,
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository
): Promise<TaskDetailDTO> => {
  // Batch-Load aller benötigten Daten
  const [
    verantwortlicher,
    assignees,
    assignments,
    comments,
    dependencies,
  ] = await Promise.all([
    task.verantwortlichId
      ? memberRepository.findById(task.verantwortlichId)
      : null,
    Promise.all(task.zugewiesenAn.map(id => memberRepository.findById(id))),
    taskRepository.getAssignments(task.id),
    taskRepository.getComments(task.id),
    task.abhaengigVon
      ? Promise.all(task.abhaengigVon.map(id => taskRepository.findById(id)))
      : [],
  ]);

  // Comments mit Autor-Details
  const kommentareWithAuthors: TaskCommentDTO[] = await Promise.all(
    comments.map(async (comment) => {
      const autor = await memberRepository.findById(comment.autorId);
      return {
        id: comment.id,
        text: comment.text,
        autor: {
          id: comment.autorId,
          name: autor ? `${autor.vorname} ${autor.nachname}` : "Unbekannt",
          avatarUrl: autor?.profilbild,
        },
        erstelltAm: comment.erstelltAm.toISOString(),
        erwaehntePersonen: comment.erwaehntePersonen.length > 0
          ? await mapMemberReferences(comment.erwaehntePersonen, memberRepository)
          : undefined,
        istIntern: true,
      };
    })
  );

  // Dependencies mapping
  const abhaengigVon: TaskDependencyDTO[] | undefined = dependencies.length > 0
    ? dependencies
        .filter(Boolean)
        .map(dep => ({
          taskId: dep!.id,
          titel: dep!.titel,
          status: dep!.status,
          istErledigt: dep!.status === "erledigt",
          blockiertAktuell: dep!.status !== "erledigt",
        }))
    : undefined;

  const dto: TaskDetailDTO = {
    id: task.id,
    titel: task.titel,
    beschreibung: task.beschreibung,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    context: {
      type: task.context.type,
      id: task.context.id || undefined,
      name: await resolveContextName(task.context),
    },
    verantwortlicher: verantwortlicher
      ? {
          id: verantwortlicher.id,
          name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
          avatarUrl: verantwortlicher.profilbild,
        }
      : undefined,
    zugewiesenePersonen: assignees
      .filter(Boolean)
      .map(a => ({
        id: a.id,
        name: `${a.vorname} ${a.nachname}`,
        avatarUrl: a.profilbild,
      })),
    materialien: task.materialien,
    abhaengigVon,
    istStandardaufgabe: task.istStandardaufgabe,
    kategorie: task.kategorie,
    kommentare: kommentareWithAuthors,
    history: [], // TODO: Implement history loading
    metadata: {
      erstelltAm: task.erstelltAm.toISOString(),
      aktualisiertAm: task.aktualisiertAm.toISOString(),
      erledigtAm: task.erledigtAm?.toISOString(),
      erledigtVon: task.erledigtVon
        ? await mapUserReference(task.erledigtVon, memberRepository)
        : undefined,
      versionsnummer: 1,
    },
    permissions: getTaskPermissions(task, userId, userRole),
  };

  return dto;
};

/**
 * Mappt Tasks zu List DTOs
 */
export const mapTasksToListDTOs = async (
  tasks: Task[],
  userId: string,
  userRole: string,
  memberRepository: IMemberRepository,
  taskRepository: ITaskRepository,
  blockedTaskIds: Set<string>
): Promise<TaskListDTO[]> => {
  return Promise.all(
    tasks.map(async (task) => {
      const [verantwortlicher, assignees, ersteller] = await Promise.all([
        task.verantwortlichId
          ? memberRepository.findById(task.verantwortlichId)
          : null,
        Promise.all(task.zugewiesenAn.map(id => memberRepository.findById(id))),
        memberRepository.findById(task.erstelltVon),
      ]);

      const dto: TaskListDTO = {
        id: task.id,
        titel: task.titel,
        beschreibung: task.beschreibung,
        status: task.status,
        prioritaet: task.prioritaet,
        frist: task.frist?.toISOString(),
        kategorie: task.kategorie,
        context: {
          type: task.context.type,
          id: task.context.id || undefined,
          name: await resolveContextName(task.context),
        },
        verantwortlicher: verantwortlicher
          ? {
              id: verantwortlicher.id,
              name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
              avatarUrl: verantwortlicher.profilbild,
            }
          : undefined,
        zugewiesenePersonen: assignees
          .filter(Boolean)
          .map(a => ({
            id: a.id,
            name: `${a.vorname} ${a.nachname}`,
            avatarUrl: a.profilbild,
          })),
        istStandardaufgabe: task.istStandardaufgabe,
        materialienStatus: task.materialien.length > 0
          ? {
              total: task.materialien.length,
              besorgt: task.materialien.filter(m => m.besorgt).length,
            }
          : undefined,
        abhaengigVon: task.abhaengigVon,
        istBlockiert: blockedTaskIds.has(task.id),
        erstelltVon: {
          id: ersteller?.id || task.erstelltVon,
          name: ersteller
            ? `${ersteller.vorname} ${ersteller.nachname}`
            : "Unbekannt",
        },
        erstelltAm: task.erstelltAm.toISOString(),
        aktualisiertAm: task.aktualisiertAm.toISOString(),
        completionPercentage: calculateCompletionPercentage(task),
        permissions: getTaskPermissions(task, userId, userRole),
      };

      return dto;
    })
  );
};

/**
 * Identifiziert blockierte Tasks
 */
export const identifyBlockedTasks = async (
  tasks: Task[],
  taskRepository: ITaskRepository
): Promise<Set<string>> => {
  const blockedTaskIds = new Set<string>();

  for (const task of tasks) {
    if (await isTaskBlocked(task, taskRepository)) {
      blockedTaskIds.add(task.id);
    }
  }

  return blockedTaskIds;
};

/**
 * Prüft ob eine Task blockiert ist
 */
export const isTaskBlocked = async (
  task: Task,
  taskRepository: ITaskRepository
): Promise<boolean> => {
  if (!task.abhaengigVon || task.abhaengigVon.length === 0) return false;

  const dependencies = await Promise.all(
    task.abhaengigVon.map(id => taskRepository.findById(id))
  );

  return dependencies.some(dep => dep && dep.status !== "erledigt");
};

/**
 * Berechnet Task Permissions
 */
export const getTaskPermissions = (
  task: Task,
  userId: string,
  userRole: string
): TaskPermissionsDTO => {
  const isAssigned = task.zugewiesenAn.includes(userId);
  const isResponsible = task.verantwortlichId === userId;
  const isCreator = task.erstelltVon === userId;
  const isLeadership = ["VORSTAND", "BEIRAT", "ADMIN"].includes(userRole);

  return {
    canEdit: isAssigned || isResponsible || isCreator || isLeadership,
    canDelete: (isCreator && task.status === "offen") || userRole === "ADMIN",
    canChangeStatus: isAssigned || isResponsible || isLeadership,
    canAssign: isResponsible || isLeadership,
    canComment: true,
    canViewDetails: true,
  };
};

/**
 * Mappt Member References
 */
export const mapMemberReferences = async (
  memberIds: string[],
  memberRepository: IMemberRepository
): Promise<UserReferenceDTO[]> => {
  const members = await Promise.all(
    memberIds.map(id => memberRepository.findById(id))
  );

  return members
    .filter(Boolean)
    .map(m => ({
      id: m!.id,
      name: `${m!.vorname} ${m!.nachname}`,
      avatarUrl: m!.profilbild,
    }));
};

/**
 * Mappt User Reference
 */
export const mapUserReference = async (
  userId: string,
  memberRepository: IMemberRepository
): Promise<UserReferenceDTO> => {
  const member = await memberRepository.findById(userId);
  return {
    id: userId,
    name: member ? `${member.vorname} ${member.nachname}` : "Unbekannt",
    avatarUrl: member?.profilbild,
  };
};

/**
 * Löst Context Namen auf
 */
export const resolveContextName = async (
  context: { type: string; id: string | null }
): Promise<string | undefined> => {
  // TODO: Implement actual resolution
  if (context.type === "event" && context.id) {
    return `Event ${context.id}`;
  }
  if (context.type === "team" && context.id) {
    return `Team ${context.id}`;
  }
  return undefined;
};

/**
 * Berechnet Completion Percentage
 */
export const calculateCompletionPercentage = (task: Task): number => {
  const statusWeights = {
    offen: 0,
    in_bearbeitung: 50,
    review: 90,
    erledigt: 100,
    blockiert: 0,
  };

  return statusWeights[task.status] || 0;
};

/**
 * Filter Tasks
 */
export const applyTaskFilters = async (
  tasks: Task[],
  filters: any,
  taskRepository: ITaskRepository
): Promise<Task[]> => {
  let filteredTasks = [...tasks];

  if (filters.status && filters.status.length > 0) {
    filteredTasks = filteredTasks.filter(t =>
      filters.status!.includes(t.status)
    );
  }

  if (filters.priority && filters.priority.length > 0) {
    filteredTasks = filteredTasks.filter(t =>
      filters.priority!.includes(t.prioritaet)
    );
  }

  if (!filters.includeCompleted) {
    filteredTasks = filteredTasks.filter(t => t.status !== "erledigt");
  }

  if (filters.context) {
    filteredTasks = filteredTasks.filter(t => t.context.type === filters.context);
  }

  if (filters.dueDateFrom || filters.dueDateTo) {
    filteredTasks = filteredTasks.filter(t => {
      if (!t.frist) return false;
      const dueDate = new Date(t.frist);
      if (filters.dueDateFrom && dueDate < new Date(filters.dueDateFrom)) return false;
      if (filters.dueDateTo && dueDate > new Date(filters.dueDateTo)) return false;
      return true;
    });
  }

  return filteredTasks;
};

/**
 * Create Task Summary
 */
export const createTaskSummary = (
  tasks: Task[],
  blockedTaskIds: Set<string>
): any => {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return {
    total: tasks.length,
    byStatus: {
      offen: tasks.filter(t => t.status === "offen").length,
      in_bearbeitung: tasks.filter(t => t.status === "in_bearbeitung").length,
      review: tasks.filter(t => t.status === "review").length,
      erledigt: tasks.filter(t => t.status === "erledigt").length,
      blockiert: tasks.filter(t => t.status === "blockiert").length,
    },
    overdue: tasks.filter(t =>
      t.frist && new Date(t.frist) < now && t.status !== "erledigt"
    ).length,
    dueSoon: tasks.filter(t =>
      t.frist &&
      new Date(t.frist) >= now &&
      new Date(t.frist) <= inThreeDays &&
      t.status !== "erledigt"
    ).length,
    blocked: blockedTaskIds.size,
  };
};

/**
 * Sort Tasks by Priority and Deadline
 */
export const sortTasksByPriorityAndDeadline = (
  tasks: Task[],
  blockedTaskIds: Set<string>
): Task[] => {
  return [...tasks].sort((a, b) => {
    // Blockierte Tasks zuletzt
    const aBlocked = blockedTaskIds.has(a.id);
    const bBlocked = blockedTaskIds.has(b.id);
    if (aBlocked && !bBlocked) return 1;
    if (!aBlocked && bBlocked) return -1;

    // Priorität
    const priorityOrder = { kritisch: 0, hoch: 1, mittel: 2, niedrig: 3 };
    const prioDiff = priorityOrder[a.prioritaet] - priorityOrder[b.prioritaet];
    if (prioDiff !== 0) return prioDiff;

    // Frist
    if (a.frist && b.frist) {
      return a.frist.getTime() - b.frist.getTime();
    }
    return a.frist ? -1 : 1;
  });
};
