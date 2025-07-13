/* eslint-disable @typescript-eslint/naming-convention */
// frontend/src/testing/mocks/handlers/public/organization.handlers.ts
import { delay, http, HttpResponse } from 'msw';

import type { GremiumType } from '@/entities/public/organization';
import type { OrganizationNode } from '@/entities/public/organization-structure';

import {
  createDocumentsResponse,
  createGremienListResponse,
  GREMIEN_DETAILS,
} from '../../db/seeds/organization.seed';

// Erstelle die Organization Structure basierend auf den Gremien
const createOrganizationStructure = (): OrganizationNode => {
  return {
    id: 'fanini-root',
    name: 'Faninitiative Spandau e.V.',
    type: 'root',
    description: 'Offizieller Fanverein der Eintracht Spandau',
    memberCount: 70,
    color: 'from-blue-600 to-blue-800',
    children: [
      {
        id: 'eintracht-spandau',
        name: 'Eintracht Spandau',
        type: 'partner',
        description: 'Unser Profi-Fußballverein',
        logo: '/images/eintracht-logo.png',
        color: 'from-blue-500 to-blue-700',
        link: 'https://eintracht-spandau.de',
        isExternal: true,
      },
      {
        id: 'vorstand-dept',
        name: 'Vorstand',
        type: 'department',
        description: 'Geschäftsführendes Organ',
        memberCount: 4,
        lead: 'Glenn Odya',
        color: 'from-blue-500 to-blue-600',
        children: [
          {
            id: 'vorstand-team',
            name: 'Geschäftsführender Vorstand',
            type: 'team',
            memberCount: 3,
            lead: 'Glenn Odya',
          },
          {
            id: 'erweiterter-vorstand',
            name: 'Erweiterter Vorstand',
            type: 'team',
            memberCount: 1,
            lead: 'Sarah Weber',
          },
        ],
      },
      {
        id: 'beirat-dept',
        name: 'Beirat',
        type: 'department',
        description: 'Operative Leitung',
        memberCount: 4,
        color: 'from-purple-500 to-purple-600',
        children: [
          {
            id: 'team-event',
            name: 'Team Event',
            type: 'team',
            memberCount: 3,
            lead: 'lisamon',
            email: 'events@fanini-spandau.de',
          },
          {
            id: 'team-medien',
            name: 'Team Medien',
            type: 'team',
            memberCount: 4,
            lead: 'Rifton',
            email: 'medien@fanini-spandau.de',
          },
          {
            id: 'team-technik',
            name: 'Team Technik',
            type: 'team',
            memberCount: 3,
            lead: 'Kaya',
            email: 'technik@fanini-spandau.de',
          },
          {
            id: 'team-verein',
            name: 'Team Verein',
            type: 'team',
            memberCount: 2,
            lead: 'franZee',
            email: 'mitglieder@fanini-spandau.de',
          },
        ],
      },
      {
        id: 'kassenpruefung-dept',
        name: 'Kassenprüfung',
        type: 'department',
        description: 'Unabhängige Finanzprüfung',
        memberCount: 2,
        color: 'from-red-500 to-red-600',
      },
    ],
  };
};

export const organizationHandlers = [
  // Organization Structure Handler - NEUER HANDLER
  http.get('/api/public/organization/structure', async () => {
    await delay(200);
    const structure = createOrganizationStructure();
    return HttpResponse.json(structure);
  }),

  // List Handler
  http.get('/api/organization/public/gremien', async () => {
    await delay(300);
    const response = createGremienListResponse();
    return HttpResponse.json(response);
  }),

  // Detail Handler
  http.get('/api/organization/public/gremien/:gremiumId', async ({ params }) => {
    const gremiumId = params['gremiumId'] as string;
    await delay(200);

    // Prüfen ob die ID ein gültiger GremiumType ist
    const validTypes: GremiumType[] = [
      'vorstand',
      'beirat',
      'team_event',
      'team_medien',
      'team_technik',
      'team_verein',
      'kassenpruefung',
    ];

    if (!validTypes.includes(gremiumId as GremiumType)) {
      return new HttpResponse(JSON.stringify({ error: 'Gremium nicht gefunden' }), {
        status: 404,
        headers: { 'content-type': 'application/json' },
      });
    }

    // Direkt auf GREMIEN_DETAILS zugreifen
    const gremium = GREMIEN_DETAILS[gremiumId as GremiumType];

    return HttpResponse.json({ data: gremium });
  }),

  // Documents Handler
  http.get('/api/organization/public/documents', async () => {
    await delay(200);
    const response = createDocumentsResponse();
    return HttpResponse.json(response);
  }),
];
