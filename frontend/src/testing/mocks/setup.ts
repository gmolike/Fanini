// frontend/src/testing/mocks/setup.ts
import { worker } from './browser';

/**
 * Startet den Mock Service Worker
 */
export async function startMockServer(): Promise<void> {
  console.info('[MSW] Checking if mock server should start...');
  console.info('[MSW] VITE_MOCK_API_ENABLED:', import.meta.env['VITE_MOCK_API_ENABLED']);

  if (import.meta.env['VITE_MOCK_API_ENABLED'] !== 'true') {
    console.warn('[MSW] Mock server disabled - VITE_MOCK_API_ENABLED is not "true"');
    return;
  }

  // Don't start in production
  if (import.meta.env.PROD) {
    console.warn('[MSW] Mock server disabled in production');
    return;
  }

  try {
    // Start MSW
    await worker.start({
      onUnhandledRequest: req => {
        // Ignoriere statische Assets
        const url = new URL(req.url);
        if (
          url.pathname.includes('/node_modules/') ||
          url.pathname.includes('/@vite/') ||
          url.pathname.includes('/@react-refresh') ||
          url.pathname.includes('/src/') ||
          !url.pathname.startsWith('/api/')
        ) {
          return;
        }

        // Warne bei unbehandelten API calls
        console.warn(`[MSW] Unhandled ${req.method} request to ${req.url}`);
      },
      serviceWorker: {
        url: '/mockServiceWorker.js',
      },
    });
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error);
    throw error;
  }
}

/**
 * Stoppt den Mock Service Worker
 */
export function stopMockServer(): Promise<void> {
  return new Promise(resolve => {
    worker.stop();
    resolve();
  });
}
