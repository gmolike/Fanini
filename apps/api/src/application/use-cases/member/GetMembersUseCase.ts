// apps/api/src/application/use-cases/member/GetMembersUseCase.ts
import { IMemberRepository } from "@/domain/repositories/IMemberRepository";

export class GetMembersUseCase {
  constructor(private memberRepository: IMemberRepository) {}

  async execute(filters?: {
    active?: boolean;
    search?: string;
    roleId?: string;
  }): Promise<any[]> {
    return await this.memberRepository.findAll(filters);
  }
}
