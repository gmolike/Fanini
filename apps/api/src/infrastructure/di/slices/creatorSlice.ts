// apps/api/src/infrastructure/di/slices/creatorSlice.ts
import type { Container } from "../container";
import { createCreatorController } from "@/presentation/controllers/creator/CreatorController";

export const registerCreatorSlice = (container: Container): void => {
  container.register("CreatorController", () => {
    return createCreatorController();
  });
};
