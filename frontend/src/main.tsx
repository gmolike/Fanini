// frontend/src/main.tsx
// CSS imports in korrekter Reihenfolge
import ReactDOM from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { AppProvider } from '@/app/providers';

import { router } from '@/shared/config';

import './shared/styles/font.css';
import './shared/styles/main.css';

import { logActiveHandlers } from '@/testing/mocks/browser';

/**
 * Prepare app before rendering
 * @description Startet MSW in Development wenn aktiviert
 */
async function prepare(): Promise<void> {
  if (import.meta.env.DEV && import.meta.env['VITE_MOCK_API_ENABLED'] === 'true') {
    // Dynamischer Import nur wenn benötigt
    const { startMockServer } = await import('@/testing');
    await startMockServer();
    logActiveHandlers(); // Das zeigt alle registrierten Handler
  }
}

// Root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Start app
prepare()
  .then(() => {
    ReactDOM.createRoot(rootElement).render(
      <AppProvider>
        <RouterProvider router={router} />
      </AppProvider>
    );
  })
  .catch((error: unknown) => {
    console.error('Failed to start app:', error);
  });
