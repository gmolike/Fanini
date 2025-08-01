// apps/api/src/presentation/controllers/member/MemberController.ts
import { z } from "zod";
import { success, error, notFound } from "@/presentation/helpers/responses";
import { withErrorHandling } from "@/presentation/helpers/responses/errorHandler";

const getMembersQuerySchema = z.object({
  active: z.coerce.boolean().optional(),
  search: z.string().optional(),
  roleId: z.string().optional(),
});

export type MemberController = {
  getMembers: (req: Request) => Promise<Response>;
  getMember: (req: Request) => Promise<Response>;
};

export const createMemberController = (
  getPublicMembersUseCase: any,
  getMemberByIdUseCase: any,
): MemberController => ({
  /**
   * Get public members list
   */
  getMembers: withErrorHandling(async (req: Request) => {
    const url = new URL(req.url);
    const query = Object.fromEntries(url.searchParams);
    const validated = getMembersQuerySchema.parse(query);

    const result = await getPublicMembersUseCase.execute({
      filters: {
        search: validated.search,
        role: validated.roleId,
      },
    });

    return success({
      data: result.items,
      meta: {
        total: result.pagination.totalItems,
        page: result.pagination.page,
        limit: result.pagination.pageSize,
      },
    });
  }),

  /**
   * Get member by ID
   */
  getMember: withErrorHandling(async (req: Request) => {
    const { params } = req as any;

    const result = await getMemberByIdUseCase.execute({
      id: params.id,
    });

    if (!result) {
      return notFound("Member", params.id);
    }

    return success(result);
  }),
});
