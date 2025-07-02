// frontend/src/testing/mocks/db/factories/event.factory.ts
import { faker } from '@faker-js/faker/locale/de';

import { type db } from '../index';

type DbEvent = ReturnType<typeof db.event.create>;

export const createRandomEvent = (overrides?: Partial<Parameters<typeof db.event.create>[0]>) => {
  // ... Implementation bleibt gleich ...
};

// Nur neuer converter
export const toPublicEventListItem = (dbEvent: DbEvent): PublicEventListItem => {
  if (!dbEvent) {
    throw new Error('Invalid event');
  }

  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.date,
    time: dbEvent.time,
    location: dbEvent.location,
    type: dbEvent.type as PublicEventListItem['type'],
    category: (dbEvent.category ?? 'social') as PublicEventListItem['category'],
    maxParticipants: dbEvent.maxParticipants ?? undefined,
    currentParticipants: dbEvent.currentParticipants ?? undefined,
    thumbnailImage: dbEvent.image ?? undefined,
    isPublic: true,
    organizer: (dbEvent.organizer ?? 'faninitiative') as PublicEventListItem['organizer'],
    organizerDetails: {
      name: 'Faninitiative Spandau',
      color: 'var(--color-fanini-blue)',
    },
  };
};
