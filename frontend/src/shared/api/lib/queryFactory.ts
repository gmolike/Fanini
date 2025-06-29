// frontend/src/shared/api/lib/queryFactory.ts
// Query key factory for TanStack Query

/**
 * Query Key Factory
 * @description Erstellt konsistente Query Keys für TanStack Query
 * @param entity - Name der Entity (z.B. 'event', 'member')
 */
export const createQueryKeys = <T extends string>(entity: T) => {
  return {
    all: [entity] as const,
    lists: () => [...createQueryKeys(entity).all, 'list'] as const,
    list: (filters?: Record<string, unknown>) =>
      [...createQueryKeys(entity).lists(), { filters }] as const,
    details: () => [...createQueryKeys(entity).all, 'detail'] as const,
    detail: (id: string | number) => [...createQueryKeys(entity).details(), id] as const,
    // Zusätzliche spezifische Keys
    by: (key: string, value: unknown) => [...createQueryKeys(entity).all, key, value] as const,
  } as const;
};

/**
 * Mutation Key Factory
 * @param entity - Name der Entity
 * @param action - Aktion (create, update, delete)
 */
export const createMutationKey = (entity: string, action: string) => {
  return [entity, action] as const;
};

/**
 * Invalidate Queries Helper
 * @description Helper um related Queries zu invalidieren
 */
export const createInvalidateQueries = (queryClient: any, entity: string) => {
  return {
    all: () => queryClient.invalidateQueries({ queryKey: [entity] }),
    lists: () => queryClient.invalidateQueries({ queryKey: [entity, 'list'] }),
    detail: (id: string | number) =>
      queryClient.invalidateQueries({ queryKey: [entity, 'detail', id] }),
    except: (keep: string[]) => {
      // Invalidiert alle außer den angegebenen
      const allKeys = queryClient
        .getQueryCache()
        .getAll()
        .filter(
          (query: any) =>
            query.queryKey[0] === entity && !keep.some(k => query.queryKey.includes(k))
        );
      allKeys.forEach((query: any) => queryClient.invalidateQueries({ queryKey: query.queryKey }));
    },
  };
};
