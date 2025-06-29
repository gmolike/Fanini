// frontend/src/entities/settings/lib/settingsCache.ts
// Settings cache utilities

import type { Settings } from '../model/types';

/**
 * Settings Cache Manager
 * @description Verwaltet Settings im Memory für schnellen Zugriff
 */
class SettingsCache {
  private cache: Settings | null = null;
  private readonly listeners: Set<(settings: Settings) => void> = new Set();

  /**
   * Setzt die Settings im Cache
   */
  set(settings: Settings) {
    this.cache = settings;
    this.notifyListeners(settings);
  }

  /**
   * Holt die Settings aus dem Cache
   */
  get(): Settings | null {
    return this.cache;
  }

  /**
   * Löscht den Cache
   */
  clear() {
    this.cache = null;
  }

  /**
   * Registriert einen Listener für Settings-Änderungen
   */
  subscribe(listener: (settings: Settings) => void) {
    this.listeners.add(listener);

    // Cleanup function
    return () => {
      this.listeners.delete(listener);
    };
  }

  /**
   * Benachrichtigt alle Listener
   */
  private notifyListeners(settings: Settings) {
    this.listeners.forEach(listener => listener(settings));
  }

  /**
   * Holt einen spezifischen Wert aus den Settings
   */
  getValue<K extends keyof Settings>(key: K): Settings[K] | null {
    return this.cache?.[key] ?? null;
  }
}

// Singleton Instance
export const settingsCache = new SettingsCache();

/**
 * Hook zum Verwenden des Settings Cache
 */
export const useSettingsCache = () => {
  return settingsCache;
};
