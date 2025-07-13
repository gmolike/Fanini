// frontend/src/entities/public/stats/model/types.ts
export type Stats = {
  memberCount: number;
  eventsPerYear: number;
  foundedYear: number;
  passionPercentage: number;
};

export type StatsResponse = {
  data: Stats;
};
