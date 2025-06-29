// frontend/src/testing/mocks/handlers/settings.handlers.ts
import { http, HttpResponse, delay } from 'msw';
import { settingsMockData } from '../data/settings.data';
import { settingsSchema, brandingSchema } from '@/entities/settings/model/schemas';

console.log('[MSW] Registering settings handlers...');

export const settingsHandlers = [
  // GET /api/settings
  http.get('/api/settings', async () => {
    console.log('[MSW] GET /api/settings');
    await delay(300);
    return HttpResponse.json(settingsMockData.getDefault());
  }),

  // PUT /api/settings
  http.put('/api/settings', async ({ request }) => {
    console.log('[MSW] PUT /api/settings');
    await delay(500);

    try {
      const body = await request.json();
      const updates = settingsSchema.parse(body);
      const updated = settingsMockData.update(updates);
      return HttpResponse.json(updated);
    } catch (error) {
      return HttpResponse.json({ message: 'Validation failed', details: error }, { status: 400 });
    }
  }),

  // GET /api/settings/branding
  http.get('/api/settings/branding', async () => {
    console.log('[MSW] GET /api/settings/branding');
    await delay(200);
    const settings = settingsMockData.getDefault();
    return HttpResponse.json(settings.branding);
  }),

  // PATCH /api/settings/branding
  http.patch('/api/settings/branding', async ({ request }) => {
    console.log('[MSW] PATCH /api/settings/branding');
    await delay(400);

    try {
      const body = await request.json();
      const branding = brandingSchema.parse(body);
      const updated = settingsMockData.updateBranding(branding);
      return HttpResponse.json(updated.branding);
    } catch (error) {
      return HttpResponse.json({ message: 'Validation failed', details: error }, { status: 400 });
    }
  }),
];

console.log(`[MSW] Registered ${settingsHandlers.length} settings handlers`);
