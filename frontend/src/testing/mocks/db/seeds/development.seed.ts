// frontend/src/testing/mocks/db/seeds/development.seed.ts
import { seedEvents } from './event.seed';
import { seedNewsletters } from './newsletter.seed';
import { seedTeamHistory } from './teamHistory.seed';

import { seedOrganization } from '@/testing/mocks/db';

export const seedDevelopmentData = () => {
  console.info('[MSW] Seeding development data...');

  // Events
  seedEvents(20);

  // Team History
  seedTeamHistory();

  // Newsletter
  seedNewsletters();

  // organiation
  seedOrganization();

  console.info('[MSW] Development data seeded successfully!');
};
