// src/infrastructure/di/slices/newsletterSlice.ts
import { Container } from "../container";
import { NewsletterController } from "@/presentation/controllers";

export const registerNewsletterSlice = (container: Container) => {
  // Temporär - wird später implementiert
  container.register("NewsletterController", () => {
    return new NewsletterController();
  });
};
