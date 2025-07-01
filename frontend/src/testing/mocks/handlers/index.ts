import { eventsHandlers } from './public/events.handlers';
import { organizationHandlers } from './public/organization.handlers';
import { statsHandlers } from './public/stats.handlers';

export const handlers = [...eventsHandlers, ...statsHandlers, ...organizationHandlers];
