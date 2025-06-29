// frontend/src/testing/mocks/data/settings.data.ts
import { DEFAULT_SETTINGS } from '@/entities/settings/model/constants';
import type { Branding, Settings, SettingsUpdate } from '@entities/settings';

class SettingsMockData {
  private settings: Settings = { ...DEFAULT_SETTINGS };

  getDefault(): Settings {
    // Deep clone to prevent mutations
    return JSON.parse(JSON.stringify(this.settings));
  }

  update(updates: SettingsUpdate): Settings {
    // Deep merge implementation
    const merge = (target: any, source: any): any => {
      if (!source) return target;

      const output = { ...target };

      Object.keys(source).forEach(key => {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
          output[key] = merge(target[key] || {}, source[key]);
        } else if (source[key] !== undefined) {
          output[key] = source[key];
        }
      });

      return output;
    };

    this.settings = {
      ...this.settings,
      ...merge(this.settings, updates),
      updatedAt: new Date().toISOString(),
    };

    return this.getDefault();
  }

  updateBranding(branding: Branding): Settings {
    this.settings = {
      ...this.settings,
      branding,
      updatedAt: new Date().toISOString(),
    };
    return this.getDefault();
  }

  reset(): void {
    this.settings = {
      id: 'default-settings',
      branding: {
        colors: {
          primary: '#34687e',
          secondary: '#b94f46',
          accent: '#e8f0f4',
        },
        logo: {
          url: 'https://fanini.live/images/logo.svg',
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
  }

  // Test scenarios
  withDisabledFeatures(): Settings {
    return {
      ...this.getDefault(),
      features: {
        events: false,
        members: false,
        gallery: false,
      },
    };
  }

  withCustomBranding(): Settings {
    return {
      ...this.getDefault(),
      branding: {
        colors: {
          primary: '#FF0000',
          secondary: '#00FF00',
          accent: '#0000FF',
        },
        logo: {
          url: 'https://fanini.live/custom-logo.png',
          alt: 'Custom Logo',
        },
      },
    };
  }
}

export const settingsMockData = new SettingsMockData();
