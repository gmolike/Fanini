// Config exports
export * from './config';

// Library exports
export * from './lib';

// Mock exports (nur in dev)
export { initMockServer } from './mocks';

// Re-export commonly used items for convenience
export { queryClient } from './config/queryClient';
export { apiClient } from './config/apiClient';
export { createQueryKeys } from './lib/queryFactory';
