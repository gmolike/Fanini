// apps/web/src/shared/api/index.ts
// Client exports
export { apiClient, ApiClientError, type ApiError, type RequestOptions } from './client/apiClient';

// Config exports
export { API_CONFIG } from './config/constants';
export { queryClient } from './config/queryClient';

// Query/Mutation utilities
export { createRemoteMutation } from './mutations';
export { createRemoteQuery, createSimpleRemoteQuery } from './queries';

// Types
export * from './constants';
export type { RemoteMutationConfig } from './mutations';
export type { RemoteQueryConfig } from './queries';
