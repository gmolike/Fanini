import { faker } from '@faker-js/faker/locale/de';

import { db } from '@/testing/mocks/db';

// testing/mocks/db/factories/organization.factory.ts
export const createDocument = (overrides?: Partial<Document>) => {
  const types = ['satzung', 'geschaeftsordnung', 'protokoll', 'other'];

  return db.document.create({
    id: faker.string.uuid(),
    title: faker.helpers.arrayElement([
      'Vereinssatzung',
      'Geschäftsordnung Vorstand',
      'Geschäftsordnung Beirat',
      'Protokoll Mitgliederversammlung',
      'Beitragsordnung',
    ]),
    type: faker.helpers.arrayElement(types),
    fileUrl: '/dokumente/sample.pdf', // Geändert von /documents/ zu /dokumente/
    fileSize: faker.number.int({ min: 100000, max: 5000000 }),
    updatedAt: faker.date.recent().toISOString(),
    category: faker.helpers.arrayElement(['Rechtliches', 'Organisation', 'Protokolle']),
    ...overrides,
  });
};
