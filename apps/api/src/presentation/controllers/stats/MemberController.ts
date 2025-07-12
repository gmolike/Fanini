import type {
  GetMembersUseCase,
  UpdateMemberUseCase,
} from "@/application/use-cases";

export class MemberController {
  constructor(
    private getMembersUseCase: GetMembersUseCase,
    private updateMemberUseCase: UpdateMemberUseCase,
  ) {}

  async getMembers(req: Request): Promise<Response> {
    try {
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

  async getMember(req: Request): Promise<Response> {
    try {
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
