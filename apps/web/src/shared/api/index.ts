// frontend/src/shared/api/index.ts
// Client exports
export * from './client';


// Query/Mutation utilities
export * from './queries';



// Re-export commonly used items
export { apiClient } from './client/apiClient';
export { createRemoteMutation } from './mutations';
// Config exports (queryClient bleibt wo es ist)
export { queryClient } from './config/queryClient';
