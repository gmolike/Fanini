// frontend/src/testing/mocks/handlers/index.ts
import { creatorHandlers } from './public/creator.handlers';
import { eventsHandlers } from './public/events.handlers';
import { newsletterHandlers } from './public/newsletter.handlers';
import { organizationHandlers } from './public/organization.handlers';
import { statsHandlers } from './public/stats.handlers';
import { teamHistoryHandlers } from './public/teamHistory.handlers';

// Handler-Reihenfolge ist wichtig - Creator handlers zuerst für Priorität
export const handlers = [
  ...creatorHandlers,
  ...eventsHandlers,
  ...statsHandlers,
  ...organizationHandlers,
  ...teamHistoryHandlers,
  ...newsletterHandlers,
];

// Debug: Zeige alle registrierten Handler
console.log('[MSW] Total handlers registered:', handlers.length);
handlers.forEach((handler, index) => {
  if (handler.info) {
    console.log(`[MSW] ${index}: ${handler.info.method} ${handler.info.path}`);
  }
});
