// apps/api/src/application/dto/task/TaskSummaryDTO.ts
import type { TaskStatus } from "@/domain/entities/Task";

/**
 * Task Summary DTO
 * @description Zusammenfassung von Task-Statistiken
 */
export type TaskSummaryDTO = {
  readonly total: number;
  readonly byStatus: Record<TaskStatus, number>;
  readonly overdue: number;
  readonly dueSoon: number;
  readonly blocked: number;
};
