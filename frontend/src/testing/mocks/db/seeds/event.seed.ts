// frontend/src/testing/mocks/db/seeds/event.seed.ts
import { createRandomEvent } from '../factories';

export const seedEvents = (count = 10) => {
  console.info(`[MSW] Seeding ${count} events...`);

  const events = [];
  for (let i = 0; i < count; i++) {
    const event = createRandomEvent();
    events.push(event);
  }

  return events;
};

export const seedUpcomingEvents = () => {
  const now = new Date();
  const events = [];

  // Nächste Woche
  const nextWeekEvent = createRandomEvent();
  db.event.update({
    where: { id: { equals: nextWeekEvent.id } },
    data: {
      title: 'Rückrundenstart-Party',
      date: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'party',
    },
  });
  events.push(nextWeekEvent);

  // In 2 Wochen
  const twoWeeksEvent = createRandomEvent();
  db.event.update({
    where: { id: { equals: twoWeeksEvent.id } },
    data: {
      title: 'Auswärtsfahrt Berlin',
      date: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      type: 'away',
    },
  });
  events.push(twoWeeksEvent);

  return events;
};
