import { eventsHandlers } from './public/events.handlers';
import { statsHandlers } from './public/stats.handlers';

export const handlers = [...eventsHandlers, ...statsHandlers];
