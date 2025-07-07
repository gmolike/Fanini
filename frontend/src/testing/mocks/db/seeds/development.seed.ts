// frontend/src/testing/mocks/db/seeds/development.seed.ts

import {
  seedCreators,
  seedEvents,
  seedNewsletters,
  seedOrganization,
  seedTeamHistory,
} from '@/testing/mocks/db';

export const seedDevelopmentData = () => {
  console.info('[MSW] Seeding development data...');

  // Creators
  seedCreators();

  // Events
  seedEvents(20);

  // Newsletter
  seedNewsletters();

  // organiation
  seedOrganization();

  // Team History
  seedTeamHistory();

  console.info('[MSW] Development data seeded successfully!');
};
