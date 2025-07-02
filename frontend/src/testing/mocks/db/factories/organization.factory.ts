// frontend/src/testing/mocks/db/factories/event.factory.ts
import type { PublicEventListItem } from '@/entities/public/event';

import { db } from '../index';

type DbEvent = ReturnType<typeof db.event.create>;

export const createRandomEvent = () => {
  return db.event.create({
    // eslint-disable-next-line sonarjs/pseudo-random
    id: Math.random().toString(36).slice(2, 11),
    title: 'Test Event',
    date: new Date().toISOString().split('T')[0],
    time: '19:00',
    location: 'Test Location',
    type: 'party',
    category: 'social',
    organizer: 'faninitiative',
    description: 'Test Description',
    isPublic: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
};

// Type-safe converter
export const toPublicEventListItem = (dbEvent: DbEvent): PublicEventListItem => {
  return {
    id: dbEvent.id,
    title: dbEvent.title,
    date: dbEvent.date,
    time: dbEvent.time,
    location: dbEvent.location,
    type: dbEvent.type as PublicEventListItem['type'],
    category: dbEvent.category as PublicEventListItem['category'],
    maxParticipants: dbEvent.maxParticipants ?? undefined,
    currentParticipants: dbEvent.currentParticipants ?? undefined,
    thumbnailImage: dbEvent.image ?? undefined,
    isPublic: true,
    organizer: dbEvent.organizer as PublicEventListItem['organizer'],
    organizerDetails: {
      name: 'Faninitiative Spandau',
      color: 'var(--color-fanini-blue)',
    },
  };
};
