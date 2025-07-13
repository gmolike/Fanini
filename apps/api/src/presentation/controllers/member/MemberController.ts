import type {
  GetMembersUseCase,
  UpdateMemberUseCase,
} from "@/application/use-cases";

export class MemberController {
  constructor(
    private getMembersUseCase: GetMembersUseCase,
    private updateMemberUseCase: UpdateMemberUseCase,
  ) {}

/**
 * @swagger
 * /api/members:
 *   get:
 *     summary: Liste aller Mitglieder
 *     tags: ["👥 Members"]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: active
 *         schema:
 *           type: boolean
 *         description: Nur aktive Mitglieder
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Suche nach Name oder Email
 *     responses:
 *       200:
 *         description: Mitgliederliste
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
 *                     $ref: '#/components/schemas/Member'
 */
async getMembers(req: Request): Promise<Response> {    try {
      const members = await this.getMembersUseCase.execute();
      return Response.json({
        success: true,
        data: members,
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch members" },
        { status: 500 },
      );
    }
  }

/**
 * @swagger
 * /api/members/{id}:
 *   get:
 *     summary: Mitglied-Details
 *     tags: ["👥 Members"]
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
 *         description: Mitglied gefunden
 *       404:
 *         description: Mitglied nicht gefunden
 */
async getMember(req: Request): Promise<Response> {    try {
      const { params } = req as any;
      // TODO: Implement single member fetch
      return Response.json({
        success: true,
        data: { id: params.id, name: "Test Member" },
      });
    } catch (error) {
      return Response.json(
        { success: false, error: "Failed to fetch member" },
        { status: 500 },
      );
    }
  }
}
