import { delay, http, HttpResponse } from 'msw';

import type { BoardMember, Document, OrganizationNode } from '@/entities/public/organization';

import { db } from '../../db';

// Type für DB Returns
type DbBoardMember = ReturnType<typeof db.boardMember.findFirst>;
type DbDocument = ReturnType<typeof db.document.findFirst>;

// Hilfsfunktionen für die Konvertierung mit Type Guards
const toBoardMemberResponse = (dbMember: NonNullable<DbBoardMember>): BoardMember => ({
  id: dbMember.id,
  name: dbMember.name,
  role: dbMember.role as BoardMember['role'],
  roleLabel: dbMember.roleLabel,
  email: dbMember.email ?? undefined,
  phone: dbMember.phone ?? undefined,
  image: dbMember.image ?? undefined,
  description: dbMember.description ?? undefined,
  memberSince: dbMember.memberSince,
  responsibilities: dbMember.responsibilities as string[],
  order: dbMember.order,
});

const toDocumentResponse = (dbDoc: NonNullable<DbDocument>): Document => ({
  id: dbDoc.id,
  title: dbDoc.title,
  type: dbDoc.type as Document['type'],
  fileUrl: dbDoc.fileUrl,
  fileSize: dbDoc.fileSize,
  updatedAt: dbDoc.updatedAt,
  category: dbDoc.category,
});

export const organizationHandlers = [
  // GET /api/organization/public/board
  http.get('/api/organization/public/board', async () => {
    await delay(300);

    const dbMembers = db.boardMember.findMany({
      orderBy: { order: 'asc' },
    });

    const members = dbMembers.map(toBoardMemberResponse);

    return HttpResponse.json({
      data: members,
      meta: { total: members.length },
    });
  }),

  // GET /api/organization/public/structure
  http.get('/api/organization/public/structure', async () => {
    await delay(300);

    const structure: OrganizationNode = {
      id: 'root',
      name: 'Mitgliederversammlung',
      type: 'board',
      level: 0,
      children: [
        {
          id: 'vorstand',
          name: 'Vorstand',
          type: 'board',
          level: 1,
          description: 'Geschäftsführendes Organ',
          children: [
            {
              id: 'geschaeftsfuehrung',
              name: 'Geschäftsführender Vorstand',
              type: 'board',
              level: 2,
              description: '1. und 2. Vorsitzende, Kassenwartin',
            },
            {
              id: 'erweiterter-vorstand',
              name: 'Erweiterter Vorstand',
              type: 'board',
              level: 2,
              description: 'Schriftführung',
            },
          ],
        },
        {
          id: 'beirat',
          name: 'Beirat',
          type: 'advisory',
          level: 1,
          description: 'Beratende und operative Funktionen',
          children: [
            {
              id: 'beirat-members',
              name: 'Beiratsmitglieder',
              type: 'advisory',
              level: 2,
              description: 'Event, Medien, Technik, Mitglieder',
            },
          ],
        },
        {
          id: 'kassenpruefung',
          name: 'Kassenprüfung',
          type: 'audit',
          level: 1,
          description: 'Unabhängige Finanzprüfung',
        },
      ],
    };

    return HttpResponse.json({ data: structure });
  }),

  // GET /api/organization/public/documents
  http.get('/api/organization/public/documents', async () => {
    await delay(300);

    const dbDocuments = db.document.findMany({
      orderBy: { updatedAt: 'desc' },
    });

    const documents = dbDocuments.map(toDocumentResponse);

    return HttpResponse.json({
      data: documents,
      meta: { total: documents.length },
    });
  }),
];
