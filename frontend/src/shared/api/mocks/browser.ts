// frontend/src/shared/api/mocks/browser.ts
// MSW browser worker setup

import { setupWorker } from 'msw/browser';
import { handlers } from './handlers';

// Worker instance
export const worker = setupWorker(...handlers);

/**
 * Initialisiert den Mock Service Worker
 */
export const initMockServer = async () => {
  // Nur in development
  if (import.meta.env.MODE !== 'development') {
    return;
  }

  try {
    await worker.start({
      onUnhandledRequest: 'bypass',
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });

    console.log('[MSW] Mock Service Worker started successfully');
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error);
  }
};
