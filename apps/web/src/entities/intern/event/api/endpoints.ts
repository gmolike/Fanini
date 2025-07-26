// apps/web/src/entities/intern/event/api/endpoints.ts
export const EVENT_ENDPOINTS = {
  // Public
  public: {
    list: '/api/public/event/list',
    detail: (id: string) => `/api/public/event/${id}`,
  },

  // Internal
  internal: {
    list: '/api/internal/events/list',
    detail: (id: string) => `/api/internal/events/${id}`,
    create: '/api/internal/events',
    update: (id: string) => `/api/internal/events/${id}`,
    delete: (id: string) => `/api/internal/events/${id}`,
    status: (id: string) => `/api/internal/events/${id}/status`,
  },
} as const;
