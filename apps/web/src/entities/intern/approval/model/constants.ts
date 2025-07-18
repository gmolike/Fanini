import { createEnumVariantConfig } from '@/shared/ui';

// Enum-Objekte für die Config
const ApprovalStatusEnum = {
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;

const ApprovalTypeEnum = {
  member_update: 'member_update',
  role_assignment: 'role_assignment',
  event_creation: 'event_creation',
  expense_submission: 'expense_submission',
} as const;

// Approval Status Configuration
export const APPROVAL_STATUS_CONFIG = createEnumVariantConfig(ApprovalStatusEnum, {
  pending: {
    label: 'Ausstehend',
    variant: 'warning',
  },
  approved: {
    label: 'Genehmigt',
    variant: 'success',
  },
  rejected: {
    label: 'Abgelehnt',
    variant: 'error',
  },
});

// Approval Type Configuration
export const APPROVAL_TYPE_CONFIG = createEnumVariantConfig(ApprovalTypeEnum, {
  member_update: {
    label: 'Mitgliederänderung',
    variant: 'info',
  },
  role_assignment: {
    label: 'Rollenzuweisung',
    variant: 'purple',
  },
  event_creation: {
    label: 'Event-Erstellung',
    variant: 'success',
  },
  expense_submission: {
    label: 'Ausgabenantrag',
    variant: 'orange',
  },
});
