// apps/api/src/application/use-cases/GetPublicStatsUseCase.ts
import { IStatsRepository } from "@/domain/repositories/IStatsRepository";
import { Stats } from "@/domain/entities/Stats";

/**
 * Get Public Stats Use Case
 * @description Business Logik für öffentliche Statistiken
 */
export class GetPublicStatsUseCase {
  constructor(private readonly statsRepository: IStatsRepository) {}

  /**
   * Führt den Use Case aus
   */
  async execute(): Promise<Stats> {
    // Hier könnten weitere Business Rules hinzugefügt werden
    // z.B. Caching, Validierung, etc.
    return await this.statsRepository.getPublicStats();
  }
}
