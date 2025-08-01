// apps/api/src/presentation/controllers/creator/CreatorController.ts
import { success } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

export type CreatorController = {
  getPublicCreatorList: (req: Request) => Promise<Response>;
  getPublicCreatorDetail: (req: Request) => Promise<Response>;
  getPublicGallery: (req: Request) => Promise<Response>;
  getPublicCreatorWorks: (req: Request) => Promise<Response>;
};

export const createCreatorController = (): CreatorController => ({
  /**
   * Get public creator list
   */
  getPublicCreatorList: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Creator feature coming soon",
    });
  }),

  /**
   * Get public creator detail
   */
  getPublicCreatorDetail: withErrorHandling(async (req: Request) => {
    return success({
      data: null,
      message: "Creator feature coming soon",
    });
  }),

  /**
   * Get public gallery
   */
  getPublicGallery: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Gallery feature coming soon",
    });
  }),

  /**
   * Get creator works
   */
  getPublicCreatorWorks: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Creator works feature coming soon",
    });
  }),
});
