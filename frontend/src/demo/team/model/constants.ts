// src/entities/team/model/constants.ts
import { Code, Palette, Users, TestTube } from 'lucide-react';
import type { ComboboxOption } from '@/shared/ui/form';
import type { TeamMemberRole } from './types';

export const TEAM_MEMBER_ROLES: ComboboxOption<TeamMemberRole>[] = [
  { value: 'developer', label: 'Developer', icon: Code },
  { value: 'designer', label: 'Designer', icon: Palette },
  { value: 'manager', label: 'Manager', icon: Users },
  { value: 'tester', label: 'Tester', icon: TestTube },
] as const;

export const DEFAULT_TEAM_MEMBER: TeamMemberDto = {
  name: '',
  email: '',
  role: 'developer',
  startDate: new Date().toISOString(),
  isActive: true,
} as const;
