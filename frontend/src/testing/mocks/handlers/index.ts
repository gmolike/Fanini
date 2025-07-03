// frontend/src/testing/mocks/handlers/index.ts
import { eventsHandlers } from './public/events.handlers';
import { newsletterHandlers } from './public/newsletter.handlers';
import { organizationHandlers } from './public/organization.handlers';
import { statsHandlers } from './public/stats.handlers';
import { teamHistoryHandlers } from './public/teamHistory.handlers';

export const handlers = [
  ...eventsHandlers,
  ...statsHandlers,
  ...organizationHandlers,
  ...teamHistoryHandlers,
  ...newsletterHandlers,
];
