// src/infrastructure/di/slices/creatorSlice.ts
import { Container } from "../container";
import { CreatorController } from "@/presentation/controllers";

export const registerCreatorSlice = (container: Container) => {
  // Temporär - wird später implementiert
  container.register("CreatorController", () => {
    return new CreatorController();
  });
};
