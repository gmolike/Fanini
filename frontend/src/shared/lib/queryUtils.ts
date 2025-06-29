import { type QueryClient } from '@tanstack/react-query';

// Utility für optimistic Updates
export function createOptimisticUpdate<T extends { id: string }>(
  queryClient: QueryClient,
  queryKey: readonly unknown[]
) {
  return {
    onMutate: async (updatedData: T) => {
      await queryClient.cancelQueries({ queryKey });
      const previousData = queryClient.getQueryData(queryKey);
      queryClient.setQueryData(queryKey, updatedData);
      return { previousData };
    },
    onError: (_err: unknown, _updatedData: T, context: { previousData: unknown } | undefined) => {
      if (context && context.previousData !== undefined) {
        queryClient.setQueryData(queryKey, context.previousData);
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey });
    },
  };
}
