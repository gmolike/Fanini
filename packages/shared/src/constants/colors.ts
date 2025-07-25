// packages/shared/src/constants/colors.ts
import type { RoleName, TaskStatus, TaskPriority } from "../types";

/**
 * Role color configurations
 * @description Color schemes for role badges
 */
export const ROLE_COLORS: Record<
  RoleName,
  { bg: string; text: string; border: string }
> = {
  ADMIN: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
    border: "border-red-300 dark:border-red-700",
  },
  VORSTAND: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
    border: "border-purple-300 dark:border-purple-700",
  },
  BEIRAT: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
    border: "border-blue-300 dark:border-blue-700",
  },
  KASSENPRUFER: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-300",
    border: "border-orange-300 dark:border-orange-700",
  },
  TEAM_EVENT: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
    border: "border-green-300 dark:border-green-700",
  },
  TEAM_TECHNIK: {
    bg: "bg-cyan-100 dark:bg-cyan-900",
    text: "text-cyan-700 dark:text-cyan-300",
    border: "border-cyan-300 dark:border-cyan-700",
  },
  TEAM_MEDIEN: {
    bg: "bg-pink-100 dark:bg-pink-900",
    text: "text-pink-700 dark:text-pink-300",
    border: "border-pink-300 dark:border-pink-700",
  },
  TEAM_VEREIN: {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-700 dark:text-gray-300",
    border: "border-gray-300 dark:border-gray-700",
  },
  MITGLIED: {
    bg: "bg-slate-100 dark:bg-slate-900",
    text: "text-slate-700 dark:text-slate-300",
    border: "border-slate-300 dark:border-slate-700",
  },
} as const;

/**
 * Task status color configurations
 * @description Color schemes for task status badges
 */
export const TASK_STATUS_COLORS: Record<
  TaskStatus,
  { bg: string; text: string }
> = {
  offen: {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-700 dark:text-gray-300",
  },
  in_bearbeitung: {
    bg: "bg-blue-100 dark:bg-blue-900",
    text: "text-blue-700 dark:text-blue-300",
  },
  review: {
    bg: "bg-purple-100 dark:bg-purple-900",
    text: "text-purple-700 dark:text-purple-300",
  },
  erledigt: {
    bg: "bg-green-100 dark:bg-green-900",
    text: "text-green-700 dark:text-green-300",
  },
  blockiert: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
  },
} as const;

/**
 * Task priority color configurations
 * @description Color schemes for task priority badges
 */
export const TASK_PRIORITY_COLORS: Record<
  TaskPriority,
  { bg: string; text: string }
> = {
  niedrig: {
    bg: "bg-gray-100 dark:bg-gray-900",
    text: "text-gray-600 dark:text-gray-400",
  },
  mittel: {
    bg: "bg-yellow-100 dark:bg-yellow-900",
    text: "text-yellow-700 dark:text-yellow-300",
  },
  hoch: {
    bg: "bg-orange-100 dark:bg-orange-900",
    text: "text-orange-700 dark:text-orange-300",
  },
  kritisch: {
    bg: "bg-red-100 dark:bg-red-900",
    text: "text-red-700 dark:text-red-300",
  },
} as const;
