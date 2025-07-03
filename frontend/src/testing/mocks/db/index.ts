// frontend/src/testing/mocks/db/index.ts
import { factory } from '@mswjs/data';

import * as schemas from './schemas';

// Re-export für einfachen Import
export * from './factories';
export * from './seeds';
export const db = factory(schemas);

// Re-export nur die neuen converter
export { toPublicEventListItem } from './factories/event.factory';
export { toNewsletterDetail, toNewsletterListItem } from './factories/newsletter.factory';
