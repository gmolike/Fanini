// frontend/src/entities/settings/api/settingsMocks.ts
// MSW mock handlers for settings

import { delay, http, HttpResponse } from 'msw';
import { DEFAULT_SETTINGS } from '../model/constants';
import { brandingSchema, settingsUpdateSchema } from '../model/schemas';
import type { Settings } from '../model/types';

// Mock Datenbank - stelle sicher, dass es ein vollständiges Settings Objekt ist
let mockSettings: Settings = { ...DEFAULT_SETTINGS };

export const settingsHandlers = [
  // GET /api/settings
  http.get('/api/settings', () => {
    console.log('[MSW] GET /api/settings');
    return HttpResponse.json(DEFAULT_SETTINGS);
  }),
  // PUT /api/settings
  http.put('/api/settings', async ({ request }) => {
    await delay(300);
    const body = await request.json();

    // Type assertion nach Validierung
    const validatedUpdates = settingsUpdateSchema.parse(body);

    // Deep merge für nested objects
    mockSettings = {
      ...mockSettings,
      branding: {
        ...mockSettings.branding,
        ...(validatedUpdates.branding ?? {}),
        colors: {
          ...mockSettings.branding.colors,
          ...(validatedUpdates.branding?.colors ?? {}),
        },
        logo: {
          ...mockSettings.branding.logo,
          ...(validatedUpdates.branding?.logo ?? {}),
        },
      },
      contact: {
        ...mockSettings.contact,
        ...(validatedUpdates.contact ?? {}),
        email: validatedUpdates.contact?.email ?? mockSettings.contact.email,
        address: {
          ...mockSettings.contact.address,
          ...(validatedUpdates.contact?.address ?? {}),
        },
      },
      features: {
        events: validatedUpdates.features?.events ?? mockSettings.features.events,
        members: validatedUpdates.features?.members ?? mockSettings.features.members,
        gallery: validatedUpdates.features?.gallery ?? mockSettings.features.gallery,
      },
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(mockSettings);
  }),

  // GET /api/settings/branding
  http.get('/api/settings/branding', () => {
    console.log('[MSW] GET /api/settings/branding');
    return HttpResponse.json(DEFAULT_SETTINGS.branding);
  }),

  // PATCH /api/settings/branding
  http.patch('/api/settings/branding', async ({ request }) => {
    await delay(300);
    const body = await request.json();
    const branding = brandingSchema.parse(body);

    mockSettings = {
      ...mockSettings,
      branding,
      updatedAt: new Date().toISOString(),
    };

    return HttpResponse.json(branding);
  }),
];
