// apps/web/src/features/auth/ui/ProtectedLayout.tsx
import { Outlet } from '@tanstack/react-router';

import { AuthGuard } from './AuthGuard';

/**
 * Layout-Wrapper für geschützte Routen
 * Wendet AuthGuard auf alle Kind-Routen an
 */
export const ProtectedLayout = () => {
  return (
    <AuthGuard>
      <Outlet />
    </AuthGuard>
  );
};
