// frontend/src/testing/mocks/db/seeds/development.seed.ts
import { seedEvents } from './event.seed';
import { seedBoardMembers, seedDocuments } from './organization.seed';

export const seedDevelopmentData = () => {
  console.info('[MSW] Seeding development data...');

  // Events
  seedEvents(20);
  seedBoardMembers();
  seedDocuments();

  console.info('[MSW] Development data seeded successfully!');
};
