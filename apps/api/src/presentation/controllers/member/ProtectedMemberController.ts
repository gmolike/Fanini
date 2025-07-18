// apps/api/src/presentation/controllers/member/ProtectedMemberController.ts
import { GetMembersWithPermissionUseCase } from "@/application/use-cases/member/GetMembersWithPermissionUseCase";
import { UpdateMemberWithApprovalUseCase } from "@/application/use-cases/member/UpdateMemberWithApprovalUseCase";
import { z } from "zod";

// Zod Schemas fungieren als DTOs - definieren die erwartete Struktur
const getMembersQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  search: z.string().optional(),
  roleId: z.string().optional(),
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(20),
});

const updateMemberBodySchema = z.object({
  vorname: z.string().min(2).max(100).optional(),
  nachname: z.string().min(2).max(100).optional(),
  email: z.string().email().optional(),
  telefon: z
    .string()
    .regex(/^[\d\s\-\+\(\)]+$/)
    .optional(),
  mitgliedsnummer: z.string().optional(),
  istAktiv: z.boolean().optional(),
  geburtsdatum: z.string().datetime().optional(),
  adresse: z
    .object({
      strasse: z.string().min(3),
      hausnummer: z.string(),
      plz: z.string().regex(/^\d{5}$/),
      stadt: z.string().min(2),
    })
    .optional(),
  iban: z
    .string()
    .regex(/^[A-Z]{2}\d{2}[A-Z0-9]+$/)
    .optional(),
  notfallkontakt: z
    .object({
      name: z.string().min(3),
      telefon: z.string().regex(/^[\d\s\-\+\(\)]+$/),
    })
    .optional(),
});

/**
 * Protected Member Controller
 * @description Behandelt geschützte Mitglieder-Endpoints mit Permission-Filtering
 */
export class ProtectedMemberController {
  constructor(
    private getMembersWithPermission: GetMembersWithPermissionUseCase,
    private updateMemberWithApproval: UpdateMemberWithApprovalUseCase,
  ) {}

  /**
   * @swagger
   * /api/members:
   *   get:
   *     summary: Liste aller Mitglieder (gefiltert nach Berechtigungen)
   *     tags: ["👥 Members"]
   *     security:
   *       - bearerAuth: []
   */
  async getMembers(req: Request): Promise<Response> {
    try {
      const url = new URL(req.url);
      const query = Object.fromEntries(url.searchParams);

      // Zod Schema validiert und transformiert die Query Parameter
      const validated = getMembersQuerySchema.parse(query);

      const userPermissions = (req as any).userPermissions;

      const members = await this.getMembersWithPermission.execute({
        userPermissions,
        filters: {
          active: validated.active,
          search: validated.search,
          roleId: validated.roleId,
        },
      });

      // Pagination
      const start = (validated.page - 1) * validated.limit;
      const paginatedMembers = members.slice(start, start + validated.limit);

      return Response.json({
        success: true,
        data: paginatedMembers,
        meta: {
          total: members.length,
          page: validated.page,
          limit: validated.limit,
          pages: Math.ceil(members.length / validated.limit),
          filtered: true,
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          {
            success: false,
            error: "Validation failed",
            details: error.errors,
          },
          { status: 400 },
        );
      }
      console.error("Get members error:", error);
      return Response.json(
        { success: false, error: "Failed to fetch members" },
        { status: 500 },
      );
    }
  }

  /**
   * @swagger
   * /api/members/{id}:
   *   put:
   *     summary: Mitglied aktualisieren (mit Approval wenn nötig)
   *     tags: ["👥 Members"]
   *     security:
   *       - bearerAuth: []
   */
  async updateMember(req: Request): Promise<Response> {
    try {
      const { params } = req as any;
      const body = await req.json();

      // Zod validiert und gibt typsicheres Objekt zurück
      const validatedUpdates = updateMemberBodySchema.parse(body);

      const userId = (req as any).userId;
      const userRole = (req as any).userRole;

      const result = await this.updateMemberWithApproval.execute({
        memberId: params.id,
        updates: validatedUpdates, // Direkt das validierte Objekt
        userId,
        userRole,
      });

      return Response.json({
        success: true,
        data: result,
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return Response.json(
          {
            success: false,
            error: "Validation failed",
            details: error.errors,
          },
          { status: 400 },
        );
      }
      console.error("Update member error:", error);
      return Response.json(
        { success: false, error: "Failed to update member" },
        { status: 500 },
      );
    }
  }
}
