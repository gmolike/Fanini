// frontend/src/testing/mocks/db/factories/event.factory.ts
import { faker } from '@faker-js/faker/locale/de';

import type { PublicEventListItem } from '@/entities/public/event';

import { db } from '../index';

type DbEvent = ReturnType<typeof db.event.create>;

export const createRandomEvent = (_overrides?: Partial<Parameters<typeof db.event.create>[0]>) => {
  return db.event.create({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      'Rückrundenstart-Party',
      'Auswärtsfahrt nach Berlin',
      'Mitgliederversammlung',
      'Heimspiel gegen TuS Makkabi',
      'Sommer-Grillfest',
    ]),
    date: faker.date.future().toISOString().split('T')[0],
    time: faker.helpers.arrayElement(['19:00', '15:00', '20:00', '14:30']),
    location: faker.helpers.arrayElement([
      'Vereinsheim Faninitiative',
      'Stadion Zitadelle',
      'Hauptbahnhof Berlin',
      'Sportplatz Falkenhagener Feld',
    ]),
    type: faker.helpers.arrayElement(['party', 'away', 'meeting', 'match', 'concert', 'training']),
    category: faker.helpers.arrayElement(['sport', 'culture', 'social', 'official']),
    organizer: faker.helpers.arrayElement(['faninitiative', 'eintracht', 'external']),
    description: faker.lorem.paragraphs(2),
    shortDescription: faker.lorem.sentence(),
    image: faker.helpers.maybe(() => faker.image.url(), { probability: 0.7 }),
    maxParticipants: faker.helpers.maybe(() => faker.number.int({ min: 20, max: 200 })),
    currentParticipants: faker.helpers.maybe(() => faker.number.int({ min: 0, max: 150 })),
    isPublic: true,
    createdAt: faker.date.recent().toISOString(),
    updatedAt: faker.date.recent().toISOString(),
  });
};

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
