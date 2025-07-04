// frontend/src/testing/mocks/db/seeds/development.seed.ts
import { seedEvents } from './event.seed';
import { seedNewsletters } from './newsletter.seed';
import { seedBoardMembers, seedDocuments } from './organization.seed';
import { seedTeamHistory } from './teamHistory.seed';

export const seedDevelopmentData = () => {
  console.info('[MSW] Seeding development data...');

  // Events
  seedEvents(20);

  // Organization
  seedBoardMembers();
  seedDocuments();

  // Team History
  seedTeamHistory();

  // Newsletter
  seedNewsletters();

  console.info('[MSW] Development data seeded successfully!');
};
