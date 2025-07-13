// apps/api/src/domain/repositories/ISettingsRepository.ts
import { Settings } from "../entities/Settings";

/**
 * Settings Repository Interface
 * @description Definiert Methoden für Settings-Datenzugriff
 */
export interface ISettingsRepository {
  /**
   * Holt die globalen Einstellungen
   */
  getSettings(): Promise<Settings>;

  /**
   * Aktualisiert die globalen Einstellungen
   */
  updateSettings(settings: Partial<Settings>): Promise<Settings>;
}
