// frontend/src/shared/api/mocks/handlers.ts
// Combined mock handlers

import { settingsHandlers } from '@/entities/settings/api/settingsMocks';

/**
 * Alle Mock Handler kombiniert
 * @description Sammelt alle Entity-spezifischen Handler
 */
export const handlers = [...settingsHandlers];
