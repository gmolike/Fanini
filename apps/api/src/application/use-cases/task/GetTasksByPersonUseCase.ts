// apps/api/src/application/use-cases/task/GetTasksByTeamUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { AuditLogService } from "@/application/services/AuditLogService";
import type { TaskListDTO, TaskReportDTO } from "@/application/dto/task";
import type { Task, TaskStatus } from "@/domain/entities/Task";
import { createPermissionError } from "@/application/dto/common";
import { mapTasksToListDTOs } from "./helpers";
import { identifyBlockedTasks } from "./helpers";

/**
 * Get Tasks By Team Parameters
 */
export type GetTasksByTeamParams = {
  readonly teamId: string;
  readonly userId: string;
  readonly userRole: string;
  readonly filters?: {
    readonly status?: TaskStatus[];
    readonly assigneeId?: string;
    readonly includeCompleted?: boolean;
  };
};

/**
 * Get Tasks By Team Result
 */
export type GetTasksByTeamResult = {
  readonly items: TaskListDTO[];
  readonly report: TaskReportDTO;
};

/**
 * Get Tasks By Team Use Case
 * @description Lädt alle Tasks eines Teams
 */
export type GetTasksByTeamUseCase = {
  execute: (params: GetTasksByTeamParams) => Promise<GetTasksByTeamResult>;
};

export const createGetTasksByTeamUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  auditLogService: AuditLogService,
): GetTasksByTeamUseCase => ({
  execute: async ({ teamId, userId, userRole, filters = {} }) => {
    // 1. Berechtigungsprüfung für spezielle Teams
    const restrictedTeams = ["TEAM_VORSTAND", "TEAM_BEIRAT"];
    if (restrictedTeams.includes(teamId)) {
      const canViewRestrictedTeams = ["VORSTAND", "BEIRAT", "ADMIN"].includes(
        userRole,
      );
      if (!canViewRestrictedTeams) {
        throw createPermissionError(`Tasks von ${teamId} anzeigen`);
      }
    }

    // 2. Tasks laden
    const allTasks = await taskRepository.getTasksByTeam(teamId);

    // 3. Filter anwenden
    let filteredTasks = allTasks;

    if (filters.status && filters.status.length > 0) {
      filteredTasks = filteredTasks.filter((t) =>
        filters.status!.includes(t.status),
      );
    }

    if (filters.assigneeId) {
      filteredTasks = filteredTasks.filter((t) =>
        t.zugewiesenAn.includes(filters.assigneeId!),
      );
    }

    if (!filters.includeCompleted) {
      filteredTasks = filteredTasks.filter((t) => t.status !== "erledigt");
    }

    // 4. Blockierte Tasks identifizieren
    const blockedTaskIds = await identifyBlockedTasks(
      filteredTasks,
      taskRepository,
    );

    // 5. Zu DTOs mappen
    const items = await mapTasksToListDTOs(
      filteredTasks,
      userId,
      userRole,
      memberRepository,
      taskRepository,
      blockedTaskIds,
    );

    // 6. Report erstellen
    const report = await createTaskReport(
      filteredTasks,
      teamId,
      userId,
      memberRepository,
    );

    // 7. Audit Log
    await auditLogService.logAction({
      userId,
      action: "viewed",
      entityType: "task",
      entityId: "team-tasks",
      metadata: {
        context: "team",
        teamId,
        taskCount: items.length,
        filters,
      },
    });

    return { items, report };
  },
});

const createTaskReport = async (
  tasks: Task[],
  teamId: string,
  userId: string,
  memberRepository: IMemberRepository,
): Promise<TaskReportDTO> => {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Assignee Statistiken
  const assigneeMap = new Map<
    string,
    { taskCount: number; completedCount: number }
  >();

  for (const task of tasks) {
    for (const assigneeId of task.zugewiesenAn) {
      const stats = assigneeMap.get(assigneeId) || {
        taskCount: 0,
        completedCount: 0,
      };
      stats.taskCount++;
      if (task.status === "erledigt") {
        stats.completedCount++;
      }
      assigneeMap.set(assigneeId, stats);
    }
  }

  // Assignee Details laden
  const assigneeStats = await Promise.all(
    Array.from(assigneeMap.entries()).map(async ([assigneeId, stats]) => {
      const member = await memberRepository.findById(assigneeId);
      return {
        userId: assigneeId,
        name: member ? `${member.vorname} ${member.nachname}` : "Unbekannt",
        taskCount: stats.taskCount,
        completedCount: stats.completedCount,
      };
    }),
  );

  return {
    context: {
      type: "team",
      id: teamId,
      name: `Team ${teamId}`, // TODO: Team-Namen auflösen
    },
    summary: {
      total: tasks.length,
      open: tasks.filter((t) => t.status === "offen").length,
      inProgress: tasks.filter((t) => t.status === "in_bearbeitung").length,
      review: tasks.filter((t) => t.status === "review").length,
      completed: tasks.filter((t) => t.status === "erledigt").length,
      blocked: tasks.filter((t) => t.status === "blockiert").length,
    },
    byPriority: {
      niedrig: tasks.filter((t) => t.prioritaet === "niedrig").length,
      mittel: tasks.filter((t) => t.prioritaet === "mittel").length,
      hoch: tasks.filter((t) => t.prioritaet === "hoch").length,
      kritisch: tasks.filter((t) => t.prioritaet === "kritisch").length,
    },
    overdueCount: tasks.filter(
      (t) => t.frist && new Date(t.frist) < now && t.status !== "erledigt",
    ).length,
    dueSoonCount: tasks.filter(
      (t) =>
        t.frist &&
        new Date(t.frist) >= now &&
        new Date(t.frist) <= inThreeDays &&
        t.status !== "erledigt",
    ).length,
    assigneeStats,
    categoryBreakdown: tasks.reduce(
      (acc, task) => {
        if (task.kategorie) {
          acc[task.kategorie] = (acc[task.kategorie] || 0) + 1;
        }
        return acc;
      },
      {} as Record<string, number>,
    ),
    metadata: {
      generatedAt: new Date().toISOString(),
      generatedBy: userId,
    },
  };
};
