// frontend/src/testing/mocks/handlers/index.ts aktualisieren
import { eventsHandlers } from './public/events.handlers';
import { organizationHandlers } from './public/organization.handlers';
import { statsHandlers } from './public/stats.handlers';
import { teamHistoryHandlers } from './public/teamHistory.handlers';

export const handlers = [
  ...eventsHandlers,
  ...statsHandlers,
  ...organizationHandlers,
  ...teamHistoryHandlers,
];
