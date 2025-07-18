import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import { userPermissionsSchema } from '../model/schemas';

import type { MemberFilter, UserPermissions } from '../model/types';

// Angepasste Response Types für die Queries
type MemberListQueryResponse = {
  data: {
    id: string;
    vorname: string;
    nachname: string;
    email: string;
    mitgliedsnummer: string;
    istAktiv: boolean;
    mitgliedSeit: string;
    rolle: string[]; // Manuell als required definiert
    profilbild?: string;
    telefon?: string;
    geburtsdatum?: string;
    letzteAktivitaet?: string;
    vollstaendigerName?: string;
  }[];
  meta: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    filtered: boolean;
  };
};

type MemberDetailQueryResponse = {
  data: {
    id: string;
    vorname: string;
    nachname: string;
    email: string;
    mitgliedsnummer: string;
    istAktiv: boolean;
    mitgliedSeit: string;
    rolle: string[]; // Manuell als required definiert
    profilbild?: string;
    telefon?: string;
    geburtsdatum?: string;
    letzteAktivitaet?: string;
    vollstaendigerName?: string;
    adresse?: {
      strasse: string;
      hausnummer: string;
      plz: string;
      stadt: string;
    };
    notfallkontakt?: {
      name: string;
      telefon: string;
    };
    iban?: string;
    hatVertraulichkeitserklaerung: boolean;
    sichtbarkeit?: {
      email: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
      telefon: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
      profil: 'alle' | 'mitglieder' | 'vorstand' | 'niemand';
    };
    createdAt: string;
    updatedAt: string;
  };
  meta?: {
    total: number;
    page: number;
    limit: number;
    pages: number;
    filtered: boolean;
  };
};

// Get User Permissions
export const useUserPermissions = createSimpleRemoteQuery<UserPermissions>({
  queryKey: ['user', 'permissions'],
  endpoint: '/api/users/permissions',
  schema: userPermissionsSchema,
  staleTime: 1000 * 60 * 10,
});

// Member List with Filters
type MemberListParams = {
  filters?: MemberFilter;
};

export const useMemberList = createRemoteQuery<MemberListQueryResponse, MemberListParams>({
  queryKey: ({ filters }: MemberListParams) => ['members', 'list', filters],
  endpoint: ({ filters }: MemberListParams) => {
    const params = new URLSearchParams();

    if (filters?.active !== undefined) params.append('active', filters.active.toString());
    if (filters?.search) params.append('search', filters.search);
    if (filters?.roleId) params.append('roleId', filters.roleId);
    if (filters?.page) params.append('page', filters.page.toString());
    if (filters?.limit) params.append('limit', filters.limit.toString());

    const queryString = params.toString();
    return queryString ? `/api/members?${queryString}` : '/api/members';
  },
  staleTime: 1000 * 60 * 5,
});

// Member Detail
type MemberDetailParams = {
  memberId: string;
};

export const useMemberDetail = createRemoteQuery<MemberDetailQueryResponse, MemberDetailParams>({
  queryKey: ({ memberId }: MemberDetailParams) => ['members', 'detail', memberId],
  endpoint: ({ memberId }: MemberDetailParams) => `/api/members/${memberId}`,
  staleTime: 1000 * 60 * 5,
  enabled: ({ memberId }: MemberDetailParams) => !!memberId,
});

// My Profile (current user)
export const useMyProfile = createSimpleRemoteQuery<MemberDetailQueryResponse>({
  queryKey: ['members', 'my-profile'],
  endpoint: '/api/members/me',
  staleTime: 1000 * 60 * 10,
});

// Members by Role
type MembersByRoleParams = {
  roleId: string;
};

export const useMembersByRole = createRemoteQuery<MemberListQueryResponse, MembersByRoleParams>({
  queryKey: ({ roleId }: MembersByRoleParams) => ['members', 'by-role', roleId],
  endpoint: ({ roleId }: MembersByRoleParams) => `/api/members?roleId=${roleId}`,
  staleTime: 1000 * 60 * 5,
  enabled: ({ roleId }: MembersByRoleParams) => !!roleId,
});
