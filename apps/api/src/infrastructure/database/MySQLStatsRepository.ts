// apps/api/src/infrastructure/database/MySQLStatsRepository.ts
import { Stats } from '@/domain/entities/Stats';
import { IStatsRepository } from '@/domain/repositories/IStatsRepository';
import { MySQLConnection } from './MySQLConnection';

/**
 * MySQL Stats Repository
 * @description Implementiert Stats-Datenzugriff für MySQL
 */
export class MySQLStatsRepository implements IStatsRepository {
  constructor(private db: MySQLConnection) {}

  async getPublicStats(): Promise<Stats> {
    try {
      // Member Count
      const memberCountResult = await this.db.query<any[]>(
        'SELECT COUNT(*) as count FROM mitglieder WHERE ist_aktiv = true'
      );
      const memberCount = Number(memberCountResult[0]?.count) || 0;

      // Events this year
      const currentYear = new Date().getFullYear();
      const eventsResult = await this.db.query<any[]>(
        'SELECT COUNT(*) as count FROM events WHERE YEAR(datum) = ? AND status != ?',
        [currentYear, 'abgesagt']
      );
      const eventsPerYear = Number(eventsResult[0]?.count) || 0;

      // Founded year (aus Konfiguration oder erster Mitgliedseintrag)
      const foundedYear = 2025; // TODO: Aus Settings-Tabelle holen

      // Passion percentage ist immer 100%
      const passionPercentage = 100;

      return Stats.create({
        memberCount,
        eventsPerYear,
        foundedYear,
        passionPercentage,
      });
    } catch (error) {
      console.error('Error fetching public stats:', error);

      // Fallback Werte
      return Stats.create({
        memberCount: 70,
        eventsPerYear: 24,
        foundedYear: 2025,
        passionPercentage: 100,
      });
    }
  }
}
