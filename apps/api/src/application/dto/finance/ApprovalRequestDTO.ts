// apps/api/src/application/dto/finance/ApprovalRequestDTO.ts

import type { ApprovalRequestType, ApprovalStatus, ApprovalPriority } from "@/domain/entities/ApprovalRequest";

/**
 * Approval Request DTO
 * @description Genehmigungsanfrage für Ausgaben
 */
export type ApprovalRequestDTO = {
  readonly id: string;
  readonly requestType: ApprovalRequestType;
  readonly status: ApprovalStatus;
  readonly requestedBy: {
    readonly id: string;
    readonly name: string;
  };
  readonly requestedAt: string;
  readonly changesSummary?: string;
  readonly priority: ApprovalPriority;
  readonly dueDate?: string;
  readonly approver?: {
    readonly id: string;
    readonly name: string;
    readonly approvedAt?: string;
  };
  readonly rejectionReason?: string;
};
