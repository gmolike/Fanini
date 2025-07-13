// frontend/src/shared/ui/feedback/ui/LoadingState.tsx
import { Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/shared/shadcn';

import type { LoadingStateProps } from '../model/types';

/**
 * LoadingState Komponente
 * @description Handhabt Loading, Error und Empty States für TanStack Query
 */
export const LoadingState = <TData = unknown,>({
  query,
  children,
  loadingFallback,
  errorFallback,
  emptyFallback,
}: LoadingStateProps<TData>) => {
  if (query.isLoading) {
    return (
      <>
        {loadingFallback ?? (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="text-muted-foreground h-8 w-8 animate-spin" />
          </div>
        )}
      </>
    );
  }

  if (query.isError) {
    return (
      <>
        {errorFallback ?? (
          <Alert variant="destructive">
            <AlertDescription>
              Fehler beim Laden der Daten. Bitte versuche es später erneut.
            </AlertDescription>
          </Alert>
        )}
      </>
    );
  }

  // eslint-disable-next-line no-extra-boolean-cast
  if (!Boolean(query.data)) {
    return <>{emptyFallback ?? <div>Keine Daten vorhanden</div>}</>;
  }

  // Type assertion needed here due to React children type constraints
  return <>{children(query.data as NonNullable<TData>)}</>;
};
