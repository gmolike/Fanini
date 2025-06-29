// frontend/src/entities/settings/model/constants.ts
// Default values and constants

import type { Settings } from './types';

export const DEFAULT_SETTINGS: Settings = {
  id: 'default-settings',
  branding: {
    colors: {
      primary: '#34687e',
      secondary: '#b94f46',
      accent: '#e8f0f4',
    },
    logo: {
      url: '/images/logo.svg',
      alt: 'Faninitiative Spandau e.V.',
    },
  },
  contact: {
    email: 'info@fanini.live',
    phone: '+49 30 12345678',
    address: {
      street: 'Vereinsstraße 1',
      zip: '13587',
      city: 'Berlin-Spandau',
    },
  },
  features: {
    events: true,
    members: true,
    gallery: true,
  },
  updatedAt: new Date().toISOString(),
};
