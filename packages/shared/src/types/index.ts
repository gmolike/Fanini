// packages/shared/src/types/index.ts
/**
 * Shared Types from Backend
 * @module @faninitiative/shared/types
 */

import { MemberDetail, RoleName } from "..";

// Re-export generated types with better organization
export type {
  // ===== Auth & User =====
  User,
  RoleName,

  // ===== Member =====
  MemberListItem,
  MemberDetail,
  Adresse,
  Notfallkontakt,
  Sichtbarkeit,

  // ===== Event =====
  Event,
  EventLocation,
  EventType,
  EventStatus,
  SportBereich,

  // ===== Task =====
  Task,
  TaskContext,
  TaskStatus,
  TaskPriority,
  TaskMaterial,

  // ===== Requests =====
  CreateMemberRequest,
  UpdateMemberRequest,
  CreateEventRequest,
  CreateTaskRequest,

  // ===== Responses =====
  ApiResponse,
  PaginatedResponse,
} from "../generated/api-types";

// Type aliases for better naming
export type Member = MemberDetail;
export type MemberRole = RoleName;
