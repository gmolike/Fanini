// frontend/src/testing/mocks/db/index.ts
import { factory } from '@mswjs/data';

import * as schemas from './schemas';

// Re-export für einfachen Import
// frontend/src/testing/mocks/db/index.ts
// Newsletter

export * from './seeds';
export const db = factory(schemas);

// Re-export nur die neuen converter
export { toPublicEventListItem } from './factories/event.factory';
