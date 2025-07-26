// apps/web/src/entities/intern/member/model/types.ts
// Importiere nur was du brauchst, nicht alles re-exportieren
import type {
  MemberDetail,
  MemberListItem as SharedMemberListItem,
  RoleName,
  CreateMemberRequest as SharedCreateMemberRequest,
  UpdateMemberRequest as SharedUpdateMemberRequest,
} from '@faninitiative/shared';

// Re-export mit besseren Namen
export type Member = MemberDetail;
export type MemberListItem = SharedMemberListItem;
export type MemberRole = RoleName;
export type CreateMemberRequest = SharedCreateMemberRequest;
export type UpdateMemberRequest = SharedUpdateMemberRequest;

// Frontend-specific extensions
export type MemberFormData = CreateMemberRequest & {
  sendCredentials?: boolean;
  passwordOption?: 'none' | 'generate' | 'manual';
};

export type MemberListFilters = {
  active?: boolean;
  search?: string;
  roleId?: MemberRole;
  page?: number;
  limit?: number;
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
