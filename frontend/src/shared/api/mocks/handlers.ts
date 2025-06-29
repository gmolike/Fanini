// frontend/src/shared/api/mocks/handlers.ts
// Combined mock handlers

import { settingsHandlers } from '@/testing/mocks/handlers/settings.handlers';

/**
 * Alle Mock Handler kombiniert
 * @description Sammelt alle Entity-spezifischen Handler
 */
export const handlers = [...settingsHandlers];
