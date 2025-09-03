// apps/api/src/application/use-cases/task/GetTasksByTeamUseCase.ts
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";
import type { TaskListItemDTO, TaskStatsDTO } from "@/application/dto/task";
import { mapTasksToListItems } from "./mappers/TaskMapper";
import { calculateTaskStats } from "./helpers/TaskStatsCalculator";
import { TaskPermissionService } from "@/application/services/TaskPermissionService";
import { TaskStatus } from "@/domain/entities";

/**
 * Get Tasks By Team Use Case
 */
export type GetTasksByTeamUseCase = {
  execute: (params: GetTasksByTeamParams) => Promise<GetTasksByTeamResult>;
};

export type GetTasksByTeamParams = {
  readonly teamId: string;
  readonly userId: string;
  readonly userRole: string;
  readonly filters?: {
    readonly status?: ReadonlyArray<TaskStatus>;
    readonly assigneeId?: string;
    readonly includeCompleted?: boolean;
  };
};

export type GetTasksByTeamResult = {
  readonly success: boolean;
  readonly tasks?: ReadonlyArray<TaskListItemDTO>;
  readonly stats?: TaskStatsDTO;
  readonly teamInfo?: {
    readonly id: string;
    readonly name: string;
    readonly memberCount?: number;
  };
  readonly error?: string;
};

/**
 * Factory für GetTasksByTeamUseCase
 */
export const createGetTasksByTeamUseCase = (
  taskRepository: ITaskRepository,
  memberRepository: IMemberRepository,
  taskPermissionService: TaskPermissionService,
): GetTasksByTeamUseCase => ({
  execute: async ({ teamId, userId, userRole, filters = {} }) => {
    try {
      // 1. Team-Berechtigung prüfen
      const restrictedTeams = ["TEAM_VORSTAND", "TEAM_BEIRAT"];
      if (restrictedTeams.includes(teamId)) {
        const canViewRestrictedTeams = ["VORSTAND", "BEIRAT", "ADMIN"].includes(
          userRole,
        );
        if (!canViewRestrictedTeams) {
          return {
            success: false,
            error: "Keine Berechtigung für dieses Team",
          };
        }
      }

      // 2. Tasks abrufen
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

      // 4. Zu DTOs mappen
      const taskItems = await mapTasksToListItems(filteredTasks, {
        userId,
        userRole,
        memberRepository,
        taskRepository,
      });

      // 5. Statistiken
      const stats = calculateTaskStats(filteredTasks);

      // 6. Team-Info
      const teamInfo = {
        id: teamId,
        name: getTeamName(teamId),
        memberCount: await getTeamMemberCount(teamId, memberRepository),
      };

      return {
        success: true,
        tasks: taskItems,
        stats,
        teamInfo,
      };
    } catch (error) {
      console.error("GetTasksByTeamUseCase error:", error);
      return {
        success: false,
        error: "Fehler beim Abrufen der Team-Tasks",
      };
    }
  },
});

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
