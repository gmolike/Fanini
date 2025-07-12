// apps/api/src/presentation/controllers/DocumentController.ts
import { z } from "zod";
import type {
  GetDocumentsUseCase,
  UploadDocumentUseCase,
} from "@/application/use-cases";

const uploadDocumentSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string(),
  category: z.enum([
    "satzung",
    "protokolle",
    "formulare",
    "richtlinien",
    "guides",
  ]),
  version: z.string(),
  isPublic: z.boolean().default(false),
});

export class DocumentController {
  constructor(
    private readonly getDocumentsUseCase: GetDocumentsUseCase,
    private readonly uploadDocumentUseCase: UploadDocumentUseCase,
  ) {}

  /**
   * @swagger
   * /api/public/documents:
   *   get:
   *     summary: Liste aller öffentlichen Dokumente
   *     tags: [Documents]
   *     parameters:
   *       - in: query
   *         name: category
   *         schema:
   *           type: string
   *           enum: [satzung, protokolle, formulare, richtlinien, guides]
   *     responses:
   *       200:
   *         description: Erfolgreiche Antwort
   *         content:
   *           application/json:
   *             schema:
   *               type: object
   *               properties:
   *                 success:
   *                   type: boolean
   *                 data:
   *                   type: array
   *                   items:
   *                     $ref: '#/components/schemas/Document'
   */
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

  /**
   * @swagger
   * /api/documents/upload:
   *   post:
   *     summary: Dokument hochladen
   *     tags: [Documents]
   *     security:
   *       - bearerAuth: []
   *     requestBody:
   *       required: true
   *       content:
   *         multipart/form-data:
   *           schema:
   *             type: object
   *             required:
   *               - file
   *               - title
   *               - category
   *             properties:
   *               file:
   *                 type: string
   *                 format: binary
   *               title:
   *                 type: string
   *               description:
   *                 type: string
   *               category:
   *                 type: string
   *                 enum: [satzung, protokolle, formulare, richtlinien, guides]
   *               version:
   *                 type: string
   *               isPublic:
   *                 type: boolean
   *     responses:
   *       201:
   *         description: Dokument erfolgreich hochgeladen
   */
  async uploadDocument(req: Request): Promise<Response> {
    try {
      const userId = (req as any).userId;
      const formData = await req.formData();

      const file = formData.get("file") as File;
      if (!file) {
        return Response.json(
          { success: false, error: "No file provided" },
          { status: 400 },
        );
      }

      const metadata = {
        title: formData.get("title") as string,
        description: (formData.get("description") as string) || "",
        category: formData.get("category") as any,
        version: (formData.get("version") as string) || "1.0",
        isPublic: formData.get("isPublic") === "true",
      };

      const validated = uploadDocumentSchema.parse(metadata);
      const buffer = Buffer.from(await file.arrayBuffer());

      const document = await this.uploadDocumentUseCase.execute({
        ...validated,
        fileBuffer: buffer,
        fileName: file.name,
        mimeType: file.type,
        userId,
      });

      return Response.json(
        { success: true, data: document.toJSON() },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to upload document" },
        { status: 500 },
      );
    }
  }
}
