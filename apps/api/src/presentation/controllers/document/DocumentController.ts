import { GetDocumentsUseCase, UploadDocumentUseCase } from "@/application/use-cases";

// src/presentation/controllers/document/DocumentController.ts
export class DocumentController {
  constructor(
    private readonly getDocumentsUseCase: GetDocumentsUseCase,
    private readonly uploadDocumentUseCase?: UploadDocumentUseCase,
  ) {}

  /**
   * @swagger
   * /api/public/documents:
   *   get:
   *     summary: Öffentliche Dokumente
   *     tags: ["🌐 Public Documents"]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [satzung, protokolle, formulare, richtlinien, guides]
   *         description: Filter nach Kategorie
   *     responses:
   *       200:
   *         description: Dokumentenliste
   */
  async getPublicDocuments(req: Request): Promise<Response> {
    // TODO: Implement the logic to fetch public documents
    return Response.json(
      { success: false, error: "Not implemented" },
      { status: 501 }
    );
  }

  /**
   * @swagger
   * /api/public/documents/{documentId}:
   *   get:
   *     summary: Öffentliches Dokument Details
   *     tags: ["🌐 Public Documents"]
   *     parameters:
   *       - in: path
   *         name: documentId
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Dokument gefunden
   *       404:
   *         description: Dokument nicht gefunden
   */
  async getPublicDocumentDetail(req: Request): Promise<Response> {
    const { params } = req as any;
    try {
      const document = await this.getDocumentsUseCase.executeById({
        id: params.documentId,
      });

      if (!document) {
        return Response.json(
          { success: false, error: "Document not found" },
          { status: 404 },
        );
      }

      return Response.json({
        success: true,
        data: document.toJSON(),
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch document" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/documents:
   *   get:
   *     summary: Alle Dokumente (geschützt)
   *     tags: ["📄 Documents"]
   *     security:
   *       - bearerAuth: []
   *     responses:
   *       200:
   *         description: Dokumentenliste
   */
  async getDocuments(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const category = url.searchParams.get("category") || undefined;
      const userId = (req as any).userId;

      const documents = await this.getDocumentsUseCase.execute({
        filters: { category },
        userId,
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

  /**
   * @swagger
   * /api/documents/{id}:
   *   delete:
   *     summary: Dokument löschen
   *     tags: ["📄 Documents"]
   *     security:
   *       - bearerAuth: []
   *     parameters:
   *       - in: path
   *         name: id
   *         required: true
   *         schema:
   *           type: string
   *     responses:
   *       200:
   *         description: Dokument gelöscht
   *       404:
   *         description: Dokument nicht gefunden
   */
  async deleteDocument(req: Request): Promise<Response> {
    // TODO: Implement
    return Response.json({
      success: true,
      message: "Document deleted",
    });
  }
}
