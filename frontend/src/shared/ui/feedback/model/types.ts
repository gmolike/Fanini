import type { UseQueryResult } from '@tanstack/react-query'


export type ErrorBoundaryProps = {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}

/**
 * Feedback Komponenten Types
 */
export type LoadingStateProps<TData = unknown> = {
  query: UseQueryResult<TData>
  children: (data: NonNullable<TData>) => React.ReactNode
  loadingFallback?: React.ReactNode
  errorFallback?: React.ReactNode
  emptyFallback?: React.ReactNode
}
