// entities/intern/task/model/types.ts
import type {
  addTaskCommentSchema,
  assignTaskSchema,
  changeTaskStatusSchema,
  createTaskSchema,
  materialSchema,
  taskCommentSchema,
  taskDetailResponseSchema,
  taskDetailSchema,
  taskFilterSchema,
  taskListItemSchema,
  taskListResponseSchema,
  updateTaskSchema,
} from './schemas';
import type { z } from 'zod';

// Schema Types
export type TaskListItem = z.infer<typeof taskListItemSchema>;
export type TaskDetail = z.infer<typeof taskDetailSchema>;
export type TaskListResponse = z.infer<typeof taskListResponseSchema>;
export type TaskDetailResponse = z.infer<typeof taskDetailResponseSchema>;

// Request Types
export type CreateTaskRequest = z.infer<typeof createTaskSchema>;
export type UpdateTaskRequest = z.infer<typeof updateTaskSchema>;
export type ChangeTaskStatusRequest = z.infer<typeof changeTaskStatusSchema>;
export type AssignTaskRequest = z.infer<typeof assignTaskSchema>;
export type AddTaskCommentRequest = z.infer<typeof addTaskCommentSchema>;
export type TaskFilter = z.infer<typeof taskFilterSchema>;

// Sub-Types
export type TaskMaterial = z.infer<typeof materialSchema>;
export type TaskComment = z.infer<typeof taskCommentSchema>;

// Enum Types
export type TaskStatus = 'offen' | 'in_bearbeitung' | 'review' | 'erledigt' | 'blockiert';
export type TaskPriority = 'niedrig' | 'mittel' | 'hoch' | 'kritisch';
export type TaskContextType = 'event' | 'team' | 'general';

// Config Types
export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  offen: {
    label: 'Offen',
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    icon: '○',
  },
  in_bearbeitung: {
    label: 'In Bearbeitung',
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: '◐',
  },
  review: {
    label: 'Review',
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    icon: '◉',
  },
  erledigt: {
    label: 'Erledigt',
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: '✓',
  },
  blockiert: {
    label: 'Blockiert',
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    icon: '✗',
  },
};

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  {
    label: string;
    color: string;
    icon: string;
  }
> = {
  niedrig: {
    label: 'Niedrig',
    color: 'bg-gray-100 text-gray-600',
    icon: '↓',
  },
  mittel: {
    label: 'Mittel',
    color: 'bg-yellow-100 text-yellow-700',
    icon: '→',
  },
  hoch: {
    label: 'Hoch',
    color: 'bg-orange-100 text-orange-700',
    icon: '↑',
  },
  kritisch: {
    label: 'Kritisch',
    color: 'bg-red-100 text-red-700',
    icon: '⚠',
  },
};

export const TASK_CONTEXT_CONFIG: Record<
  TaskContextType,
  {
    label: string;
    labelPlural: string;
    icon: string;
  }
> = {
  event: {
    label: 'Event',
    labelPlural: 'Events',
    icon: '📅',
  },
  team: {
    label: 'Team',
    labelPlural: 'Teams',
    icon: '👥',
  },
  general: {
    label: 'Allgemein',
    labelPlural: 'Allgemeine',
    icon: '📌',
  },
};
