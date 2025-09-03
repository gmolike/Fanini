// apps/api/src/application/use-cases/task/mappers/TaskMapper.ts
import type { Task } from "@/domain/entities/Task";
import type {
  TaskListItemDTO,
  TaskDetailDTO,
  UserReferenceDTO,
} from "@/application/dto/task";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { TaskPermissionService } from "@/application/services/TaskPermissionService";

/**
 * Mapper Context für Dependencies
 */
export type MapperContext = {
  readonly userId: string;
  readonly userRole: string;
  readonly memberRepository: IMemberRepository;
  readonly taskRepository: ITaskRepository;
  readonly permissionService?: TaskPermissionService;
};

/**
 * Mappt mehrere Tasks zu List Items
 */
export const mapTasksToListItems = async (
  tasks: ReadonlyArray<Task>,
  context: MapperContext,
): Promise<ReadonlyArray<TaskListItemDTO>> => {
  return Promise.all(tasks.map((task) => mapTaskToListItem(task, context)));
};

/**
 * Mappt eine einzelne Task zu einem List Item
 */
export const mapTaskToListItem = async (
  task: Task,
  context: MapperContext,
): Promise<TaskListItemDTO> => {
  const {
    userId,
    userRole,
    memberRepository,
    taskRepository,
    permissionService,
  } = context;

  // Lade Verantwortlichen
  const verantwortlicher = task.verantwortlichId
    ? await memberRepository.findById(task.verantwortlichId)
    : null;

  // Prüfe ob Task blockiert ist
  const istBlockiert = await isTaskBlocked(task, taskRepository);

  // Berechne Completion
  const completionPercentage = calculateTaskCompletion(task);

  // Permissions
  const permissions = permissionService
    ? {
        canEdit: permissionService.canEditTask(task, userId, userRole),
        canDelete: permissionService.canDeleteTask(task, userId, userRole),
        canChangeStatus: permissionService.canChangeStatus(
          task,
          userId,
          userRole,
          task.status,
        ),
        canAssign: permissionService.canAssignTask(task, userId, userRole),
        canComment: true,
        canViewDetails: true,
      }
    : {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canAssign: false,
        canComment: true,
        canViewDetails: true,
      };

  const now = new Date();
  const istUeberfaellig = task.frist
    ? task.frist < now && task.status !== "erledigt"
    : false;

  return {
    id: task.id,
    titel: task.titel,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    context: {
      type: task.context.type,
      id: task.context.id || undefined,
      name: await getContextName(task.context, context),
    },
    verantwortlicher: verantwortlicher
      ? {
          id: verantwortlicher.id,
          name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
          email: verantwortlicher.email,
          avatarUrl: verantwortlicher.profilbild,
        }
      : undefined,
    zugewieseneAnzahl: task.zugewiesenAn.length,
    istUeberfaellig,
    istBlockiert,
    completionPercentage,
    permissions,
  };
};

/**
 * Mappt Task zu Detail DTO
 */
export const mapTaskToDetailDTO = async (
  task: Task,
  context: MapperContext,
): Promise<TaskDetailDTO> => {
  const {
    userId,
    userRole,
    memberRepository,
    taskRepository,
    permissionService,
  } = context;

  // Lade alle zugehörigen Daten parallel
  const [
    verantwortlicher,
    zugewiesenePersonen,
    kommentare,
    abhaengigeTasksData,
  ] = await Promise.all([
    task.verantwortlichId
      ? memberRepository.findById(task.verantwortlichId)
      : null,
    loadAssignedMembers(task.zugewiesenAn, memberRepository),
    taskRepository.getComments(task.id),
    loadDependentTasks(task.abhaengigVon, taskRepository),
  ]);

  // Map Comments
  const kommentareDTO = await Promise.all(
    kommentare.map(async (comment) => {
      const autor = await memberRepository.findById(comment.autorId);
      const erwaehntePersonen = await loadMentionedPersons(
        comment.erwaehntePersonen,
        memberRepository,
      );

      return {
        id: comment.id,
        text: comment.text,
        autor: autor
          ? {
              id: autor.id,
              name: `${autor.vorname} ${autor.nachname}`,
              email: autor.email,
              avatarUrl: autor.profilbild,
            }
          : {
              id: comment.autorId,
              name: "Unbekannt",
            },
        erstelltAm: comment.erstelltAm.toISOString(),
        erwaehntePersonen,
      };
    }),
  );

  // Permissions
  const permissions = permissionService
    ? {
        canEdit: permissionService.canEditTask(task, userId, userRole),
        canDelete: permissionService.canDeleteTask(task, userId, userRole),
        canChangeStatus: permissionService.canChangeStatus(
          task,
          userId,
          userRole,
          task.status,
        ),
        canAssign: permissionService.canAssignTask(task, userId, userRole),
        canComment: true,
        canViewDetails: true,
      }
    : {
        canEdit: false,
        canDelete: false,
        canChangeStatus: false,
        canAssign: false,
        canComment: true,
        canViewDetails: true,
      };

  return {
    id: task.id,
    titel: task.titel,
    beschreibung: task.beschreibung,
    status: task.status,
    prioritaet: task.prioritaet,
    frist: task.frist?.toISOString(),
    context: {
      type: task.context.type,
      id: task.context.id || undefined,
      name: await getContextName(task.context, context),
    },
    verantwortlicher: verantwortlicher
      ? {
          id: verantwortlicher.id,
          name: `${verantwortlicher.vorname} ${verantwortlicher.nachname}`,
          email: verantwortlicher.email,
          avatarUrl: verantwortlicher.profilbild,
        }
      : undefined,
    zugewiesenePersonen,
    materialien: task.materialien,
    abhaengigVon: abhaengigeTasksData,
    istStandardaufgabe: task.istStandardaufgabe,
    kategorie: task.kategorie,
    kommentare: kommentareDTO,
    history: [], // TODO: Implement history
    metadata: {
      erstelltAm: task.erstelltAm.toISOString(),
      aktualisiertAm: task.aktualisiertAm.toISOString(),
      erledigtAm: task.erledigtAm?.toISOString(),
      erledigtVon: task.erledigtVon
        ? {
            id: task.erledigtVon,
            name: "TODO", // TODO: Load user
          }
        : undefined,
    },
    permissions,
  };
};

