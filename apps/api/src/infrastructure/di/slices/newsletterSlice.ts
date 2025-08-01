// apps/api/src/infrastructure/di/slices/newsletterSlice.ts
import type { Container } from "../container";
import { createNewsletterController } from "@/presentation/controllers/newsletter/NewsletterController";

export const registerNewsletterSlice = (container: Container): void => {
  container.register("NewsletterController", () => {
    return createNewsletterController();
  });
};
