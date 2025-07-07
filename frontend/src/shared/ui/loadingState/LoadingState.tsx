// frontend/src/shared/ui/LoadingState/LoadingState.tsx
import { Loader2 } from 'lucide-react';

import { Alert, AlertDescription } from '@/shared/shadcn';

import type { LoadingStateProps } from './types';

/**
 * LoadingState Komponente
 * @description Handhabt Loading, Error und Empty States für TanStack Query
 * @param {UseQueryResult} query - TanStack Query Result
 * @param {Function} children - Render function für erfolgreiche Daten
 * @param {ReactNode} loadingFallback - Custom Loading Component
 * @param {ReactNode} errorFallback - Custom Error Component
 * @param {ReactNode} emptyFallback - Custom Empty Component
 * @example
 * ```tsx
 * <LoadingState query={userQuery}>
 *   {(data) => <UserProfile user={data} />}
 * </LoadingState>
 * ```
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

  if (query.data === undefined || query.data == null) {
    return <>{emptyFallback ?? <div>Keine Daten vorhanden</div>}</>;
  }

  return <>{children(query.data as NonNullable<TData>)}</>;
};
