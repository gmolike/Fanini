import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 Minuten
      gcTime: 1000 * 60 * 10, // 10 Minuten (ehemals cacheTime)
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false
        return failureCount < 3
      },
      refetchOnWindowFocus: true,
      networkMode: 'online',
    },
    mutations: {
      retry: 0,
      networkMode: 'online',
    },
  },
})

// Re-export für einfacheren Import
export { QueryClient } from '@tanstack/react-query'
