import type { UseQueryResult } from '@tanstack/react-query';

export type ErrorBoundaryProps = {
  children: React.ReactNode;
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>;
};

/**
 * Feedback Komponenten Types
 */
// frontend/src/shared/ui/feedback/model/types.ts
export type LoadingStateProps<TData = unknown> = {
  query: UseQueryResult<TData>; // Fix: Expliziter Error type
  children: (data: NonNullable<TData>) => React.ReactNode;
  loadingFallback?: React.ReactNode;
  errorFallback?: React.ReactNode;
  emptyFallback?: React.ReactNode;
};
