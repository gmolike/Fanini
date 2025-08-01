// apps/api/src/application/use-cases/task/helpers/utils.ts
import type { Task, TaskStatus } from "@/domain/entities/Task";
import type { ITaskRepository } from "@/domain/repositories/ITaskRepository";

/**
 * Konvertiert TaskContext für DTOs
 */
export const convertTaskContext = (context: {
  type: "event" | "team" | "general";
  id: string | null;
}) => ({
  type: context.type,
  id: context.id || undefined, // Konvertiere null zu undefined
  name: undefined, // Wird später durch Use Case gefüllt wenn nötig
});

/**
 * Identifiziert blockierte Tasks basierend auf Dependencies
 */
export const identifyBlockedTasks = async (
  tasks: Task[],
  taskRepository: ITaskRepository,
): Promise<string[]> => {
  const blockedIds: string[] = [];

  for (const task of tasks) {
    if (task.status === "blockiert") {
      blockedIds.push(task.id);
      continue;
    }

    if (task.abhaengigVon && task.abhaengigVon.length > 0) {
      const dependencies = await Promise.all(
        task.abhaengigVon.map((id) => taskRepository.findById(id)),
      );

      const isBlocked = dependencies.some(
        (dep) => dep && dep.status !== "erledigt",
      );

      if (isBlocked) {
        blockedIds.push(task.id);
      }
    }
  }

  return blockedIds;
};

/**
 * Berechnet den Gesamtfortschritt
 */
export const calculateOverallCompletion = (tasks: Task[]): number => {
  if (tasks.length === 0) return 100;

  const weights: Record<TaskStatus, number> = {
    offen: 0,
    in_bearbeitung: 50,
    review: 90,
    erledigt: 100,
    blockiert: 0,
  };

  const totalProgress = tasks.reduce((sum, task) => {
    return sum + (weights[task.status] || 0);
  }, 0);

  return Math.round(totalProgress / tasks.length);
};
