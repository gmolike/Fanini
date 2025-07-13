// apps/api/src/presentation/controllers/StatsController.ts
import type { GetPublicStatsUseCase } from "@/application/use-cases/stats/GetPublicStatsUseCase";

/**
 * Stats Controller
 * @description Verarbeitet Stats-bezogene HTTP-Anfragen
 */
export class StatsController {
  constructor(private readonly getPublicStatsUseCase: GetPublicStatsUseCase) {}

  /**
   * @swagger
   * /api/public/stats:
   *   get:
   *     summary: Öffentliche Vereinsstatistiken
   *     tags: ["🌐 Public Stats"]
   *     responses:
   *       200:
   *         description: Statistiken
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 data:
   *                   type: object
   *                   properties:
   *                     memberCount:
   *                       type: number
   *                       description: Anzahl aktiver Mitglieder
   *                     eventsPerYear:
   *                       type: number
   *                       description: Events pro Jahr
   *                     foundedYear:
   *                       type: number
   *                       description: Gründungsjahr
   *                     passionPercentage:
   *                       type: number
   *                       description: Leidenschaft in Prozent
   *             example:
   *               data:
   *                 memberCount: 42
   *                 eventsPerYear: 24
   *                 foundedYear: 2025
   *                 passionPercentage: 100
   */
  async getPublicStats(req: Request): Promise<Response> {
    try {
      const stats = await this.getPublicStatsUseCase.execute();

      return Response.json({
        data: stats.toJSON(),
      });
    } catch (error) {
      console.error("Error in getPublicStats:", error);

      return Response.json(
        { error: "Failed to fetch statistics" },
        { status: 500 },
      );
    }
  }
}
