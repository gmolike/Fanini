// frontend/src/testing/mocks/db/seeds/development.seed.ts
import { seedEvents } from './event.seed';

export const seedDevelopmentData = () => {
  console.info('[MSW] Seeding development data...');

  // Events
  seedEvents(20);

  console.info('[MSW] Development data seeded successfully!');
};
