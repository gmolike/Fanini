// apps/api/src/domain/repositories/IStatsRepository.ts
import { Stats } from '../entities/Stats';

/**
 * Stats Repository Interface
 * @description Definiert Methoden für Stats-Datenzugriff
 */
export interface IStatsRepository {
  /**
   * Holt die aktuellen öffentlichen Statistiken
   */
  getPublicStats(): Promise<Stats>;
}
