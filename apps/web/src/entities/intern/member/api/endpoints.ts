// apps/web/src/entities/intern/member/api/endpoints.ts
/**
 * Member API Endpoints
 * @description Alle Member-bezogenen API Endpoints
 */
export const MEMBER_ENDPOINTS = {
  // Listen & Details
  list: '/api/members',
  detail: (id: string) => `/api/members/${id}`,
  me: '/api/members/me',

  // Member Creation
  create: '/api/members',
  local: '/api/members/local',

  // Member Updates
  update: (id: string) => `/api/members/${id}`,
  updateMe: '/api/members/me',

  // Status Management
  status: (id: string) => `/api/members/${id}/status`,

  // Role Management
  roles: (id: string) => `/api/members/${id}/roles`,
  role: (memberId: string, roleId: string) => `/api/members/${memberId}/roles/${roleId}`,

  // Password Management
  password: (id: string) => `/api/members/${id}/password`,

  // Bulk Operations
  bulk: '/api/members/bulk',
} as const;
