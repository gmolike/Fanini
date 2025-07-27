// apps/api/src/domain/entities/ApprovalRequest.ts
export type ApprovalRequestType =
  | "member_edit"
  | "role_assignment"
  | "event_creation"
  | "finance_expense"
  | "finance_expense_edit"
  | "creator_activation"
  | "protokoll_edit";

export type ApprovalStatus =
  | "pending"
  | "approved"
  | "rejected"
  | "cancelled"
  | "applied";
export type ApprovalPriority = "low" | "medium" | "high" | "critical";

export type ApprovalRequest = {
  readonly id: string;
  readonly requestType: ApprovalRequestType;
  readonly resourceType: string;
  readonly resourceId: string;
  readonly requestedBy: string;
  readonly requestedAt: Date;
  readonly status: ApprovalStatus;
  readonly oldData?: any;
  readonly newData?: any;
  readonly changesSummary?: string;
  readonly priority: ApprovalPriority;
  readonly dueDate?: Date;
};
