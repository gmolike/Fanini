import { PoolConnection } from "mysql2/promise";

// seed/types/index.ts
export type SeedConfig = {
  readonly minEvents: number;
  readonly publicEventRatio: number;
  readonly memberCount: number;
  readonly creatorCount: number;
};

export type SeederFunction = (connection: PoolConnection) => Promise<void>;

export const DEFAULT_SEED_CONFIG: SeedConfig = {
  minEvents: 40,
  publicEventRatio: 0.5,
  memberCount: 50,
  creatorCount: 8
} as const;
