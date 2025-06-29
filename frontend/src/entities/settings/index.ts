// frontend/src/entities/settings/index.ts
// Settings entity exports

// Model exports
export * from './model';

// API exports
export * from './api';

// Re-export commonly used items
export { settingsQueryKeys } from './api/settingsHooks';
export type { Settings, Branding, Contact, Features } from './model/types';
