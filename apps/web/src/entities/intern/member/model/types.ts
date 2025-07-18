import type {
  assignRoleSchema,
  createMemberSchema,
  memberDetailSchema,
  memberFilterSchema,
  memberListItemSchema,
  updateMemberSchema,
} from '@/entities/intern/member/model/schemas';

import type z from 'zod';

// Basis Member Types (bereits vorhanden)
export type MemberListItem = z.infer<typeof memberListItemSchema>;
export type MemberDetail = z.infer<typeof memberDetailSchema>;
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

// Request Types (bereits vorhanden)
export type UpdateMemberRequest = z.infer<typeof updateMemberSchema>;
export type AssignRoleRequest = z.infer<typeof assignRoleSchema>;
export type MemberFilter = z.infer<typeof memberFilterSchema>;

export type MemberListFilters = MemberFilter & {
  sortBy?: 'name' | 'mitgliedSeit' | 'letzteAktivitaet';
  sortOrder?: 'asc' | 'desc';
};

export type BulkAction = 'assign-role' | 'deactivate' | 'activate' | 'export';

export type BulkActionPayload = {
  action: BulkAction;
  memberIds: string[];
  data?: {
    roleId?: MemberRole;
    reason?: string;
  };
};

export type CreateMemberFormData = z.infer<typeof createMemberSchema>;

export type MemberType = 'creator' | 'sponsor' | 'partner';

export type PasswordOption = 'none' | 'generate' | 'manual';

export type CreateLocalMemberRequest = {
  vorname: string;
  nachname: string;
  email: string;
  telefon?: string;
  memberType: MemberType;
  passwordOption: PasswordOption;
  password?: string;
  kuenstlername?: string;
  portfolio?: string;
  sendCredentials: boolean;
};

export type CreateLocalMemberResponse = {
  success: boolean;
  data?: {
    memberId: string;
    userId: string;
    temporaryPassword?: string;
  };
  error?: string;
};

export type SetPasswordRequest = {
  memberId: string;
  generateTemporary?: boolean;
  password?: string;
  sendEmail?: boolean;
};

export type SetPasswordResponse = {
  success: boolean;
  data?: {
    temporaryPassword?: string;
  };
  error?: string;
};

// Props Types für UI Components
export type MemberInfoCardProps = {
  member: MemberDetail;
  canViewSensitiveData: boolean;
};

export type MemberContactCardProps = {
  member: MemberDetail;
  canViewSensitiveData: boolean;
};

export type MemberRolesCardProps = {
  member: MemberDetail;
  canManageRoles: boolean;
  userRole: MemberRole;
};

export type MemberActionsCardProps = {
  member: MemberDetail;
  canResetPassword: boolean;
  canToggleStatus: boolean;
  canDelete: boolean;
  needsApproval: boolean;
  onEdit?: () => void;
};
