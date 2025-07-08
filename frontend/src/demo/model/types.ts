// src/features/team/model/types.ts
import type { Option } from '@/shared/ui/form';

import type { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

/**
 * Team member role types
 */
export type TeamMemberRole = 'developer' | 'designer' | 'manager' | 'tester';

/**
 * Team member DTO
 */
export type TeamMemberDto = {
  name: string;
  email: string;
  role: TeamMemberRole;
  startDate: string;
  isActive: boolean;
};

/**
 * Main team form DTO
 */
export type TeamFormDto = {
  teamName: string;
  description: string;
  members: TeamMemberDto[];
};

/**
 * Props for the TeamForm component
 */
export type TeamFormProps = {
  /**
   * Initial form values
   */
  defaultValues?: Partial<TeamFormDto>;

  /**
   * Submit handler
   */
  onSubmit: (data: TeamFormDto) => void;

  /**
   * Cancel handler
   */
  onCancel?: () => void;
};

/**
 * Props for the controller hook
 */
export type ControllerProps = {
  defaultValues?: Partial<TeamFormDto>;
};

/**
 * Return value of the controller hook
 */
export type ControllerResult = {
  form: UseFormReturn<TeamFormDto>;
  fields: FieldArrayWithId<TeamFormDto, 'members'>[];
  handleAddMember: () => void;
  handleRemoveMember: (index: number) => void;
  canRemoveMember: boolean;
};

/**
 * Props for member field group
 */
export type MemberFieldGroupProps = {
  control: UseFormReturn<TeamFormDto>['control'];
  index: number;
  onRemove: () => void;
  canRemove: boolean;
};

/**
 * Team member role options for select
 */
export type TeamMemberRoleOption = Option<TeamMemberRole>;
