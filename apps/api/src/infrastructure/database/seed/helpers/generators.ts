// apps/api/src/infrastructure/database/seed/helpers/generators.ts
import { randomUUID } from "crypto";

export const generateId = (): string => randomUUID();

export const randomElement = <T>(array: T[]): T =>
  array[Math.floor(Math.random() * array.length)];

export const randomInt = (min: number, max: number): number =>
  Math.floor(Math.random() * (max - min + 1)) + min;

export const randomDate = (start: Date, end: Date): Date => {
  return new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime()),
  );
};

export const randomBool = (probability: number = 0.5): boolean =>
  Math.random() < probability;
