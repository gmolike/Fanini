/* eslint-disable @typescript-eslint/strict-boolean-expressions */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// frontend/src/testing/mocks/browser.ts
import { setupWorker } from 'msw/browser';

import { handlers } from './handlers';

// Create worker instance
export const worker = setupWorker(...handlers);

// Debug helper
export function logActiveHandlers() {
  console.group('[MSW] Active Handlers');
  worker.listHandlers().forEach((handler, index) => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if ('info' in handler && handler.info && 'header' in handler.info) {
      console.log(`${index + 1}. ${String(handler.info.header)}`);
    } else {
      console.log(`${index + 1}. [Unknown Handler Type]`);
    }
  });
  console.groupEnd();
}