// Helper Functions

const isTaskBlocked = async (
  task: Task,
  taskRepository: ITaskRepository,
): Promise<boolean> => {
  if (task.status === "blockiert") return true;

  if (!task.abhaengigVon || task.abhaengigVon.length === 0) return false;

  const blockedTasks = await taskRepository.getBlockedTasks(task.id);
  return blockedTasks.length > 0;
};

const calculateTaskCompletion = (task: Task): number => {
  const statusToCompletion: Record<typeof task.status, number> = {
    offen: 0,
    in_bearbeitung: 50,
    review: 90,
    erledigt: 100,
    blockiert: 0,
  };

  return statusToCompletion[task.status];
};

const getContextName = async (
  context: Task["context"],
  mapperContext: MapperContext,
): Promise<string | undefined> => {
  if (context.type === "general") return "Allgemein";

  if (context.type === "event" && context.id) {
    // TODO: Load event name
    return `Event ${context.id}`;
  }

  if (context.type === "team" && context.id) {
    return getTeamName(context.id);
  }

  return undefined;
};

const getTeamName = (teamId: string): string => {
  const teamNames: Record<string, string> = {
    TEAM_EVENT: "Team Event",
    TEAM_MEDIEN: "Team Medien",
    TEAM_TECHNIK: "Team Technik",
    TEAM_VEREIN: "Team Verein",
    TEAM_VORSTAND: "Team Vorstand",
    TEAM_BEIRAT: "Team Beirat",
  };
  return teamNames[teamId] || teamId;
};

const loadAssignedMembers = async (
  memberIds: ReadonlyArray<string>,
  memberRepository: IMemberRepository,
): Promise<ReadonlyArray<UserReferenceDTO>> => {
  const members = await Promise.all(
    memberIds.map((id) => memberRepository.findById(id)),
  );

  return members.filter(Boolean).map((member) => ({
    id: member!.id,
    name: `${member!.vorname} ${member!.nachname}`,
    email: member!.email,
    avatarUrl: member!.profilbild,
  }));
};

const loadMentionedPersons = async (
  personIds: ReadonlyArray<string>,
  memberRepository: IMemberRepository,
): Promise<ReadonlyArray<UserReferenceDTO>> => {
  return loadAssignedMembers(personIds, memberRepository);
};

const loadDependentTasks = async (
  taskIds: ReadonlyArray<string> | undefined,
  taskRepository: ITaskRepository,
): Promise<ReadonlyArray<any> | undefined> => {
  if (!taskIds || taskIds.length === 0) return undefined;

  const tasks = await Promise.all(
    taskIds.map((id) => taskRepository.findById(id)),
  );

  return tasks.filter(Boolean).map((task) => ({
    taskId: task!.id,
    titel: task!.titel,
    status: task!.status,
    istErledigt: task!.status === "erledigt",
    blockiertAktuell: task!.status !== "erledigt",
  }));
};

/**
 * Holt die Anzahl der Team-Mitglieder
 */
export const getTeamMemberCount = async (
  teamId: string,
  memberRepository: IMemberRepository,
): Promise<number> => {
  // TODO: Implement actual team member count logic
  // For now, return a placeholder
  const teamSizes: Record<string, number> = {
    TEAM_EVENT: 5,
    TEAM_MEDIEN: 3,
    TEAM_TECHNIK: 4,
    TEAM_VEREIN: 6,
    TEAM_VORSTAND: 7,
    TEAM_BEIRAT: 5,
  };

  return teamSizes[teamId] || 0;
};
