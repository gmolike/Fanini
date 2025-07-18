import { createRemoteQuery, createSimpleRemoteQuery } from '@/shared/api';

import { approvalDetailResponseSchema, approvalListResponseSchema } from '../model/schemas';

import type { ApprovalDetailResponse, ApprovalFilter, ApprovalListResponse } from '../model/types';

// Pending Approvals
export const usePendingApprovals = createSimpleRemoteQuery<ApprovalListResponse>({
  queryKey: ['approvals', 'pending'],
  endpoint: '/api/approvals?status=pending',
  schema: approvalListResponseSchema,
  staleTime: 1000 * 60 * 2, // 2 minutes
});

// Approval List with Filters
type ApprovalListParams = {
  filters?: ApprovalFilter;
};

export const useApprovalList = createRemoteQuery<ApprovalListResponse, ApprovalListParams>({
  queryKey: ({ filters }: ApprovalListParams) => ['approvals', 'list', filters],
  endpoint: ({ filters }: ApprovalListParams) => {
    const params = new URLSearchParams();

    if (filters?.status) params.append('status', filters.status);
    if (filters?.type) params.append('type', filters.type);
    if (filters?.entityId) params.append('entityId', filters.entityId);
    if (filters?.requestedBy) params.append('requestedBy', filters.requestedBy);

    const queryString = params.toString();
    return queryString ? `/api/approvals?${queryString}` : '/api/approvals';
  },
  schema: approvalListResponseSchema,
  staleTime: 1000 * 60 * 2,
});

// Approval Detail
type ApprovalDetailParams = {
  approvalId: string;
};

export const useApprovalDetail = createRemoteQuery<ApprovalDetailResponse, ApprovalDetailParams>({
  queryKey: ({ approvalId }: ApprovalDetailParams) => ['approvals', 'detail', approvalId],
  endpoint: ({ approvalId }: ApprovalDetailParams) => `/api/approvals/${approvalId}`,
  schema: approvalDetailResponseSchema,
  staleTime: 1000 * 60 * 5,
  enabled: ({ approvalId }: ApprovalDetailParams) => !!approvalId,
});
