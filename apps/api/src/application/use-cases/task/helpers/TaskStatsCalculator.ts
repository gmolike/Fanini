// apps/api/src/application/use-cases/task/helpers/TaskStatsCalculator.ts
import type { Task, TaskStatus, TaskPriority } from "@/domain/entities/Task";
import type { TaskStatsDTO } from "@/application/dto/task";

/**
 * Berechnet Task-Statistiken
 */
export const calculateTaskStats = (tasks: ReadonlyArray<Task>): TaskStatsDTO => {
  const now = new Date();
  const inThreeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);

  return {
    total: tasks.length,
    byStatus: calculateStatusDistribution(tasks),
    byPriority: calculatePriorityDistribution(tasks),
    overdue: countOverdueTasks(tasks, now),
    dueSoon: countDueSoonTasks(tasks, now, inThreeDays),
    blocked: countBlockedTasks(tasks)
  };
};

const calculateStatusDistribution = (tasks: ReadonlyArray<Task>): Record<TaskStatus, number> => {
  const statusValues: TaskStatus[] = ['offen', 'in_bearbeitung', 'review', 'erledigt', 'blockiert'];

  return statusValues.reduce((acc, status) => ({
    ...acc,
    [status]: tasks.filter(task => task.status === status).length
  }), {} as Record<TaskStatus, number>);
};

const calculatePriorityDistribution = (tasks: ReadonlyArray<Task>): Record<TaskPriority, number> => {
  const priorityValues: TaskPriority[] = ['niedrig', 'mittel', 'hoch', 'kritisch'];

  return priorityValues.reduce((acc, priority) => ({
    ...acc,
    [priority]: tasks.filter(task => task.prioritaet === priority).length
  }), {} as Record<TaskPriority, number>);
};

const countOverdueTasks = (tasks: ReadonlyArray<Task>, now: Date): number => {
  return tasks.filter(task =>
    task.frist &&
    task.frist < now &&
    task.status !== 'erledigt'
  ).length;
};

const countDueSoonTasks = (tasks: ReadonlyArray<Task>, now: Date, deadline: Date): number => {
  return tasks.filter(task =>
    task.frist &&
    task.frist >= now &&
    task.frist <= deadline &&
    task.status !== 'erledigt'
  ).length;
};

const countBlockedTasks = (tasks: ReadonlyArray<Task>): number => {
  return tasks.filter(task =>
    task.status === 'blockiert' ||
    (task.abhaengigVon && task.abhaengigVon.length > 0)
  ).length;
};
