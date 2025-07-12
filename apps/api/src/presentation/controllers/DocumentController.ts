// apps/api/src/presentation/controllers/DocumentController.ts
import type { GetDocumentsUseCase } from "@/application/use-cases";

export class DocumentController {
  constructor(
    private readonly getDocumentsUseCase: GetDocumentsUseCase,
    // UploadDocumentUseCase wird hier NICHT mehr gebraucht!
  ) {}

  async getPublicDocuments(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const category = url.searchParams.get("category") || undefined;

      const documents = await this.getDocumentsUseCase.execute({
        filters: {
          isPublic: true,
          category,
        },
      });

      return Response.json({
        success: true,
        data: documents.map((d) => d.toJSON()),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch documents" },
        { status: 500 },
      );
    }
  }

  // uploadDocument Methode ENTFERNEN - die ist jetzt in der Route-Datei!
}
