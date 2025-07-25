// apps/api/src/config/swagger-schemas.ts
import type { OpenAPIV3 } from 'openapi-types';

/**
 * Konvertiert unsere Domain Entities zu OpenAPI Schemas
 * @description Zentrale Schema-Definitionen für Type Generation
 */
export const domainSchemas: Record<string, OpenAPIV3.SchemaObject> = {
  // ========== USER & AUTH ==========
  User: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      email: { type: 'string', format: 'email' },
      vorname: { type: 'string' },
      nachname: { type: 'string' },
      mitgliedsnummer: { type: 'string' },
      authSource: { type: 'string', enum: ['local', 'easyverein'] },
      easyVereinId: { type: 'string' },
      role: { $ref: '#/components/schemas/RoleName' },
      istAktiv: { type: 'boolean' },
      erstelltAm: { type: 'string', format: 'date-time' },
      aktualisiertAm: { type: 'string', format: 'date-time' },
      letzterLogin: { type: 'string', format: 'date-time' },
    },
    required: ['id', 'email', 'vorname', 'nachname', 'authSource', 'istAktiv', 'erstelltAm', 'aktualisiertAm'],
  },

  RoleName: {
    type: 'string',
    enum: ['ADMIN', 'VORSTAND', 'BEIRAT', 'KASSENPRUFER', 'TEAM_EVENT', 'TEAM_MEDIEN', 'TEAM_TECHNIK', 'TEAM_VEREIN', 'MITGLIED'],
  },

  // ========== MEMBER ==========
  MemberListItem: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      vorname: { type: 'string' },
      nachname: { type: 'string' },
      email: { type: 'string', format: 'email' },
      telefon: { type: 'string' },
      mitgliedsnummer: { type: 'string' },
      istAktiv: { type: 'boolean' },
      mitgliedSeit: { type: 'string', format: 'date' },
      geburtsdatum: { type: 'string', format: 'date' },
      rolle: { type: 'array', items: { $ref: '#/components/schemas/RoleName' } },
      profilbild: { type: 'string' },
      letzteAktivitaet: { type: 'string', format: 'date-time' },
      vollstaendigerName: { type: 'string' },
    },
    required: ['id', 'vorname', 'nachname', 'email', 'mitgliedsnummer', 'istAktiv', 'mitgliedSeit', 'rolle'],
  },

  MemberDetail: {
    allOf: [
      { $ref: '#/components/schemas/MemberListItem' },
      {
        type: 'object',
        properties: {
          adresse: { $ref: '#/components/schemas/Adresse' },
          notfallkontakt: { $ref: '#/components/schemas/Notfallkontakt' },
          iban: { type: 'string' },
          hatVertraulichkeitserklaerung: { type: 'boolean' },
          sichtbarkeit: { $ref: '#/components/schemas/Sichtbarkeit' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
        },
      },
    ],
  },

  Adresse: {
    type: 'object',
    properties: {
      strasse: { type: 'string' },
      hausnummer: { type: 'string' },
      plz: { type: 'string', pattern: '^\\d{5}$' },
      stadt: { type: 'string' },
    },
    required: ['strasse', 'hausnummer', 'plz', 'stadt'],
  },

  Notfallkontakt: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      telefon: { type: 'string' },
    },
    required: ['name', 'telefon'],
  },

  Sichtbarkeit: {
    type: 'object',
    properties: {
      email: { type: 'string', enum: ['alle', 'mitglieder', 'vorstand', 'niemand'] },
      telefon: { type: 'string', enum: ['alle', 'mitglieder', 'vorstand', 'niemand'] },
      profil: { type: 'string', enum: ['alle', 'mitglieder', 'vorstand', 'niemand'] },
    },
    required: ['email', 'telefon', 'profil'],
  },

  // ========== EVENT ==========
  Event: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      shortDescription: { type: 'string' },
      date: { type: 'string', format: 'date-time' },
      time: { type: 'string' },
      durationMinutes: { type: 'integer' },
      location: { $ref: '#/components/schemas/EventLocation' },
      type: { $ref: '#/components/schemas/EventType' },
      sportBereich: { $ref: '#/components/schemas/SportBereich' },
      status: { $ref: '#/components/schemas/EventStatus' },
      isPublic: { type: 'boolean' },
      isConfidential: { type: 'boolean' },
      responsibleMemberId: { type: 'string' },
      deputyMemberIds: { type: 'array', items: { type: 'string' } },
      budget: { type: 'number' },
      budgetUsed: { type: 'number' },
      maxParticipants: { type: 'integer' },
      registrationDeadline: { type: 'string', format: 'date-time' },
      ticketLink: { type: 'string' },
      createdAt: { type: 'string', format: 'date-time' },
      createdBy: { type: 'string' },
      updatedAt: { type: 'string', format: 'date-time' },
      updatedBy: { type: 'string' },
      approvedAt: { type: 'string', format: 'date-time' },
      approvedBy: { type: 'string' },
    },
    required: ['id', 'title', 'description', 'date', 'time', 'location', 'type', 'status', 'isPublic', 'isConfidential', 'responsibleMemberId', 'budgetUsed', 'createdAt', 'createdBy', 'updatedAt'],
  },

  EventLocation: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      address: { type: 'string' },
      description: { type: 'string' },
    },
    required: ['name'],
  },

  EventType: {
    type: 'string',
    enum: ['vereinstreffen', 'sportveranstaltung', 'fanfahrt', 'social', 'sitzung', 'workshop', 'turnier', 'sonstiges'],
  },

  EventStatus: {
    type: 'string',
    enum: ['entwurf', 'geplant', 'genehmigt', 'aktiv', 'abgeschlossen', 'abgesagt'],
  },

  SportBereich: {
    type: 'string',
    enum: ['league_of_legends', 'fussball', 'esports_allgemein', 'sonstiges'],
  },

  // ========== TASK ==========
  Task: {
    type: 'object',
    properties: {
      id: { type: 'string' },
      titel: { type: 'string' },
      beschreibung: { type: 'string' },
      context: { $ref: '#/components/schemas/TaskContext' },
      verantwortlichId: { type: 'string' },
      zugewiesenAn: { type: 'array', items: { type: 'string' } },
      status: { $ref: '#/components/schemas/TaskStatus' },
      prioritaet: { $ref: '#/components/schemas/TaskPriority' },
      frist: { type: 'string', format: 'date-time' },
      materialien: { type: 'array', items: { $ref: '#/components/schemas/TaskMaterial' } },
      abhaengigVon: { type: 'array', items: { type: 'string' } },
      istStandardaufgabe: { type: 'boolean' },
      kategorie: { type: 'string' },
      erstelltVon: { type: 'string' },
      erstelltAm: { type: 'string', format: 'date-time' },
      aktualisiertAm: { type: 'string', format: 'date-time' },
      erledigtAm: { type: 'string', format: 'date-time' },
      erledigtVon: { type: 'string' },
      geloescht: { type: 'boolean' },
    },
    required: ['id', 'titel', 'context', 'zugewiesenAn', 'status', 'prioritaet', 'materialien', 'istStandardaufgabe', 'erstelltVon', 'erstelltAm', 'aktualisiertAm', 'geloescht'],
  },

  TaskContext: {
    type: 'object',
    properties: {
      type: { type: 'string', enum: ['event', 'team', 'general'] },
      id: { type: 'string', nullable: true },
    },
    required: ['type', 'id'],
  },

  TaskStatus: {
    type: 'string',
    enum: ['offen', 'in_bearbeitung', 'review', 'erledigt', 'blockiert'],
  },

  TaskPriority: {
    type: 'string',
    enum: ['niedrig', 'mittel', 'hoch', 'kritisch'],
  },

  TaskMaterial: {
    type: 'object',
    properties: {
      name: { type: 'string' },
      menge: { type: 'number' },
      einheit: { type: 'string' },
      beschreibung: { type: 'string' },
      besorgt: { type: 'boolean' },
    },
    required: ['name', 'menge', 'einheit', 'besorgt'],
  },

  // ========== REQUESTS ==========
  CreateMemberRequest: {
    type: 'object',
    properties: {
      memberType: { type: 'string', enum: ['member', 'creator', 'sponsor', 'partner'] },
      vorname: { type: 'string', minLength: 2 },
      nachname: { type: 'string', minLength: 2 },
      email: { type: 'string', format: 'email' },
      telefon: { type: 'string' },
      kuenstlername: { type: 'string' },
      portfolio: { type: 'string' },
      passwordOption: { type: 'string', enum: ['none', 'generate', 'manual'] },
      password: { type: 'string' },
      sendCredentials: { type: 'boolean' },
    },
    required: ['memberType', 'vorname', 'nachname', 'email'],
  },

  UpdateMemberRequest: {
    type: 'object',
    properties: {
      vorname: { type: 'string', minLength: 2, maxLength: 100 },
      nachname: { type: 'string', minLength: 2, maxLength: 100 },
      email: { type: 'string', format: 'email' },
      telefon: { type: 'string' },
      mitgliedsnummer: { type: 'string' },
      istAktiv: { type: 'boolean' },
      geburtsdatum: { type: 'string', format: 'date' },
      adresse: { $ref: '#/components/schemas/Adresse' },
      iban: { type: 'string' },
      notfallkontakt: { $ref: '#/components/schemas/Notfallkontakt' },
    },
  },

  CreateEventRequest: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 3 },
      description: { type: 'string', minLength: 10 },
      shortDescription: { type: 'string' },
      date: { type: 'string', format: 'date' },
      time: { type: 'string' },
      location: { $ref: '#/components/schemas/EventLocation' },
      type: { $ref: '#/components/schemas/EventType' },
      responsibleMemberId: { type: 'string' },
      isPublic: { type: 'boolean' },
    },
    required: ['title', 'description', 'date', 'time', 'location', 'type', 'responsibleMemberId'],
  },

  CreateTaskRequest: {
    type: 'object',
    properties: {
      titel: { type: 'string', minLength: 3, maxLength: 255 },
      beschreibung: { type: 'string' },
      context_type: { type: 'string', enum: ['event', 'team', 'general'] },
      context_id: { type: 'string' },
      verantwortlich_id: { type: 'string' },
      prioritaet: { $ref: '#/components/schemas/TaskPriority' },
      frist: { type: 'string', format: 'date-time' },
      materialien: { type: 'array', items: { $ref: '#/components/schemas/TaskMaterial' } },
      abhaengig_von: { type: 'array', items: { type: 'string' } },
      kategorie: { type: 'string' },
    },
    required: ['titel', 'context_type'],
  },

  // ========== RESPONSES ==========
  ApiResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean' },
      data: { type: 'object' },
      error: { type: 'string' },
      meta: { type: 'object' },
    },
    required: ['success'],
  },

  PaginatedResponse: {
    type: 'object',
    properties: {
      data: { type: 'array', items: { type: 'object' } },
      meta: {
        type: 'object',
        properties: {
          total: { type: 'integer' },
          page: { type: 'integer' },
          limit: { type: 'integer' },
          pages: { type: 'integer' },
          filtered: { type: 'boolean' },
        },
        required: ['total', 'page', 'limit', 'pages'],
      },
    },
    required: ['data', 'meta'],
  },
};
