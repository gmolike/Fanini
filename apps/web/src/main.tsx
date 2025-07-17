// apps/web/src/main.tsx
import ReactDOM from 'react-dom/client';

import { RouterProvider } from '@tanstack/react-router';

import { AppProvider } from '@/app/providers';

import { router } from '@/shared/config';

import './shared/styles/font.css';
import './shared/styles/main.css';

// Root element
const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error('Root element not found');
}

// Start app
ReactDOM.createRoot(rootElement).render(
  <AppProvider>
    <RouterProvider router={router} />
  </AppProvider>
);
