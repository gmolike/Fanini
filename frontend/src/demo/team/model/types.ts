// src/entities/team/model/types.ts
export type TeamMemberRole = 'developer' | 'designer' | 'manager' | 'tester';

export type TeamMemberDto = {
  name: string;
  email: string;
  role: TeamMemberRole;
  startDate: string;
  isActive: boolean;
};

export type TeamFormDto = {
  teamName: string;
  description: string;
  members: TeamMemberDto[];
};
