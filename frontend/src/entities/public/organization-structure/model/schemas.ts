// frontend/src/entities/public/organization-structure/model/schemas.ts
import { z } from 'zod';

import type { OrganizationNode } from '@/entities/public/organization-structure';

const organizationNodeSchema: z.ZodType<OrganizationNode> = z.lazy(() =>
  z.object({
    id: z.string(),
    name: z.string(),
    type: z.enum(['root', 'partner', 'department', 'team', 'external']),
    description: z.string().optional(),
    memberCount: z.number().optional(),
    lead: z.string().optional(),
    email: z.string().email().optional(),
    children: z.array(organizationNodeSchema).optional(),
    logo: z.string().optional(),
    color: z.string().optional(),
    link: z.string().optional(),
    isExternal: z.boolean().optional(),
  })
);

export const organizationStructureSchema = organizationNodeSchema;
