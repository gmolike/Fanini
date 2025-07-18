import type {
  approvalActionSchema,
  approvalDetailResponseSchema,
  approvalFilterSchema,
  approvalItemSchema,
  approvalListResponseSchema,
} from './schemas';
import type { z } from 'zod';

// Schema Types
export type ApprovalItem = z.infer<typeof approvalItemSchema>;
export type ApprovalListResponse = z.infer<typeof approvalListResponseSchema>;
export type ApprovalDetailResponse = z.infer<typeof approvalDetailResponseSchema>;

// Request Types
export type ApprovalAction = z.infer<typeof approvalActionSchema>;
export type ApprovalFilter = z.infer<typeof approvalFilterSchema>;

// Enum Types
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ApprovalType =
  | 'member_update'
  | 'role_assignment'
  | 'event_creation'
  | 'expense_submission';
