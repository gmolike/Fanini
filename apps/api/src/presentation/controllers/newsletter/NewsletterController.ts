// apps/api/src/presentation/controllers/newsletter/NewsletterController.ts
import { z } from "zod";
import { success, created } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

const subscribeSchema = z.object({
  email: z.string().email(),
  vorname: z.string().min(2),
  nachname: z.string().optional(),
});

const confirmSchema = z.object({
  token: z.string(),
});

const unsubscribeSchema = z.object({
  email: z.string().email(),
  token: z.string(),
});

export type NewsletterController = {
  subscribe: (req: Request) => Promise<Response>;
  confirmSubscription: (req: Request) => Promise<Response>;
  unsubscribe: (req: Request) => Promise<Response>;
  getPublicNewsletterList: (req: Request) => Promise<Response>;
  getPublicNewsletterDetail: (req: Request) => Promise<Response>;
};

export const createNewsletterController = (): NewsletterController => ({
  /**
   * Subscribe to newsletter
   */
  subscribe: withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = subscribeSchema.parse(body);

    return created({
      message:
        "Registration successful. Please check your email to verify your subscription.",
    });
  }),

  /**
   * Confirm subscription
   */
  confirmSubscription: withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = confirmSchema.parse(body);

    return success({
      message: "Newsletter confirm feature coming soon",
    });
  }),

  /**
   * Unsubscribe from newsletter
   */
  unsubscribe: withErrorHandling(async (req: Request) => {
    const body = await req.json();
    const validated = unsubscribeSchema.parse(body);

    return success({
      message: "Newsletter unsubscribe feature coming soon",
    });
  }),

  /**
   * Get newsletter list
   */
  getPublicNewsletterList: withErrorHandling(async (req: Request) => {
    return success({
      data: [],
      message: "Newsletter list feature coming soon",
    });
  }),

  /**
   * Get newsletter detail
   */
  getPublicNewsletterDetail: withErrorHandling(async (req: Request) => {
    return success({
      data: null,
      message: "Newsletter detail feature coming soon",
    });
  }),
});
