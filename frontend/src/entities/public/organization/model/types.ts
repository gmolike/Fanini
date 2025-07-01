/* eslint-disable @typescript-eslint/naming-convention */
// entities/public/organization/model/types.ts
import { type z } from 'zod';

import type {
  boardMemberSchema,
  boardMembersResponseSchema,
  documentSchema,
  documentsResponseSchema,
  organizationNodeSchema,
  organizationStructureResponseSchema,
} from './schemas';

export type BoardMember = z.infer<typeof boardMemberSchema>;
export type OrganizationNode = z.infer<typeof organizationNodeSchema>;
export type Document = z.infer<typeof documentSchema>;

export type BoardMembersResponse = z.infer<typeof boardMembersResponseSchema>;
export type OrganizationStructureResponse = z.infer<typeof organizationStructureResponseSchema>;
export type DocumentsResponse = z.infer<typeof documentsResponseSchema>;

export const ROLE_LABELS: Record<BoardMember['role'], string> = {
  erste_vorsitzende: 'Erste Vorsitzende',
  zweite_vorsitzende: 'Zweite Vorsitzende',
  kassenwartin: 'Kassenwartin',
  schriftfuehrerin: 'Schriftführerin',
  event_managerin: 'Event-Managerin',
  medienbeauftragte: 'Medienbeauftragte',
  technik_koordinatorin: 'Technik-Koordinatorin',
  mitgliederverwalterin: 'Mitgliederverwalterin',
};
