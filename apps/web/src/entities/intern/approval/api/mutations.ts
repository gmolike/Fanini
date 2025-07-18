import { createRemoteMutation, queryClient } from '@/shared/api';

import type { ApprovalAction } from '../model/types';

// Process Approval
export const useProcessApproval = createRemoteMutation({
  endpoint: (variables: ApprovalAction & { approvalId: string }) => {
    return `/api/approvals/${variables.approvalId}/process`;
  },
  method: 'POST',
  onSuccess: () => {
    console.info('TODO: Show notification - Approval processed successfully');

    void queryClient.invalidateQueries({ queryKey: ['approvals'] });
    void queryClient.invalidateQueries({ queryKey: ['members'] });
  },
});

// Bulk Process Approvals
export const useBulkProcessApprovals = createRemoteMutation<{
  approvalIds: string[];
  action: 'approve' | 'reject';
  reason?: string;
}>({
  endpoint: '/api/approvals/bulk-process',
  method: 'POST',
  onSuccess: () => {
    console.info('TODO: Show notification - Bulk approvals processed');

    void queryClient.invalidateQueries({ queryKey: ['approvals'] });
  },
});
