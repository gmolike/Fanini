// frontend/src/shared/api/mutations/createRemoteMutation.ts
import {
  useMutation,
  type UseMutationOptions,
  type UseMutationResult,
  useQueryClient,
} from '@tanstack/react-query';
import { type z } from 'zod';

import { apiClient } from '../client/apiClient';

export type RemoteMutationConfig<TData, TVariables, TContext = unknown> = {
  method: 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  endpoint: string | ((variables: TVariables) => string);
  schema?: z.ZodSchema<TData>;
  invalidateQueries?: (string | readonly unknown[])[];
  onSuccess?: (
    data: TData,
    variables: TVariables,
    context: TContext | undefined
  ) => void | Promise<void>;
  optimisticUpdate?: (variables: TVariables) => TContext;
  rollback?: (context: TContext) => void;
}

export function createRemoteMutation<TData = unknown, TVariables = void, TContext = unknown>(
  config: RemoteMutationConfig<TData, TVariables, TContext>
) {
  return function useRemoteMutation(
    options?: Omit<UseMutationOptions<TData, Error, TVariables, TContext>, 'mutationFn'>
  ): UseMutationResult<TData, Error, TVariables, TContext> {
    const queryClient = useQueryClient();

    return useMutation<TData, Error, TVariables, TContext>({
      mutationFn: async variables => {
        const endpoint =
          typeof config.endpoint === 'function' ? config.endpoint(variables) : config.endpoint;

        let response: unknown;

        switch (config.method) {
          case 'POST':
            response = await apiClient.post(endpoint, variables);
            break;
          case 'PUT':
            response = await apiClient.put(endpoint, variables);
            break;
          case 'PATCH':
            response = await apiClient.patch(endpoint, variables);
            break;
          case 'DELETE':
            response = await apiClient.delete(endpoint);
            break;
        }

        if (config.schema) {
          return config.schema.parse(response);
        }

        return response as TData;
      },

      onMutate: async (variables: TVariables) => {
        if (config.invalidateQueries) {
          await Promise.all(
            config.invalidateQueries.map(key =>
              queryClient.cancelQueries({ queryKey: Array.isArray(key) ? key : [key] })
            )
          );
        }
        if (config.optimisticUpdate) {
          return config.optimisticUpdate(variables);
        }
        return undefined;
      },

      onError: (_error, _variables, context) => {
        if (context !== undefined && config.rollback) {
          config.rollback(context);
        }
      },

      onSuccess: async (data, variables, context) => {
        if (config.onSuccess) {
          await config.onSuccess(data, variables, context);
        }

        if (config.invalidateQueries) {
          await Promise.all(
            config.invalidateQueries.map(key =>
              queryClient.invalidateQueries({
                queryKey: Array.isArray(key) ? key : [key],
              })
            )
          );
        }
      },

      ...options,
    });
  };
}
