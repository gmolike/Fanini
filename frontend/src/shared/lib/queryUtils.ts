import { QueryClient } from '@tanstack/react-query'

// Utility für optimistic Updates
export function createOptimisticUpdate<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: readonly unknown[],
) {
  return {
    onMutate: async (updatedData: T) => {
      await queryClient.cancelQueries({ queryKey })
      const previousData = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, updatedData)
      return { previousData }
    },
    onError: (_err: unknown, _updatedData: T, context: any) => {
      if (context?.previousData) {
        queryClient.setQueryData(queryKey, context.previousData)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    },
  }
}
