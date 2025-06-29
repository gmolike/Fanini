import type { UseQueryResult } from '@tanstack/react-query'

/**
 * Feedback Komponenten Types
 */
export interface LoadingStateProps<TData = unknown> {
  query: UseQueryResult<TData>
  children: (data: NonNullable<TData>) => React.ReactNode
  loadingFallback?: React.ReactNode
  errorFallback?: React.ReactNode
  emptyFallback?: React.ReactNode
}

export interface ErrorBoundaryProps {
  children: React.ReactNode
  fallback?: React.ComponentType<{ error: Error; reset: () => void }>
}
