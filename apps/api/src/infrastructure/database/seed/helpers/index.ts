// seed/helpers/index.ts
export { PREDEFINED_IDS } from "./ids";
export { generateId } from "./ids";
export { dateHelpers, randomDate } from "./dates";
export { generateEvents } from "../generators/eventGenerator";
export { generateMembers } from "../generators/memberGenerator";

// seed/types/index.ts
import { Connection, PoolConnection } from "mysql2/promise";

export type SeedConfig = {
  readonly minEvents: number;
  readonly publicEventRatio: number;
  readonly memberCount: number;
  readonly creatorCount: number;
};

// Akzeptiere beide Connection-Typen
export type SeederFunction = (
  connection: Connection | PoolConnection,
) => Promise<void>;

export const DEFAULT_SEED_CONFIG: SeedConfig = {
  minEvents: 40,
  publicEventRatio: 0.5,
  memberCount: 50,
  creatorCount: 8,
} as const;

export const passwords = {
  admin: "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyNiLXCJVaDfyC",
  vorstand: "$2b$12$dGV4EXGL3WYqVmB6znBhqeJfIJmP5As3vyJhGkTlDzXDiTZOV.YBC",
  team: "$2b$12$HYfp3TjkQzCqLRGxOa1YXeI88Dbi3Q0sKxJog8gTqnFOgFKN5nLxu",
  member: "$2b$12$X5VCdMQOq8HlLaBfJonUCuLiwGJKgNPCVKUPBFI1tWYQzJ1sP8Ip6",
} as const;

export const randomElement = <T>(array: readonly T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

export const randomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const chunk = <T>(array: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};
