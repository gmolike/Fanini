import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 Minuten
      gcTime: 1000 * 60 * 10, // 10 Minuten
      retry: (failureCount: number, error: unknown) => {
        if (typeof error === 'object' && error !== null && 'status' in error) {
          const { status } = error as { status?: number };
          if (status !== undefined && status >= 400 && status < 500) return false;
        }
        return failureCount < 3;
      },
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 1,
    },
  },
});
