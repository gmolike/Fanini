// apps/api/src/infrastructure/di/slices/organizationSlice.ts
import type { Container } from "../container";
import { createOrganizationController } from "@/presentation/controllers/organization/OrganizationController";

export const registerOrganizationSlice = (container: Container): void => {
  container.register("OrganizationController", () => {
    return createOrganizationController();
  });
};
