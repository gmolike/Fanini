// frontend/src/testing/mocks/setup.ts
import { worker } from './browser';

/**
 * Startet den Mock Service Worker
 */
export async function startMockServer(): Promise<void> {
  // Check if mocking is enabled
  if (import.meta.env.VITE_MOCK_API_ENABLED !== 'true') {
    console.log('[MSW] Mock API disabled via environment variable');
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
      onUnhandledRequest: (req, print) => {
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

    console.log('[MSW] Mock Service Worker started successfully ✅');

    // Für MSW v2 - keine handler.info mehr verfügbar
    console.log(
      '[MSW] Mock server is running. Check browser DevTools Network tab to see intercepted requests.'
    );
  } catch (error) {
    console.error('[MSW] Failed to start Mock Service Worker:', error);
    throw error;
  }
}

/**
 * Stoppt den Mock Service Worker
 */
export async function stopMockServer(): Promise<void> {
  await worker.stop();
  console.log('[MSW] Mock Service Worker stopped');
}
