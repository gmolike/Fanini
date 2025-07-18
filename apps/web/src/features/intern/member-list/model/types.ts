import type { MemberFilter, MemberRole } from '@/entities/intern/member';

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
