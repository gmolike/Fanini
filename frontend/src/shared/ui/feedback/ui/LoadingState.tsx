import { Loader2 } from 'lucide-react'

import { Alert, AlertDescription } from '@/shared/shadcn'

import type { LoadingStateProps } from '../model/types'

/**
 * LoadingState Komponente
 * @description Handhabt Loading, Error und Empty States für TanStack Query
 */
export const LoadingState = <TData,>({
  query,
  children,
  loadingFallback,
  errorFallback,
  emptyFallback,
}: LoadingStateProps<TData>) => {
  if (query.isLoading) {
    return (
      <>
        {loadingFallback || (
          <div className="flex items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        )}
      </>
    )
  }

  if (query.isError) {
    return (
      <>
        {errorFallback || (
          <Alert variant="destructive">
            <AlertDescription>
              Fehler beim Laden der Daten. Bitte versuche es später erneut.
            </AlertDescription>
          </Alert>
        )}
      </>
    )
  }

  if (!query.data) {
    return <>{emptyFallback || <div>Keine Daten vorhanden</div>}</>
  }

  return <>{children(query.data)}</>
}
