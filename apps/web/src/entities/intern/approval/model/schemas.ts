import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';

import { memberRoleEnum } from '../../member/model/schemas';

// Type-safe enum tuples
export const approvalStatusEnum = ['pending', 'approved', 'rejected'] as const;
export const approvalTypeEnum = [
  'member_update',
  'role_assignment',
  'event_creation',
  'expense_submission',
] as const;

// Approval Item Schema
export const approvalItemSchema = z.object({
  id: z.string(),
  type: z.enum(approvalTypeEnum),
  status: z.enum(approvalStatusEnum),
  entityId: z.string(),
  entityType: z.string(),
  requestedBy: z.object({
    id: z.string(),
    name: z.string(),
    rolle: z.enum(memberRoleEnum).optional(),
  }),
  requestedAt: z.string(),
  changes: z.record(z.any()),
  oldValues: z.record(z.any()).optional(),
  reason: z.string().optional(),
  // Approval info
  approvedBy: z
    .object({
      id: z.string(),
      name: z.string(),
    })
    .optional(),
  approvedAt: z.string().optional(),
  rejectionReason: z.string().optional(),
});

// Approval Action Schema
export const approvalActionSchema = z.object({
  action: z.enum(['approve', 'reject']),
  reason: z.string().min(10).optional(),
});

// Filter Schema
export const approvalFilterSchema = z.object({
  status: z.enum(approvalStatusEnum).optional(),
  type: z.enum(approvalTypeEnum).optional(),
  entityId: z.string().optional(),
  requestedBy: z.string().optional(),
});

// Response Schemas
export const approvalListResponseSchema = createResponseSchema(z.array(approvalItemSchema)).extend({
  meta: z.object({
    pending: z.number(),
    total: z.number(),
  }),
});

export const approvalDetailResponseSchema = createResponseSchema(approvalItemSchema);
