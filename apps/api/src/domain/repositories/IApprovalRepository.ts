import { ApprovalRequest } from "../entities/ApprovalRequest";

export interface IApprovalRepository {
  createRequest(params: Omit<ApprovalRequest, 'id' | 'requestedAt' | 'status'>): Promise<ApprovalRequest>;
  findRequestById(id: string): Promise<ApprovalRequest | null>;
  findPendingRequestsForApprover(userId: string): Promise<ApprovalRequest[]>;
  updateRequestStatus(
    requestId: string,
    status: ApprovalRequest['status'],
    approvedBy: string,
    comment?: string
  ): Promise<void>;
  applyApprovedChanges(requestId: string): Promise<void>;
}
