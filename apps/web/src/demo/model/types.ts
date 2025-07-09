// src/features/team/model/types.ts
// src/demo/model/types.ts
import { z } from 'zod';

import type { Option } from '@/shared/ui/form';

import type { FieldArrayWithId, UseFormReturn } from 'react-hook-form';

/**
 * Team member role types
 */
export type TeamMemberRole = 'developer' | 'designer' | 'manager' | 'tester';

/**
 * Person display information
 */
export type PersonInfo = {
  id: string;
  vorname: string;
  nachname: string;
  gremium: string;
};

/**
 * Base DTOs für Schema-Erstellung
 */
export const teamMemberDTO = z.object({
  name: z.string(),
  email: z.string(),
  role: z.string() as z.ZodType<TeamMemberRole>,
  startDate: z.string(),
  isActive: z.boolean(),
});

export const teamFormDTO = z.object({
  teamName: z.string(),
  description: z.string().optional(),
  verantwortlichId: z.string().optional(), // Added this field
  members: z.array(teamMemberDTO),
});

/**
 * Labels für Fehlermeldungen
 */
export const teamMemberLabels = {
  name: 'Name',
  email: 'E-Mail',
  role: 'Rolle',
  startDate: 'Startdatum',
  isActive: 'Aktiv',
} as const;

export const teamFormLabels = {
  teamName: 'Team Name',
  description: 'Beschreibung',
  verantwortlichId: 'Verantwortliche Person',
  members: 'Team-Mitglieder',
} as const;

/**
 * Inferred Types aus DTOs
 */
export type TeamMemberDto = z.infer<typeof teamMemberDTO>;
export type TeamFormDto = z.infer<typeof teamFormDTO>;

/**
 * Team detail DTO from backend (includes full person info)
 */
export type TeamDetailDto = TeamFormDto & {
  verantwortlichPerson?: PersonInfo;
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
   * Initial person info (for display only)
   */
  defaultPersonInfo?: PersonInfo;

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

/**
 * Team DTO for backend
 */
export type TeamDto = z.infer<typeof teamFormDTO>;

/**
 * Team detail DTO from backend (includes full person info)
 */
