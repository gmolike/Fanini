// apps/api/src/presentation/controllers/document/DocumentController.ts
import { z } from "zod";
import { success, notFound, error } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

const getDocumentsQuerySchema = z.object({
  category: z.string().optional(),
});

export type DocumentController = {
  getPublicDocuments: (req: Request) => Promise<Response>;
  getPublicDocumentDetail: (req: Request) => Promise<Response>;
  getDocuments: (req: Request) => Promise<Response>;
  deleteDocument: (req: Request) => Promise<Response>;
};

export const createDocumentController = (
  getPublicDocumentsUseCase: any,
  getInternalDocumentsUseCase: any,
  deleteDocumentUseCase: any,
): DocumentController => ({
  /**
   * Get public documents
   */
  getPublicDocuments: withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams);
    const validated = getDocumentsQuerySchema.parse(query);

    const result = await getPublicDocumentsUseCase.execute({
      filters: {
        category: validated.category,
        isPublic: true,
      },
    });

    return success({
      data: result.items,
      meta: {
        total: result.pagination.totalItems,
      },
    });
  }),

  /**
   * Get public document detail
   */
  getPublicDocumentDetail: withErrorHandling(async (req: Request) => {
    const { params } = req as any;

    const result = await getPublicDocumentsUseCase.execute({
      id: params.documentId,
      isPublic: true,
    });

    if (!result) {
      return notFound("Document", params.documentId);
    }

    return success(result);
  }),

  /**
   * Get documents (internal)
   */
  getDocuments: withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const userId = (req as any).userId;
    const query = Object.fromEntries(url.searchParams);
    const validated = getDocumentsQuerySchema.parse(query);

    const result = await getInternalDocumentsUseCase.execute({
      userId,
      filters: {
        category: validated.category,
      },
    });

    return success({
      data: result.items,
      meta: {
        total: result.pagination.totalItems,
      },
    });
  }),

  /**
   * Delete document
   */
  deleteDocument: withErrorHandling(async (req: Request) => {
    const { params } = req as any;
    const userId = (req as any).userId;
    const userRole = (req as any).userRole;

    await deleteDocumentUseCase.execute({
      id: params.id,
      userId,
      userRole,
    });

    return success({
      message: "Document deleted successfully",
    });
  }),
});
