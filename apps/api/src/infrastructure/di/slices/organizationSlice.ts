// apps/api/src/infrastructure/di/slices/organizationSlice.ts
import type { Container } from "../container";
import { OrganizationController } from "@/presentation/controllers";

export const registerOrganizationSlice = (container: Container): void => {
  container.register("OrganizationController", () => {
    return new OrganizationController();
  });
};
