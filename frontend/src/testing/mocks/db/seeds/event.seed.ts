/* eslint-disable @typescript-eslint/no-non-null-assertion */
// frontend/src/testing/mocks/db/seeds/event.seed.ts

import { createRandomEvent } from '../factories';

export const seedEvents = (count = 10) => {
  console.info(`[MSW] Seeding ${String(count)} events...`);

  const events = [];
  for (let i = 0; i < count; i++) {
    events.push(createRandomEvent());
  }

  return events;
};

export const seedUpcomingEvents = () => {
  const now = new Date();
  const events = [];

  // Nächste Woche
  events.push(
    createRandomEvent({
      title: 'Rückrundenstart-Party',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
      type: 'party',
    })
  );

  // In 2 Wochen
  events.push(
    createRandomEvent({
      title: 'Auswärtsfahrt Berlin',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]!,
      type: 'away',
    })
  );

  return events;
};
