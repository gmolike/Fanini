// apps/api/src/presentation/controllers/organization/OrganizationController.ts
import { success } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

export type OrganizationController = {
  getPublicInfo: (req: Request) => Promise<Response>;
  getPublicOrganizationDocuments: (req: Request) => Promise<Response>;
  getPublicGremiumDetail: (req: Request) => Promise<Response>;
  getPublicFAQ: (req: Request) => Promise<Response>;
  getTeamHistoryYears: (req: Request) => Promise<Response>;
  getTeamHistoryByYear: (req: Request) => Promise<Response>;
};

export const createOrganizationController = (): OrganizationController => ({
  /**
   * Get public organization info
   */
  getPublicInfo: withErrorHandling(async (req: Request) => {
    return success({
      data: {
        name: "Faninitiative Spandau e.V.",
        founded: "2025",
        members: 72,
        description: "Fanverein der Eintracht Spandau",
      },
    });
  }),

  /**
   * Get public organization documents
   */
  getPublicOrganizationDocuments: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Organization documents coming soon",
    });
  }),

  /**
   * Get public gremium detail
   */
  getPublicGremiumDetail: withErrorHandling(async (req: Request) => {
    return success({
      data: null,
      message: "Gremium details coming soon",
    });
  }),

  /**
   * Get public FAQ
   */
  getPublicFAQ: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "FAQ coming soon",
    });
  }),

  /**
   * Get team history years
   */
  getTeamHistoryYears: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Team history coming soon",
    });
  }),

  /**
   * Get team history by year
   */
  getTeamHistoryByYear: withErrorHandling(async (req: Request) => {
    return success({
      data: null,
      message: "Team history coming soon",
    });
  }),
});
