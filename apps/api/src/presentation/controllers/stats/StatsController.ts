// apps/api/src/presentation/controllers/stats/StatsController.ts
import type { GetPublicStatsUseCase } from "@/application/use-cases/stats/GetPublicStatsUseCase";
import { success } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

export type StatsController = {
  getPublicStats: (req: Request) => Promise<Response>;
};

export const createStatsController = (
  getPublicStatsUseCase: GetPublicStatsUseCase,
): StatsController => ({
  /**
   * Get public stats
   */
  getPublicStats: withErrorHandling(async (req: Request) => {
    const stats = await getPublicStatsUseCase.execute();

    return success({
      data: stats.toJSON(),
    });
  }),
});
