// apps/api/src/application/use-cases/task/helpers/report.ts
import type { TaskReportDTO } from "@/application/dto/task";
import type { Task } from "@/domain/entities/Task";
import type { IMemberRepository } from "@/domain/repositories/IMemberRepository";

/**
 * Erstellt einen Task Report
 */
export const createTaskReport = async (
  tasks: Task[],
  contextId: string,
  contextType: "event" | "team",
  userId: string,
  memberRepository: IMemberRepository,
): Promise<TaskReportDTO> => {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  // Assignee Statistiken
  const assigneeMap = new Map<
    string,
    {
      taskCount: number;
      completedCount: number;
    }
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
      type: contextType,
      id: contextId,
      name: contextType === "team" ? `Team ${contextId}` : `Event ${contextId}`,
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
