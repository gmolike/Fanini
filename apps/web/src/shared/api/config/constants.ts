// apps/web/src/shared/api/config/constants.ts
/**
 * API Konfigurationskonstanten
 * @description Zentrale Konfiguration für alle API-Aufrufe
 */
export const API_CONFIG = {
  // WICHTIG: Leer lassen für relative URLs in Entwicklung (Vite Proxy)
  baseURL: import.meta.env.PROD ? String(import.meta.env['VITE_API_BASE_URL'] ?? '') : '',
  timeout: Number(import.meta.env['VITE_API_TIMEOUT']) || 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
} as const;

// NUR allgemeine/system-weite Endpoints hier
export const SYSTEM_ENDPOINTS = {
  health: '/api/health',
  version: '/api/version',
} as const;
