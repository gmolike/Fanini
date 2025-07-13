// frontend/src/shared/ui/LoadingState/types.ts
import type { UseQueryResult } from '@tanstack/react-query';

export type LoadingStateProps<TData = unknown> = {
  query: UseQueryResult<TData>;
  children: (data: NonNullable<TData>) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
};
