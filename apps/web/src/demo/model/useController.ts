// src/features/team/model/useController.ts
import { useFieldArray, useForm } from 'react-hook-form';

import { zodResolver } from '@hookform/resolvers/zod';
import { Code, Palette, TestTube, Users } from 'lucide-react';
import { z } from 'zod';

import type {
  ControllerProps,
  ControllerResult,
  TeamDto,
  TeamMemberDto,
  TeamMemberRoleOption,
} from './types';

/**
 * Default team member object
 */
export const DEFAULT_TEAM_MEMBER: TeamMemberDto = {
  name: '',
  email: '',
  role: 'developer',
  startDate: new Date().toISOString(),
  isActive: true,
} as const;

/**
 * Team member role options
 */
export const TEAM_MEMBER_ROLES: TeamMemberRoleOption[] = [
  { value: 'developer', label: 'Developer', icon: Code },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'manager', label: 'Manager', icon: Users },
  { value: 'tester', label: 'Tester', icon: TestTube },
] as const;

/**
 * Team member validation schema
 */
const teamMemberSchema = z.object({
  name: z.string().min(2, 'Name muss mindestens 2 Zeichen haben'),
  email: z.string().email('E-Mail muss eine gültige E-Mail-Adresse sein'),
  role: z.enum(['developer', 'designer', 'manager', 'tester']),
  startDate: z.string(),
  isActive: z.boolean(),
});

/**
 * Main team form validation schema
 */
export const teamFormSchema = z.object({
  teamName: z.string().min(3, 'Team Name muss mindestens 3 Zeichen haben'),
  description: z.string().optional(),
  members: z.array(teamMemberSchema).min(1, 'Team-Mitglieder muss mindestens 1 Einträge haben'),
});

/**
 * Controller hook for team form logic
 *
 * @param props - Controller props
 * @returns Form instance and handlers
 */
export const useController = ({ defaultValues }: ControllerProps): ControllerResult => {
  // Initialize form with validation
  const form = useForm<TeamDto>({
    resolver: zodResolver(teamFormSchema),
    defaultValues: {
      teamName: defaultValues?.teamName ?? '',
      description: defaultValues?.description ?? '',
      members: defaultValues?.members ?? [DEFAULT_TEAM_MEMBER],
    },
    mode: 'onChange',
  });

  // Setup field array for dynamic members
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: 'members',
  });

  /**
   * Add new member to the list
   */
  const handleAddMember = () => {
    append(DEFAULT_TEAM_MEMBER);
  };

  /**
   * Remove member at specific index
   */
  const handleRemoveMember = (index: number) => {
    if (fields.length > 1) {
      remove(index);
    }
  };

  return {
    form,
    fields,
    handleAddMember,
    handleRemoveMember,
    canRemoveMember: fields.length > 1,
  };
};
