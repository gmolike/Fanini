// frontend/src/testing/mocks/db/factories/event.factory.ts
import { faker } from '@faker-js/faker/locale/de';

import type { EventType,PublicEvent } from '@/entities/public/event';

import { db } from '../index';











type DbEvent = ReturnType<typeof db.event.create>;

export const createRandomEvent = (overrides?: Partial<Parameters<typeof db.event.create>[0]>) => {
  const eventTypes: EventType[] = ['party', 'away', 'meeting', 'match'];
  const locations = ['Vereinsheim', 'Busabfahrt Rathaus', 'Sportplatz', 'Gaststätte'];

  const maxParticipants =
    faker.helpers.maybe(() => faker.number.int({ min: 20, max: 100 })) ?? null;

  return db.event.create({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      'Saisonabschlussfeier',
      `Auswärtsfahrt ${faker.location.city()}`,
      'Mitgliederversammlung',
      'Grillabend',
    ]),
    date: faker.date.future().toISOString().split('T')[0] ?? '',
    time: faker.helpers.arrayElement(['14:00', '15:30', '18:00', '19:00']),
    location: faker.helpers.arrayElement(locations),
    type: faker.helpers.arrayElement(eventTypes),
    description: faker.lorem.paragraph(),
    shortDescription: faker.helpers.maybe(() => faker.lorem.sentence()) ?? null,
    image:
      faker.helpers.maybe(
        () => `/images/events/event-${faker.number.int({ min: 1, max: 5 }).toString()}.jpg`
      ) ?? null,
    maxParticipants,
    currentParticipants: maxParticipants
      ? faker.number.int({ min: 0, max: maxParticipants })
      : null,
    isPublic: true,
    createdAt: faker.date.past().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  });
};

export const toPublicEvent = (dbEvent: DbEvent): PublicEvent => ({
  id: dbEvent.id,
  title: dbEvent.title,
  date: dbEvent.date,
  time: dbEvent.time,
  location: dbEvent.location,
  type: dbEvent.type as EventType,
  description: dbEvent.description,
  shortDescription: dbEvent.shortDescription ?? '', // Ensure string
  image: dbEvent.image ?? '', // Ensure string if PublicEvent expects string
  maxParticipants: dbEvent.maxParticipants ?? 0, // Ensure number if PublicEvent expects number
  currentParticipants: dbEvent.currentParticipants ?? 0, // Ensure number if PublicEvent expects number
  isPublic: true,
});
