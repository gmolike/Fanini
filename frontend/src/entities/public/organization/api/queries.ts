// entities/public/organization/api/queries.ts
import { createSimpleRemoteQuery } from '@/shared/api';

import {
  boardMembersResponseSchema,
  documentsResponseSchema,
  organizationStructureResponseSchema,
} from '../model/schemas';

import type {
  BoardMembersResponse,
  DocumentsResponse,
  OrganizationStructureResponse,
} from '../model/types';

export const useBoardMembers = createSimpleRemoteQuery<BoardMembersResponse>({
  queryKey: ['organization', 'board', 'public'],
  endpoint: '/api/organization/public/board',
  schema: boardMembersResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useOrganizationStructure = createSimpleRemoteQuery<OrganizationStructureResponse>({
  queryKey: ['organization', 'structure', 'public'],
  endpoint: '/api/organization/public/structure',
  schema: organizationStructureResponseSchema,
  staleTime: 1000 * 60 * 10,
});

export const useOrganizationDocuments = createSimpleRemoteQuery<DocumentsResponse>({
  queryKey: ['organization', 'documents', 'public'],
  endpoint: '/api/organization/public/documents',
  schema: documentsResponseSchema,
  staleTime: 1000 * 60 * 5,
});
