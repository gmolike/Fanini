// apps/api/src/presentation/controllers/member/LocalMemberController.ts
import { z } from "zod";
import type {
  CreateLocalMemberUseCase,
  SetUserPasswordUseCase,
} from "@/application/use-cases/member";

const createLocalMemberSchema = z.object({
  vorname: z.string().min(2).max(100),
  nachname: z.string().min(2).max(100),
  email: z.string().email(),
  telefon: z.string().optional(),
  memberType: z.enum(["creator", "sponsor", "partner"]),
  passwordOption: z.enum(["none", "generate", "manual"]),
  password: z.string().min(8).optional(),
  kuenstlername: z.string().optional(),
  portfolio: z.string().url().optional(),
  sendCredentials: z.boolean().default(false),
});

const setPasswordSchema = z.object({
  generateTemporary: z.boolean().default(false),
  password: z.string().min(8).optional(),
  sendEmail: z.boolean().default(false),
});

export class LocalMemberController {
  constructor(
    private readonly createLocalMemberUseCase: CreateLocalMemberUseCase,
    private readonly setUserPasswordUseCase: SetUserPasswordUseCase,
  ) {}

  /**
   * @swagger
   * /api/members/local:
   *   post:
   *     summary: Lokales Mitglied anlegen
   *     tags: ["👥 Members"]
   *     security:
   *       - bearerAuth: []
   */
  async createLocalMember(req: Request): Promise<Response> {
    try {
      const body = await req.json();
      const validated = createLocalMemberSchema.parse(body);

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      // Nur ADMIN und VORSTAND dürfen lokale Mitglieder anlegen
      if (!["ADMIN", "VORSTAND"].includes(userRole)) {
        return Response.json(
          { success: false, error: "Insufficient permissions" },
          { status: 403 },
        );
      }

      const result = await this.createLocalMemberUseCase.execute({
        ...validated,
        createdBy: userId,
      });

      if (!result.success) {
        return Response.json(
          {
            success: false,
            error: result.error,
            statusCode: 400, // Füge statusCode hinzu
          },
          { status: 400 },
        );
      }

      return Response.json(
        {
          success: true,
          data: {
            memberId: result.memberId,
            userId: result.userId,
            temporaryPassword: result.temporaryPassword,
          },
          statusCode: 201, // Füge statusCode hinzu
        },
        { status: 201 },
      );
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          {
            success: false,
            errors: error.errors,
            statusCode: 400, // Füge statusCode hinzu
          },
          { status: 400 },
        );
      }
      console.error("Failed to create member:", error); // Besseres Error Logging
      return Response.json(
        {
          success: false,
          error: "Failed to create member",
          statusCode: 500, // Füge statusCode hinzu
        },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/members/{id}/password:
   *   put:
   *     summary: Passwort setzen/zurücksetzen
   *     tags: ["👥 Members"]
   *     security:
   *       - bearerAuth: []
   */
  async setPassword(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();
      const validated = setPasswordSchema.parse(body);

      const performedBy = (req as any).userId;
      const userRole = (req as any).userRole;

      // Permission check
      if (!["ADMIN", "VORSTAND"].includes(userRole)) {
        return Response.json(
          { success: false, error: "Insufficient permissions", statusCode: 403 },
          { status: 403 },
        );
      }

      const result = await this.setUserPasswordUseCase.execute({
        userId: params.id,
        ...validated,
        performedBy,
      });

      if (!result.success) {
        return Response.json(
          { success: false, error: result.error, statusCode: 400 },
          { status: 400 },
        );
      }

      return Response.json({
        success: true,
        data: {
          temporaryPassword: result.temporaryPassword,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          { success: false, errors: error.errors, statusCode: 400 },
          { status: 400 },
        );
      }
      return Response.json(
        { success: false, error: "Failed to set password", statusCode: 500 },
        { status: 500 },
      );
    }
  }
}
