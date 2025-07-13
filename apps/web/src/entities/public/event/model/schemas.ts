// entities/public/event/model/schemas.ts
import { z } from 'zod';

import { createResponseSchema } from '@/shared/api/schemas/common';
import { createDTOSchemaBuilder } from '@/shared/lib/dto-schema-builder';

// Type-safe enum tuples
type EventTypeTuple = ['party', 'away', 'meeting', 'match', 'concert', 'training'];
export const eventTypeEnum: EventTypeTuple = [
  'party',
  'away',
  'meeting',
  'match',
  'concert',
  'training',
];

type EventCategoryTuple = ['sport', 'culture', 'social', 'official'];
export const eventCategoryEnum: EventCategoryTuple = ['sport', 'culture', 'social', 'official'];

type EventOrganizerTuple = ['faninitiative', 'eintracht', 'external'];
export const eventOrganizerEnum: EventOrganizerTuple = ['faninitiative', 'eintracht', 'external'];

type EventStatusTuple = ['upcoming', 'ongoing', 'completed', 'cancelled'];
export const eventStatusEnum: EventStatusTuple = ['upcoming', 'ongoing', 'completed', 'cancelled'];

// DTO und Labels
const eventDTO = z.object({
  id: z.string(),
  title: z.string(),
  date: z.string(),
  time: z.string(),
  location: z.string(),
  type: z.string(),
  category: z.string(),
  description: z.string(),
  maxParticipants: z.number(),
  currentParticipants: z.number(),
  thumbnailImage: z.string(),
  bannerImage: z.string(),
  isPublic: z.boolean(),
  organizer: z.string(),
  registrationRequired: z.boolean(),
  registrationDeadline: z.string(),
  ticketLink: z.string(),
  status: z.string(),
});

const eventLabels = {
  id: 'Event-ID',
  title: 'Titel',
  date: 'Datum',
  time: 'Uhrzeit',
  location: 'Ort',
  type: 'Event-Typ',
  category: 'Kategorie',
  description: 'Beschreibung',
  maxParticipants: 'Max. Teilnehmer',
  currentParticipants: 'Aktuelle Teilnehmer',
  thumbnailImage: 'Vorschaubild',
  bannerImage: 'Banner-Bild',
  isPublic: 'Öffentlich',
  organizer: 'Veranstalter',
  registrationRequired: 'Anmeldung erforderlich',
  registrationDeadline: 'Anmeldeschluss',
  ticketLink: 'Ticket-Link',
  status: 'Status',
} as const;

const builder = createDTOSchemaBuilder(eventDTO, eventLabels);

// Basis Event Schema
const publicEventListItemSchemaBase = builder.extend(b => ({
  id: b.requiredString('id'),
  title: b.requiredString('title', 3),
  date: b.dateString('date', { format: 'date' }),
  time: b.requiredString('time'),
  location: b.requiredString('location'),
  type: b.enum('type', eventTypeEnum),
  category: b.enum('category', eventCategoryEnum),
  maxParticipants: b.optionalNumber('maxParticipants', { min: 1 }),
  currentParticipants: b.optionalNumber('currentParticipants', { min: 0 }),
  thumbnailImage: b.url('thumbnailImage', { optional: true, allowRelative: true }),
  isPublic: b.literal('isPublic', true),
  organizer: b.enum('organizer', eventOrganizerEnum),
  organizerDetails: z
    .object({
      name: z.string(),
      logo: z.string().optional(),
      color: z.string(),
    })
    .optional(),
}));

export const publicEventListItemSchema = builder.extend(b => ({
  id: b.requiredString('id'),
  title: b.requiredString('title', 3),
  date: b.dateString('date', { format: 'date' }),
  time: b.requiredString('time'),
  location: b.requiredString('location'),
  type: b.enum('type', eventTypeEnum),
  category: b.enum('category', eventCategoryEnum),
  maxParticipants: b.optionalNumber('maxParticipants', { min: 1 }),
  currentParticipants: b.optionalNumber('currentParticipants', { min: 0 }),
  thumbnailImage: b.url('thumbnailImage', { optional: true, allowRelative: true }),
  isPublic: z.literal(true), // Direkt als literal true
  organizer: b.enum('organizer', eventOrganizerEnum),
  organizerDetails: z
    .object({
      name: z.string(),
      logo: z.string().optional(),
      color: z.string(),
    })
    .optional(),
}));
// Detailliertes Event Schema
export const publicEventDetailSchema = publicEventListItemSchemaBase.extend({
  description: z.string().min(10),
  bannerImage: z.string().url().optional(),
  responsiblePerson: z
    .object({
      name: z.string(),
      role: z.string().optional(),
      contact: z.string().optional(),
    })
    .optional(),
  registrationRequired: z.boolean(),
  registrationDeadline: z.string().datetime().optional(),
  ticketLink: z.string().url().optional(),
  price: z
    .object({
      amount: z.number().min(0),
      currency: z.string().default('EUR'),
      description: z.string().optional(),
    })
    .optional(),
  history: z
    .array(
      z.object({
        date: z.string().datetime(),
        action: z.enum(['created', 'updated', 'announced', 'registration_opened', 'sold_out']),
        description: z.string(),
      })
    )
    .optional(),
  comments: z
    .array(
      z.object({
        id: z.string(),
        author: z.object({
          name: z.string(),
          role: z.string().optional(),
          avatar: z.string().url().optional(),
        }),
        content: z.string(),
        createdAt: z.string().datetime(),
        isOfficial: z.boolean(),
      })
    )
    .optional(),
  status: z.enum(eventStatusEnum),
  tags: z.array(z.string()).optional(),
  relatedEvents: z
    .array(
      z.object({
        id: z.string(),
        title: z.string(),
        date: z.string(),
      })
    )
    .optional(),
});

// Response Schemas
export const publicEventListResponseSchema = createResponseSchema(
  z.array(publicEventListItemSchema)
).extend({
  meta: z.object({
    total: z.number(),
    page: z.number(),
    limit: z.number(),
    hasMore: z.boolean(),
  }),
});

export const publicEventDetailResponseSchema = createResponseSchema(publicEventDetailSchema);
