// apps/web/src/features/auth/ui/AuthGuard.tsx
import { type ReactNode, useEffect } from 'react';

import { useNavigate } from '@tanstack/react-router';
import { AlertCircle } from 'lucide-react';

import { useAuthStore } from '@/features/auth';

import { Alert } from '@/shared/shadcn';
import { Container, PageSection } from '@/shared/ui';

import { type RoleName } from '../model/types';

type AuthGuardProps = {
  children: ReactNode;
  requiredRoles?: RoleName[];
  redirectTo?: string;
};

/**
 * Schützt Routen vor unautorisiertem Zugriff
 * Prüft JWT Token und Rollen
 */
export const AuthGuard = ({
  children,
  requiredRoles = [],
  redirectTo = '/login',
}: AuthGuardProps) => {
  const navigate = useNavigate();
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  const { user, isLoading, checkAuth } = useAuthStore() as {
    user: { rollen: { name: RoleName }[] } | null;
    isLoading: boolean;
    checkAuth: () => void;
  };

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (!isLoading && !user) {
      void navigate({ to: redirectTo });
    }
  }, [isLoading, user, navigate, redirectTo]);

  if (!user) {
    return null;
  }

  // Rollen-Check
  if (requiredRoles.length > 0) {
    const userRoles = user.rollen.map(r => r.name);
    const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));

    if (!hasRequiredRole) {
      return (
        <Container>
          <PageSection>
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <span>Du hast keine Berechtigung für diese Seite.</span>
            </Alert>
          </PageSection>
        </Container>
      );
    }
  }

  return <>{children}</>;
};
