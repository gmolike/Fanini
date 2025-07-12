// apps/api/src/presentation/controllers/StatsController.ts
import type { GetPublicStatsUseCase } from '@/application/use-cases/stats/GetPublicStatsUseCase';

/**
 * Stats Controller
 * @description Verarbeitet Stats-bezogene HTTP-Anfragen
 */
export class StatsController {
  constructor(private getPublicStatsUseCase: GetPublicStatsUseCase) {}

  /**
   * GET /api/public/stats
   * @description Holt öffentliche Statistiken
   */
  async getPublicStats(req: Request): Promise<Response> {
    try {
      const stats = await this.getPublicStatsUseCase.execute();

      return Response.json({
        data: stats.toJSON(),
      });
    } catch (error) {
      console.error('Error in getPublicStats:', error);

      return Response.json(
        { error: 'Failed to fetch statistics' },
        { status: 500 }
      );
    }
  }
}
