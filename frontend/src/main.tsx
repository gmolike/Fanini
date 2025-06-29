// frontend/src/main.tsx
import ReactDOM from 'react-dom/client';
import { RouterProvider } from '@tanstack/react-router';
import { AppProvider } from '@/app/providers';
import { router } from '@/shared/config';
import './shared/styles/font.css';
import './shared/styles/main.css';

// MSW initialisieren
async function enableMocking() {
  if (import.meta.env.VITE_MOCK_API_ENABLED !== 'true') {
    return;
  }

  const { initMockServer } = await import('@/shared/api/mocks');
  return initMockServer();
}

const rootElement = document.getElementById('root')!;

// Warte auf MSW bevor App startet
enableMocking().then(() => {
  ReactDOM.createRoot(rootElement).render(
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
  );
});
