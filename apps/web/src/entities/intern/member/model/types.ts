import type {
  assignRoleSchema,
  memberDetailResponseSchema,
  memberDetailSchema,
  memberFilterSchema,
  memberListItemSchema,
  memberListResponseSchema,
  updateMemberSchema,
  userPermissionsSchema,
} from './schemas';
import type { z } from 'zod';

// Schema Types
export type MemberListItem = z.infer<typeof memberListItemSchema>;
export type MemberDetail = z.infer<typeof memberDetailSchema>;
export type MemberListResponse = z.infer<typeof memberListResponseSchema>;
export type MemberDetailResponse = z.infer<typeof memberDetailResponseSchema>;
export type UserPermissions = z.infer<typeof userPermissionsSchema>;

// Request Types
export type UpdateMemberRequest = z.infer<typeof updateMemberSchema>;
export type AssignRoleRequest = z.infer<typeof assignRoleSchema>;
export type MemberFilter = z.infer<typeof memberFilterSchema>;

// Enum Types
export type MemberRole =
  | 'ADMIN'
  | 'VORSTAND'
  | 'BEIRAT'
  | 'KASSENPRUFER'
  | 'TEAM_EVENT'
  | 'TEAM_TECHNIK'
  | 'TEAM_MEDIEN'
  | 'TEAM_VEREIN'
  | 'MITGLIED';

export type SensitivityLevel = 'none' | 'low' | 'medium' | 'high' | 'critical';
export type Sichtbarkeit = 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
