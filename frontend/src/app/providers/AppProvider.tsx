import type { ReactNode } from 'react'
import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TooltipProvider } from '@/shared/shadcn'
import { queryClient } from '@/shared/config'
import { ErrorBoundary } from '@/shared/providers'
import { BreadcrumbProvider } from './BreadcrumbProvider'
import { DesignSystemProvider } from './DesignSystemProvider'

interface AppProviderProps {
  children: ReactNode
}

export function AppProvider({ children }: AppProviderProps) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <DesignSystemProvider>
          <TooltipProvider>
            <BreadcrumbProvider>{children}</BreadcrumbProvider>
          </TooltipProvider>
        </DesignSystemProvider>
        {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
      </QueryClientProvider>
    </ErrorBoundary>
  )
}
