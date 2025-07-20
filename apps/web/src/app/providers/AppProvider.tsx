import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';

import { queryClient } from '@/shared/config';
import { TooltipProvider } from '@/shared/shadcn';
import { ErrorBoundary } from '@/shared/ui/feedback/ui/ErrorBoundary';

import { ApiProvider } from './ApiProvider';

import type { ReactNode } from 'react';

type AppProviderProps = {
  children: ReactNode;
};

export function AppProvider({ children }: Readonly<AppProviderProps>) {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <ApiProvider>
          <TooltipProvider>{children}</TooltipProvider>
          {import.meta.env.DEV ? <ReactQueryDevtools initialIsOpen={false} /> : null}
        </ApiProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}
