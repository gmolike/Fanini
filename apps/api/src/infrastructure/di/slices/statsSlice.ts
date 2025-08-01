// apps/api/src/infrastructure/di/slices/statsSlice.ts
import type { Container } from "../container";
import { GetPublicStatsUseCase } from "@/application/use-cases/stats";
import { createStatsController } from "@/presentation/controllers/stats/StatsController";
import { MySQLStatsRepository } from "@/infrastructure/repositories/MySQLStatsRepository";

export const registerStatsSlice = (container: Container): void => {
  container.register("StatsRepository", () => {
    const db = container.get("Database");
    return new MySQLStatsRepository(db);
  });

  container.register("GetPublicStatsUseCase", () => {
    const repo = container.get("StatsRepository");
    return new GetPublicStatsUseCase(repo);
  });

  container.register("StatsController", () => {
    const getPublicStats = container.get("GetPublicStatsUseCase");
    return createStatsController(getPublicStats);
  });
};
