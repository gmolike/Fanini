// apps/api/src/domain/entities/Stats.ts
/**
 * Stats Entity
 * @description Öffentliche Statistiken des Vereins
 */
export class Stats {
  constructor(
    public readonly memberCount: number,
    public readonly eventsPerYear: number,
    public readonly foundedYear: number,
    public readonly passionPercentage: number
  ) {}

  /**
   * Erstellt eine neue Stats-Instanz
   */
  static create(params: {
    memberCount: number;
    eventsPerYear: number;
    foundedYear: number;
    passionPercentage: number;
  }): Stats {
    return new Stats(
      params.memberCount,
      params.eventsPerYear,
      params.foundedYear,
      params.passionPercentage
    );
  }

  /**
   * Konvertiert zu JSON
   */
  toJSON() {
    return {
      memberCount: this.memberCount,
      eventsPerYear: this.eventsPerYear,
      foundedYear: this.foundedYear,
      passionPercentage: this.passionPercentage,
    };
  }
}
