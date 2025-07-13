// frontend/src/shared/ui/state/LoadingState.tsx
import type { UseQueryResult } from '@tanstack/react-query';

type LoadingStateProps<T> = {
  query: UseQueryResult<T>;
  children: (data: T) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
};

/**
 * LoadingState Component
 * @description Handles loading, error and empty states for queries
 * @template T - The type of data returned by the query
 */
export const LoadingState = <T,>({
  query,
  children,
  loadingFallback,
  errorFallback,
  emptyFallback,
}: LoadingStateProps<T>) => {
  if (query.isLoading) {
    return <>{loadingFallback ?? <div>Loading...</div>}</>;
  }

  if (query.isError) {
    return <>{errorFallback ?? <div>Error: {query.error.message}</div>}</>;
  }

  if (query.data === undefined || query.data == null) {
    return <>{emptyFallback ?? <div>No data</div>}</>;
  }

  return <>{children(query.data)}</>;
};
