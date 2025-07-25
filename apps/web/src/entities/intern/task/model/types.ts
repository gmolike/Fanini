// apps/web/src/entities/intern/task/model/types.ts
import type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskContext,
  TaskMaterial,
  CreateTaskRequest,
} from '@faninitiative/shared';

import { TASK_STATUS_LABELS, TASK_PRIORITY_LABELS } from '@faninitiative/shared';

// Re-export shared types
export type {
  Task,
  TaskStatus,
  TaskPriority,
  TaskContext,
  TaskMaterial,
  CreateTaskRequest,
} from '@faninitiative/shared';

// Frontend-specific types
export type TaskListItem = Task & {
  verantwortlicher?: {
    id: string;
    name: string;
    rolle?: string;
  };
  zugewiesenePersonen?: Array<{
    id: string;
    name: string;
    profilbild?: string;
  }>;
};

export type TaskDetail = TaskListItem & {
  kommentare: TaskComment[];
  history: TaskHistoryEntry[];
};

export type TaskComment = {
  id: string;
  text: string;
  autorId: string;
  autor?: {
    name: string;
    rolle?: string;
    profilbild?: string;
  };
  erstelltAm: string;
  erwaehntePersonen?: string[];
};

export type TaskHistoryEntry = {
  datum: string;
  aktion: string;
  benutzer: string;
  details?: string;
};

// UI Config using shared labels
export const TASK_STATUS_CONFIG: Record<
  TaskStatus,
  { label: string; color: string; icon: string }
> = {
  offen: {
    label: TASK_STATUS_LABELS.offen,
    color: 'bg-gray-100 text-gray-700 dark:bg-gray-900 dark:text-gray-300',
    icon: '○',
  },
  in_bearbeitung: {
    label: TASK_STATUS_LABELS.in_bearbeitung,
    color: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300',
    icon: '◐',
  },
  review: {
    label: TASK_STATUS_LABELS.review,
    color: 'bg-purple-100 text-purple-700 dark:bg-purple-900 dark:text-purple-300',
    icon: '◉',
  },
  erledigt: {
    label: TASK_STATUS_LABELS.erledigt,
    color: 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300',
    icon: '✓',
  },
  blockiert: {
    label: TASK_STATUS_LABELS.blockiert,
    color: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300',
    icon: '✗',
  },
};

export const TASK_PRIORITY_CONFIG: Record<
  TaskPriority,
  { label: string; color: string; icon: string }
> = {
  niedrig: {
    label: TASK_PRIORITY_LABELS.niedrig,
    color: 'bg-gray-100 text-gray-600',
    icon: '↓',
  },
  mittel: {
    label: TASK_PRIORITY_LABELS.mittel,
    color: 'bg-yellow-100 text-yellow-700',
    icon: '→',
  },
  hoch: {
    label: TASK_PRIORITY_LABELS.hoch,
    color: 'bg-orange-100 text-orange-700',
    icon: '↑',
  },
  kritisch: {
    label: TASK_PRIORITY_LABELS.kritisch,
    color: 'bg-red-100 text-red-700',
    icon: '⚠',
  },
};
